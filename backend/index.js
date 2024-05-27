import express from "express";
import dotenv from "dotenv";
import ProductsRouter from "./router/product.js";
import AuthRouters from "./router/auth.js";
import OrderRoutes from "./router/order.js";
import PaymentRoutes from "./router/payment.js";
import errorMiddleware from "./middleware/errors.js";
import ConnectToDatabse from "./dbconnect.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting Down server due to uncaught expection`);
  process.exit(1);
});
dotenv.config();

app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(cookieParser());
//dbconnect
ConnectToDatabse();

//routes
app.use("/api/v2", ProductsRouter);
app.use("/api/v2", AuthRouters);
app.use("/api/v2", OrderRoutes);
app.use("/api/v2", PaymentRoutes);

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

//error middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(
    `server is running PORT:${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

process.on("unhandledRejection", (err) => {
  console.log(`Error ${err.message}`);
  console.log(`Shutting Down server due to Unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
