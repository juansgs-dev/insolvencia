import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, generateToken } from "@/lib/auth"
import { registerSchema } from "@/lib/validations"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log(body);

    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      )
    }

    const { fullName, email, password } = validation.data

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
      userId: Number(user.id),
      email: user.email,
      rolId: Number(user.roleId),
      roleName: user.role.name,
    })

    return NextResponse.json(
      {
        token,
        usuario: {
          id: Number(user.id),
          fullName: user.fullName,
          email: user.email,
          role: user.role.name,
          roleId: Number(user.roleId),
        },
      },
      { status: 201 }
    )
  } catch (error) {

    console.log(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
