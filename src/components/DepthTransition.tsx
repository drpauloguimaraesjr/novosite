"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, MotionValue } from "framer-motion";

/**
 * Depth Transition - Creates 3D-like depth transitions between sections
 * Uses layered parallax and scale effects for immersive experience
 */

interface DepthLayerProps {
  children: React.ReactNode;
  depth: number; // 0 = front, higher = further back
  scrollProgress: MotionValue<number>;
}

function DepthLayer({ children, depth, scrollProgress }: DepthLayerProps) {
  // Calculate transforms based on depth
  const scale = useTransform(
    scrollProgress,
    [0, 0.5, 1],
    [1 - depth * 0.05, 1, 1 + depth * 0.05]
  );

  const y = useTransform(
    scrollProgress,
    [0, 1],
    [depth * -50, depth * 50]
  );

  const opacity = useTransform(
    scrollProgress,
    [0, 0.3, 0.7, 1],
    [1, 1, 1 - depth * 0.1, 1 - depth * 0.2]
  );

  const blur = useTransform(
    scrollProgress,
    [0, 0.5, 1],
    [0, depth * 2, depth * 4]
  );

  return (
    <motion.div
      style={{
        scale,
        y,
        opacity,
        filter: blur,
        position: "relative",
        zIndex: 10 - depth,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {children}
    </motion.div>
  );
}

interface Section3DProps {
  children: React.ReactNode;
  className?: string;
  transitionType?: "zoom" | "slide" | "rotate" | "fade" | "flip";
}

export function Section3D({ children, className, transitionType = "zoom" }: Section3DProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const getTransformStyles = () => {
    switch (transitionType) {
      case "zoom":
        return {
          scale: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.9]),
          opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
          y: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -50]),
        };

      case "slide":
        return {
          x: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [-200, 0, 0, 200]),
          opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
          rotateY: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [-15, 0, 0, 15]),
        };

      case "rotate":
        return {
          rotateX: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [45, 0, 0, -45]),
          opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
          scale: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.7, 1, 1, 0.8]),
        };

      case "flip":
        return {
          rotateY: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [90, 0, 0, -90]),
          opacity: useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]),
          scale: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5]),
        };

      case "fade":
      default:
        return {
          opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
          y: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [50, 0, 0, -50]),
        };
    }
  };

  const styles = getTransformStyles();

  return (
    <motion.section
      ref={sectionRef}
      className={className}
      style={{
        ...styles,
        transformStyle: "preserve-3d",
        perspective: "1200px",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </motion.section>
  );
}

interface ParallaxDepthContainerProps {
  children: React.ReactNode;
  className?: string;
  layers?: number;
}

export function ParallaxDepthContainer({
  children,
  className,
  layers = 3,
}: ParallaxDepthContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        perspective: "1500px",
        transformStyle: "preserve-3d",
        position: "relative",
      }}
    >
      <DepthLayer depth={0} scrollProgress={scrollYProgress}>
        {children}
      </DepthLayer>
    </div>
  );
}

/**
 * Page transition wrapper with 3D depth effect
 */
interface PageTransition3DProps {
  children: React.ReactNode;
  isVisible: boolean;
}

export function PageTransition3D({ children, isVisible }: PageTransition3DProps) {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
            rotateX: 10,
            z: -100,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotateX: 0,
            z: 0,
          }}
          exit={{
            opacity: 0,
            scale: 1.1,
            rotateX: -10,
            z: 100,
          }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
            transformOrigin: "center center",
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Scroll-linked camera-like movement
 */
interface CameraScrollProps {
  children: React.ReactNode;
  intensity?: number;
}

export function CameraScroll({ children, intensity = 1 }: CameraScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [5 * intensity, -5 * intensity]);
  const translateZ = useTransform(scrollYProgress, [0, 0.5, 1], [0, 100 * intensity, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      style={{
        rotateX,
        rotateY: mousePos.x * 2 * intensity,
        translateZ,
        transformStyle: "preserve-3d",
        perspective: "2000px",
      }}
    >
      {children}
    </motion.div>
  );
}

export default Section3D;
