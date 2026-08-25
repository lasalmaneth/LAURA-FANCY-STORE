"use client";

import { useEffect, useRef, useState } from "react";

export default function LogoSplashOverlay() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleEnd = () => {
    setFadeOut(true);
    setTimeout(() => {
      setVisible(false);
    }, 700);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Try playing video with sound; fallback to muted if browser blocks audio autoplay
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        video.muted = true;
        video.play().catch(() => {
          // If video fails completely, finish splash
          handleEnd();
        });
      });
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center transition-opacity duration-700 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Fullscreen Video Player */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          src="/assets/videos/logo-reveal.mp4"
          autoPlay
          playsInline
          onEnded={handleEnd}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute bottom-6 z-10 font-mono text-[10px] text-white/50 tracking-widest uppercase pointer-events-none drop-shadow-md">
        Laura Fancy Store — Intro Reveal
      </div>
    </div>
  );
}
