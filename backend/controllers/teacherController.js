import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

/* ✅ TEACHER ONBOARD */
export const teacherOnboard = async (req, res) => {
  try {
    const { name, email, googleId, collegeId } = req.body;

    // ✅ Validate college
    const college = await prisma.college.findUnique({
      where: { collegeId }
    });

    if (!college) {
      return res.status(400).json({ error: "Invalid College Selected" });
    }

    const teacher = await prisma.teacher.create({
      data: {
        name,
        email,
        googleId,
        collegeId: college.id
      }
    });

    res.json({ message: "Teacher Onboarded", teacher });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Teacher onboarding failed" });
  }
};

/* ✅ GENERATE QR CODE */
export const createQR = async (req, res) => {
  try {
    const { teacherGoogleId, collegeId, className, date } = req.body;

    const teacher = await prisma.teacher.findUnique({
      where: { googleId: teacherGoogleId }
    });

    if (!teacher) return res.status(404).json({ error: "Teacher not found" });

    const college = await prisma.college.findUnique({
      where: { collegeId }
    });

    const token = crypto.randomBytes(16).toString("hex");

    const qr = await prisma.qRCode.create({
      data: {
        qrToken: token,
        className,
        date: new Date(date),
        validFrom: new Date(),
        validTill: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        teacherId: teacher.id,
        collegeId: college.id
      }
    });

    res.json({ message: "QR Created", qr });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "QR generation failed" });
  }
};

export const refreshQR = async (req, res) => {
  try {
    const { oldToken } = req.body;

    const qr = await prisma.qRCode.findUnique({
      where: { qrToken: oldToken }
    });

    if (!qr) return res.status(404).json({ error: "QR not found" });

    // Generate new token
    const newToken = crypto.randomBytes(16).toString("hex");

    // Update QR in DB
    await prisma.qRCode.update({
      where: { id: qr.id },
      data: { qrToken: newToken }
    });
    console.log("we got new token")
    res.json({ newToken });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "QR refresh failed" });
  }
};

