"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "@/lib/gsap/ScrollTrigger";

interface PlaygroundItem {
  id: string | number;
  number: string;
  title: string;
  description?: string;
  images: string[];
  category?: string;
}

interface PlaygroundProps {
  items: PlaygroundItem[];
  title?: string;
}

export default function Playground({ items, title = "Playground" }: PlaygroundProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  if (!items || items.length === 0) return null;

  return (
    <section 
      ref={sectionRef}
      style={{
        padding: "20vh 40px",
        backgroundColor: "var(--bg-color)",
        position: "relative",
        zIndex: 2,
        marginTop: "10vh",
        marginBottom: "10vh"
      }}
    >
      <div style={{ marginBottom: "8rem", maxWidth: "1200px", margin: "0 auto 8rem" }}>
        <span className="sub-label" style={{ opacity: 0.6 }}>[ {title.toUpperCase()} ]</span>
        <h2 style={{ 
          fontSize: "clamp(3rem, 8vw, 6rem)", 
          marginTop: "1rem",
          letterSpacing: "-0.04em",
          fontWeight: 500
        }}>
          {title}
        </h2>
        <p style={{ 
          fontSize: "clamp(1rem, 1.5vw, 1.3rem)",
          marginTop: "2rem",
          maxWidth: "800px",
          lineHeight: "1.6",
          opacity: 0.7
        }}>
          A PLACE TO SHOWCASE CONCEPTS, SIDE-PROJECTS, EXPERIMENTS, UNUSED DESIGNS, COLLABS, OLDER CONTENT... TO SUM UP, DESIGNS THAT DESERVE A SECOND LIFE
        </p>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {items.map((item, index) => (
          <PlaygroundItem
            key={item.id}
            item={item}
            index={index}
            isInView={isInView}
          />
        ))}
      </div>
    </section>
  );
}

function PlaygroundItem({ 
  item, 
  index, 
  isInView 
}: {
  item: PlaygroundItem;
  index: number;
  isInView: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemInView = useInView(containerRef, { once: true, margin: "-150px" });

  useEffect(() => {
    if (!itemInView) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Animação de entrada
      gsap.from(containerRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [itemInView]);

  return (
    <div
      ref={containerRef}
      style={{
        marginBottom: "15vh",
        paddingBottom: "15vh",
        borderBottom: index < item.images.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none"
      }}
    >
      {/* Número da seção */}
      <div style={{ marginBottom: "4rem" }}>
        <span className="sub-label" style={{ fontSize: "0.8rem", opacity: 0.4 }}>
          [{item.number}]
        </span>
      </div>

      {/* Título */}
      {item.title && (
        <h3 style={{
          fontSize: "clamp(2rem, 5vw, 4rem)",
          marginBottom: "3rem",
          letterSpacing: "-0.03em",
          fontWeight: 500
        }}>
          {item.title}
        </h3>
      )}

      {/* Grid de imagens */}
      <div style={{
        display: "grid",
        gridTemplateColumns: item.images.length === 1 
          ? "1fr" 
          : item.images.length === 2 
          ? "1fr 1fr" 
          : "repeat(2, 1fr)",
        gap: "20px",
        marginBottom: "2rem"
      }}>
        {item.images.map((image, imgIndex) => (
          <LensImage
            key={imgIndex}
            src={image}
            isMain={imgIndex === 0 && item.images.length > 1}
          />
        ))}
      </div>

      {/* Descrição */}
      {item.description && (
        <p style={{
          fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)",
          lineHeight: "1.6",
          opacity: 0.6,
          maxWidth: "600px",
          marginTop: "2rem"
        }}>
          {item.description}
        </p>
      )}
    </div>
  );
}

function LensImage({ src, isMain = false }: { src: string; isMain?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Normalizar para -1 a 1
    const normalizedX = mouseX / (rect.width / 2);
    const normalizedY = mouseY / (rect.height / 2);
    
    // Calcular distância do centro
    const distance = Math.hypot(normalizedX, normalizedY);
    const maxDistance = 1;
    
    if (distance < maxDistance && isHovered) {
      // Efeito de lente: zoom baseado na distância do centro
      const zoomPower = 1 - (distance / maxDistance);
      const zoomAmount = 1 + (zoomPower * 0.3); // Zoom até 1.3x
      
      // Movimento suave em direção ao mouse
      const moveX = normalizedX * 20 * zoomPower;
      const moveY = normalizedY * 20 * zoomPower;
      
      x.set(moveX);
      y.set(moveY);
      scale.set(zoomAmount);
    } else {
      x.set(0);
      y.set(0);
      scale.set(1);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        aspectRatio: isMain ? "16/9" : "4/3",
        overflow: "hidden",
        position: "relative",
        cursor: "zoom-in",
        backgroundColor: "rgba(0,0,0,0.02)"
      }}
      whileHover={{ 
        transition: { duration: 0.3 }
      }}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          x: springX,
          y: springY,
          scale: springScale
        }}
      />
    </motion.div>
  );
}

