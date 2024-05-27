import express from "express";
import { authhorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";
import OrderControllers from "../controllers/OrderControllers.js";
const router = express.Router();

router.post("/orders/new", isAuthenticatedUser, OrderControllers.newOrder);
router.get(
  "/orders/:id",
  isAuthenticatedUser,
  OrderControllers.getOrderDetails
);
router.get("/me/orders", isAuthenticatedUser, OrderControllers.getMyOrders);

router.get(
  "/admin/get_sales",
  isAuthenticatedUser,
  authhorizeRoles("admin"),
  OrderControllers.getSales
);

router.get(
  "/admin/orders",
  isAuthenticatedUser,
  authhorizeRoles("admin"),
  OrderControllers.AllOrders
);
router.put(
  "/admin/orders/:id",
  isAuthenticatedUser,
  authhorizeRoles("admin"),
  OrderControllers.UpdateOrder
);
router.delete(
  "/admin/orders/:id",
  isAuthenticatedUser,
  authhorizeRoles("admin"),
  OrderControllers.DeleteOrder
);

export default router;
