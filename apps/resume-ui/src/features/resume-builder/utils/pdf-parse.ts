import * as pdfjs from 'pdfjs-dist'

// Use CDN worker for reliable cross-browser and build compatibility
pdfjs.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`

export async function extractTextFromPdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: buffer }).promise
  const pages: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()

    // Group text items by their y-position to detect line breaks.
    // Items on the same line share the same y coordinate (item.transform[5]).
    let lastY: number | null = null
    const pageLines: string[] = []
    let currentLine = ''

    for (const item of content.items) {
      if (!('str' in item)) continue
      const y = Math.round(item.transform[5])
      if (lastY !== null && y !== lastY) {
        if (currentLine) pageLines.push(currentLine)
        currentLine = item.str
      } else {
        currentLine += (currentLine ? ' ' : '') + item.str
      }
      lastY = y
    }
    if (currentLine) pageLines.push(currentLine)

    pages.push(pageLines.join('\n'))
  }

  return pages.join('\n\n')
}
