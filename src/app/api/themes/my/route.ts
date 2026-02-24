/**
 * GET /api/themes/my - Get current user's themes (including unapproved)
 */
import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import { Theme, User } from "@/models";
import { getUserFromRequest, authResponse, authError } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const decoded = getUserFromRequest(request);

    if (!decoded) {
      return authError("Not authenticated", 401);
    }

    await connectToDatabase();
    void User; // Ensure User model is registered

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const skip = (page - 1) * limit;

    const [themes, total] = await Promise.all([
      Theme.find({ author: decoded.userId })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Theme.countDocuments({ author: decoded.userId }),
    ]);

    return authResponse({
      themes: themes.map((theme) => ({
        id: theme._id.toString(),
        name: theme.name,
        description: theme.description,
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
        copiedFrom: theme.copiedFrom?.toString() || null,
        createdAt: theme.createdAt,
        updatedAt: theme.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get my themes error:", error);
    return authError("Failed to fetch themes", 500);
  }
}
