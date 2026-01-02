import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { comparePassword, generateToken } from "@/lib/auth"
import { loginSchema } from "@/lib/validations"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validation.error.message },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    const usuario = await prisma.usuario.findFirst({
      where: {
        email,
        activo: true
      },
      include: {
        rol: true
      },
    })

    if (!usuario) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      )
    }

    const passwordMatch = await comparePassword(password, usuario.password)
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      )
    }

    const token = await generateToken({
      userId: Number(usuario.id),
      email: usuario.email,
      rolId: Number(usuario.rolId),
      rolNombre: usuario.rol.nombre,
    })

    return NextResponse.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol.nombre,
        rolId: usuario.rolId,
      }
    })
  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}
