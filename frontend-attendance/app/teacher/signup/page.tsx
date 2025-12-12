"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TeacherSignup() {
  const router = useRouter();

  // After Google Login, NextAuth redirects → this page should push to onboard
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("callback") === "teacher") {
      router.push("/teacher/onboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="max-w-sm w-full text-center">
        <h1 className="text-3xl font-bold text-black mb-3">Teacher Signup</h1>
        <p className="text-gray-600 mb-6">
          Sign up using your Google account to continue
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/teacher/signup?callback=teacher" })}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900"
        >
          Sign up with Google
        </button>
      </div>
    </div>
  );
}
