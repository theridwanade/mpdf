/**
 * POST /api/themes/[id]/copy - Copy/fork a theme to user's own themes
 */
import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import { Theme, User } from "@/models";
import { getUserFromRequest, authResponse, authError } from "@/lib/auth";

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
    void User; // Ensure User model is registered for populate

    const originalTheme = await Theme.findById(id).lean();

    if (!originalTheme) {
      return authError("Theme not found", 404);
    }

    // Can only copy approved themes (unless it's your own)
    if (!originalTheme.approved && originalTheme.author.toString() !== decoded.userId) {
      return authError("Cannot copy unapproved theme", 400);
    }

    const body = await request.json().catch(() => ({}));
    const customName = body.name;

    // Create a copy
    const copiedTheme = await Theme.create({
      author: decoded.userId,
      name: customName || `${originalTheme.name} (Copy)`,
      description: originalTheme.description,
      longDescription: originalTheme.longDescription,
      css: originalTheme.css,
      preview: originalTheme.preview,
      tags: originalTheme.tags,
      copiedFrom: originalTheme._id,
      approved: false, // Copy needs approval
    });

    await copiedTheme.populate("author", "username avatar verified");

    const author = copiedTheme.author as unknown as { _id: { toString(): string }; username: string; avatar?: string; verified?: boolean };

    return authResponse(
      {
        message: "Theme copied to your themes",
        theme: {
          id: copiedTheme._id.toString(),
          name: copiedTheme.name,
          description: copiedTheme.description,
          longDescription: copiedTheme.longDescription,
          preview: copiedTheme.preview,
          css: copiedTheme.css,
          tags: copiedTheme.tags,
          featured: copiedTheme.featured,
          approved: copiedTheme.approved,
          downloads: copiedTheme.downloads,
          rating: {
            average: 0,
            count: 0,
          },
          author: {
            id: author._id.toString(),
            name: author.username,
            avatar: author.avatar,
            verified: author.verified || false,
          },
          copiedFrom: originalTheme._id.toString(),
          createdAt: copiedTheme.createdAt,
          updatedAt: copiedTheme.updatedAt,
        },
      },
      201
    );
  } catch (error) {
    console.error("Copy theme error:", error);
    return authError("Failed to copy theme", 500);
  }
}
