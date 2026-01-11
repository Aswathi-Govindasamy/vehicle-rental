import express from "express";
import { register, login,getMe} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";


const router = express.Router();

/**
 * Auth Routes
 * Base URL: /api/auth
 */

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post("/register", register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", login);
router.get("/me",protect, getMe);


export default router;
