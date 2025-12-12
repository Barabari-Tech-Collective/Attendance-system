import express from "express";
import { teacherOnboard, createQR, refreshQR } from "../controllers/teacherController.js";

const router = express.Router();
console.log("Teacher Routes Loaded");


router.post("/teacher-onboard", teacherOnboard);
router.post("/generate-qr", createQR);
router.post("/refresh-qr", refreshQR)

export default router;
