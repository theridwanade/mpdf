/**
 * POST /api/themes/[id]/publish - Submit theme for review / publish
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

    // Validate theme CSS before publishing
    const validation = validateTheme(theme.css);
    if (!validation.valid) {
      return authError(
        `Theme CSS validation failed: ${validation.errors[0]?.message || "Invalid CSS"}. Please fix the errors before publishing.`,
        400
      );
    }

    // Check required fields
    if (!theme.name || theme.name.length < 3) {
      return authError("Theme name must be at least 3 characters", 400);
    }

    if (!theme.description || theme.description.length < 10) {
      return authError("Theme description must be at least 10 characters", 400);
    }

    // For now, auto-approve themes (in production, this would go to a review queue)
    // Set approved to true
    theme.approved = true;
    await theme.save();

    return authResponse({
      message: "Theme published successfully",
      theme: {
        id: theme._id.toString(),
        name: theme.name,
        description: theme.description,
        approved: theme.approved,
        createdAt: theme.createdAt,
        updatedAt: theme.updatedAt,
      },
    });
  } catch (error) {
    console.error("Publish theme error:", error);
    return authError("Failed to publish theme", 500);
  }
}
