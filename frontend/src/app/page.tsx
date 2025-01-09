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
import Navbar from "@/components/ui/navbar";
import DisplayRewards from "@/components/DisplayRewards";
import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

// Reown configuration
const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

const metadata = {
  name: "Reality Check",
  description: "AppKit Solana Example",
  url: "http://localhost:3000/",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solana, solanaTestnet, solanaDevnet],
  metadata: metadata,
  projectId: `${process.env.PROJECT_ID}`,
  features: {
    analytics: true,
  },
});

export default function Home() {
  const [countdown, setCountdown] = useState(5);
  const [showSelfie, setShowSelfie] = useState(false);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [showNameForm, setShowNameForm] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const endpoint = clusterApiUrl("devnet");
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

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

  if (!isClient) return null;

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <div className="h-screen w-screen py-6 px-8">
          {showSelfie && !selfieImage ? (
            <>
              <Navbar />
              <DisplayRewards />
              <SelfieCapture onCapture={handleSelfieCaptured} />
            </>
          ) : (
            <Countdown initialSeconds={5} />
          )}
        </div>
      </WalletProvider>
    </ConnectionProvider>
  );
}
