/**
 * MPDF Theme Schema & Validation
 * Defines required CSS selectors and properties for theme compliance.
 */

// =============================================================================
// SCHEMA DEFINITIONS
// =============================================================================

export interface CSSPropertyRequirement {
  property: string;
  description: string;
  required: boolean;
  suggestedValues?: string[];
}

export interface SelectorRequirement {
  selector: string;
  description: string;
  category: SchemaCategory;
  required: boolean;
  properties: CSSPropertyRequirement[];
  example?: string;
}

export type SchemaCategory =
  | "css-variables"
  | "typography"
  | "headings"
  | "links"
  | "code"
  | "blockquotes"
  | "tables"
  | "lists"
  | "utilities"
  | "callouts"
  | "badges"
  | "cards"
  | "layout";

export interface ThemeSchemaCategory {
  id: SchemaCategory;
  name: string;
  description: string;
  icon: string;
}

// =============================================================================
// CATEGORY DEFINITIONS
// =============================================================================

export const SCHEMA_CATEGORIES: ThemeSchemaCategory[] = [
  {
    id: "css-variables",
    name: "CSS Variables",
    description: "Root-level custom properties for consistent theming",
    icon: "🎨",
  },
  {
    id: "typography",
    name: "Typography",
    description: "Base text styles and font settings",
    icon: "📝",
  },
  {
    id: "headings",
    name: "Headings",
    description: "Heading hierarchy (h1-h6)",
    icon: "📰",
  },
  {
    id: "links",
    name: "Links",
    description: "Anchor styles and states",
    icon: "🔗",
  },
  {
    id: "code",
    name: "Code",
    description: "Inline code and code blocks",
    icon: "💻",
  },
  {
    id: "blockquotes",
    name: "Blockquotes",
    description: "Quoted content styling",
    icon: "💬",
  },
  {
    id: "tables",
    name: "Tables",
    description: "Table element styling",
    icon: "📊",
  },
  {
    id: "lists",
    name: "Lists",
    description: "Ordered and unordered lists",
    icon: "📋",
  },
  {
    id: "utilities",
    name: "Utilities",
    description: "Helper classes for common patterns",
    icon: "🔧",
  },
  {
    id: "callouts",
    name: "Callouts",
    description: "Alert and notification boxes",
    icon: "📢",
  },
  {
    id: "badges",
    name: "Badges",
    description: "Label and tag elements",
    icon: "🏷️",
  },
  {
    id: "cards",
    name: "Cards",
    description: "Card containers and surfaces",
    icon: "🃏",
  },
  {
    id: "layout",
    name: "Layout",
    description: "Page structure and spacing",
    icon: "📐",
  },
];

// =============================================================================
// THEME SCHEMA - Required Selectors & Properties
// =============================================================================

export const THEME_SCHEMA: SelectorRequirement[] = [
  // CSS Variables (Required)
  {
    selector: ":root",
    description: "CSS custom properties for theme-wide consistency",
    category: "css-variables",
    required: true,
    properties: [
      { property: "--color-primary", description: "Primary brand color", required: true },
      { property: "--color-accent", description: "Secondary/accent color", required: true },
      { property: "--color-text", description: "Main text color", required: true },
      { property: "--color-text-light", description: "Secondary text color", required: true },
      { property: "--color-text-muted", description: "Muted/disabled text", required: false },
      { property: "--color-background", description: "Page background color", required: true },
      { property: "--color-surface", description: "Surface/card background", required: true },
      { property: "--color-border", description: "Border color", required: true },
    ],
    example: `:root {
  --color-primary: #667eea;
  --color-accent: #764ba2;
  --color-text: #2d3748;
  --color-text-light: #718096;
  --color-background: #ffffff;
  --color-surface: #f7fafc;
  --color-border: #e2e8f0;
}`,
  },

  // Typography
  {
    selector: "body",
    description: "Base typography and page styling",
    category: "typography",
    required: true,
    properties: [
      { property: "font-family", description: "Primary font stack", required: true },
      { property: "font-size", description: "Base font size (use pt for print)", required: true, suggestedValues: ["11pt", "12pt", "10pt"] },
      { property: "line-height", description: "Base line height", required: true, suggestedValues: ["1.6", "1.7", "1.75"] },
      { property: "color", description: "Text color (use var)", required: true },
      { property: "background", description: "Page background", required: true },
    ],
    example: `body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11pt;
  line-height: 1.75;
  color: var(--color-text);
  background: var(--color-background);
}`,
  },

  // Headings
  {
    selector: "h1",
    description: "Primary heading / document title",
    category: "headings",
    required: true,
    properties: [
      { property: "font-size", description: "Heading size", required: true, suggestedValues: ["2.5rem", "2.25rem", "3rem"] },
      { property: "font-weight", description: "Heading weight", required: true, suggestedValues: ["700", "800", "600"] },
      { property: "line-height", description: "Heading line height", required: true },
      { property: "margin", description: "Spacing around heading", required: true },
    ],
    example: `h1 {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 1rem 0;
}`,
  },
  {
    selector: "h2",
    description: "Section heading",
    category: "headings",
    required: true,
    properties: [
      { property: "font-size", description: "Heading size", required: true },
      { property: "font-weight", description: "Heading weight", required: true },
      { property: "margin", description: "Spacing around heading", required: true },
    ],
    example: `h2 {
  font-size: 1.625rem;
  font-weight: 700;
  margin: 2.5rem 0 1rem 0;
}`,
  },
  {
    selector: "h3",
    description: "Subsection heading",
    category: "headings",
    required: true,
    properties: [
      { property: "font-size", description: "Heading size", required: true },
      { property: "font-weight", description: "Heading weight", required: true },
      { property: "margin", description: "Spacing around heading", required: true },
    ],
    example: `h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 2rem 0 0.75rem 0;
}`,
  },

  // Links
  {
    selector: "a",
    description: "Anchor/link styling",
    category: "links",
    required: true,
    properties: [
      { property: "color", description: "Link color", required: true },
      { property: "text-decoration", description: "Underline style", required: false },
    ],
    example: `a {
  color: var(--color-primary);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}`,
  },

  // Code
  {
    selector: "code",
    description: "Inline code styling",
    category: "code",
    required: true,
    properties: [
      { property: "font-family", description: "Monospace font", required: true },
      { property: "font-size", description: "Code font size", required: true },
      { property: "background", description: "Code background", required: true },
      { property: "padding", description: "Code padding", required: true },
      { property: "border-radius", description: "Code border radius", required: false },
    ],
    example: `code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9em;
  background: var(--color-surface);
  padding: 0.2em 0.4em;
  border-radius: 4px;
}`,
  },
  {
    selector: "pre",
    description: "Code block styling",
    category: "code",
    required: true,
    properties: [
      { property: "font-family", description: "Monospace font", required: true },
      { property: "font-size", description: "Code font size", required: true },
      { property: "background", description: "Block background", required: true },
      { property: "color", description: "Code text color", required: true },
      { property: "padding", description: "Block padding", required: true },
      { property: "border-radius", description: "Block border radius", required: false },
      { property: "overflow-x", description: "Horizontal overflow", required: true, suggestedValues: ["auto", "scroll"] },
    ],
    example: `pre {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  background: #1a1a2e;
  color: #e2e8f0;
  padding: 1.5rem;
  border-radius: 12px;
  overflow-x: auto;
}`,
  },
  {
    selector: "pre code",
    description: "Code inside pre blocks (reset inline styles)",
    category: "code",
    required: true,
    properties: [
      { property: "background", description: "Should be transparent", required: true, suggestedValues: ["transparent", "none"] },
      { property: "padding", description: "Should be 0", required: true, suggestedValues: ["0"] },
    ],
    example: `pre code {
  background: transparent;
  padding: 0;
  border: none;
}`,
  },

  // Blockquotes
  {
    selector: "blockquote",
    description: "Quoted text styling",
    category: "blockquotes",
    required: true,
    properties: [
      { property: "margin", description: "Quote spacing", required: true },
      { property: "padding", description: "Quote padding", required: true },
      { property: "border-left", description: "Left border accent", required: false },
      { property: "background", description: "Quote background", required: false },
    ],
    example: `blockquote {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  border-left: 4px solid var(--color-primary);
  background: var(--color-surface);
}`,
  },

  // Tables
  {
    selector: "table",
    description: "Table container",
    category: "tables",
    required: true,
    properties: [
      { property: "width", description: "Table width", required: true, suggestedValues: ["100%"] },
      { property: "border-collapse", description: "Border handling", required: true, suggestedValues: ["collapse"] },
      { property: "margin", description: "Table spacing", required: true },
    ],
    example: `table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}`,
  },
  {
    selector: "th",
    description: "Table header cells",
    category: "tables",
    required: true,
    properties: [
      { property: "padding", description: "Cell padding", required: true },
      { property: "text-align", description: "Text alignment", required: true },
      { property: "font-weight", description: "Header weight", required: true },
    ],
    example: `th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  background: var(--color-primary);
  color: white;
}`,
  },
  {
    selector: "td",
    description: "Table data cells",
    category: "tables",
    required: true,
    properties: [
      { property: "padding", description: "Cell padding", required: true },
      { property: "border-bottom", description: "Row separator", required: false },
    ],
    example: `td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}`,
  },

  // Lists
  {
    selector: "ul, ol",
    description: "List containers",
    category: "lists",
    required: true,
    properties: [
      { property: "margin", description: "List spacing", required: true },
      { property: "padding-left", description: "List indentation", required: true },
    ],
    example: `ul, ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}`,
  },
  {
    selector: "li",
    description: "List items",
    category: "lists",
    required: true,
    properties: [
      { property: "margin", description: "Item spacing", required: false },
    ],
    example: `li {
  margin: 0.5rem 0;
}`,
  },

  // Horizontal Rule
  {
    selector: "hr",
    description: "Horizontal divider",
    category: "layout",
    required: true,
    properties: [
      { property: "border", description: "Border style", required: true },
      { property: "margin", description: "Divider spacing", required: true },
    ],
    example: `hr {
  border: none;
  height: 1px;
  background: var(--color-border);
  margin: 2rem 0;
}`,
  },

  // Utility Classes
  {
    selector: ".subtitle",
    description: "Document subtitle text",
    category: "utilities",
    required: true,
    properties: [
      { property: "font-size", description: "Subtitle size", required: true },
      { property: "color", description: "Subtitle color", required: true },
    ],
    example: `.subtitle {
  font-size: 1.125rem;
  color: var(--color-text-light);
  margin-top: -0.5rem;
}`,
  },
  {
    selector: ".lead",
    description: "Lead paragraph (intro text)",
    category: "utilities",
    required: true,
    properties: [
      { property: "font-size", description: "Lead text size", required: true },
      { property: "line-height", description: "Lead line height", required: true },
    ],
    example: `.lead {
  font-size: 1.2rem;
  line-height: 1.8;
  color: var(--color-text-light);
}`,
  },

  // Callouts
  {
    selector: ".callout",
    description: "Base callout/alert box",
    category: "callouts",
    required: true,
    properties: [
      { property: "padding", description: "Callout padding", required: true },
      { property: "border-radius", description: "Callout corners", required: true },
      { property: "margin", description: "Callout spacing", required: true },
      { property: "border", description: "Callout border", required: true },
    ],
    example: `.callout {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  border: 1px solid var(--color-border);
}`,
  },
  {
    selector: ".callout-info",
    description: "Informational callout variant",
    category: "callouts",
    required: true,
    properties: [
      { property: "background", description: "Info background", required: true },
      { property: "border-color", description: "Info border", required: true },
      { property: "color", description: "Info text", required: true },
    ],
    example: `.callout-info {
  background: #ebf8ff;
  border-color: #90cdf4;
  color: #2c5282;
}`,
  },
  {
    selector: ".callout-success",
    description: "Success callout variant",
    category: "callouts",
    required: true,
    properties: [
      { property: "background", description: "Success background", required: true },
      { property: "border-color", description: "Success border", required: true },
      { property: "color", description: "Success text", required: true },
    ],
    example: `.callout-success {
  background: #f0fff4;
  border-color: #9ae6b4;
  color: #276749;
}`,
  },
  {
    selector: ".callout-warning",
    description: "Warning callout variant",
    category: "callouts",
    required: true,
    properties: [
      { property: "background", description: "Warning background", required: true },
      { property: "border-color", description: "Warning border", required: true },
      { property: "color", description: "Warning text", required: true },
    ],
    example: `.callout-warning {
  background: #fffaf0;
  border-color: #fbd38d;
  color: #975a16;
}`,
  },

  // Badges
  {
    selector: ".badge",
    description: "Base badge/tag styling",
    category: "badges",
    required: true,
    properties: [
      { property: "display", description: "Badge display", required: true, suggestedValues: ["inline-block", "inline-flex"] },
      { property: "padding", description: "Badge padding", required: true },
      { property: "font-size", description: "Badge font size", required: true },
      { property: "font-weight", description: "Badge font weight", required: true },
      { property: "border-radius", description: "Badge corners", required: true },
    ],
    example: `.badge {
  display: inline-block;
  padding: 0.2em 0.6em;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
}`,
  },
  {
    selector: ".badge-primary",
    description: "Primary badge variant",
    category: "badges",
    required: true,
    properties: [
      { property: "background", description: "Primary badge bg", required: true },
      { property: "color", description: "Primary badge text", required: true },
    ],
    example: `.badge-primary {
  background: var(--color-primary);
  color: white;
}`,
  },
  {
    selector: ".badge-success",
    description: "Success badge variant",
    category: "badges",
    required: true,
    properties: [
      { property: "background", description: "Success badge bg", required: true },
      { property: "color", description: "Success badge text", required: true },
    ],
    example: `.badge-success {
  background: #dcfce7;
  color: #166534;
}`,
  },
  {
    selector: ".badge-warning",
    description: "Warning badge variant",
    category: "badges",
    required: true,
    properties: [
      { property: "background", description: "Warning badge bg", required: true },
      { property: "color", description: "Warning badge text", required: true },
    ],
    example: `.badge-warning {
  background: #fef3c7;
  color: #92400e;
}`,
  },

  // Cards
  {
    selector: ".card",
    description: "Card container",
    category: "cards",
    required: true,
    properties: [
      { property: "background", description: "Card background", required: true },
      { property: "border", description: "Card border", required: true },
      { property: "border-radius", description: "Card corners", required: true },
      { property: "padding", description: "Card padding", required: true },
    ],
    example: `.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
}`,
  },
];

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  coverage: {
    total: number;
    found: number;
    percentage: number;
  };
}

export interface ValidationError {
  selector: string;
  category: SchemaCategory;
  message: string;
  severity: "error";
}

export interface ValidationWarning {
  selector: string;
  category: SchemaCategory;
  message: string;
  severity: "warning";
}

/**
 * Normalize CSS by removing comments and extra whitespace
 */
function normalizeCss(css: string): string {
  return css
    // Remove CSS comments
    .replace(/\/\*[\s\S]*?\*\//g, "")
    // Normalize whitespace
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Check if a CSS string contains a specific selector
 * More lenient matching to handle various CSS formatting styles
 */
function cssContainsSelector(css: string, selector: string): boolean {
  const normalized = normalizeCss(css);
  // Escape special regex characters in selector
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  
  // Try multiple patterns to be more lenient:
  // 1. Standard selector at start or after } or newline
  // 2. Selector in a group (after comma)
  // 3. Selector with any preceding whitespace
  const patterns = [
    // Standard: selector followed by { or ,
    new RegExp(`(^|[}\\s])${escaped}\\s*[{,]`, "mi"),
    // In a selector group: h1, h2, h3 {}
    new RegExp(`,\\s*${escaped}\\s*[{,]`, "mi"),
    // After opening @media or similar
    new RegExp(`@[^{]*\\{[^}]*${escaped}\\s*\\{`, "mi"),
  ];
  
  return patterns.some(pattern => pattern.test(normalized));
}

/**
 * Check if a CSS rule for a selector contains a specific property
 * Handles multiple occurrences of the same selector
 */
function cssContainsProperty(css: string, selector: string, property: string): boolean {
  const normalized = normalizeCss(css);
  // Escape special regex characters
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  
  // Find ALL rule blocks for the selector (selector can appear multiple times)
  const rulePattern = new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, "gmi");
  let match;
  
  while ((match = rulePattern.exec(normalized)) !== null) {
    const ruleContent = match[1];
    // Check for property (handle CSS variable format --property-name)
    const propEscaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const propPattern = new RegExp(`(^|;|\\s)${propEscaped}\\s*:`, "i");
    if (propPattern.test(ruleContent)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Validate a theme's CSS against the schema
 * @param css The CSS string to validate
 * @param strict If true, all required selectors must be present. If false, only basic selectors are required.
 */
export function validateTheme(css: string, strict = true): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // For lenient mode, only require :root and body selectors
  const essentialSelectors = [":root", "body"];
  const requiredSelectors = THEME_SCHEMA.filter((s) => s.required);
  const selectorsToCheck = strict 
    ? requiredSelectors 
    : requiredSelectors.filter(s => essentialSelectors.includes(s.selector));
  
  let foundCount = 0;
  const totalRequired = requiredSelectors.length;

  for (const requirement of selectorsToCheck) {
    const hasSelector = cssContainsSelector(css, requirement.selector);
    
    if (!hasSelector) {
      errors.push({
        selector: requirement.selector,
        category: requirement.category,
        message: `Missing required selector: ${requirement.selector}`,
        severity: "error",
      });
    } else {
      foundCount++;
      
      // Check required properties (only in strict mode)
      if (strict) {
        for (const prop of requirement.properties.filter((p) => p.required)) {
          if (!cssContainsProperty(css, requirement.selector, prop.property)) {
            warnings.push({
              selector: requirement.selector,
              category: requirement.category,
              message: `Missing property '${prop.property}' in ${requirement.selector}`,
              severity: "warning",
            });
          }
        }
      }
    }
  }

  // In lenient mode, also count selectors that ARE present but weren't required to check
  if (!strict) {
    for (const requirement of requiredSelectors) {
      if (!essentialSelectors.includes(requirement.selector)) {
        if (cssContainsSelector(css, requirement.selector)) {
          foundCount++;
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    coverage: {
      total: totalRequired,
      found: foundCount,
      percentage: Math.round((foundCount / totalRequired) * 100),
    },
  };
}

/**
 * Get all selectors grouped by category
 */
export function getSelectorsByCategory(): Record<SchemaCategory, SelectorRequirement[]> {
  const grouped = {} as Record<SchemaCategory, SelectorRequirement[]>;
  
  for (const category of SCHEMA_CATEGORIES) {
    grouped[category.id] = THEME_SCHEMA.filter((s) => s.category === category.id);
  }
  
  return grouped;
}

/**
 * Generate a minimal valid theme skeleton
 */
export function generateThemeSkeleton(): string {
  const lines: string[] = [
    "/* MPDF Theme Skeleton */",
    "/* All required selectors included */",
    "",
  ];

  const grouped = getSelectorsByCategory();
  
  for (const category of SCHEMA_CATEGORIES) {
    const selectors = grouped[category.id];
    if (selectors.length === 0) continue;
    
    lines.push(`/* === ${category.name.toUpperCase()} === */`);
    lines.push("");
    
    for (const req of selectors) {
      if (req.example) {
        lines.push(req.example);
        lines.push("");
      }
    }
  }

  return lines.join("\n");
}
