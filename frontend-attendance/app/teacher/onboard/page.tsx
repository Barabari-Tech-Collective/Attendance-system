"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherOnboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [collegeId, setCollegeId] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("http://192.168.0.195:4000/api/teacher/teacher-onboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: session?.user?.name,
        email: session?.user?.email,
        googleId: session?.user?.googleId,
        collegeId
      })
    });

    const data = await res.json();
    console.log(data);

    router.push("/teacher/home");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-black">Teacher Onboarding</h1>

        <p className="text-black">
          Name: <b>{session?.user?.name}</b>
        </p>

        <select
          required
          value={collegeId}
          onChange={(e) => setCollegeId(e.target.value)}
          className="w-full border p-3 rounded text-black"
        >
          <option value="">Select College</option>
          <option value="CLG001">Government College A</option>
          <option value="CLG002">Government College B</option>
        </select>

        <button className="w-full bg-black text-white py-3 rounded">
          Continue
        </button>
      </form>
    </div>
  );
}
