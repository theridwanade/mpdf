/**
 * MPDF Theme Store
 * Community themes, ratings, and marketplace functionality
 */

import { validateTheme, type ValidationResult } from "./theme-schema";

export interface ThemeAuthor {
  id: string;
  name: string;
  avatar?: string;
  verified?: boolean;
}

export interface ThemeRating {
  average: number;
  count: number;
}

export interface CommunityTheme {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  preview: string;
  css: string;
  author: ThemeAuthor;
  rating: ThemeRating;
  downloads: number;
  tags: string[];
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ThemeSubmission {
  name: string;
  description: string;
  css: string;
  tags: string[];
}

// =============================================================================
// MOCK COMMUNITY THEMES
// =============================================================================

export const communityThemes: CommunityTheme[] = [
  {
    id: "corporate-professional",
    name: "Corporate Professional",
    description: "Clean, authoritative design for business documents",
    longDescription: "A sophisticated theme designed for corporate reports, proposals, and official documentation. Features clean typography, structured layouts, and a professional color palette that conveys trust and authority.",
    preview: "linear-gradient(135deg, #1e3a5f 0%, #2c5282 50%, #3182ce 100%)",
    author: { id: "1", name: "MPDF Team", verified: true },
    rating: { average: 4.8, count: 234 },
    downloads: 12500,
    tags: ["business", "corporate", "professional", "reports"],
    featured: true,
    createdAt: "2025-06-15",
    updatedAt: "2026-01-10",
    css: `/* CORPORATE PROFESSIONAL THEME */

:root {
  --color-primary: #2c5282;
  --color-accent: #3182ce;
  --color-text: #1a202c;
  --color-text-light: #4a5568;
  --color-text-muted: #a0aec0;
  --color-background: #ffffff;
  --color-surface: #f7fafc;
  --color-border: #e2e8f0;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11pt;
  line-height: 1.7;
  color: var(--color-text);
  background: var(--color-background);
}

h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 1.5rem 0;
  line-height: 1.3;
  border-bottom: 3px solid var(--color-primary);
  padding-bottom: 0.75rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
  margin: 2rem 0 1rem 0;
}

h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 1.5rem 0 0.75rem 0;
}

a { color: var(--color-accent); text-decoration: none; }
a:hover { text-decoration: underline; }

code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9em;
  background: var(--color-surface);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

pre {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  background: #1a202c;
  color: #e2e8f0;
  padding: 1.25rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5rem 0;
}

pre code { background: transparent; border: none; padding: 0; }

blockquote {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  background: var(--color-surface);
  border-left: 4px solid var(--color-primary);
  color: var(--color-text-light);
}

table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
th { background: var(--color-primary); color: white; padding: 0.75rem 1rem; text-align: left; font-weight: 600; }
td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--color-border); }

hr { border: none; height: 2px; background: var(--color-border); margin: 2rem 0; }

ul, ol { margin: 1rem 0; padding-left: 1.5rem; }
li { margin: 0.5rem 0; }

.callout { padding: 1rem 1.5rem; border-radius: 8px; margin: 1.5rem 0; border: 1px solid; }
.callout-info { background: #ebf8ff; border-color: #90cdf4; color: #2c5282; }
.callout-success { background: #f0fff4; border-color: #9ae6b4; color: #276749; }
.callout-warning { background: #fffaf0; border-color: #fbd38d; color: #975a16; }

.badge { display: inline-block; padding: 0.2em 0.6em; font-size: 0.75rem; font-weight: 600; border-radius: 4px; }
.badge-primary { background: var(--color-primary); color: white; }
.badge-success { background: #48bb78; color: white; }
.badge-warning { background: #ed8936; color: white; }

.card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 8px; padding: 1.5rem; margin: 1rem 0; }

.subtitle { font-size: 1.125rem; color: var(--color-text-light); margin-top: -1rem; margin-bottom: 2rem; }
.lead { font-size: 1.125rem; line-height: 1.8; color: var(--color-text-light); }
`
  },
  {
    id: "startup-pitch",
    name: "Startup Pitch",
    description: "Bold, energetic design for pitch decks and presentations",
    longDescription: "Make your startup stand out with this vibrant, modern theme. Perfect for pitch decks, investor presentations, and marketing materials. Features bold gradients, dynamic typography, and attention-grabbing layouts.",
    preview: "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)",
    author: { id: "2", name: "DesignCraft", verified: true },
    rating: { average: 4.9, count: 187 },
    downloads: 8900,
    tags: ["startup", "pitch", "presentation", "modern", "bold"],
    featured: true,
    createdAt: "2025-08-22",
    updatedAt: "2026-02-01",
    css: `/* STARTUP PITCH THEME */

:root {
  --color-primary: #f97316;
  --color-accent: #ec4899;
  --color-text: #18181b;
  --color-text-light: #52525b;
  --color-text-muted: #a1a1aa;
  --color-background: #ffffff;
  --color-surface: #fafafa;
  --color-border: #e4e4e7;
  --gradient-hero: linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%);
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11pt;
  line-height: 1.75;
  color: var(--color-text);
  background: var(--color-background);
}

h1 {
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin: 0 0 1rem 0;
  background: var(--gradient-hero);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 2.5rem 0 1rem 0;
}

h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary);
  margin: 2rem 0 0.75rem 0;
}

a { color: var(--color-primary); text-decoration: none; font-weight: 500; }
a:hover { color: var(--color-accent); }

code {
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
  background: var(--color-surface);
  color: var(--color-accent);
  padding: 0.2em 0.5em;
  border-radius: 6px;
}

pre {
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  background: linear-gradient(135deg, #18181b 0%, #27272a 100%);
  color: #fafafa;
  padding: 1.5rem;
  border-radius: 16px;
  overflow-x: auto;
  margin: 1.5rem 0;
  position: relative;
}

pre::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: var(--gradient-hero);
  border-radius: 16px 16px 0 0;
}

pre code { background: transparent; padding: 0; }

blockquote {
  margin: 2rem 0;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
  border-left: 4px solid var(--color-primary);
  border-radius: 0 16px 16px 0;
  font-size: 1.125rem;
}

table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; border-radius: 12px; overflow: hidden; }
thead { background: var(--gradient-hero); }
th { color: white; padding: 1rem; text-align: left; font-weight: 600; }
td { padding: 1rem; border-bottom: 1px solid var(--color-border); }

hr { border: none; height: 4px; background: var(--gradient-hero); border-radius: 2px; margin: 2.5rem 0; opacity: 0.3; }

ul, ol { margin: 1rem 0; padding-left: 1.5rem; }
li { margin: 0.5rem 0; }

.callout { padding: 1.5rem; border-radius: 16px; margin: 1.5rem 0; border: 1px solid; }
.callout-info { background: linear-gradient(135deg, #dbeafe, #ede9fe); border-color: #a5b4fc; color: #4338ca; }
.callout-success { background: linear-gradient(135deg, #dcfce7, #d1fae5); border-color: #86efac; color: #166534; }
.callout-warning { background: linear-gradient(135deg, #fef3c7, #ffedd5); border-color: #fdba74; color: #c2410c; }

.badge { display: inline-block; padding: 0.3em 0.8em; font-size: 0.75rem; font-weight: 700; border-radius: 50px; }
.badge-primary { background: var(--gradient-hero); color: white; }
.badge-success { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; }
.badge-warning { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }

.card { background: white; border: 1px solid var(--color-border); border-radius: 20px; padding: 2rem; margin: 1.5rem 0; box-shadow: 0 10px 40px rgba(0,0,0,0.05); }

.subtitle { font-size: 1.375rem; color: var(--color-text-light); margin-top: -0.5rem; margin-bottom: 2rem; }
.lead { font-size: 1.25rem; line-height: 1.8; color: var(--color-text-light); }
`
  },
  {
    id: "academic-paper",
    name: "Academic Paper",
    description: "Traditional scholarly format for research papers",
    longDescription: "A clean, scholarly theme designed for academic papers, research documents, and thesis work. Features traditional typography, proper citation styling, and a format that meets academic standards.",
    preview: "linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)",
    author: { id: "3", name: "AcademicStyles", verified: false },
    rating: { average: 4.6, count: 156 },
    downloads: 6700,
    tags: ["academic", "research", "paper", "scholarly", "thesis"],
    createdAt: "2025-09-10",
    updatedAt: "2026-01-20",
    css: `/* ACADEMIC PAPER THEME */

:root {
  --color-primary: #1f2937;
  --color-accent: #4b5563;
  --color-text: #111827;
  --color-text-light: #4b5563;
  --color-text-muted: #9ca3af;
  --color-background: #ffffff;
  --color-surface: #f9fafb;
  --color-border: #e5e7eb;
}

body {
  font-family: 'Times New Roman', Georgia, serif;
  font-size: 12pt;
  line-height: 2;
  color: var(--color-text);
  background: var(--color-background);
}

h1 {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  color: var(--color-text);
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 2rem 0 1rem 0;
  text-transform: uppercase;
}

h3 {
  font-size: 1.125rem;
  font-weight: 700;
  font-style: italic;
  color: var(--color-text);
  margin: 1.5rem 0 0.75rem 0;
}

a { color: var(--color-accent); text-decoration: underline; }

code {
  font-family: 'Courier New', monospace;
  font-size: 0.95em;
  background: var(--color-surface);
  padding: 0.15em 0.3em;
  border-radius: 2px;
}

pre {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
}

pre code { background: transparent; padding: 0; }

blockquote {
  margin: 1rem 2rem;
  padding: 0.5rem 1rem;
  border-left: 2px solid var(--color-border);
  font-style: italic;
  color: var(--color-text-light);
}

table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.95rem; }
th { border-top: 2px solid var(--color-text); border-bottom: 1px solid var(--color-text); padding: 0.5rem; text-align: left; font-weight: 700; }
td { padding: 0.5rem; border-bottom: 1px solid var(--color-border); }
tbody tr:last-child td { border-bottom: 2px solid var(--color-text); }

hr { border: none; border-top: 1px solid var(--color-border); margin: 2rem 0; }

ul, ol { margin: 1rem 0; padding-left: 2rem; }
li { margin: 0.25rem 0; }

.callout { padding: 1rem; margin: 1rem 0; border: 1px solid var(--color-border); background: var(--color-surface); }
.callout-info { border-left: 3px solid #3b82f6; }
.callout-success { border-left: 3px solid #22c55e; }
.callout-warning { border-left: 3px solid #f59e0b; }

.badge { display: inline; font-size: 0.85rem; font-weight: 600; }
.badge-primary { color: var(--color-primary); }
.badge-success { color: #166534; }
.badge-warning { color: #b45309; }

.card { background: var(--color-surface); border: 1px solid var(--color-border); padding: 1rem; margin: 1rem 0; }

.subtitle { font-size: 1rem; text-align: center; color: var(--color-text-light); margin-bottom: 2rem; font-style: italic; }
.lead { font-size: 1rem; line-height: 2; }
`
  },
  {
    id: "neon-nights",
    name: "Neon Nights",
    description: "Cyberpunk-inspired dark theme with neon accents",
    longDescription: "A bold, futuristic theme inspired by cyberpunk aesthetics. Perfect for tech documentation, gaming content, and projects that want to make a bold statement with vibrant neon colors against dark backgrounds.",
    preview: "linear-gradient(135deg, #0f0f23 0%, #1a0a2e 50%, #16213e 100%)",
    author: { id: "4", name: "NeonDesigns", verified: true },
    rating: { average: 4.7, count: 312 },
    downloads: 15200,
    tags: ["dark", "neon", "cyberpunk", "futuristic", "tech"],
    featured: true,
    createdAt: "2025-05-01",
    updatedAt: "2026-02-15",
    css: `/* NEON NIGHTS THEME */

:root {
  --color-primary: #00ff88;
  --color-accent: #ff00ff;
  --color-text: #e0e0e0;
  --color-text-light: #a0a0a0;
  --color-text-muted: #606060;
  --color-background: #0a0a0f;
  --color-surface: #12121a;
  --color-border: #2a2a35;
  --neon-green: #00ff88;
  --neon-pink: #ff00ff;
  --neon-blue: #00d4ff;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11pt;
  line-height: 1.8;
  color: var(--color-text);
  background: var(--color-background);
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(0, 255, 136, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.03) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
}

h1 {
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0 0 1rem 0;
  color: var(--neon-green);
  text-shadow: 0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 255, 136, 0.3);
}

h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--neon-pink);
  margin: 2.5rem 0 1rem 0;
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.3);
}

h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--neon-blue);
  margin: 2rem 0 0.75rem 0;
}

a { color: var(--neon-blue); text-decoration: none; }
a:hover { text-shadow: 0 0 10px rgba(0, 212, 255, 0.5); }

code {
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
  background: var(--color-surface);
  color: var(--neon-pink);
  padding: 0.2em 0.5em;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

pre {
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  background: var(--color-surface);
  color: var(--color-text);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  overflow-x: auto;
  margin: 1.5rem 0;
  position: relative;
}

pre::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--neon-green), var(--neon-blue), var(--neon-pink));
}

pre code { background: transparent; border: none; padding: 0; color: inherit; }

blockquote {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: rgba(0, 255, 136, 0.05);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--neon-green);
  border-radius: 0 12px 12px 0;
}

table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
thead { background: var(--color-surface); }
th { color: var(--neon-green); padding: 1rem; text-align: left; font-weight: 600; border-bottom: 2px solid var(--neon-green); }
td { padding: 1rem; border-bottom: 1px solid var(--color-border); }

hr { border: none; height: 1px; background: linear-gradient(90deg, transparent, var(--neon-green), var(--neon-pink), transparent); margin: 2.5rem 0; }

ul, ol { margin: 1rem 0; padding-left: 1.5rem; }
li { margin: 0.5rem 0; }
ul > li::marker { color: var(--neon-green); }

.callout { padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0; border: 1px solid; }
.callout-info { background: rgba(0, 212, 255, 0.1); border-color: rgba(0, 212, 255, 0.3); color: var(--neon-blue); }
.callout-success { background: rgba(0, 255, 136, 0.1); border-color: rgba(0, 255, 136, 0.3); color: var(--neon-green); }
.callout-warning { background: rgba(255, 200, 0, 0.1); border-color: rgba(255, 200, 0, 0.3); color: #ffc800; }

.badge { display: inline-block; padding: 0.3em 0.8em; font-size: 0.75rem; font-weight: 600; border-radius: 50px; }
.badge-primary { background: var(--neon-green); color: var(--color-background); }
.badge-success { background: var(--neon-blue); color: var(--color-background); }
.badge-warning { background: #ffc800; color: var(--color-background); }

.card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 16px; padding: 1.5rem; margin: 1rem 0; }

.subtitle { font-size: 1.25rem; color: var(--color-text-light); margin-top: -0.5rem; margin-bottom: 2rem; }
.lead { font-size: 1.2rem; line-height: 1.8; color: var(--color-text-light); }
`
  },
  {
    id: "nature-organic",
    name: "Nature Organic",
    description: "Earthy, natural tones for eco-friendly content",
    longDescription: "A warm, organic theme inspired by nature. Perfect for sustainability reports, environmental content, wellness brands, and any project that wants to convey natural, earthy vibes.",
    preview: "linear-gradient(135deg, #2d5016 0%, #4a7c23 50%, #84cc16 100%)",
    author: { id: "5", name: "GreenThemes", verified: false },
    rating: { average: 4.5, count: 89 },
    downloads: 3400,
    tags: ["nature", "organic", "green", "eco", "wellness"],
    createdAt: "2025-11-05",
    updatedAt: "2026-01-28",
    css: `/* NATURE ORGANIC THEME */

:root {
  --color-primary: #2d5016;
  --color-accent: #84cc16;
  --color-text: #1c1917;
  --color-text-light: #57534e;
  --color-text-muted: #a8a29e;
  --color-background: #fefdfb;
  --color-surface: #f5f5f0;
  --color-border: #e7e5e4;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11pt;
  line-height: 1.8;
  color: var(--color-text);
  background: var(--color-background);
}

body::before {
  content: '';
  position: fixed;
  top: 0; right: 0;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(132, 204, 22, 0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 1rem 0;
  line-height: 1.3;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
  margin: 2.5rem 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-accent);
}

h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-primary);
  margin: 2rem 0 0.75rem 0;
}

a { color: var(--color-accent); text-decoration: none; font-weight: 500; }
a:hover { color: var(--color-primary); }

code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9em;
  background: var(--color-surface);
  color: var(--color-primary);
  padding: 0.2em 0.4em;
  border-radius: 4px;
}

pre {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  background: #1c1917;
  color: #fafaf9;
  padding: 1.5rem;
  border-radius: 12px;
  overflow-x: auto;
  margin: 1.5rem 0;
}

pre code { background: transparent; padding: 0; }

blockquote {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, rgba(132, 204, 22, 0.1), rgba(45, 80, 22, 0.05));
  border-left: 4px solid var(--color-accent);
  border-radius: 0 8px 8px 0;
}

table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
thead { background: var(--color-primary); }
th { color: white; padding: 0.75rem 1rem; text-align: left; font-weight: 600; }
td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--color-border); }

hr { border: none; height: 2px; background: linear-gradient(90deg, transparent, var(--color-accent), transparent); margin: 2rem 0; }

ul, ol { margin: 1rem 0; padding-left: 1.5rem; }
li { margin: 0.5rem 0; }

.callout { padding: 1rem 1.5rem; border-radius: 12px; margin: 1.5rem 0; border: 1px solid; }
.callout-info { background: #ecfdf5; border-color: #a7f3d0; color: #065f46; }
.callout-success { background: #f0fdf4; border-color: #bbf7d0; color: #166534; }
.callout-warning { background: #fefce8; border-color: #fef08a; color: #854d0e; }

.badge { display: inline-block; padding: 0.2em 0.6em; font-size: 0.75rem; font-weight: 600; border-radius: 50px; }
.badge-primary { background: var(--color-primary); color: white; }
.badge-success { background: var(--color-accent); color: var(--color-primary); }
.badge-warning { background: #fbbf24; color: #78350f; }

.card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 12px; padding: 1.5rem; margin: 1rem 0; }

.subtitle { font-size: 1.125rem; color: var(--color-text-light); margin-top: -0.5rem; margin-bottom: 2rem; }
.lead { font-size: 1.125rem; line-height: 1.8; color: var(--color-text-light); }
`
  }
];

// =============================================================================
// STORE FUNCTIONS
// =============================================================================

/**
 * Get all community themes
 */
export function getAllCommunityThemes(): CommunityTheme[] {
  return communityThemes;
}

/**
 * Get featured themes
 */
export function getFeaturedThemes(): CommunityTheme[] {
  return communityThemes.filter((t) => t.featured);
}

/**
 * Get a theme by ID
 */
export function getCommunityThemeById(id: string): CommunityTheme | undefined {
  return communityThemes.find((t) => t.id === id);
}

/**
 * Search themes by query
 */
export function searchThemes(query: string): CommunityTheme[] {
  const q = query.toLowerCase();
  return communityThemes.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

/**
 * Get themes by tag
 */
export function getThemesByTag(tag: string): CommunityTheme[] {
  return communityThemes.filter((t) =>
    t.tags.some((tg) => tg.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Sort themes
 */
export function sortThemes(
  themes: CommunityTheme[],
  sort: "popular" | "rating" | "newest" | "name"
): CommunityTheme[] {
  const sorted = [...themes];
  switch (sort) {
    case "popular":
      return sorted.sort((a, b) => b.downloads - a.downloads);
    case "rating":
      return sorted.sort((a, b) => b.rating.average - a.rating.average);
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

/**
 * Get all unique tags from themes
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  communityThemes.forEach((t) => t.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

/**
 * Validate a theme submission
 */
export function validateThemeSubmission(
  submission: ThemeSubmission
): ValidationResult & { nameError?: string; descriptionError?: string } {
  const cssValidation = validateTheme(submission.css);

  let nameError: string | undefined;
  let descriptionError: string | undefined;

  if (!submission.name || submission.name.length < 3) {
    nameError = "Theme name must be at least 3 characters";
  } else if (submission.name.length > 50) {
    nameError = "Theme name must be 50 characters or less";
  }

  if (!submission.description || submission.description.length < 10) {
    descriptionError = "Description must be at least 10 characters";
  } else if (submission.description.length > 200) {
    descriptionError = "Description must be 200 characters or less";
  }

  return {
    ...cssValidation,
    valid: cssValidation.valid && !nameError && !descriptionError,
    nameError,
    descriptionError,
  };
}

// =============================================================================
// RATING SYSTEM (localStorage-based for demo)
// =============================================================================

const RATINGS_KEY = "mpdf_theme_ratings";
const DOWNLOADS_KEY = "mpdf_theme_downloads";

interface StoredRatings {
  [themeId: string]: number; // user's rating 1-5
}

interface StoredDownloads {
  [themeId: string]: boolean; // has user downloaded
}

/**
 * Get user's rating for a theme
 */
export function getUserRating(themeId: string): number | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(RATINGS_KEY);
    if (!stored) return null;
    const ratings: StoredRatings = JSON.parse(stored);
    return ratings[themeId] ?? null;
  } catch {
    return null;
  }
}

/**
 * Rate a theme (1-5 stars)
 */
export function rateTheme(themeId: string, rating: number): boolean {
  if (typeof window === "undefined") return false;
  if (rating < 1 || rating > 5) return false;
  
  try {
    const stored = localStorage.getItem(RATINGS_KEY);
    const ratings: StoredRatings = stored ? JSON.parse(stored) : {};
    ratings[themeId] = rating;
    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
    return true;
  } catch {
    return false;
  }
}

/**
 * Track theme download
 */
export function trackDownload(themeId: string): void {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(DOWNLOADS_KEY);
    const downloads: StoredDownloads = stored ? JSON.parse(stored) : {};
    downloads[themeId] = true;
    localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(downloads));
  } catch {
    // Fail silently
  }
}

/**
 * Check if user has downloaded a theme
 */
export function hasDownloaded(themeId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem(DOWNLOADS_KEY);
    if (!stored) return false;
    const downloads: StoredDownloads = JSON.parse(stored);
    return downloads[themeId] ?? false;
  } catch {
    return false;
  }
}

// =============================================================================
// SHARING SYSTEM
// =============================================================================

/**
 * Generate share URL for a theme
 */
export function getShareUrl(themeId: string): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/themes/${themeId}`;
}

/**
 * Generate share data for Web Share API
 */
export function getShareData(theme: CommunityTheme): ShareData {
  return {
    title: `${theme.name} - MPDF Theme`,
    text: theme.description,
    url: getShareUrl(theme.id),
  };
}

/**
 * Share a theme using Web Share API or fallback to clipboard
 */
export async function shareTheme(theme: CommunityTheme): Promise<"shared" | "copied" | "failed"> {
  const shareData = getShareData(theme);
  
  // Try Web Share API first
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share(shareData);
      return "shared";
    } catch (err) {
      // User cancelled or error - fall through to clipboard
    }
  }
  
  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(shareData.url || "");
    return "copied";
  } catch {
    return "failed";
  }
}

/**
 * Generate embed code for a theme
 */
export function getEmbedCode(themeId: string): string {
  const url = getShareUrl(themeId);
  return `<a href="${url}" target="_blank">View Theme on MPDF</a>`;
}
