import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

interface JwtPayload {
  sub: string
  role: string
}

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    let payload: JwtPayload

    try {
      payload = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as JwtPayload
    } catch {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const user = await prisma.user.findUnique({
      where: {
        id: BigInt(payload.sub),
        isActive: true,
      },
      include: {
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({
      user: {
        id: user.id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role.name,
        roleId: user.role.id.toString(),
      },
    })
  } catch (error) {
    console.error("AUTH_ME_ERROR", error)
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    )
  }
}
