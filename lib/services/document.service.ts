import { prisma } from "@/lib/prisma"
import { saveLocalFile } from "@/lib/utils/fileUpload"

interface CreateDocumentParams {
  userId: number
  file: File
  documentType: string
  occupation: string
  hasAssets: boolean
  hasPayrollLoans: boolean
  creditorCount: number
  delinquencyTime: string
  hasEmbargoes: boolean
  totalDebtCapital: number
  description?: string
}

export async function createDocument({
  userId,
  file,
  documentType,
  occupation,
  hasAssets,
  hasPayrollLoans,
  creditorCount,
  delinquencyTime,
  hasEmbargoes,
  totalDebtCapital,
  description,
}: CreateDocumentParams) {
  const { fileName, fileUrl } = await saveLocalFile(file, userId)

  return prisma.document.create({
    data: {
      userId: userId,
      fileName: fileName,
      fileType: file.type,
      fileUrl: fileUrl,
      documentType,
      description,
      occupation,
      hasAssets,
      hasPayrollLoans,
      creditorCount,
      delinquencyTime,
      hasEmbargoes,
      totalDebtCapital,
    },
  })
}
