import express from "express";

const router = express.Router();

import AuthRoute from "./AuthRoute";
import ProductRoute from "./ProductRoute";
import CartRoute from "./CartRoutes";

router.use("/auth", AuthRoute);
router.use("/products", ProductRoute);
router.use("/cart", CartRoute);

export default router;