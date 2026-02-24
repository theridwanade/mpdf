/**
 * GET /api/documents - Get all documents for current user
 * POST /api/documents - Create a new document
 */
import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import { DocumentModel } from "@/models/Document";
import { getUserFromRequest, authResponse, authError } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const decoded = getUserFromRequest(request);

    if (!decoded) {
      return authError("Not authenticated", 401);
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      DocumentModel.find({ user: decoded.userId })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      DocumentModel.countDocuments({ user: decoded.userId }),
    ]);

    return authResponse({
      documents: documents.map((doc) => ({
        id: doc._id.toString(),
        name: doc.name,
        content: doc.content,
        css: doc.css,
        themeId: doc.themeId,
        thumbnail: doc.thumbnail,
        isPublic: doc.isPublic,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get documents error:", error);
    return authError("Failed to fetch documents", 500);
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
    const { name, content, css, themeId, isPublic } = body;

    const document = await DocumentModel.create({
      user: decoded.userId,
      name: name || "Untitled Document",
      content: content || "",
      css: css || "",
      themeId: themeId || null,
      isPublic: isPublic || false,
    });

    return authResponse(
      {
        message: "Document created",
        document: {
          id: document._id.toString(),
          name: document.name,
          content: document.content,
          css: document.css,
          themeId: document.themeId,
          thumbnail: document.thumbnail,
          isPublic: document.isPublic,
          createdAt: document.createdAt,
          updatedAt: document.updatedAt,
        },
      },
      201
    );
  } catch (error) {
    console.error("Create document error:", error);
    return authError("Failed to create document", 500);
  }
}
