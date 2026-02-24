/**
 * GET /api/documents/[id] - Get a specific document
 * PATCH /api/documents/[id] - Update a document
 * DELETE /api/documents/[id] - Delete a document
 */
import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import { DocumentModel } from "@/models/Document";
import { getUserFromRequest, authResponse, authError } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const decoded = getUserFromRequest(request);
    const { id } = await params;

    await connectToDatabase();

    const document = await DocumentModel.findById(id).lean();

    if (!document) {
      return authError("Document not found", 404);
    }

    // Check ownership or public access
    if (document.user.toString() !== decoded?.userId && !document.isPublic) {
      return authError("Not authorized", 403);
    }

    return authResponse({
      document: {
        id: document._id.toString(),
        name: document.name,
        content: document.content,
        css: document.css,
        themeId: document.themeId,
        thumbnail: document.thumbnail,
        isPublic: document.isPublic,
        isOwner: document.user.toString() === decoded?.userId,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get document error:", error);
    return authError("Failed to fetch document", 500);
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

    const document = await DocumentModel.findById(id);

    if (!document) {
      return authError("Document not found", 404);
    }

    if (document.user.toString() !== decoded.userId) {
      return authError("Not authorized", 403);
    }

    const body = await request.json();
    const { name, content, css, themeId, isPublic, thumbnail } = body;

    // Update fields
    if (name !== undefined) document.name = name;
    if (content !== undefined) document.content = content;
    if (css !== undefined) document.css = css;
    if (themeId !== undefined) document.themeId = themeId;
    if (isPublic !== undefined) document.isPublic = isPublic;
    if (thumbnail !== undefined) document.thumbnail = thumbnail;

    await document.save();

    return authResponse({
      message: "Document updated",
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
    });
  } catch (error) {
    console.error("Update document error:", error);
    return authError("Failed to update document", 500);
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

    const document = await DocumentModel.findById(id);

    if (!document) {
      return authError("Document not found", 404);
    }

    if (document.user.toString() !== decoded.userId) {
      return authError("Not authorized", 403);
    }

    await document.deleteOne();

    return authResponse({ message: "Document deleted" });
  } catch (error) {
    console.error("Delete document error:", error);
    return authError("Failed to delete document", 500);
  }
}
