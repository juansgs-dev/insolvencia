import { prisma } from "@/lib/prisma"
import { saveLocalFile } from "@/lib/utils/fileUpload"

interface CreateDocumentParams {
  userId: number
  file: File
  documentType: string
  description?: string
}

export async function createDocument({
  userId,
  file,
  documentType,
  description,
}: CreateDocumentParams) {
  const { fileName, fileUrl } = await saveLocalFile(file, userId)

  return prisma.document.create({
    data: {
      userId: userId,
      fileName: fileName,
      fileType: file.type,
      fileUrl: fileUrl
    },
  })
}
