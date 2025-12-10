import mongoose, { Schema, Document, Model } from "mongoose";

export interface IListing extends Document {
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  status: "active" | "pending" | "passive";
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    currency: { type: String, default: "TL" },
    category: { type: String, required: true },
    status: { type: String, default: "active" }, // Test için varsayılan active yapıldı
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Listing: Model<IListing> = mongoose.models.Listing || mongoose.model<IListing>("Listing", ListingSchema);

export default Listing;
