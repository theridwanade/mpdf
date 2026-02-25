/**
 * POST /api/themes/[id]/publish - Toggle theme visibility (public/private)
 */
import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import { Theme } from "@/models";
import { getUserFromRequest, authResponse, authError } from "@/lib/auth";
import { validateTheme } from "@/lib/theme-schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const decoded = getUserFromRequest(request);
    const { id } = await params;

    if (!decoded) {
      return authError("Not authenticated", 401);
    }

    await connectToDatabase();

    const theme = await Theme.findById(id);

    if (!theme) {
      return authError("Theme not found", 404);
    }

    if (theme.author.toString() !== decoded.userId) {
      return authError("Not authorized", 403);
    }

    // Check if we're making it public or private
    let body: { isPublic?: boolean } = {};
    try {
      body = await request.json();
    } catch {
      // If no body, toggle the current state
    }

    const makePublic = body.isPublic !== undefined ? body.isPublic : !theme.approved;

    // If making public, validate first
    if (makePublic) {
      const validation = validateTheme(theme.css);
      if (!validation.valid) {
        return authError(
          `Theme CSS validation failed: ${validation.errors[0]?.message || "Invalid CSS"}. Please fix the errors before sharing.`,
          400
        );
      }

      if (!theme.name || theme.name.length < 3) {
        return authError("Theme name must be at least 3 characters", 400);
      }

      if (!theme.description || theme.description.length < 10) {
        return authError("Theme description must be at least 10 characters", 400);
      }
    }

    // Toggle visibility
    theme.approved = makePublic;
    await theme.save();

    return authResponse({
      message: makePublic ? "Theme is now public in the Theme Store" : "Theme is now private",
      theme: {
        id: theme._id.toString(),
        name: theme.name,
        description: theme.description,
        isPublic: theme.approved,
        createdAt: theme.createdAt,
        updatedAt: theme.updatedAt,
      },
    });
  } catch (error) {
    console.error("Toggle theme visibility error:", error);
    return authError("Failed to update theme visibility", 500);
  }
}
