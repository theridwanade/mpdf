import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

type PageFormat = "A4" | "A3" | "A5" | "Letter" | "Legal" | "Tabloid";

interface PdfConfig {
  format?: PageFormat;
  width?: string;
  height?: string;
  landscape?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { html, config } = await request.json() as { html: string; config?: PdfConfig };

    if (!html) {
      return NextResponse.json({ error: "HTML content is required" }, { status: 400 });
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Build PDF options - no margins for full-bleed support
    // Margins are handled via CSS @page rules for more control
    const pdfOptions: Parameters<typeof page.pdf>[0] = {
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      landscape: config?.landscape ?? false,
      preferCSSPageSize: true, // Let CSS @page rules control page size
    };

    // Use custom dimensions if provided, otherwise use format
    // preferCSSPageSize will override these if @page size is defined
    if (config?.width && config?.height) {
      pdfOptions.width = config.width;
      pdfOptions.height = config.height;
    } else {
      pdfOptions.format = config?.format ?? "A4";
    }

    const pdfBuffer = await page.pdf(pdfOptions);

    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=document.pdf",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
