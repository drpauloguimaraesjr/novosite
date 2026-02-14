"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Realistic Cards - Premium cards with realistic lighting, depth, and reflections
 * Uses CSS 3D transforms with dynamic lighting based on mouse position
 */

interface RealisticCardProps {
  children: React.ReactNode;
  className?: string;
  glareColor?: string;
  shadowColor?: string;
  borderGlow?: boolean;
  reflective?: boolean;
}

export function RealisticCard({
  children,
  className = "",
  glareColor = "rgba(255, 255, 255, 0.4)",
  shadowColor = "rgba(0, 0, 0, 0.3)",
  borderGlow = true,
  reflective = true,
}: RealisticCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
    stiffness: 150,
    damping: 20,
  });

  // Glare position
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), {
    stiffness: 100,
    damping: 15,
  });
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), {
    stiffness: 100,
    damping: 15,
  });

  // Shadow offset
  const shadowX = useTransform(mouseX, [-0.5, 0.5], [20, -20]);
  const shadowY = useTransform(mouseY, [-0.5, 0.5], [20, -20]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`realistic-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px",
        cursor: "pointer",
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ scale: { duration: 0.3 } }}
    >
      {/* Card content with depth */}
      <motion.div
        style={{
          position: "relative",
          borderRadius: "16px",
          overflow: "hidden",
          background: "linear-gradient(145deg, rgba(30, 30, 30, 0.9), rgba(20, 20, 20, 0.95))",
          backdropFilter: "blur(20px)",
          border: borderGlow ? "1px solid rgba(74, 222, 128, 0.2)" : "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: isHovered
            ? `${shadowX.get()}px ${shadowY.get()}px 40px ${shadowColor}, 
               0 0 30px rgba(74, 222, 128, 0.1),
               inset 0 0 60px rgba(74, 222, 128, 0.03)`
            : `0 10px 30px ${shadowColor}`,
          transition: "box-shadow 0.3s ease",
        }}
      >
        {children}

        {/* Glare effect */}
        {reflective && (
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(
                circle at ${glareX.get()}% ${glareY.get()}%,
                ${glareColor} 0%,
                transparent 50%
              )`,
              pointerEvents: "none",
              opacity: isHovered ? 0.6 : 0,
              transition: "opacity 0.3s ease",
              mixBlendMode: "overlay",
            }}
          />
        )}

        {/* Ambient border glow */}
        {borderGlow && isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              top: -1,
              left: -1,
              right: -1,
              bottom: -1,
              borderRadius: "17px",
              background: "linear-gradient(45deg, rgba(74, 222, 128, 0.3), transparent, rgba(34, 197, 94, 0.3))",
              zIndex: -1,
              filter: "blur(8px)",
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

interface ServiceCardProps {
  title: string;
  description: string;
  image?: string;
  icon?: React.ReactNode;
  category?: string;
  index?: number;
}

export function ServiceCard({
  title,
  description,
  image,
  icon,
  category,
  index = 0,
}: ServiceCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <RealisticCard className="service-card">
      <div style={{ padding: "0" }}>
        {/* Image with parallax depth */}
        {image && (
          <div
            style={{
              position: "relative",
              height: "200px",
              overflow: "hidden",
              borderRadius: "16px 16px 0 0",
            }}
          >
            <motion.img
              src={image}
              alt={title}
              onLoad={() => setImageLoaded(true)}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: imageLoaded ? 1 : 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {/* Image overlay gradient */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "60%",
                background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                pointerEvents: "none",
              }}
            />

            {/* Category badge */}
            {category && (
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  padding: "6px 12px",
                  background: "rgba(74, 222, 128, 0.2)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  color: "#4ade80",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {category}
              </motion.span>
            )}
          </div>
        )}

        {/* Content */}
        <div style={{ padding: "24px" }}>
          {/* Icon */}
          {icon && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(34, 197, 94, 0.1))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
                color: "#4ade80",
              }}
            >
              {icon}
            </motion.div>
          )}

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.05 }}
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "#fff",
              marginBottom: "12px",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            style={{
              fontSize: "0.9rem",
              color: "rgba(255, 255, 255, 0.6)",
              lineHeight: 1.6,
            }}
          >
            {description}
          </motion.p>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
            style={{
              height: "2px",
              background: "linear-gradient(90deg, #4ade80, transparent)",
              marginTop: "20px",
              transformOrigin: "left",
            }}
          />
        </div>
      </div>
    </RealisticCard>
  );
}

interface GalleryCardProps {
  image: string;
  title: string;
  category?: string;
  onClick?: () => void;
}

export function GalleryCard({ image, title, category, onClick }: GalleryCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <RealisticCard className="gallery-card" glareColor="rgba(74, 222, 128, 0.3)">
      <div
        onClick={onClick}
        style={{
          position: "relative",
          aspectRatio: "4/3",
          overflow: "hidden",
          borderRadius: "16px",
          cursor: onClick ? "pointer" : "default",
        }}
      >
        <motion.img
          src={image}
          alt={title}
          onLoad={() => setImageLoaded(true)}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: imageLoaded ? 1 : 0 }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5 }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "24px",
          }}
        >
          {category && (
            <span
              style={{
                fontSize: "0.65rem",
                color: "#4ade80",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              {category}
            </span>
          )}
          <h4
            style={{
              fontSize: "1.1rem",
              fontWeight: 500,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h4>
        </motion.div>

        {/* Shine effect on hover */}
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          whileHover={{ x: "200%", opacity: 0.3 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            transform: "skewX(-20deg)",
            pointerEvents: "none",
          }}
        />
      </div>
    </RealisticCard>
  );
}

export default RealisticCard;
