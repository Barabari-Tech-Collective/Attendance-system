"use client";

import { signIn } from "next-auth/react";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-black mb-6 text-center">
          Student Login
        </h1>

        <button
          onClick={() => signIn("google", { callbackUrl: "/student/onboard" })}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
