import express from "express";
import AuthControllers from "../controllers/AuthControllers.js";
import { authhorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";

const route = express.Router();

route.post("/register", AuthControllers.registerUser);
route.post("/login", AuthControllers.loginUser);
route.get("/logout", AuthControllers.logoutUser);
route.post("/password/forgot", AuthControllers.forgotPassword);
route.put("/password/reset/:token", AuthControllers.resetPassword);

route.get("/me", isAuthenticatedUser, AuthControllers.getUserProfile);
route.put("/me/update", isAuthenticatedUser, AuthControllers.updateProfile);
route.put(
  "/me/upload_avatar",
  isAuthenticatedUser,
  AuthControllers.UploadUserAvatar
);

route.put(
  "/password/update",
  isAuthenticatedUser,
  AuthControllers.updateUserPassword
);

route.get(
  "/admin/users",
  isAuthenticatedUser,
  authhorizeRoles("admin"),
  AuthControllers.getAllUsers
);
route.get(
  "/admin/users/:id",
  isAuthenticatedUser,
  authhorizeRoles("admin"),
  AuthControllers.getUserDetails
);
route.put(
  "/admin/users/:id",
  isAuthenticatedUser,
  authhorizeRoles("admin"),
  AuthControllers.updateUser
);
route.delete(
  "/admin/users/:id",
  isAuthenticatedUser,
  authhorizeRoles("admin"),
  AuthControllers.deleteUser
);

export default route;
