import express from "express";
import { markAttendance } from "../controllers/scanController.js";

const router = express.Router();

router.post("/", markAttendance);

export default router;
