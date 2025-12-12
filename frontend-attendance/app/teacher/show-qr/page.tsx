"use client";

import { useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ShowQR() {
  const params = useSearchParams();
  const initialToken = params.get("token");
  const className = params.get("class");
  const date = params.get("date");

  const [token, setToken] = useState(initialToken);
  const [qrUrl, setQrUrl] = useState("");

  // 🔄 Generate QR whenever token changes
  useEffect(() => {
    if (token) {
      QRCode.toDataURL(token).then((url) => setQrUrl(url));
    }
  }, [token]);

  // 🔄 Auto-refresh token every 15 sec
  useEffect(() => {
    const interval = setInterval(async () => {
      console.log("⏳ Refreshing QR...");

      const res = await fetch("http://192.168.0.195:4000/api/teacher/refresh-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldToken: token }),
      });

      const data = await res.json();

      if (data?.newToken) {
        setToken(data.newToken);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [token]);
  

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">
      <h1 className="text-2xl font-bold text-black mb-3">
        Scan To Mark Attendance
      </h1>

      <p className="text-gray-700 mb-1">
        <b>Class:</b> {className}
      </p>

      <p className="text-gray-700 mb-5">
        <b>Date:</b> {date}
      </p>

      {qrUrl && (
        <Image
          src={qrUrl}
          alt="QR Code"
          className="w-64 h-64 border p-3 rounded-lg"
          width={256}
          height={256}
        />
      )}

      <p className="text-black text-sm mt-4">
        This QR auto-refreshes every 15 seconds.
      </p>
    </div>
  );
}
