/** @format */

"use client";

import { useState, useEffect, useMemo } from "react";
import Countdown from "../components/Countdown";
import SelfieCapture from "../components/SelfieCapture";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import Navbar from "@/components/ui/navbar";
import DisplayRewards from "@/components/DisplayRewards";

export default function Home() {
  const [countdown, setCountdown] = useState(5);
  const [showSelfie, setShowSelfie] = useState(false);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [showNameForm, setShowNameForm] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const endpoint = clusterApiUrl("devnet");
  const wallets = useMemo(() => [], []);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
  };

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <div className="h-screen w-screen py-6 px-8">
          {isClient ? (
            <>
              {showSelfie && !selfieImage ? (
                <>
                  <Navbar />
                  <DisplayRewards />
                  <SelfieCapture onCapture={handleSelfieCaptured} />
                </>
              ) : (
                <Countdown initialSeconds={5} />
              )}
            </>
          ) : (
            <p>Prerender</p>
          )}
        </div>
      </WalletProvider>
    </ConnectionProvider>
  );
}
