"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherHome() {
  const { data: session } = useSession();
  const router = useRouter();

  const [className, setClassName] = useState("");
  const [date, setDate] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [qr, setQr] = useState<any>(null);

  const generateQR = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/teacher/generate-qr`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacherGoogleId: session?.user?.googleId,
        collegeId,
        className,
        date
      })
    });

    const data = await res.json();
    // setQr(data.qr);
    router.push(`/teacher/show-qr?token=${data.qr.qrToken}&class=${className}&date=${date}`);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5">
      <div className="w-full max-w-sm space-y-4">

        <h1 className="text-xl font-bold text-black">
          Hi, {session?.user?.name}
        </h1>

        <select
          onChange={(e) => setCollegeId(e.target.value)}
          className="w-full border p-3 text-black"
        >
          <option value="">Select College</option>
          <option value="CLG001">Government College A</option>
          <option value="CLG002">Government College B</option>
        </select>

        <input
          className="w-full border p-3 text-black"
          placeholder="Class Name"
          onChange={(e) => setClassName(e.target.value)}
        />

        <input
          type="date"
          className="w-full border p-3 text-black"
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          onClick={generateQR}
          className="w-full bg-black text-white py-3 rounded"
        >
          Generate QR
        </button>

        {qr && (
          <div className="text-black text-sm mt-4 break-all">
            ✅ QR Token: {qr.qrToken}
          </div>
        )}
      </div>
    </div>
  );
}
