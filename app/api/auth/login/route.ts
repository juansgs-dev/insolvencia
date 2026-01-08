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

    const user = await prisma.user.findFirst({
      where: {
        email,
        isActive: true,
      },
      include: {
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      )
    }

    const passwordMatch = await comparePassword(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      )
    }

    const token = await generateToken({
      sub: user.id.toString(),
      email: user.email,
      rolId: user.role.id.toString(),
      roleName: user.role.name,
    })

    const response = NextResponse.json(
      {
        user: {
          id: user.id.toString(),
          fullName: user.fullName,
          email: user.email,
          role: user.role.name,
          roleId: user.role.id.toString(),
        },
      },
      { status: 200 }
    )

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    )
  }
}
