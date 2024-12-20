/** @format */

"use client";

import { useState, useEffect } from "react";
import Countdown from "./components/Countdown";
import SelfieCapture from "./components/SelfieCapture";
import NameForm from "./components/NameForm";

export default function Home() {
  const [countdown, setCountdown] = useState(5);
  const [showSelfie, setShowSelfie] = useState(false);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [showNameForm, setShowNameForm] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowSelfie(true);
    }
  }, [countdown]);

  const handleSelfieCaptured = (imageSrc: string) => {
    setSelfieImage(imageSrc);
    setShowNameForm(true);
  };

  const handleNameSubmit = (name: string) => {
    console.log(`Name submitted: ${name}`);
    console.log(`Selfie image: ${selfieImage}`);
    // Here you would typically send this data to your backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex flex-col items-center justify-center p-4">
      {countdown > 0 && <Countdown seconds={countdown} />}
      {showSelfie && !selfieImage && (
        <SelfieCapture onCapture={handleSelfieCaptured} />
      )}
      {showNameForm && <NameForm onSubmit={handleNameSubmit} />}
    </div>
  );
}
