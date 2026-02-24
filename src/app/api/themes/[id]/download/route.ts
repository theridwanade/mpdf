/**
 * POST /api/themes/[id]/download - Track theme download/use
 */
import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import { Theme } from "@/models/Theme";
import { authResponse, authError } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await connectToDatabase();

    const theme = await Theme.findById(id);

    if (!theme) {
      return authError("Theme not found", 404);
    }

    if (!theme.approved) {
      return authError("Theme not available", 400);
    }

    // Increment download count
    theme.downloads += 1;
    await theme.save();

    return authResponse({
      message: "Download tracked",
      downloads: theme.downloads,
    });
  } catch (error) {
    console.error("Track download error:", error);
    return authError("Failed to track download", 500);
  }
}
