import express from "express";
import validateRegisterRequest, { registerUserSchema } from "../middleware/validation/authentication/registerValidationSchemas";
import { protect } from "../middleware/protect";
import { loginUser, registerUser } from "../controllers/AuthController";

const router = express.Router();

router.post("/register", validateRegisterRequest(registerUserSchema), registerUser);
router.post("/login", loginUser);

export default router;