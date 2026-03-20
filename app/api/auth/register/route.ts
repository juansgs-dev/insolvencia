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
        { error: "Invalid data" },
        { status: 400 }
      )
    }

    const { fullName, phoneNumber, email, password } = validation.data

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        fullName,
        phoneNumber: phoneNumber ?? null,
        email,
        password: hashedPassword,
        isActive: true,
        roleId: 2,
      },
      include: {
        role: true,
      },
    })

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
      { status: 201 }
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
  console.error("REGISTER ERROR:", error);

  return NextResponse.json(
    { error: "Server error" },
    { status: 500 }
  );
}
}
