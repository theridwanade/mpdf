/**
 * POST /api/themes/[id]/rate - Rate a theme
 */
import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import { Theme } from "@/models/Theme";
import { Rating } from "@/models/Rating";
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

    const body = await request.json();
    const { rating } = body;

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return authError("Rating must be between 1 and 5", 400);
    }

    const theme = await Theme.findById(id);

    if (!theme) {
      return authError("Theme not found", 404);
    }

    if (!theme.approved) {
      return authError("Cannot rate unapproved theme", 400);
    }

    // Check for existing rating
    const existingRating = await Rating.findOne({
      user: decoded.userId,
      theme: id,
    });

    if (existingRating) {
      // Update existing rating
      const ratingDiff = rating - existingRating.rating;
      existingRating.rating = rating;
      await existingRating.save();

      // Update theme rating sum
      theme.ratingSum += ratingDiff;
      await theme.save();
    } else {
      // Create new rating
      await Rating.create({
        user: decoded.userId,
        theme: id,
        rating,
      });

      // Update theme
      theme.ratingSum += rating;
      theme.ratingCount += 1;
      await theme.save();
    }

    const average = theme.ratingCount > 0
      ? Math.round((theme.ratingSum / theme.ratingCount) * 10) / 10
      : 0;

    return authResponse({
      message: "Rating saved",
      rating: {
        userRating: rating,
        average,
        count: theme.ratingCount,
      },
    });
  } catch (error) {
    console.error("Rate theme error:", error);
    return authError("Failed to rate theme", 500);
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

    const existingRating = await Rating.findOne({
      user: decoded.userId,
      theme: id,
    });

    if (!existingRating) {
      return authError("No rating found", 404);
    }

    // Update theme
    theme.ratingSum -= existingRating.rating;
    theme.ratingCount -= 1;
    await theme.save();

    await existingRating.deleteOne();

    const average = theme.ratingCount > 0
      ? Math.round((theme.ratingSum / theme.ratingCount) * 10) / 10
      : 0;

    return authResponse({
      message: "Rating removed",
      rating: {
        userRating: null,
        average,
        count: theme.ratingCount,
      },
    });
  } catch (error) {
    console.error("Remove rating error:", error);
    return authError("Failed to remove rating", 500);
  }
}
