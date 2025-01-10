/** @format */

"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit"; // Added missing import
import "@solana/wallet-adapter-react-ui/styles.css";

import Navbar from "@/components/ui/navbar";
import Countdown from "@/components/Countdown";
import SelfieCapture from "@/components/SelfieCapture";
import DisplayRewards from "@/components/DisplayRewards";

// Initialize wallet adapters outside the component
const walletAdapters = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

// AppKit configuration
const PROJECT_ID =
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ?? "YOUR_PROJECT_ID";
const SOLANA_ENDPOINT = clusterApiUrl("devnet");

// Since we're in a "use client" component, we need to ensure window is available
const getMetadata = () => ({
  name: "AppKit",
  description: "AppKit Solana Example",
  url:
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000/",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
});

// Initialize SolanaAdapter
const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: walletAdapters,
});

// Move AppKit initialization to useEffect to avoid SSR issues
const initializeAppKit = () => {
  createAppKit({
    adapters: [solanaWeb3JsAdapter],
    networks: [solana, solanaTestnet, solanaDevnet],
    metadata: getMetadata(),
    projectId: PROJECT_ID,
    features: {
      analytics: true,
    },
  });
};

export default function Home() {
  const [countdown, setCountdown] = useState(5);
  const [showSelfie, setShowSelfie] = useState(false);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [showNameForm, setShowNameForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Memoize empty wallets array
  const wallets = useMemo(() => [], []);

  // Handle client-side mounting and AppKit initialization
  useEffect(() => {
    setMounted(true);
    initializeAppKit();
  }, []);

  // Handle countdown
  useEffect(() => {
    if (countdown <= 0) {
      setShowSelfie(true);
      return;
    }

    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSelfieCaptured = (imageSrc: string) => {
    setSelfieImage(imageSrc);
    setShowNameForm(true);
  };

  const handleNameSubmit = (name: string) => {
    // TODO: Implement name submission logic
    console.log({ name, selfieImage });
  };

  // Don't render anything until client-side
  if (!mounted) return null;

  return (
    <ConnectionProvider endpoint={SOLANA_ENDPOINT}>
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
