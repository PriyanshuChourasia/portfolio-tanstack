import { createWorker } from 'tesseract.js'

/**
 * Extract text from an image file using Tesseract.js OCR.
 * Supports PNG, JPG, JPEG, WebP, BMP, and other common image formats.
 */
export async function extractTextFromImage(file: File): Promise<string> {
  const worker = await createWorker('eng')
  try {
    const { data } = await worker.recognize(file)
    return data.text.trim()
  } finally {
    await worker.terminate()
  }
}
