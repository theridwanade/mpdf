/**
 * GET /api/themes/[id] - Get a specific theme
 * PATCH /api/themes/[id] - Update a theme (owner only)
 * DELETE /api/themes/[id] - Delete a theme (owner only)
 */
import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import { Theme } from "@/models/Theme";
import { Rating } from "@/models/Rating";
import { getUserFromRequest, authResponse, authError } from "@/lib/auth";
import { validateTheme } from "@/lib/theme-schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const decoded = getUserFromRequest(request);
    const { id } = await params;

    await connectToDatabase();

    const theme = await Theme.findById(id)
      .populate("author", "username avatar verified")
      .lean();

    if (!theme) {
      return authError("Theme not found", 404);
    }

    // Only show approved themes or owner's own themes
    const isOwner = decoded?.userId === theme.author?._id?.toString();
    if (!theme.approved && !isOwner) {
      return authError("Theme not found", 404);
    }

    // Get user's rating if authenticated
    let userRating = null;
    if (decoded) {
      const rating = await Rating.findOne({
        user: decoded.userId,
        theme: id,
      }).lean();
      userRating = rating?.rating || null;
    }

    const author = theme.author as unknown as { _id: { toString(): string }; username: string; avatar?: string; verified?: boolean } | null;

    return authResponse({
      theme: {
        id: theme._id.toString(),
        name: theme.name,
        description: theme.description,
        longDescription: theme.longDescription,
        preview: theme.preview,
        css: theme.css,
        tags: theme.tags,
        featured: theme.featured,
        approved: theme.approved,
        downloads: theme.downloads,
        rating: {
          average: theme.ratingCount > 0 ? Math.round((theme.ratingSum / theme.ratingCount) * 10) / 10 : 0,
          count: theme.ratingCount,
        },
        userRating,
        isOwner,
        author: author
          ? {
              id: author._id.toString(),
              name: author.username,
              avatar: author.avatar,
              verified: author.verified || false,
            }
          : null,
        copiedFrom: theme.copiedFrom?.toString() || null,
        createdAt: theme.createdAt,
        updatedAt: theme.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get theme error:", error);
    return authError("Failed to fetch theme", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    const body = await request.json();
    const { name, description, longDescription, css, preview, tags } = body;

    // Validation
    if (name !== undefined) {
      if (name.length < 3 || name.length > 50) {
        return authError("Theme name must be between 3 and 50 characters", 400);
      }
      theme.name = name;
    }

    if (description !== undefined) {
      if (description.length < 10 || description.length > 200) {
        return authError("Description must be between 10 and 200 characters", 400);
      }
      theme.description = description;
    }

    if (longDescription !== undefined) {
      theme.longDescription = longDescription;
    }

    if (css !== undefined) {
      const validation = validateTheme(css);
      if (!validation.valid) {
        return authError(
          `Theme CSS validation failed: ${validation.errors[0]?.message || "Invalid CSS"}`,
          400
        );
      }
      theme.css = css;
      // Reset approval if CSS changed
      theme.approved = false;
    }

    if (preview !== undefined) {
      theme.preview = preview;
    }

    if (tags !== undefined) {
      theme.tags = Array.isArray(tags) ? tags.slice(0, 10).map((t: string) => t.toLowerCase()) : [];
    }

    await theme.save();

    return authResponse({
      message: "Theme updated",
      theme: {
        id: theme._id.toString(),
        name: theme.name,
        description: theme.description,
        longDescription: theme.longDescription,
        preview: theme.preview,
        css: theme.css,
        tags: theme.tags,
        featured: theme.featured,
        approved: theme.approved,
        downloads: theme.downloads,
        rating: {
          average: theme.ratingCount > 0 ? Math.round((theme.ratingSum / theme.ratingCount) * 10) / 10 : 0,
          count: theme.ratingCount,
        },
        createdAt: theme.createdAt,
        updatedAt: theme.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update theme error:", error);
    return authError("Failed to update theme", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    // Delete associated ratings
    await Rating.deleteMany({ theme: id });
    await theme.deleteOne();

    return authResponse({ message: "Theme deleted" });
  } catch (error) {
    console.error("Delete theme error:", error);
    return authError("Failed to delete theme", 500);
  }
}
