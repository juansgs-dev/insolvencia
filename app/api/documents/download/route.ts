import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const filePath = searchParams.get("url")

  if (!filePath) {
    return new NextResponse("Archivo no especificado", { status: 400 })
  }

  try {
    const relativePath = filePath.replace(/^\/+/, "")

    const absolutePath = path.join(process.cwd(), relativePath)

    const fileBuffer = await fs.readFile(absolutePath)

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${path.basename(absolutePath)}"`,
      },
    })
  } catch (error) {
    console.error("Error descargando archivo:", error)
    return new NextResponse("No se pudo descargar el archivo", { status: 404 })
  }
}
