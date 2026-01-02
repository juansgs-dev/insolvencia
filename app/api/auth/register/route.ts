import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, generateToken } from "@/lib/auth"
import { registerSchema } from "@/lib/validations"


export async function POST(request: Request) {
  try {
    const body = await request.json()

    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validation.error.message },
        { status: 400 }
      )
    }

    const { nombre, email, password } = validation.data

    const existeUsuario = await prisma.usuario.findFirst({
      where: { email },
    })

    if (existeUsuario) {
      return NextResponse.json(
        { error: "El correo ya está registrado" },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        activo: true,
        rolId: 1,
      },
      include: {
        rol: true,
      },
    })

    const token = await generateToken({
      userId: Number(usuario.id),
      email: usuario.email,
      rolId: Number(usuario.rolId),
      rolNombre: usuario.rol.nombre,
    })

    return NextResponse.json(
      {
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol.nombre,
          rolId: usuario.rolId,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error en register:", error)
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    )
  }
}
