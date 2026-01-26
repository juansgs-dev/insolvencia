import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"
import { serializeBigInt } from "@/lib/serialize"

export async function GET() {
  const cookieStore = cookies()
  const token = (await cookieStore).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 })
  }

  const user = await verifyToken(token);

  if (!user || user.roleName !== "admin") {
    return NextResponse.json({ message: "No autorizado" }, { status: 403 })
  }

  const documents = await prisma.document.findMany({
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(serializeBigInt(documents))
}
