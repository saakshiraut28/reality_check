/** @format */
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface CountdownProps {
  initialSeconds: number; // Renamed to indicate it's the starting value
  onComplete?: () => void; // Optional callback when countdown reaches 0
}

export default function Countdown({
  initialSeconds,
  onComplete,
}: CountdownProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer); // Cleanup to prevent memory leaks
    } else if (onComplete) {
      onComplete(); // Trigger the optional callback when countdown ends
    }
  }, [seconds, onComplete]);

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      className="h-full w-full flex"
    >
      <div className="h-full w-full flex flex-col bg-background-purple py-8 px-8 font-libre border border-2 border-black rounded-3xl shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
        <div className="text-[80px] leading-tight font-bold">
          <p>This New Year Eve</p>
          <p> Get Ready to Earn 🤑</p>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="w-32 h-32 flex items-center justify-center border border-2 border-black rounded-full bg-background-yellow text-[70px]">
            {seconds}
          </div>
        </div>
        <div className="w-full flex flex-row space-x-8">
          <div className="flex flex-row justify-between w-1/2 h-48  bg-white px-8 py-2 border border-2 border-black rounded-xl">
            <div className="flex w-1/2 flex-col text-3xl font-semibold py-6">
              <p>Currently works on</p>
              <p>
                <span className="text-5xl">DEVNET</span>
              </p>
              <p> only.</p>
            </div>
            <div className="flex">
              {/* Check mark */}
              <DotLottieReact
                src="https://lottie.host/1c132779-7ee0-4a9e-bcec-e53a7d50ee1d/BnkX91a2rL.lottie"
                loop
                autoplay
              />
            </div>
          </div>
          <div className="flex flex-row justify-between w-1/2 h-48  bg-white px-8 py-2 border border-2 border-black rounded-xl">
            <div className="flex flex-col text-2xl font-semibold py-6">
              <p>Made with love by @saakshitwt.</p>
              <p>
                If you get find any unexpected <br /> behavior ping me.{" "}
              </p>
            </div>
            <div className="flex ">
              {/* Message sends*/}
              <DotLottieReact
                src="https://lottie.host/61eebd5b-606d-4a5f-aa2c-7cc3c9064ec0/vioYSA3EuK.lottie"
                loop
                autoplay
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
