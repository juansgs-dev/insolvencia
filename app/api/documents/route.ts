import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createDocument } from "@/lib/services/document.service"
import { verifyToken } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get("auth_token")?.value

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)

    if (!payload?.sub) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      )
    }

    const formData = await req.formData()

    const file = formData.get("file") as File
    const documentType = formData.get("documentType") as string
    const description = formData.get("description") as string | null

    if (!file || !documentType) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    await createDocument({
      userId: Number(payload.sub),
      file,
      documentType,
      description: description || undefined,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DOCUMENT_UPLOAD_ERROR", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
