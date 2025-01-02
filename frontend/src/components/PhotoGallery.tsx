/** @format */

"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Zap } from "lucide-react";

interface Photo {
  _id: string;
  name: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);

  const openLightbox = (photo: Photo) => {
    setCurrentPhoto(photo);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentPhoto(null);
  };

  return (
    <div className="container mx-auto px-8 py-8 font-comic-sans bg-yellow-50">
      <div className="flex flex-col bg-white py-6 px-8 border-4 border-black rounded-3xl shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text animate-pulse">
          Thanks for something!
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8">
        {photos.map((photo) => (
          <div
            key={photo._id}
            className="flex flex-col bg-white rounded-2xl border-4 border-black 
                     transition-all duration-300 hover:scale-110 hover:rotate-6 hover:z-10 
                     shadow-[6px_6px_0_0_rgba(0,0,0,1)] max-w-xs"
          >
            <div
              className="relative overflow-hidden cursor-pointer h-48"
              onClick={() => openLightbox(photo)}
            >
              <Image
                src={`http://localhost:5000/capture/${photo._id}`}
                alt={photo.name}
                width={150}
                height={150}
                className="object-cover w-full h-full rounded-lg"
              />
              <div
                className="absolute inset-0 bg-yellow-400 bg-opacity-0 hover:bg-opacity-20 
                            transition-opacity duration-300 flex items-center justify-center"
              >
                <Zap
                  className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity 
                           duration-300 animate-pulse"
                  size={32}
                />
              </div>
            </div>
            <div className="p-2 text-center bg-white text-black font-bold rounded-b-lg text-sm font-libre">
              Points Gained:
            </div>
          </div>
        ))}
      </div>

      {lightboxOpen && currentPhoto && (
        <div
          className="fixed inset-0 bg-gray-900 
                      bg-opacity-95 flex items-center justify-center z-50 backdrop-blur-sm"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-yellow-300 
                     transition-transform duration-300 hover:scale-125 hover:rotate-12"
          >
            <X size={40} />
          </button>
          <div className="relative max-w-2xl w-full px-4">
            <div
              className="bg-white p-4 rounded-2xl border-4 border-black 
                          shadow-[12px_12px_0_0_rgba(0,0,0,1)]"
            >
              <Image
                src={`http://localhost:5000/capture/${currentPhoto._id}`}
                alt={currentPhoto.name}
                width={600}
                height={400}
                className="rounded-lg object-contain w-full h-auto"
              />
              <div className="p-2 text-center bg-white text-black font-bold rounded-b-lg text-2xl font-libre">
                Points Gained:
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
