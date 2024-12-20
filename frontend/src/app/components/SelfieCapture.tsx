/** @format */

"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface SelfieCaptureProps {
  onCapture: (imageSrc: string) => void;
}

export default function SelfieCapture({ onCapture }: SelfieCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const startCapture = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (err) {
      console.error("Error accessing the camera", err);
    }
  }, []);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 320, 240);
        const imageSrc = canvasRef.current.toDataURL("image/jpeg");
        onCapture(imageSrc);
      }
    }
  }, [onCapture]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold text-blue-700">Take a Selfie</h2>
      {isCapturing ? (
        <>
          <video ref={videoRef} autoPlay className="rounded-lg shadow-lg" />
          <Button
            onClick={captureImage}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Camera className="mr-2 h-4 w-4" /> Capture Selfie
          </Button>
        </>
      ) : (
        <Button
          onClick={startCapture}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Start Camera
        </Button>
      )}
      <canvas ref={canvasRef} width="320" height="240" className="hidden" />
    </div>
  );
}
