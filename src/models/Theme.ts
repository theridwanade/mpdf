/**
 * Theme Model - Community themes stored in database
 */
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITheme extends Document {
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  name: string;
  description: string;
  longDescription?: string;
  css: string;
  preview: string; // CSS gradient for preview card
  tags: string[];
  featured: boolean;
  approved: boolean; // Admin approval status
  downloads: number;
  ratingSum: number; // Sum of all ratings
  ratingCount: number; // Number of ratings
  copiedFrom?: mongoose.Types.ObjectId; // If this is a copy of another theme
  createdAt: Date;
  updatedAt: Date;
}

// Virtual for average rating
export interface IThemeMethods {
  averageRating: number;
}

const ThemeSchema = new Schema<ITheme, Model<ITheme>, IThemeMethods>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Theme name is required"],
      trim: true,
      minlength: [3, "Theme name must be at least 3 characters"],
      maxlength: [50, "Theme name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    longDescription: {
      type: String,
      maxlength: [1000, "Long description cannot exceed 1000 characters"],
      default: "",
    },
    css: {
      type: String,
      required: [true, "CSS is required"],
    },
    preview: {
      type: String,
      default: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.length <= 10,
        message: "Maximum 10 tags allowed",
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    downloads: {
      type: Number,
      default: 0,
      min: 0,
    },
    ratingSum: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    copiedFrom: {
      type: Schema.Types.ObjectId,
      ref: "Theme",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for average rating
ThemeSchema.virtual("averageRating").get(function () {
  if (this.ratingCount === 0) return 0;
  return Math.round((this.ratingSum / this.ratingCount) * 10) / 10;
});

// Indexes
ThemeSchema.index({ approved: 1, downloads: -1 });
ThemeSchema.index({ approved: 1, ratingSum: -1 });
ThemeSchema.index({ approved: 1, createdAt: -1 });
ThemeSchema.index({ tags: 1 });
ThemeSchema.index({ name: "text", description: "text" });

export const Theme: Model<ITheme> =
  mongoose.models.Theme || mongoose.model<ITheme>("Theme", ThemeSchema);

export default Theme;
