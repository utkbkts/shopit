import express from "express";
import MyUserProducts from "../controllers/MyUserProducts.js";
import { authhorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";

const route = express.Router();

route.get(
  "/products",

  MyUserProducts.GetAllProducts
);
route.get("/product/:id", MyUserProducts.GetProductById);
route.post(
  "/admin/products",
  isAuthenticatedUser,
  authhorizeRoles("admin"),
  MyUserProducts.CreateProduct
);
route.get(
  "/admin/products",
  isAuthenticatedUser,
  authhorizeRoles("admin"),
  MyUserProducts.getAdminProducts
);

route.put(
  "/admin/products/:id/upload_images",
  isAuthenticatedUser,
  authhorizeRoles("admin"),
  MyUserProducts.uploadProductImages
);

route.put(
  "/admin/products/:id/delete_images",
  isAuthenticatedUser,
  authhorizeRoles("admin"),
  MyUserProducts.deleteProductImage
);
route.delete(
  "/admin/products/:id",
  isAuthenticatedUser,
  authhorizeRoles("admin"),
  MyUserProducts.deleteProduct
);

route.put(
  "/admin/product/:id",
  isAuthenticatedUser,
  authhorizeRoles("admin"),
  MyUserProducts.UpdateProductId
);
route.delete(
  "/admin/product/:id",
  isAuthenticatedUser,
  authhorizeRoles("admin"),
  MyUserProducts.DeleteProductId
);

route.put("/reviews", isAuthenticatedUser, MyUserProducts.createProductReview);
route.get("/reviews", isAuthenticatedUser, MyUserProducts.getProductReview);

route.delete(
  "/admin/reviews",
  isAuthenticatedUser,
  authhorizeRoles("admin"),
  MyUserProducts.deleteReview
);

route.get("/can_review", isAuthenticatedUser, MyUserProducts.CanUserReview);

export default route;
