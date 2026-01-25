import fs from "fs"
import path from "path"

export async function saveLocalFile(
  file: File,
  userId: number
): Promise<{ fileName: string; fileUrl: string }> {
  const uploadDir = path.join(process.cwd(), "uploads", "documents")

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const timestamp = Date.now()
  const fileName = `user-${userId}-${timestamp}-${file.name}`
  const filePath = path.join(uploadDir, fileName)

  fs.writeFileSync(filePath, buffer)

  return {
    fileName,
    fileUrl: `/uploads/documents/${fileName}`,
  }
}
