import express from "express";
import { isAuthenticatedUser } from "../middleware/auth.js";
import paymentControllers from "../controllers/paymentControllers.js";

const route = express.Router();

route.post(
  "/payment/checkout_session",
  isAuthenticatedUser,
  paymentControllers.stripeCheckOutSession
);

export default route;
