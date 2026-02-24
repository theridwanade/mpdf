/**
 * Database Seed Script
 * Run with: npm run seed
 * 
 * Make sure to:
 * 1. Copy .env.example to .env.local first
 * 2. Have MongoDB running locally or use MongoDB Atlas
 */
import { config } from "dotenv";
import mongoose from "mongoose";

// Load .env.local first (Next.js convention), then .env
config({ path: ".env.local" });
config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mpdf";

// Sample themes to seed
const sampleThemes = [
  {
    name: "Corporate Professional",
    description: "Clean, authoritative design for business documents",
    longDescription: "A sophisticated theme designed for corporate reports, proposals, and official documentation.",
    preview: "linear-gradient(135deg, #1e3a5f 0%, #2c5282 50%, #3182ce 100%)",
    tags: ["business", "corporate", "professional"],
    featured: true,
    downloads: 1250,
    css: `/* Corporate Professional Theme */
:root {
  --color-primary: #2c5282;
  --color-accent: #3182ce;
  --color-text: #1a202c;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11pt;
  line-height: 1.7;
  color: var(--color-text);
}

h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-primary);
  border-bottom: 3px solid var(--color-primary);
  padding-bottom: 0.75rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
}

h3 {
  font-size: 1.125rem;
  font-weight: 600;
}

blockquote {
  border-left: 4px solid var(--color-accent);
  padding-left: 1rem;
  font-style: italic;
  color: #4a5568;
}

code {
  background: #edf2f7;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

pre {
  background: #1a202c;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #e2e8f0;
  padding: 0.5rem;
  text-align: left;
}

th {
  background: #edf2f7;
  font-weight: 600;
}`,
  },
  {
    name: "Minimal Dark",
    description: "Sleek dark theme for technical documentation",
    longDescription: "A modern dark theme perfect for technical docs, API references, and code-heavy documents.",
    preview: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    tags: ["dark", "minimal", "technical"],
    featured: true,
    downloads: 890,
    css: `/* Minimal Dark Theme */
:root {
  --color-bg: #0d1117;
  --color-surface: #161b22;
  --color-border: #30363d;
  --color-text: #c9d1d9;
  --color-accent: #58a6ff;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11pt;
  line-height: 1.7;
  color: var(--color-text);
  background: var(--color-bg);
}

h1, h2, h3, h4, h5, h6 {
  color: #ffffff;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5rem;
}

a {
  color: var(--color-accent);
}

code {
  background: var(--color-surface);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  color: #f97583;
}

pre {
  background: var(--color-surface);
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  overflow-x: auto;
}

blockquote {
  border-left: 4px solid var(--color-accent);
  padding-left: 1rem;
  color: #8b949e;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid var(--color-border);
  padding: 0.5rem;
}

th {
  background: var(--color-surface);
}`,
  },
  {
    name: "Academic Paper",
    description: "Traditional academic formatting for research papers",
    longDescription: "A classic academic theme following standard formatting guidelines for research papers and theses.",
    preview: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 50%, #bdbdbd 100%)",
    tags: ["academic", "research", "paper"],
    featured: false,
    downloads: 567,
    css: `/* Academic Paper Theme */
body {
  font-family: 'Times New Roman', Georgia, serif;
  font-size: 12pt;
  line-height: 2;
  max-width: 6.5in;
  margin: 1in auto;
}

h1 {
  font-size: 14pt;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
}

h2 {
  font-size: 12pt;
  font-weight: bold;
  margin-top: 1.5rem;
}

h3 {
  font-size: 12pt;
  font-weight: bold;
  font-style: italic;
}

p {
  text-indent: 0.5in;
  margin: 0;
}

p:first-of-type {
  text-indent: 0;
}

blockquote {
  margin: 1rem 0.5in;
  font-size: 11pt;
}

table {
  margin: 1rem auto;
  border-collapse: collapse;
}

th, td {
  border: 1px solid black;
  padding: 0.25rem 0.5rem;
}

.abstract {
  font-style: italic;
  margin: 1rem 0.5in;
}`,
  },
];

async function seed() {
  console.log("🌱 MPDF Database Seed Script\n");
  console.log(`Connecting to: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")}`);
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB\n");
  } catch (error) {
    console.error("✗ Failed to connect to MongoDB:", error);
    process.exit(1);
  }

  // Define schemas inline (simpler for scripts)
  const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: String,
    bio: String,
    verified: { type: Boolean, default: false },
  }, { timestamps: true });

  const ThemeSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: String,
    css: { type: String, required: true },
    preview: { type: String, default: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    tags: [String],
    featured: { type: Boolean, default: false },
    approved: { type: Boolean, default: false },
    downloads: { type: Number, default: 0 },
    ratingSum: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    copiedFrom: { type: mongoose.Schema.Types.ObjectId, ref: "Theme" },
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Theme = mongoose.models.Theme || mongoose.model("Theme", ThemeSchema);

  // Create or find system user
  console.log("Creating system user...");
  let systemUser = await User.findOne({ username: "MPDF_Team" });
  
  if (!systemUser) {
    systemUser = await User.create({
      username: "MPDF_Team",
      email: "team@mpdf.dev",
      password: "$2a$12$placeholder_hash_not_used_for_login",
      verified: true,
      bio: "Official MPDF Theme Team",
    });
    console.log("  ✓ Created system user: MPDF_Team");
  } else {
    console.log("  → System user already exists");
  }

  // Seed themes
  console.log("\nSeeding themes...");
  let created = 0;
  let skipped = 0;

  for (const themeData of sampleThemes) {
    const exists = await Theme.findOne({ name: themeData.name });
    
    if (!exists) {
      await Theme.create({
        author: systemUser._id,
        ...themeData,
        approved: true,
        ratingSum: Math.floor(Math.random() * 50) + 20,
        ratingCount: Math.floor(Math.random() * 10) + 5,
      });
      console.log(`  ✓ Created: ${themeData.name}`);
      created++;
    } else {
      console.log(`  → Skipped: ${themeData.name} (already exists)`);
      skipped++;
    }
  }

  console.log(`\n✓ Seed completed! Created: ${created}, Skipped: ${skipped}`);
  
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error("\n✗ Seed failed:", error);
  process.exit(1);
});
