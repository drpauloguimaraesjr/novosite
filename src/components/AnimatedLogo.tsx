"use client";

import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useEffect, useState, useRef } from "react";
import animationData from "@/data/dna-loading.json";

interface AnimatedLogoProps {
  size?: number;
  speed?: number; // multiplier for playback speed
  autoPlay?: boolean;
}

export function AnimatedLogo({
  size = 60,
  speed = 1,
  autoPlay = true,
}: AnimatedLogoProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  // sync autoplay prop
  useEffect(() => {
    setIsPlaying(autoPlay);
  }, [autoPlay]);

  // apply speed when it changes
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(speed);
    }
  }, [speed]);

  // control play/pause based on isPlaying
  useEffect(() => {
    if (lottieRef.current) {
      if (isPlaying) {
        lottieRef.current.play();
      } else {
        lottieRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size, overflow: "hidden", marginLeft: 60 }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={true}
        autoplay={isPlaying}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
