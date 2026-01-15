"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentScan() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Protect Route
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

   // ✅ Send Scan to Backend
  const markAttendance = async (token: string) => {
    setLoading(true);

    await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        qrToken: token,
        googleId: session?.user?.googleId,
      }),
    });

    alert("✅ Attendance Marked Successfully!");
    setLoading(false);
  };

  // ✅ Scan QR using HTML5 API
  const scanLoop = async () => {
    if (!("BarcodeDetector" in window)) {
      alert("QR Scanner not supported on this browser");
      return;
    }

    const detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });

    setInterval(async () => {
      if (!videoRef.current || loading) return;

      const barcodes = await detector.detect(videoRef.current);

      if (barcodes.length > 0) {
        const token = barcodes[0].rawValue;
        setScannedData(token);
        markAttendance(token);
      }
    }, 1500);
  };

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    scanLoop();
  };

  // ✅ Start Camera
  useEffect(() => {
    startCamera();
  }, []);

  

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">

      {/* ✅ Student Info */}
      <div className="w-full max-w-sm text-center mb-6">
        <h1 className="text-2xl font-bold text-black mb-1">
          Hi, {session?.user?.name}
        </h1>
        <p className="text-gray-600 text-sm">
          You are logged in successfully
        </p>
      </div>

      {/* ✅ Camera Preview */}
      <div className="w-full max-w-sm bg-black rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-[300px] object-cover"
        />
      </div>

      {/* ✅ Scan Result */}
      {scannedData && (
        <div className="mt-5 text-center text-black text-sm">
          Scanned Token: <b>{scannedData}</b>
        </div>
      )}

      {/* ✅ Status Button */}
      <button
        disabled
        className="mt-6 w-full max-w-sm bg-black text-white py-3 rounded-lg font-semibold"
      >
        {loading ? "Scanning..." : "Point Camera at QR"}
      </button>
    </div>
  );
}
