/**
 * Export the rendered resume as a Word-compatible .doc file.
 * Word can open HTML files saved with a .doc extension and render them
 * with most CSS styling preserved.
 */
export function exportAsWord(
  htmlContent: string,
  filename: string = 'resume.doc',
  orientation: 'portrait' | 'landscape' = 'portrait',
) {
  const pageSize = orientation === 'landscape' ? 'A4 landscape' : 'A4'

  const fullHtml = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    /* Reset & base */
    body {
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      line-height: 1.5;
      color: #1e293b;
      background: #ffffff;
    }
    @page {
      size: ${pageSize};
      margin: 1.5cm 2cm;
    }
    /* Preserve page-break hints */
    .break-inside-avoid {
      page-break-inside: avoid;
    }
    /* List reset */
    ul { padding-left: 1.25rem; margin: 0.375rem 0; }
    li { margin-bottom: 0.25rem; }
    p { margin: 0; }
    /* Shadow on screen only */
    .shadow-sm, .shadow-xl { box-shadow: none !important; }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`

  const blob = new Blob([fullHtml], {
    type: 'application/msword;charset=utf-8',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
