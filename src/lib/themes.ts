/**
 * MPDF Theme Store
 * CSS-only themes - injected without changing user content
 * All themes are validated against the theme schema
 */

import { validateTheme, type ValidationResult } from "./theme-schema";

export interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  css: string;
}

export interface ValidatedTheme extends Theme {
  validation: ValidationResult;
}

export const themes: Theme[] = [
  {
    id: "minimal-elegance",
    name: "Minimal Elegance",
    description: "Clean sophistication with subtle gradients",
    preview: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    css: `/* MINIMAL ELEGANCE THEME */

:root {
  --color-primary: #667eea;
  --color-accent: #764ba2;
  --color-text: #2d3748;
  --color-text-light: #718096;
  --color-text-muted: #a0aec0;
  --color-background: #ffffff;
  --color-surface: #f7fafc;
  --color-border: #e2e8f0;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11pt;
  line-height: 1.75;
  color: var(--color-text);
  background: var(--color-background);
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(180deg, rgba(102, 126, 234, 0.03) 0%, transparent 100%);
  pointer-events: none;
  z-index: -1;
}

h1 {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.2;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

h2 {
  font-size: 1.625rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text);
  margin: 2.5rem 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--color-border);
}

h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary);
  margin: 2rem 0 0.75rem 0;
}

a { color: var(--color-primary); text-decoration: none; }
a:hover { text-decoration: underline; }

code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9em;
  background: var(--color-surface);
  color: var(--color-accent);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

pre {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  line-height: 1.7;
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
  color: #e2e8f0;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1.5rem 0;
  overflow-x: auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

pre code { background: transparent; border: none; padding: 0; color: inherit; }

blockquote {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-left: 4px solid var(--color-primary);
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: var(--color-text-light);
}

table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
thead { background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%); }
th { color: white; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; padding: 0.75rem 1rem; text-align: left; }
td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--color-border); }
tbody tr:hover { background: var(--color-surface); }

hr { border: none; height: 1px; background: linear-gradient(90deg, transparent, var(--color-border), transparent); margin: 2.5rem 0; }

.callout { padding: 1rem 1.5rem; border-radius: 12px; margin: 1.5rem 0; border: 1px solid; }
.callout-info { background: #ebf8ff; border-color: #90cdf4; color: #2c5282; }
.callout-success { background: #f0fff4; border-color: #9ae6b4; color: #276749; }
.callout-warning { background: #fffaf0; border-color: #fbd38d; color: #975a16; }

.badge { display: inline-block; padding: 0.2em 0.6em; font-size: 0.75rem; font-weight: 600; border-radius: 9999px; }
.badge-primary { background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); color: white; }
.badge-success { background: #dcfce7; color: #166534; }
.badge-warning { background: #fef3c7; color: #92400e; }

.subtitle { font-size: 1.125rem; color: var(--color-text-light); margin-top: -0.5rem; margin-bottom: 2rem; }
.lead { font-size: 1.2rem; line-height: 1.8; color: var(--color-text-light); }
`
  },
  {
    id: "modern-dark",
    name: "Modern Dark",
    description: "Bold dark theme with vibrant accents",
    preview: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    css: `/* MODERN DARK THEME */

:root {
  /* Schema-required variables */
  --color-primary: #00d4ff;
  --color-accent: #7c3aed;
  --color-text: #e2e8f0;
  --color-text-light: #94a3b8;
  --color-text-muted: #64748b;
  --color-background: #0f0f1a;
  --color-surface: #1a1a2e;
  --color-border: #334155;
  /* Theme-specific variables */
  --color-bg: #0f0f1a;
  --color-bg-secondary: #1a1a2e;
  --color-accent-1: #00d4ff;
  --color-accent-2: #7c3aed;
  --color-accent-3: #f472b6;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11pt;
  line-height: 1.8;
  color: var(--color-text);
  background: var(--color-bg);
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: -1;
}

body::after {
  content: '';
  position: fixed;
  top: -150px;
  right: -150px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
}

h1 {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, var(--color-accent-1) 0%, var(--color-accent-2) 50%, var(--color-accent-3) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

h2 {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 2.5rem 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

h2::before {
  content: '';
  width: 4px;
  height: 1.5em;
  background: linear-gradient(180deg, var(--color-accent-1), var(--color-accent-2));
  border-radius: 2px;
}

h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-accent-1);
  margin: 2rem 0 0.75rem 0;
}

p { color: #94a3b8; }

a { color: var(--color-accent-1); text-decoration: none; }
a:hover { text-shadow: 0 0 10px rgba(0, 212, 255, 0.5); }

ul > li::marker { content: '▸ '; color: var(--color-accent-1); }

code {
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
  background: var(--color-bg-secondary);
  color: var(--color-accent-3);
  padding: 0.2em 0.5em;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

pre {
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  line-height: 1.7;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1.5rem 0;
  overflow-x: auto;
  position: relative;
}

pre::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-accent-1), var(--color-accent-2), var(--color-accent-3));
  border-radius: 12px 12px 0 0;
}

pre code { background: transparent; border: none; padding: 0; color: inherit; }

blockquote {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(0, 212, 255, 0.1) 100%);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-accent-2);
  border-radius: 0 12px 12px 0;
  color: #94a3b8;
}

table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
thead { background: var(--color-bg-secondary); }
th { color: var(--color-accent-1); font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.08em; padding: 1rem; text-align: left; border-bottom: 2px solid var(--color-accent-1); }
td { padding: 1rem; border-bottom: 1px solid var(--color-border); color: #94a3b8; }
tbody tr:hover { background: rgba(0, 212, 255, 0.05); }

hr { border: none; height: 1px; background: linear-gradient(90deg, transparent, var(--color-border), transparent); margin: 2.5rem 0; }

.callout { padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0; border: 1px solid; position: relative; overflow: hidden; }
.callout::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; }
.callout-info { background: rgba(0, 212, 255, 0.1); border-color: rgba(0, 212, 255, 0.3); }
.callout-info::before { background: var(--color-accent-1); }
.callout-success { background: rgba(34, 197, 94, 0.1); border-color: rgba(34, 197, 94, 0.3); }
.callout-success::before { background: #22c55e; }
.callout-warning { background: rgba(251, 191, 36, 0.1); border-color: rgba(251, 191, 36, 0.3); color: #fbbf24; }
.callout-warning::before { background: #fbbf24; }

ul, ol { margin: 1rem 0; padding-left: 1.5rem; }
li { margin: 0.5rem 0; }

.card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 1.5rem;
  margin: 1rem 0;
}

.badge { display: inline-flex; padding: 0.3em 0.8em; font-size: 0.7rem; font-weight: 600; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
.badge-primary { background: linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2)); color: white; }
.badge-success { background: rgba(34, 197, 94, 0.2); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3); }
.badge-warning { background: rgba(251, 191, 36, 0.2); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.3); }
.badge-glow { background: var(--color-bg-secondary); color: var(--color-accent-1); border: 1px solid var(--color-accent-1); box-shadow: 0 0 10px rgba(0, 212, 255, 0.3); }

.subtitle { font-size: 1.25rem; color: var(--color-text-muted); margin: -0.5rem 0 2rem 0; }
.lead { font-size: 1.2rem; line-height: 1.8; color: var(--color-text-light); }

.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 1.5rem 0; }
.stat-card { background: var(--color-bg-secondary); border: 1px solid var(--color-border); border-radius: 12px; padding: 1.5rem; text-align: center; }
.stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 700; background: linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.stat-label { font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.25rem; }
`
  },
  {
    id: "creative-gradient",
    name: "Creative Gradient",
    description: "Vibrant gradients with bold typography",
    preview: "linear-gradient(135deg, #ff6b6b 0%, #feca57 25%, #48dbfb 50%, #ff9ff3 75%, #54a0ff 100%)",
    css: `/* CREATIVE GRADIENT THEME */

:root {
  /* Schema-required variables */
  --color-primary: #667eea;
  --color-accent: #764ba2;
  --color-text: #2d3436;
  --color-text-light: #636e72;
  --color-text-muted: #b2bec3;
  --color-background: #ffffff;
  --color-surface: #f8f9fa;
  --color-border: #e9ecef;
  /* Theme-specific variables */
  --gradient-main: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  --gradient-warm: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
  --gradient-cool: linear-gradient(135deg, #48dbfb 0%, #54a0ff 100%);
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11pt;
  line-height: 1.75;
  color: var(--color-text);
  background: var(--color-background);
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  right: 0;
  width: 60%;
  height: 300px;
  background: linear-gradient(225deg, rgba(102, 126, 234, 0.08) 0%, rgba(245, 87, 108, 0.05) 50%, transparent 100%);
  pointer-events: none;
  z-index: -1;
}

body::after {
  content: '';
  position: fixed;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 250px;
  background: linear-gradient(45deg, rgba(72, 219, 251, 0.06) 0%, transparent 100%);
  pointer-events: none;
  z-index: -1;
}

h1 {
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin: 0 0 0.5rem 0;
  background: var(--gradient-main);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

h2 {
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 3rem 0 1rem 0;
  position: relative;
  display: inline-block;
}

h2::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 4px;
  background: var(--gradient-warm);
  border-radius: 2px;
}

h3 {
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 2rem 0 0.75rem 0;
}

a { color: #667eea; text-decoration: none; font-weight: 500; }
a:hover { color: #764ba2; }

ul, ol { margin: 0 0 1.5rem 0; padding-left: 0; list-style: none; }
li { margin-bottom: 0.75rem; padding-left: 1.75rem; position: relative; }
ul > li::before { content: ''; position: absolute; left: 0; top: 0.5em; width: 8px; height: 8px; background: var(--gradient-warm); border-radius: 50%; }
ol { counter-reset: list-counter; }
ol > li { counter-increment: list-counter; }
ol > li::before { content: counter(list-counter); position: absolute; left: 0; top: 0; width: 1.5rem; height: 1.5rem; background: var(--gradient-cool); color: white; font-size: 0.75rem; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

code {
  font-family: 'Fira Code', monospace;
  font-size: 0.875em;
  background: #f8f9fa;
  color: #e91e63;
  padding: 0.2em 0.5em;
  border-radius: 6px;
}

pre {
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  line-height: 1.7;
  background: linear-gradient(145deg, #1a1a2e 0%, #0f0f23 100%);
  color: #e2e8f0;
  padding: 1.5rem;
  border-radius: 16px;
  margin: 1.5rem 0;
  overflow-x: auto;
  position: relative;
}

pre::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #00d2d3 0%, #54a0ff 50%, #5f27cd 100%);
  border-radius: 16px 16px 0 0;
}

pre code { background: transparent; color: inherit; padding: 0; }

blockquote {
  margin: 2rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
  border-radius: 16px;
  border-left: 5px solid;
  border-image: var(--gradient-warm) 1;
  font-size: 1.125rem;
  font-style: italic;
  color: var(--color-text-light);
  position: relative;
}

blockquote::before {
  content: '"';
  position: absolute;
  top: 10px;
  left: 20px;
  font-size: 4rem;
  font-family: Georgia, serif;
  background: var(--gradient-warm);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0.3;
  line-height: 1;
}

table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; border-radius: 16px; overflow: hidden; }
thead { background: var(--gradient-main); }
th { color: white; font-weight: 600; font-size: 0.875rem; padding: 1rem 1.25rem; text-align: left; }
td { padding: 1rem 1.25rem; border-bottom: 1px solid #eee; }
tbody tr:nth-child(even) { background: #fafafa; }
tbody tr:hover { background: rgba(102, 126, 234, 0.05); }

hr { border: none; height: 4px; background: var(--gradient-main); border-radius: 2px; margin: 3rem 0; opacity: 0.3; }

.card { background: white; border-radius: 20px; padding: 2rem; margin: 1.5rem 0; box-shadow: 0 10px 40px rgba(102, 126, 234, 0.1); position: relative; overflow: hidden; }
.card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: var(--gradient-main); }

.callout { padding: 1.5rem 2rem; border-radius: 16px; margin: 1.5rem 0; position: relative; overflow: hidden; }
.callout::before { content: ''; position: absolute; top: 0; left: 0; width: 5px; height: 100%; }
.callout-info { background: linear-gradient(135deg, #ebf8ff 0%, #f0f9ff 100%); }
.callout-info::before { background: var(--gradient-cool); }
.callout-success { background: linear-gradient(135deg, #f0fff4 0%, #ecfdf5 100%); }
.callout-success::before { background: linear-gradient(180deg, #10b981, #059669); }
.callout-warning { background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); color: #b45309; }
.callout-warning::before { background: var(--gradient-warm); }

.badge { display: inline-flex; padding: 0.35em 1em; font-size: 0.75rem; font-weight: 700; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.05em; }
.badge-primary { background: var(--gradient-main); color: white; }
.badge-success { background: linear-gradient(135deg, #10b981, #059669); color: white; }
.badge-warning { background: var(--gradient-warm); color: white; }
.badge-gradient { background: var(--gradient-main); color: white; }
.badge-warm { background: var(--gradient-warm); color: white; }
.badge-cool { background: var(--gradient-cool); color: white; }

.subtitle { font-family: 'Poppins', sans-serif; font-size: 1.375rem; font-weight: 400; color: var(--color-text-light); margin: 0 0 2rem 0; }
.lead { font-size: 1.2rem; line-height: 1.8; color: var(--color-text-light); }
.gradient-text { background: var(--gradient-main); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

.bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 2rem 0; }
.bento-item { background: #fafafa; border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; }
.bento-item.span-2 { grid-column: span 2; }
.bento-item.span-row { grid-row: span 2; }
.bento-value { font-family: 'Poppins', sans-serif; font-size: 2.5rem; font-weight: 800; background: var(--gradient-main); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.25rem; }
.bento-label { font-size: 0.75rem; color: var(--color-text-light); text-transform: uppercase; letter-spacing: 0.1em; }
`
  }
];

export function getThemeById(id: string): Theme | undefined {
  return themes.find(theme => theme.id === id);
}

export function getDefaultTheme(): Theme {
  return themes[0];
}

// Default content for new documents
export const DEFAULT_CONTENT = `# Welcome to MPDF

<p class="subtitle">Create beautiful PDFs with Markdown & CSS</p>

---

## Getting Started

Write your content in **Markdown** and style it with **CSS**. Choose a theme from the selector above, or customize the styles to match your brand.

### Features

1. **Multiple Themes** — Switch between professional designs instantly
2. **Full CSS Control** — Customize every detail of your document
3. **Page Breaks** — Use \`.page-break\` class for multi-page documents
4. **Print-Ready** — Generate high-quality PDFs for any purpose

---

<div class="callout callout-info">
<strong>Pro Tip:</strong> Edit the CSS in the styles tab to customize colors, fonts, and layouts.
</div>

## Example Content

Here's a code block:

\`\`\`javascript
const pdf = await generatePDF({
  content: markdown,
  theme: 'minimal-elegance'
});
\`\`\`

> "Design is not just what it looks like. Design is how it works."
> — Steve Jobs

### Sample Table

| Feature | Description | Status |
|---------|-------------|--------|
| Themes | Pre-built professional designs | ✅ Ready |
| Export | Generate PDF from preview | ✅ Ready |
| Custom CSS | Full styling control | ✅ Ready |

<div class="page-break"></div>

# Second Page

This content appears on a new page. Use the \`.page-break\` class to control pagination.

## Utility Classes

The following classes are available:

- \`.page-break\` — Force a page break before element
- \`.no-break\` — Prevent page break inside element
- \`.callout\` — Highlighted information box
- \`.card\` — Styled card container
- \`.badge\` — Small label/tag element

<div class="card">
<h3 style="margin-top:0">Card Example</h3>
<p style="margin-bottom:0">Cards are great for highlighting important information or creating visual sections.</p>
</div>

---

*Start editing the content above to create your document!*
`;

// =============================================================================
// THEME VALIDATION
// =============================================================================

/**
 * Validate a single theme against the schema
 */
export function validateThemeCSS(theme: Theme): ValidatedTheme {
  return {
    ...theme,
    validation: validateTheme(theme.css),
  };
}

/**
 * Get all themes with validation results
 */
export function getValidatedThemes(): ValidatedTheme[] {
  return themes.map(validateThemeCSS);
}

/**
 * Check if all themes are valid
 */
export function areAllThemesValid(): boolean {
  return themes.every((theme) => validateTheme(theme.css).valid);
}

/**
 * Get validation summary for all themes
 */
export function getValidationSummary(): {
  total: number;
  valid: number;
  invalid: number;
  themes: { id: string; name: string; valid: boolean; coverage: number }[];
} {
  const results = themes.map((theme) => {
    const validation = validateTheme(theme.css);
    return {
      id: theme.id,
      name: theme.name,
      valid: validation.valid,
      coverage: validation.coverage.percentage,
    };
  });

  return {
    total: themes.length,
    valid: results.filter((r) => r.valid).length,
    invalid: results.filter((r) => !r.valid).length,
    themes: results,
  };
}
