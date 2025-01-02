/** @format */

"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import idl from "../lib/idl.json";

const programId = new web3.PublicKey(
  "DmydQAoPuv7qKy1fA48JWa5F1B4oHDzJapt5P4u7hyhh"
);

interface SelfieCaptureProps {
  onCapture: (imageSrc: string) => void;
}

export default function SelfieCapture({ onCapture }: SelfieCaptureProps) {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userAccountPDA, setUserAccountPDA] = useState<web3.PublicKey | null>(
    null
  );
  const [selfieCount, setSelfieCount] = useState(0);

  const getProvider = () => {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }
    return new AnchorProvider(connection, wallet, { commitment: "processed" });
  };

  const initializeOrGetUserAccount = async () => {
    if (!wallet?.publicKey) {
      throw new Error("Wallet not connected");
    }

    try {
      const provider = getProvider();
      const program = new Program(idl as any, programId, provider);
      const [userAccount] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("user_account"), wallet.publicKey.toBuffer()],
        programId
      );

      try {
        // Try to fetch existing account
        const account = await program.account.userAccount.fetch(userAccount);
        setUserAccountPDA(userAccount);
        return userAccount;
      } catch (error) {
        // Account doesn't exist, create it
        const ix = await program.methods
          .initializeUser()
          .accounts({
            userAccount,
            user: wallet.publicKey,
            systemProgram: web3.SystemProgram.programId,
          })
          .instruction();

        const transaction = new web3.Transaction().add(ix);
        const latestBlockhash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = latestBlockhash.blockhash;
        transaction.feePayer = wallet.publicKey;

        const signedTx = await wallet.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(
          signedTx.serialize()
        );
        await connection.confirmTransaction({
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });

        setUserAccountPDA(userAccount);
        setSelfieCount(0);
        return userAccount;
      }
    } catch (error) {
      console.error("Account initialization error:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (wallet?.publicKey) {
      initializeOrGetUserAccount().catch(console.error);
    }
  }, [wallet?.publicKey]);

  const addPoints = async (userAccountPDA: web3.PublicKey) => {
    if (!wallet?.publicKey) {
      throw new Error("Wallet not connected");
    }

    try {
      const provider = getProvider();
      const program = new Program(idl as any, programId, provider);

      const ix = await program.methods
        .addPoints(new BN(10))
        .accounts({
          userAccount: userAccountPDA,
          owner: wallet.publicKey,
        })
        .instruction();

      const transaction = new web3.Transaction().add(ix);
      const latestBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = wallet.publicKey;

      try {
        const signedTx = await wallet.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(
          signedTx.serialize()
        );
        await connection.confirmTransaction({
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });
      } catch (signError) {
        console.error("Transaction signing failed:", signError);
        throw new Error("Failed to sign transaction");
      }
    } catch (error) {
      console.error("Points addition error:", error);
      throw error;
    }
  };

  const startCapture = useCallback(async () => {
    if (!wallet) {
      alert("Please connect your wallet first");
      return;
    }

    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing the camera:", err);
      alert("Camera access denied or in use by another application");
      setIsCapturing(false);
    }
  }, [wallet]);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  }, []);

  const captureImage = useCallback(async () => {
    if (!wallet?.publicKey || !connection) {
      alert("Please connect your wallet first");
      return;
    }

    setIsProcessing(true);
    try {
      if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext("2d");
        if (!context) throw new Error("Could not get canvas context");

        // Get or initialize user account if not already done
        const userAccount =
          userAccountPDA || (await initializeOrGetUserAccount());

        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
        context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

        const blob = await new Promise<Blob | null>((resolve) =>
          canvasRef.current?.toBlob(resolve, "image/jpeg")
        );

        if (!blob) throw new Error("Failed to create image blob");

        const formData = new FormData();
        formData.append("file", blob, `selfie_${selfieCount + 1}.jpg`);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/capture`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        await addPoints(userAccount);
        setSelfieCount((prev) => prev + 1);
        setPreviewImage(URL.createObjectURL(blob));
        alert("Selfie captured and points awarded successfully!");
        stopCamera();
      }
    } catch (error) {
      console.error("Error in capture process:", error);
      alert(
        `Failed to capture image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsProcessing(false);
    }
  }, [wallet, connection, stopCamera, userAccountPDA, selfieCount]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 my-4 bg-yellow-50 rounded-3xl border-4 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
      <h2 className="text-3xl font-bold animate-pulse">
        📸 Take a Fun Selfie! 📸
      </h2>

      {!wallet ? (
        <div className="text-center p-6 bg-white rounded-xl border-4 border-red-400 shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
          <p className="text-red-500 font-bold text-lg">
            Oops! Connect your wallet first! 🔌
          </p>
        </div>
      ) : isCapturing ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="rounded-xl border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)]"
            />
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-red-500 rounded-full animate-pulse" />
          </div>

          <div className="space-x-4 mt-4">
            <Button
              onClick={captureImage}
              disabled={isProcessing}
              className="bg-blue-500 hover:bg-blue-600 text-white transform hover:scale-110 hover:rotate-3 transition-transform border-2 border-black rounded-xl font-bold shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
            >
              <Camera className="mr-2 h-5 w-5" />
              {isProcessing ? "Processing... 🔄" : "Say Cheese! 📸"}
            </Button>
            <Button
              onClick={stopCamera}
              className="bg-red-500 hover:bg-red-600 text-white transform hover:scale-110 hover:-rotate-3 transition-transform border-2 border-black rounded-xl font-bold shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
            >
              Stop Camera 🛑
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={startCapture}
          className="bg-green-500 hover:bg-green-600 text-white transform hover:scale-110 hover:rotate-3 transition-transform border-2 border-black rounded-xl font-bold text-lg shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
        >
          Start Camera 🎥
        </Button>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {previewImage && (
        <div className="mt-6 bg-white p-6 rounded-xl border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <h3 className="text-xl font-bold text-purple-600 mb-4">
            ✨ Your look amazing ✨
          </h3>
          <img
            src={previewImage}
            alt="Captured Preview"
            className="rounded-xl border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)]"
            width={480}
            height={360}
          />
        </div>
      )}
    </div>
  );
}
