import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, min: 0, required: true },
    image: { type: String, required: [true, "image is required"] },
    category: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    // quantity: { type: Number, required: true },
    // sold: { type: Number, default: 0 },
    // reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    // rating: { type: Number, default: 0 },
    // numReviews: { type: Number, default: 0 },
    // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
