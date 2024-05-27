import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Product Name"],
      maxLength: [200, "must have a maximum of 200 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please Enter Product Price"],
      maxLength: [6, "must have a maximum of 6 characters"],
    },
    description: {
      type: String,
      required: [true, "Please Enter Product Description"],
      maxLength: [800, "must have a maximum of 800 characters"],
    },
    seller: {
      type: String,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Please Enter Product Category"],
      enum: {
        values: [
          "Electronics",
          "Cameras",
          "Laptops",
          "Accessories",
          "Headphones",
          "Food",
          "Books",
          "Sports",
          "Outdoor",
          "Home",
        ],
        message: "Please select correct categories",
      },
    },
    stock: {
      type: Number,
      required: [true, "Please Enter Product Stock"],
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: false,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
