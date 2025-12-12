import express from "express";
import { studentOnboard } from "../controllers/studentController.js";
import { googleSignup } from "../controllers/authController.js";

const router = express.Router();

// Google Signup (step 1)
router.post("/auth/google-signup", googleSignup);

// Onboarding (step 2)
router.post("/student/onboard", studentOnboard);

export default router;
