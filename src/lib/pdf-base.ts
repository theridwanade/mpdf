/**
 * MPDF Core Styles - Enforced System CSS
 * These styles ensure consistent pagination, printing, and document quality.
 * Users cannot modify these - they are required for proper PDF output.
 */

export const PDF_BASE_CSS = `
/* ==============================================
   MPDF CORE SYSTEM STYLES
   These are enforced and not user-modifiable.
   They ensure proper PDF pagination & printing.
   ============================================== */

/* Force exact color reproduction in print */
html {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}

/* @page rules - enforce zero margins for full-bleed */
@page {
  margin: 0 !important;
}

/* Base reset - consistent box model */
*, *::before, *::after {
  box-sizing: border-box;
}

/* Ensure backgrounds print correctly */
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-attachment: fixed;
}

/* ==============================================
   PAGINATION CONTROL - ENFORCED
   ============================================== */

/* Page break utilities */
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

/* Headings should not be orphaned at page bottom */
h1, h2, h3, h4, h5, h6 {
  page-break-after: avoid !important;
  break-after: avoid !important;
}

/* Prevent orphans and widows in paragraphs */
p, li, blockquote {
  orphans: 3;
  widows: 3;
}

/* Tables should not break mid-row */
tr {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

/* Code blocks should stay together */
pre, code, .code-block {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

/* Figures and images stay with captions */
figure, .figure {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

/* ==============================================
   PRINT-SAFE UTILITIES
   ============================================== */

/* Hide elements in print */
.no-print,
.screen-only,
[data-no-print] {
  display: none !important;
}

/* Print-only elements (hidden in preview) */
@media screen {
  .print-only,
  [data-print-only] {
    display: none !important;
  }
}

/* ==============================================
   PAGE STRUCTURE
   ============================================== */

/* Document wrapper for proper page flow */
.mpdf-document {
  width: 100%;
}

/* Individual page container */
.mpdf-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

/* Page content area with margins */
.mpdf-content {
  position: relative;
  z-index: 1;
}

/* Background layer - sits behind content */
.mpdf-background {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/* ==============================================
   FIXED ELEMENTS (Headers/Footers)
   ============================================== */

.mpdf-header {
  position: running(header);
}

.mpdf-footer {
  position: running(footer);
}

/* Page counters */
.page-number::after {
  content: counter(page);
}

.page-total::after {
  content: counter(pages);
}

/* ==============================================
   ACCESSIBILITY & QUALITY
   ============================================== */

/* Ensure readable link colors */
a {
  text-decoration-skip-ink: auto;
}

/* Smooth font rendering */
body {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Proper image rendering */
img {
  max-width: 100%;
  height: auto;
  image-rendering: -webkit-optimize-contrast;
}

/* SVG sizing */
svg {
  max-width: 100%;
  height: auto;
}
`;
