/**
 * GET /api/themes - Get all themes (with pagination, search, filters)
 * POST /api/themes - Create a new theme
 */
import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import { Theme } from "@/models/Theme";
import { User } from "@/models/User";
import { getUserFromRequest, authResponse, authError } from "@/lib/auth";
import { validateTheme } from "@/lib/theme-schema";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";
    const sort = searchParams.get("sort") || "popular";
    const featured = searchParams.get("featured") === "true";
    const userId = searchParams.get("userId"); // Get themes by specific user

    // Build query
    const query: Record<string, unknown> = { approved: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (tag) {
      query.tags = tag.toLowerCase();
    }

    if (featured) {
      query.featured = true;
    }

    if (userId) {
      query.author = userId;
    }

    // Build sort
    let sortOption: Record<string, 1 | -1> = {};
    switch (sort) {
      case "popular":
        sortOption = { downloads: -1 };
        break;
      case "rating":
        sortOption = { ratingSum: -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "name":
        sortOption = { name: 1 };
        break;
      default:
        sortOption = { downloads: -1 };
    }

    const [themes, total] = await Promise.all([
      Theme.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate("author", "username avatar verified")
        .lean(),
      Theme.countDocuments(query),
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
        downloads: theme.downloads,
        rating: {
          average: theme.ratingCount > 0 ? Math.round((theme.ratingSum / theme.ratingCount) * 10) / 10 : 0,
          count: theme.ratingCount,
        },
        author: theme.author
          ? {
              id: (theme.author as unknown as { _id: { toString(): string }})._id.toString(),
              name: (theme.author as unknown as { username: string }).username,
              avatar: (theme.author as unknown as { avatar?: string }).avatar,
              verified: (theme.author as unknown as { verified?: boolean }).verified || false,
            }
          : null,
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
    console.error("Get themes error:", error);
    return authError("Failed to fetch themes", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = getUserFromRequest(request);

    if (!decoded) {
      return authError("Not authenticated", 401);
    }

    await connectToDatabase();

    const body = await request.json();
    const { name, description, longDescription, css, preview, tags } = body;

    // Validation
    if (!name || name.length < 3 || name.length > 50) {
      return authError("Theme name must be between 3 and 50 characters", 400);
    }

    if (!description || description.length < 10 || description.length > 200) {
      return authError("Description must be between 10 and 200 characters", 400);
    }

    if (!css) {
      return authError("CSS is required", 400);
    }

    // Validate CSS against schema
    const validation = validateTheme(css);
    if (!validation.valid) {
      return authError(
        `Theme CSS validation failed: ${validation.errors[0]?.message || "Invalid CSS"}`,
        400
      );
    }

    const theme = await Theme.create({
      author: decoded.userId,
      name,
      description,
      longDescription: longDescription || "",
      css,
      preview: preview || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      tags: Array.isArray(tags) ? tags.slice(0, 10).map((t: string) => t.toLowerCase()) : [],
      approved: false, // Requires admin approval
    });

    // Populate author
    await theme.populate("author", "username avatar verified");

    const author = theme.author as unknown as { _id: { toString(): string }; username: string; avatar?: string; verified?: boolean };

    return authResponse(
      {
        message: "Theme submitted for approval",
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
            average: 0,
            count: 0,
          },
          author: {
            id: author._id.toString(),
            name: author.username,
            avatar: author.avatar,
            verified: author.verified || false,
          },
          createdAt: theme.createdAt,
          updatedAt: theme.updatedAt,
        },
      },
      201
    );
  } catch (error) {
    console.error("Create theme error:", error);
    return authError("Failed to create theme", 500);
  }
}
