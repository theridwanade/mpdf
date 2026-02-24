/**
 * MPDF Theme Store
 * Professional PDF themes with sophisticated design
 */

export interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string; // CSS gradient for theme preview
  css: string;
  defaultContent: string;
}

export const themes: Theme[] = [
  {
    id: "minimal-elegance",
    name: "Minimal Elegance",
    description: "Clean, sophisticated design with subtle gradients and refined typography",
    preview: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    css: `/* ==============================================
   MINIMAL ELEGANCE THEME
   Clean sophistication with subtle gradients
   ============================================== */

:root {
  /* Page Setup */
  --page-width: 210mm;
  --page-height: 297mm;
  --page-margin: 30mm;
  
  /* Colors */
  --color-primary: #667eea;
  --color-primary-dark: #5a67d8;
  --color-accent: #764ba2;
  --color-text: #2d3748;
  --color-text-light: #718096;
  --color-text-muted: #a0aec0;
  --color-background: #ffffff;
  --color-surface: #f7fafc;
  --color-border: #e2e8f0;
  
  /* Typography */
  --font-heading: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  --font-body: 'Inter', 'SF Pro Text', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', monospace;
  
  /* Spacing */
  --space-unit: 8px;
}

/* Page Background */
body {
  font-family: var(--font-body);
  font-size: 11pt;
  line-height: 1.75;
  color: var(--color-text);
  background: var(--color-background);
  padding: var(--page-margin);
}

/* Subtle gradient overlay on first page */
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

/* Typography */
h1 {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.2;
  color: var(--color-text);
  margin: 0 0 calc(var(--space-unit) * 2) 0;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

h2 {
  font-family: var(--font-heading);
  font-size: 1.625rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text);
  margin: calc(var(--space-unit) * 5) 0 calc(var(--space-unit) * 2) 0;
  padding-bottom: calc(var(--space-unit) * 1.5);
  border-bottom: 2px solid var(--color-border);
}

h3 {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary-dark);
  margin: calc(var(--space-unit) * 4) 0 calc(var(--space-unit) * 1.5) 0;
}

h4 {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  margin: calc(var(--space-unit) * 3) 0 var(--space-unit) 0;
}

p {
  margin: 0 0 calc(var(--space-unit) * 2) 0;
}

/* Subtitle styling */
.subtitle {
  font-size: 1.125rem;
  color: var(--color-text-light);
  font-weight: 400;
  margin-top: calc(var(--space-unit) * -1);
  margin-bottom: calc(var(--space-unit) * 4);
}

/* Lead paragraph */
.lead {
  font-size: 1.2rem;
  line-height: 1.8;
  color: var(--color-text-light);
  margin-bottom: calc(var(--space-unit) * 3);
}

/* Links */
a {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

a:hover {
  border-bottom-color: var(--color-primary);
}

/* Lists */
ul, ol {
  margin: 0 0 calc(var(--space-unit) * 2) 0;
  padding-left: calc(var(--space-unit) * 3);
}

li {
  margin-bottom: var(--space-unit);
}

ul > li::marker {
  color: var(--color-primary);
}

ol > li::marker {
  color: var(--color-primary);
  font-weight: 600;
}

/* Code */
code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background: var(--color-surface);
  color: var(--color-accent);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

pre {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.7;
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
  color: #e2e8f0;
  padding: calc(var(--space-unit) * 3);
  border-radius: 12px;
  margin: calc(var(--space-unit) * 3) 0;
  overflow-x: auto;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

pre code {
  background: transparent;
  border: none;
  padding: 0;
  color: inherit;
}

/* Blockquote */
blockquote {
  margin: calc(var(--space-unit) * 3) 0;
  padding: calc(var(--space-unit) * 2) calc(var(--space-unit) * 3);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-left: 4px solid;
  border-image: linear-gradient(180deg, var(--color-primary) 0%, var(--color-accent) 100%) 1;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: var(--color-text-light);
}

blockquote p:last-child {
  margin-bottom: 0;
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin: calc(var(--space-unit) * 3) 0;
  font-size: 0.95rem;
}

thead {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
}

th {
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  padding: calc(var(--space-unit) * 1.5) calc(var(--space-unit) * 2);
  text-align: left;
}

td {
  padding: calc(var(--space-unit) * 1.5) calc(var(--space-unit) * 2);
  border-bottom: 1px solid var(--color-border);
}

tbody tr:hover {
  background: var(--color-surface);
}

/* Horizontal Rule */
hr {
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border), transparent);
  margin: calc(var(--space-unit) * 5) 0;
}

/* Callouts */
.callout {
  padding: calc(var(--space-unit) * 2.5) calc(var(--space-unit) * 3);
  border-radius: 12px;
  margin: calc(var(--space-unit) * 3) 0;
  border: 1px solid;
}

.callout-info {
  background: linear-gradient(135deg, #ebf8ff 0%, #e6fffa 100%);
  border-color: #90cdf4;
  color: #2c5282;
}

.callout-success {
  background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
  border-color: #9ae6b4;
  color: #276749;
}

.callout-warning {
  background: linear-gradient(135deg, #fffaf0 0%, #fefcbf 100%);
  border-color: #fbd38d;
  color: #975a16;
}

.callout-danger {
  background: linear-gradient(135deg, #fff5f5 0%, #fed7e2 100%);
  border-color: #feb2b2;
  color: #c53030;
}

/* Card Component */
.card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: calc(var(--space-unit) * 3);
  margin: calc(var(--space-unit) * 2) 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2em 0.75em;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.badge-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: white;
}

.badge-success {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
}

.badge-warning {
  background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
  color: white;
}

/* Divider with text */
.divider {
  display: flex;
  align-items: center;
  margin: calc(var(--space-unit) * 4) 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.divider::before {
  margin-right: calc(var(--space-unit) * 2);
}

.divider::after {
  margin-left: calc(var(--space-unit) * 2);
}

/* Page number footer */
.page-footer {
  position: fixed;
  bottom: calc(var(--page-margin) / 2);
  left: var(--page-margin);
  right: var(--page-margin);
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
`,
    defaultContent: `# Project Proposal

<p class="subtitle">Strategic Initiative for Digital Transformation</p>

<p class="lead">This document outlines our comprehensive approach to modernizing infrastructure and enhancing operational efficiency through innovative technology solutions.</p>

---

## Executive Summary

Our organization stands at a pivotal moment in its digital evolution. This proposal presents a **strategic roadmap** for implementing cutting-edge solutions that will drive growth and competitive advantage.

### Key Objectives

1. **Modernize Infrastructure** — Migrate to cloud-native architecture
2. **Enhance Security** — Implement zero-trust security model  
3. **Improve Efficiency** — Automate 60% of manual processes
4. **Enable Innovation** — Create platform for rapid experimentation

<div class="callout callout-info">
<strong>Timeline:</strong> This initiative spans 18 months with quarterly milestones and measurable KPIs.
</div>

---

## Implementation Phases

### Phase 1: Foundation

> "The foundation determines the height of the building."

We begin by establishing core infrastructure components and security frameworks.

\`\`\`yaml
infrastructure:
  platform: kubernetes
  cloud: multi-cloud
  security: zero-trust
  monitoring: prometheus + grafana
\`\`\`

### Phase 2: Migration

| Component | Current | Target | Timeline |
|-----------|---------|--------|----------|
| Databases | On-prem | Cloud | Q2 |
| Applications | Monolith | Microservices | Q3 |
| Storage | SAN | Object Storage | Q2 |

<div class="page-break"></div>

# Budget & Resources

## Investment Overview

<div class="card">
<h4 style="margin-top:0">Total Investment: $2.4M</h4>
<p>Distributed across infrastructure, personnel, and operational costs over the 18-month implementation period.</p>
</div>

### Cost Breakdown

- Infrastructure & Cloud: \`$1,200,000\`
- Professional Services: \`$600,000\`
- Training & Change Management: \`$400,000\`
- Contingency (10%): \`$200,000\`

<div class="callout callout-success">
<strong>ROI Projection:</strong> Expected 340% return within 3 years through operational savings and revenue growth.
</div>

---

<div class="divider">Next Steps</div>

1. Executive approval and budget allocation
2. Vendor selection and contract negotiation
3. Team assembly and kickoff planning
4. Phase 1 initiation

<div class="page-footer">
<span>Confidential — Internal Use Only</span>
<span>Page <span class="page-number"></span></span>
</div>
`
  },
  {
    id: "modern-dark",
    name: "Modern Dark",
    description: "Bold dark theme with vibrant accents and geometric patterns",
    preview: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    css: `/* ==============================================
   MODERN DARK THEME
   Bold, contemporary dark theme with vibrant accents
   ============================================== */

:root {
  /* Page Setup */
  --page-width: 210mm;
  --page-height: 297mm;
  --page-margin: 25mm;
  
  /* Colors */
  --color-bg-primary: #0f0f1a;
  --color-bg-secondary: #1a1a2e;
  --color-bg-tertiary: #252542;
  --color-accent-1: #00d4ff;
  --color-accent-2: #7c3aed;
  --color-accent-3: #f472b6;
  --color-text: #e2e8f0;
  --color-text-secondary: #94a3b8;
  --color-text-muted: #64748b;
  --color-border: #334155;
  
  /* Typography */
  --font-heading: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'Fira Code', 'JetBrains Mono', monospace;
  
  /* Effects */
  --glow-accent: 0 0 20px rgba(0, 212, 255, 0.3);
}

/* Dark background with pattern */
body {
  font-family: var(--font-body);
  font-size: 11pt;
  line-height: 1.8;
  color: var(--color-text);
  background: var(--color-bg-primary);
  padding: var(--page-margin);
  position: relative;
}

/* Geometric grid background pattern */
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

/* Gradient orb decoration */
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

/* Typography */
h1 {
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, var(--color-accent-1) 0%, var(--color-accent-2) 50%, var(--color-accent-3) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: var(--glow-accent);
}

h2 {
  font-family: var(--font-heading);
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
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-accent-1);
  margin: 2rem 0 0.75rem 0;
}

h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 1.5rem 0 0.5rem 0;
}

p {
  margin: 0 0 1rem 0;
  color: var(--color-text-secondary);
}

/* Subtitle */
.subtitle {
  font-size: 1.25rem;
  color: var(--color-text-muted);
  margin: -0.5rem 0 2rem 0;
  font-weight: 400;
}

/* Links */
a {
  color: var(--color-accent-1);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s;
}

a:hover {
  border-bottom-color: var(--color-accent-1);
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

/* Lists */
ul, ol {
  margin: 0 0 1.5rem 0;
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
}

ul > li::marker {
  content: '▸ ';
  color: var(--color-accent-1);
}

/* Code */
code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background: var(--color-bg-tertiary);
  color: var(--color-accent-3);
  padding: 0.2em 0.5em;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

pre {
  font-family: var(--font-mono);
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

pre code {
  background: transparent;
  border: none;
  padding: 0;
  color: inherit;
}

/* Blockquote */
blockquote {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(0, 212, 255, 0.1) 100%);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-accent-2);
  border-radius: 0 12px 12px 0;
  color: var(--color-text-secondary);
}

blockquote p:last-child {
  margin-bottom: 0;
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

thead {
  background: var(--color-bg-tertiary);
}

th {
  color: var(--color-accent-1);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid var(--color-accent-1);
}

td {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

tbody tr:hover {
  background: rgba(0, 212, 255, 0.05);
}

/* Horizontal Rule */
hr {
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border), transparent);
  margin: 2.5rem 0;
}

/* Callouts */
.callout {
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1.5rem 0;
  border: 1px solid;
  position: relative;
  overflow: hidden;
}

.callout::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

.callout-info {
  background: rgba(0, 212, 255, 0.1);
  border-color: rgba(0, 212, 255, 0.3);
}

.callout-info::before {
  background: var(--color-accent-1);
}

.callout-success {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.callout-success::before {
  background: #22c55e;
}

.callout-warning {
  background: rgba(251, 191, 36, 0.1);
  border-color: rgba(251, 191, 36, 0.3);
}

.callout-warning::before {
  background: #fbbf24;
}

/* Glow card */
.card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 1.5rem;
  margin: 1rem 0;
  position: relative;
}

.card::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2), var(--color-accent-3));
  border-radius: 16px;
  z-index: -1;
  opacity: 0.3;
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.3em 0.8em;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-primary {
  background: linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2));
  color: white;
}

.badge-glow {
  background: var(--color-bg-tertiary);
  color: var(--color-accent-1);
  border: 1px solid var(--color-accent-1);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
}

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1.5rem 0;
}

.stat-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.stat-value {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 0.25rem;
}

/* Footer */
.page-footer {
  position: fixed;
  bottom: calc(var(--page-margin) / 2);
  left: var(--page-margin);
  right: var(--page-margin);
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
`,
    defaultContent: `# System Architecture

<p class="subtitle">Technical Design Document v2.0</p>

---

## Overview

This document details the **microservices architecture** powering our next-generation platform. Built for scale, resilience, and developer velocity.

<div class="stats-grid">
<div class="stat-card">
<div class="stat-value">99.99%</div>
<div class="stat-label">Uptime SLA</div>
</div>
<div class="stat-card">
<div class="stat-value">&lt;50ms</div>
<div class="stat-label">P99 Latency</div>
</div>
<div class="stat-card">
<div class="stat-value">10M+</div>
<div class="stat-label">Requests/Day</div>
</div>
</div>

---

## Core Services

### API Gateway

The entry point for all client requests, handling:

- Rate limiting & throttling
- Authentication & authorization  
- Request routing & load balancing
- Response caching

\`\`\`typescript
interface GatewayConfig {
  rateLimits: {
    requests: number;
    window: "second" | "minute";
  };
  auth: {
    provider: "jwt" | "oauth2";
    publicKeys: string[];
  };
}
\`\`\`

<div class="callout callout-info">
<strong>Performance Note:</strong> Gateway handles 50,000 RPS with sub-millisecond overhead.
</div>

### Data Layer

| Service | Database | Replication | Purpose |
|---------|----------|-------------|---------|
| Users | PostgreSQL | Multi-region | User profiles |
| Events | TimescaleDB | Primary-replica | Analytics |
| Cache | Redis Cluster | Sharded | Session/Cache |
| Search | Elasticsearch | 3-node | Full-text search |

<div class="page-break"></div>

# Deployment Strategy

## Infrastructure

<div class="card">
<h4 style="margin-top:0">Kubernetes Cluster</h4>
<p>Multi-region deployment across 3 availability zones with automatic failover and self-healing capabilities.</p>
<p style="margin-bottom:0"><span class="badge badge-glow">Production Ready</span></p>
</div>

### CI/CD Pipeline

> "Every commit is a potential release."

1. **Build** — Containerize with multi-stage Docker builds
2. **Test** — Unit, integration, and E2E test suites
3. **Scan** — Security vulnerability scanning
4. **Deploy** — Canary deployment with automated rollback

---

## Security Model

### Zero Trust Architecture

- mTLS for all service-to-service communication
- Short-lived tokens (15 min expiry)
- Network policies enforcing least privilege
- Secrets managed via HashiCorp Vault

\`\`\`yaml
# Network Policy
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
spec:
  podSelector:
    matchLabels:
      app: api
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: gateway
\`\`\`

<div class="page-footer">
<span>Confidential • Engineering</span>
<span>Page <span class="page-number"></span></span>
</div>
`
  },
  {
    id: "creative-gradient",
    name: "Creative Gradient",
    description: "Vibrant gradients with creative layouts and bold typography",
    preview: "linear-gradient(135deg, #ff6b6b 0%, #feca57 25%, #48dbfb 50%, #ff9ff3 75%, #54a0ff 100%)",
    css: `/* ==============================================
   CREATIVE GRADIENT THEME
   Vibrant, expressive design with bold colors
   ============================================== */

:root {
  /* Page Setup */
  --page-width: 210mm;
  --page-height: 297mm;
  --page-margin: 25mm;
  
  /* Gradients */
  --gradient-warm: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
  --gradient-cool: linear-gradient(135deg, #48dbfb 0%, #54a0ff 100%);
  --gradient-sunset: linear-gradient(135deg, #ff9ff3 0%, #f368e0 100%);
  --gradient-aurora: linear-gradient(135deg, #00d2d3 0%, #54a0ff 50%, #5f27cd 100%);
  --gradient-main: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  
  /* Colors */
  --color-text: #2d3436;
  --color-text-light: #636e72;
  --color-background: #ffffff;
  --color-surface: #fafafa;
  
  /* Typography */
  --font-display: 'Poppins', 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'Fira Code', monospace;
}

/* Page background with subtle gradient */
body {
  font-family: var(--font-body);
  font-size: 11pt;
  line-height: 1.75;
  color: var(--color-text);
  background: var(--color-background);
  padding: var(--page-margin);
  position: relative;
}

/* Decorative corner gradient */
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

/* Display Heading - Large gradient text */
h1 {
  font-family: var(--font-display);
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
  font-family: var(--font-display);
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
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 2rem 0 0.75rem 0;
}

h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-light);
  margin: 1.5rem 0 0.5rem 0;
}

p {
  margin: 0 0 1rem 0;
}

/* Subtitle */
.subtitle {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 400;
  color: var(--color-text-light);
  margin: 0 0 2rem 0;
}

/* Hero section */
.hero {
  min-height: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 2rem;
}

/* Gradient text utility */
.gradient-text {
  background: var(--gradient-main);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-warm {
  background: var(--gradient-warm);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gradient-text-cool {
  background: var(--gradient-cool);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Links */
a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

a:hover {
  color: #764ba2;
}

/* Lists with gradient bullets */
ul, ol {
  margin: 0 0 1.5rem 0;
  padding-left: 0;
  list-style: none;
}

li {
  margin-bottom: 0.75rem;
  padding-left: 1.75rem;
  position: relative;
}

ul > li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.5em;
  width: 8px;
  height: 8px;
  background: var(--gradient-warm);
  border-radius: 50%;
}

ol {
  counter-reset: list-counter;
}

ol > li {
  counter-increment: list-counter;
}

ol > li::before {
  content: counter(list-counter);
  position: absolute;
  left: 0;
  top: 0;
  width: 1.5rem;
  height: 1.5rem;
  background: var(--gradient-cool);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Code */
code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: #f8f9fa;
  color: #e91e63;
  padding: 0.2em 0.5em;
  border-radius: 6px;
}

pre {
  font-family: var(--font-mono);
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
  background: var(--gradient-aurora);
  border-radius: 16px 16px 0 0;
}

pre code {
  background: transparent;
  color: inherit;
  padding: 0;
}

/* Blockquote */
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

blockquote p {
  margin: 0;
  position: relative;
  z-index: 1;
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  border-radius: 16px;
  overflow: hidden;
}

thead {
  background: var(--gradient-main);
}

th {
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 1rem 1.25rem;
  text-align: left;
}

td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #eee;
}

tbody tr:nth-child(even) {
  background: var(--color-surface);
}

tbody tr:hover {
  background: rgba(102, 126, 234, 0.05);
}

/* Horizontal Rule - Gradient */
hr {
  border: none;
  height: 4px;
  background: var(--gradient-main);
  border-radius: 2px;
  margin: 3rem 0;
  opacity: 0.3;
}

/* Gradient Card */
.card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin: 1.5rem 0;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.1);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: var(--gradient-main);
}

/* Gradient border card */
.card-gradient {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin: 1.5rem 0;
  position: relative;
}

.card-gradient::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 3px;
  background: var(--gradient-main);
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

/* Callouts */
.callout {
  padding: 1.5rem 2rem;
  border-radius: 16px;
  margin: 1.5rem 0;
  position: relative;
  overflow: hidden;
}

.callout::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
}

.callout-info {
  background: linear-gradient(135deg, #ebf8ff 0%, #f0f9ff 100%);
}

.callout-info::before {
  background: var(--gradient-cool);
}

.callout-success {
  background: linear-gradient(135deg, #f0fff4 0%, #ecfdf5 100%);
}

.callout-success::before {
  background: linear-gradient(180deg, #10b981, #059669);
}

.callout-warning {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.callout-warning::before {
  background: var(--gradient-warm);
}

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.35em 1em;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 50px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-gradient {
  background: var(--gradient-main);
  color: white;
}

.badge-warm {
  background: var(--gradient-warm);
  color: white;
}

.badge-cool {
  background: var(--gradient-cool);
  color: white;
}

/* Bento Grid */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 2rem 0;
}

.bento-item {
  background: var(--color-surface);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.bento-item.span-2 {
  grid-column: span 2;
}

.bento-item.span-row {
  grid-row: span 2;
}

.bento-item h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.bento-item p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.bento-value {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 800;
  background: var(--gradient-main);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.25rem;
}

/* Page footer */
.page-footer {
  position: fixed;
  bottom: calc(var(--page-margin) / 2);
  left: var(--page-margin);
  right: var(--page-margin);
  display: flex;
  justify-content: center;
  gap: 2rem;
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.page-footer span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-footer .dot {
  width: 4px;
  height: 4px;
  background: var(--gradient-main);
  border-radius: 50%;
}
`,
    defaultContent: `<div class="hero">

# Creative Portfolio

<p class="subtitle">Showcasing Innovation Through Design</p>

</div>

---

## About This Project

This template demonstrates how **bold typography** and **vibrant gradients** can create visually stunning documents. Perfect for creative portfolios, pitch decks, and marketing materials.

> Design is not just what it looks like. Design is how it works.

---

## Key Metrics

<div class="bento-grid">
<div class="bento-item span-2">
<div class="bento-value">147%</div>
<h4>Growth Rate</h4>
<p>Year-over-year increase in user engagement across all platforms</p>
</div>
<div class="bento-item span-row">
<div class="bento-value">4.9</div>
<h4>User Rating</h4>
<p>Average satisfaction score from 10,000+ reviews</p>
</div>
<div class="bento-item">
<div class="bento-value">52</div>
<h4>Countries</h4>
<p>Global reach</p>
</div>
<div class="bento-item">
<div class="bento-value">24/7</div>
<h4>Support</h4>
<p>Always available</p>
</div>
</div>

---

## Services

<div class="card">

### Brand Identity <span class="badge badge-warm">Popular</span>

Complete brand systems including logo design, color palettes, typography, and comprehensive style guides.

</div>

<div class="card">

### Digital Experience <span class="badge badge-cool">New</span>

Web and mobile applications with focus on user experience, accessibility, and performance.

</div>

---

## Process

1. **Discovery** — Understanding your vision, goals, and target audience
2. **Strategy** — Developing a comprehensive plan and creative direction
3. **Design** — Crafting beautiful, functional solutions
4. **Delivery** — Polished assets ready for production

<div class="callout callout-info">
<strong>Ready to start?</strong> Let's create something extraordinary together.
</div>

<div class="page-break"></div>

# Case Study

## E-Commerce Redesign

<p class="subtitle">Transforming the online shopping experience</p>

### The Challenge

Our client needed a complete overhaul of their digital storefront to compete in an increasingly crowded market.

### The Solution

\`\`\`css
/* Design System Variables */
:root {
  --brand-primary: #667eea;
  --brand-secondary: #764ba2;
  --spacing-unit: 8px;
  --radius-lg: 16px;
}
\`\`\`

### Results

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Conversion Rate | 2.1% | 4.8% | +129% |
| Avg. Session | 2:30 | 5:45 | +130% |
| Cart Abandonment | 78% | 45% | -42% |
| Mobile Revenue | 23% | 61% | +165% |

<div class="callout callout-success">
<strong>Impact:</strong> $2.4M additional revenue in the first quarter post-launch.
</div>

---

<div class="card-gradient">
<h3 style="margin-top:0" class="gradient-text">Ready to Transform Your Brand?</h3>
<p>Let's discuss how we can bring your vision to life with design that makes an impact.</p>
</div>

<div class="page-footer">
<span><span class="dot"></span> Creative Studio</span>
<span>Page <span class="page-number"></span></span>
<span>2026 <span class="dot"></span></span>
</div>
`
  }
];

export function getThemeById(id: string): Theme | undefined {
  return themes.find(theme => theme.id === id);
}

export function getDefaultTheme(): Theme {
  return themes[0];
}
