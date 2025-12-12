import { PrismaClient } from "@prisma/client";
import { markAttendanceInSheet } from "../utils/googleSheet.js";
const prisma = new PrismaClient();

export const markAttendance = async (req, res) => {
  try {
    const { qrToken, googleId } = req.body;

    if (!qrToken || !googleId) {
      return res.status(400).json({ error: "Missing scan data" });
    }

    // 1. Get student
    const student = await prisma.student.findUnique({
      where: { googleId }
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // 2. Get QR info
    const qr = await prisma.qRCode.findUnique({
      where: { qrToken }
    });

    if (!qr) return res.status(400).json({ error: "Invalid QR Code" });

    // 3. Time validity
    const now = new Date();
    if (now < qr.validFrom || now > qr.validTill) {
      return res.status(400).json({ error: "QR Expired" });
    }

    // 4. Duplicate check
    const already = await prisma.scan.findFirst({
      where: { studentDbId: student.id, qrId: qr.id }
    });

    if (already) {
      return res.status(409).json({ error: "Attendance already marked" });
    }

    // 5. Save to database
    const scan = await prisma.scan.create({
      data: {
        studentDbId: student.id,
        qrId: qr.id,
        token: qrToken,
        studentLat: 0,
        studentLng: 0,
        scanTime: new Date(),
        isOffline: false,
      },
    });

    // 6. Update Google Sheet
    const college = await prisma.college.findUnique({
      where: { id: student.collegeId }
    });

    const classDateFormatted = qr.date.toLocaleDateString("en-GB"); // DD/MM/YY format

    await markAttendanceInSheet(
      college.sheetId,
      student.name,
      student.studentId,
      qr.className,
      classDateFormatted
    );

    return res.json({
      message: "Attendance marked and sheet updated",
      scan
    });

  } catch (err) {
    console.error("SCAN ERROR:", err);
    return res.status(500).json({ error: "Internal error" });
  }
};
