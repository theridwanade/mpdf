/**
 * Document Model - User's saved PDF documents
 */
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDocument extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  name: string;
  content: string;
  css: string;
  themeId?: string; // Reference to theme if using one
  thumbnail?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Document name is required"],
      trim: true,
      maxlength: [100, "Document name cannot exceed 100 characters"],
      default: "Untitled Document",
    },
    content: {
      type: String,
      required: true,
      default: "",
    },
    css: {
      type: String,
      default: "",
    },
    themeId: {
      type: String,
      default: null,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
DocumentSchema.index({ user: 1, updatedAt: -1 });

export const DocumentModel: Model<IDocument> =
  mongoose.models.Document || mongoose.model<IDocument>("Document", DocumentSchema);

export default DocumentModel;
