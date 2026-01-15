"use client";

import { useState } from "react";

export default function OnboardingPage() {
  const [locationGranted, setLocationGranted] = useState(false);

  async function requestLocation() {
    try {
      await navigator.geolocation.getCurrentPosition(() => {
        setLocationGranted(true);
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Onboarding</h1>

      <p className="mb-4 text-gray-600">
        We need your location permission for attendance verification.
      </p>

      <button
        onClick={requestLocation}
        className="bg-green-600 text-white w-full py-2 rounded"
      >
        Give Permission
      </button>

      {locationGranted && (
        <button
          onClick={() => (window.location.href = "/student/scan")}
          className="bg-blue-600 text-white w-full py-2 rounded mt-4"
        >
          Continue to Scanner
        </button>
      )}
    </div>
  );
}
