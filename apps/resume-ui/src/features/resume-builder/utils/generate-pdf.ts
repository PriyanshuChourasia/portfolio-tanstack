/**
 * Generate a PDF using the browser's native print-to-PDF functionality.
 *
 * Instead of cloning the DOM into a new window (which loses all Tailwind /
 * template CSS), this injects a temporary <style> with @page rules and
 * calls window.print() directly. The existing `print:hidden` / `print:shadow-none`
 * classes in the templates and layout already handle hiding interactive UI.
 *
 * After the print dialog closes (or is dismissed), the injected style is
 * cleaned up via the `afterprint` event with a timeout safety net.
 */
export async function generatePdf(
  _element: HTMLElement,
  filename: string = 'resume.pdf',
  orientation: 'portrait' | 'landscape' = 'portrait',
): Promise<void> {
  const styleId = 'resume-print-style'
  const prevTitle = document.title

  // Remove any leftover style from a previous export
  document.getElementById(styleId)?.remove()

  // Inject @page rule for the chosen orientation + color-adjust on body
  const style = document.createElement('style')
  style.id = styleId
  style.textContent = `
    @page {
      size: ${orientation === 'landscape' ? 'A4 landscape' : 'A4 portrait'};
      margin: 10mm;
    }

    /* Preserve background colors, gradients, and shadows in the PDF */
    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Ensure the preview is fully visible during print */
    .fs-preview {
      display: block !important;
    }
  `
  document.head.appendChild(style)

  // Set the page title to suggest a filename in the "Save as PDF" dialog
  document.title = filename.replace(/\.pdf$/, '')

  // Clean up via afterprint event for cross-browser reliability
  const cleanup = () => {
    document.title = prevTitle
    document.getElementById(styleId)?.remove()
    window.removeEventListener('afterprint', cleanup)
  }
  window.addEventListener('afterprint', cleanup)

  // Trigger the native print dialog
  window.print()

  // Safety net: if afterprint doesn't fire (rare), clean up after a timeout
  setTimeout(() => {
    document.title = prevTitle
    document.getElementById(styleId)?.remove()
    window.removeEventListener('afterprint', cleanup)
  }, 2000)
}
