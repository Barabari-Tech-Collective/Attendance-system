"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Onboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [collegeId, setCollegeId] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("http://192.168.0.195:4000/api/student/onboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: session?.user?.name,
        email: session?.user?.email,
        collegeId,
        googleId: session?.user?.googleId
      })
    });

    const data = await res.json();
    console.log("Onboard Success:", data);

    router.push("/student/scan");
  };

  return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-black mb-4">
          Complete Your Profile
        </h1>

        <p className="text-black mb-4">
          Name: <b>{session?.user?.name}</b>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button className="w-full bg-black text-white py-3 rounded font-semibold">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
