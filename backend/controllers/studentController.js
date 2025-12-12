import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// import pkg from '@prisma/client';

// const { PrismaClient } = pkg;
// const prisma = new PrismaClient();

//STUDENT ONBOARDING
export const studentOnboard = async (req, res) => {
  try {
    const { name, email, collegeId, googleId } = req.body;
    console.log("this is the request body", req.body);

    //Auto-generate Student ID
    const studentId = "STD" + Date.now();

    // ✅ STEP 1: Find college by CLG001
    const college = await prisma.college.findUnique({
      where: {
        collegeId: collegeId, // CLG001
      },
    });

    if (!college) {
      return res.status(400).json({ error: "Invalid College Selected" });
    }

    const student = await prisma.student.create({
      data: {
        name,
        email,
        studentId,
        collegeId: college.id,
        googleId: googleId
      }
    });

    res.json({
      message: "Onboarding completed",
      student
    });
    console.log("Onboarding successful")

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Onboarding failed" });
  }
};
