/**
 * MPDF Core System CSS
 * Enforced styles for consistent pagination, printing, and document quality.
 * These are always applied first and cannot be modified by users.
 */

export const PDF_BASE_CSS = `
/* ==============================================
   MPDF SYSTEM CSS - ENFORCED
   Page dimensions, pagination, and print quality
   ============================================== */

/* Page Setup - A4 Default */
:root {
  --mpdf-page-width: 210mm;
  --mpdf-page-height: 297mm;
  --mpdf-page-margin: 25mm;
}

/* @page rules for PDF output */
@page {
  size: A4;
  margin: 20mm 0;
}

@page :first {
  margin: 20mm 0;
}

/* Force exact color reproduction in print */
html {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}

/* Base reset */
*, *::before, *::after {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
}

body {
  padding: var(--mpdf-page-margin);
  min-height: 100vh;
  background-attachment: fixed;
}

/* ==============================================
   PAGINATION CONTROL
   ============================================== */

.page-break,
.page-break-before,
[data-page-break="before"] {
  page-break-before: always !important;
  break-before: page !important;
}

.page-break-after,
[data-page-break="after"] {
  page-break-after: always !important;
  break-after: page !important;
}

.no-break,
.keep-together,
[data-no-break] {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

/* Headings should not orphan at page bottom */
h1, h2, h3, h4, h5, h6 {
  page-break-after: avoid !important;
  break-after: avoid !important;
}

/* Prevent orphans and widows */
p, li, blockquote {
  orphans: 3;
  widows: 3;
}

/* Tables should not break mid-row */
tr {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

/* Code blocks stay together */
pre, .code-block {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

/* Figures stay with captions */
figure, .figure {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

/* ==============================================
   PRINT UTILITIES
   ============================================== */

.no-print,
.screen-only,
[data-no-print] {
  display: none !important;
}

@media screen {
  .print-only,
  [data-print-only] {
    display: none !important;
  }
}

/* ==============================================
   QUALITY & RENDERING
   ============================================== */

body {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img {
  max-width: 100%;
  height: auto;
  image-rendering: -webkit-optimize-contrast;
}

svg {
  max-width: 100%;
  height: auto;
}

a {
  text-decoration-skip-ink: auto;
}

/* ==============================================
   PAGE NUMBER SUPPORT
   ============================================== */

.page-number::after {
  content: counter(page);
}

.page-total::after {
  content: counter(pages);
}
`;
