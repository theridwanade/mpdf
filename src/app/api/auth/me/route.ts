/**
 * GET /api/auth/me - Get current authenticated user
 */
import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { getUserFromRequest, authResponse, authError } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const decoded = getUserFromRequest(request);

    if (!decoded) {
      return authError("Not authenticated", 401);
    }

    await connectToDatabase();

    const user = await User.findById(decoded.userId);

    if (!user) {
      return authError("User not found", 404);
    }

    return authResponse({
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        verified: user.verified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return authError("Failed to get user", 500);
  }
}

/**
 * PATCH /api/auth/me - Update current user profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const decoded = getUserFromRequest(request);

    if (!decoded) {
      return authError("Not authenticated", 401);
    }

    await connectToDatabase();

    const body = await request.json();
    const { username, bio, avatar } = body;

    const updateData: Record<string, string> = {};

    if (username !== undefined) {
      if (username.length < 3 || username.length > 30) {
        return authError("Username must be between 3 and 30 characters", 400);
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return authError("Username can only contain letters, numbers, and underscores", 400);
      }

      // Check if username is taken
      const existing = await User.findOne({
        username,
        _id: { $ne: decoded.userId },
      });
      if (existing) {
        return authError("Username already taken", 409);
      }

      updateData.username = username;
    }

    if (bio !== undefined) {
      if (bio.length > 200) {
        return authError("Bio cannot exceed 200 characters", 400);
      }
      updateData.bio = bio;
    }

    if (avatar !== undefined) {
      updateData.avatar = avatar;
    }

    const user = await User.findByIdAndUpdate(decoded.userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return authError("User not found", 404);
    }

    return authResponse({
      message: "Profile updated",
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        verified: user.verified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return authError("Failed to update profile", 500);
  }
}
