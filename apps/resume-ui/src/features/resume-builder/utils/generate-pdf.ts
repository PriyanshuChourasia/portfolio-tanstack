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
const MARGIN_MM: Record<'narrow' | 'normal' | 'wide', number> = {
  narrow: 2,
  normal: 4,
  wide: 8,
}

export async function generatePdf(
  _element: HTMLElement,
  filename: string = 'resume.pdf',
  orientation: 'portrait' | 'landscape' = 'portrait',
  margins: 'narrow' | 'normal' | 'wide' = 'normal',
): Promise<void> {
  const styleId = 'resume-print-style'
  const prevTitle = document.title
  const marginMm = MARGIN_MM[margins]
  // A4 physical width in mm. Templates are built with fixed pixel widths
  // (e.g. max-w-[900px], which is already wider than A4's ~794px @96dpi),
  // so leaving that px width in place for print makes the output depend on
  // whatever scale-to-fit / DPI defaults the exporting machine's browser
  // happens to use — identical code can paginate differently on Mac vs
  // Windows purely from that. Pinning the printed width to the physical
  // page size in mm removes that variable entirely: it's the same box on
  // every machine, independent of screen DPI, browser zoom, or print scale.
  const pageWidthMm = orientation === 'landscape' ? 297 : 210

  // Remove any leftover style from a previous export
  document.getElementById(styleId)?.remove()

  // Inject @page rule for the chosen orientation + color-adjust on body
  const style = document.createElement('style')
  style.id = styleId
  style.textContent = `
    @page {
      size: ${orientation === 'landscape' ? 'A4 landscape' : 'A4 portrait'};
      /* Zero page margin leaves no room for the browser's own header/footer
         (date, document title, URL, page number), so Chrome omits them even
         when "Headers and footers" is checked in the print dialog. Vertical
         breathing room is restored below via padding + box-decoration-break
         instead, since @page margin only appears once (start of page 1 /
         end of the last page), not at every internal page break. */
      margin: 0;
    }

    /* Preserve background colors, gradients, and shadows in the PDF */
    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Pin the printed width to the physical page size (see comment above) —
       overrides each template's own fixed px max-width (e.g. max-w-[900px])
       so the box is identical on every machine regardless of DPI/zoom. */
    .fs-preview {
      width: ${pageWidthMm}mm !important;
      max-width: ${pageWidthMm}mm !important;
    }

    /* Every template's root is a <main> element inside .fs-preview. Several
       templates zero their own padding for print (relying on the old @page
       margin instead), so restore top/bottom whitespace here — !important
       to win over each template's print:p-0 / print:p-6 utility classes.
       box-decoration-break: clone re-applies the padding at every page
       fragment (top of each new page, bottom of each page before a break),
       not just at the very start/end of the whole flowed document. */
    .fs-preview main {
      width: 100% !important;
      max-width: 100% !important;
      padding-top: ${marginMm}mm !important;
      padding-bottom: ${marginMm}mm !important;
      padding-left: ${marginMm}mm !important;
      padding-right: ${marginMm}mm !important;
      -webkit-box-decoration-break: clone;
      box-decoration-break: clone;
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
