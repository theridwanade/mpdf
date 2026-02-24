/**
 * Rating Model - User ratings for themes
 */
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRating extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  theme: mongoose.Types.ObjectId;
  rating: number; // 1-5 stars
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    theme: {
      type: Schema.Types.ObjectId,
      ref: "Theme",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one rating per user per theme
RatingSchema.index({ user: 1, theme: 1 }, { unique: true });

export const Rating: Model<IRating> =
  mongoose.models.Rating || mongoose.model<IRating>("Rating", RatingSchema);

export default Rating;
