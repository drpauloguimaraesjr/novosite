"use client";

import Lottie from "lottie-react";
import dnaAnimation from "@/data/dna-animation.json";

interface AnimatedLogoProps {
  size?: number;
  speed?: number;
  autoPlay?: boolean;
  color?: string;
}

export function AnimatedLogo({ 
  size = 60, 
  speed = 1, 
  autoPlay = true,
}: AnimatedLogoProps) {
  return (
    <div 
      className="animated-logo-container"
      style={{ 
        width: size, 
        height: size,
        overflow: "hidden"
      }}
    >
      <Lottie 
        animationData={dnaAnimation} 
        loop={true}
        autoplay={autoPlay}
        style={{
          width: "100%",
          height: "100%"
        }}
      />
    </div>
  );
}
