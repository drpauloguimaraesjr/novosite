"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";

interface AnimatedLogoProps {
  size?: number;
  speed?: number;
  autoPlay?: boolean;
  color?: string;
}

export function AnimatedLogo({ 
  size = 60, 
  speed = 3,
  autoPlay = true,
  color = "#000000"
}: AnimatedLogoProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    setIsPlaying(autoPlay);
  }, [autoPlay]);

  const squareSize = 170;
  const padding = 45;
  const innerSize = squareSize - (padding * 2);
  const nodeCount = 12;
  const nodes = Array.from({ length: nodeCount });
  const amplitude = 35;

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ 
        width: size, 
        height: size,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${squareSize} ${squareSize}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <motion.path
          d="M160,170H10c-5.5,0-10-4.5-10-10V10C0,4.5,4.5,0,10,0h150c5.5,0,10,4.5,10,10v150C170,165.5,165.5,170,160,170z M10,2c-4.4,0-8,3.6-8,8v150c0,4.4,3.6,8,8,8h150c4.4,0,8-3.6,8-8V10c0-4.4-3.6-8-8-8H10z"
          fill={color}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
        />

        <g transform={`translate(${squareSize/2}, ${padding})`}>
          {nodes.map((_, i) => {
            const y = (i / (nodeCount - 1)) * innerSize;
            const phase = (i / nodeCount) * Math.PI * 1.5;
            
            const cxA = [
              amplitude * Math.cos(phase),
              amplitude * Math.cos(phase + Math.PI * 0.5),
              amplitude * Math.cos(phase + Math.PI),
              amplitude * Math.cos(phase + Math.PI * 1.5),
              amplitude * Math.cos(phase + Math.PI * 2)
            ];

            const cxB = [
              amplitude * Math.cos(phase + Math.PI),
              amplitude * Math.cos(phase + Math.PI * 1.5),
              amplitude * Math.cos(phase + Math.PI * 2),
              amplitude * Math.cos(phase + Math.PI * 0.5),
              amplitude * Math.cos(phase + Math.PI)
            ];

            const scaleA = [1, 1.3, 1, 0.7, 1];
            const opacityA = [0.6, 1, 0.6, 0.3, 0.6];
            
            const scaleB = [1, 0.7, 1, 1.3, 1];
            const opacityB = [0.6, 0.3, 0.6, 1, 0.6];

            return (
              <g key={i}>
                <motion.line
                  y1={y} y2={y}
                  stroke={color} strokeWidth="0.5"
                  animate={isPlaying ? {
                    x1: cxA,
                    x2: cxB,
                    opacity: [0.1, 0.3, 0.1]
                  } : {}}
                  transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
                />
                
                <motion.circle
                  r="2" cy={y} fill={color}
                  animate={isPlaying ? {
                    cx: cxA,
                    scale: scaleA,
                    opacity: opacityA
                  } : {}}
                  transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
                />

                <motion.circle
                  r="2" cy={y} fill={color}
                  animate={isPlaying ? {
                    cx: cxB,
                    scale: scaleB,
                    opacity: opacityB
                  } : {}}
                  transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
