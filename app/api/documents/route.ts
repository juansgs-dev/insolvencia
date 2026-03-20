import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createDocument } from "@/lib/services/document.service"
import { verifyToken } from "@/lib/auth"
import { advisorySchema } from "@/lib/validations"

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
    const occupation = formData.get("occupation") as string
    const hasAssets = formData.get("hasAssets") as string
    const hasPayrollLoans = formData.get("hasPayrollLoans") as string
    const creditorCount = formData.get("creditorCount") as string
    const delinquencyTime = formData.get("delinquencyTime") as string
    const hasEmbargoes = formData.get("hasEmbargoes") as string
    const totalDebtCapital = formData.get("totalDebtCapital") as string
    const description = formData.get("description") as string | null

    if (!file || !documentType) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    if (documentType !== "last_pay_stub") {
      return NextResponse.json(
        { message: "Solo se permite adjuntar la ultima colilla de pago" },
        { status: 400 }
      )
    }

    const parsedData = advisorySchema.safeParse({
      occupation,
      hasAssets: hasAssets === "true",
      hasPayrollLoans: hasPayrollLoans === "true",
      creditorCount: Number(creditorCount),
      delinquencyTime,
      hasEmbargoes: hasEmbargoes === "true",
      totalDebtCapital: Number(totalDebtCapital),
      description: description || undefined,
    })

    if (!parsedData.success) {
      return NextResponse.json(
        { message: parsedData.error.issues[0]?.message || "Datos invalidos" },
        { status: 400 }
      )
    }

    await createDocument({
      userId: Number(payload.sub),
      file,
      documentType,
      ...parsedData.data,
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
