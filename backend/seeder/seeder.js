import mongoose from "mongoose";
import ProductData from "../productdata/data.js";
import Products from "../models/product.js";
const SeederProduct = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://utkbktss5:utkbktss5@cluster0.7eqkc4y.mongodb.net/commerce"
    );

    await Products.deleteMany();
    console.log("Products Are Deleted !");

    await Products.insertMany(ProductData);
    console.log("Products Are Added !");

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

SeederProduct();
