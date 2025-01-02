/** @format */
"use client";
import { useEffect, useState } from "react";
import PhotoGallery from "../../components/PhotoGallery";

export default function Capture() {
  const [images, setImages] = useState<{ _id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch all image metadata
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/captures`
        );
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        } else {
          setError("Failed to fetch images");
        }
      } catch (err) {
        setError("Error fetching images");
        console.error(err);
      }
    };

    fetchImages();
  }, []);

  return (
    <main className="min-h-screen ">
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!error && <PhotoGallery photos={images} />}
    </main>
  );
}
