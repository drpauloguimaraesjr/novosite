"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useInView } from "framer-motion";

interface FloatingCard {
    id: string | number;
    title: string;
    category?: string;
    image: string;
    description?: string;
}

interface FloatingCardsProps {
    items: FloatingCard[];
    columns?: number;
}

export default function FloatingCards({ items, columns = 3 }: FloatingCardsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    if (!items || items.length === 0) return null;

    return (
        <section 
            ref={containerRef}
            style={{ 
                padding: "20vh 40px",
                position: "relative",
                zIndex: 2,
                marginTop: "10vh",
                marginBottom: "10vh"
            }}
        >
            <div style={{ marginBottom: "6rem" }}>
                <span className="sub-label">[ FLOATING GALLERY ]</span>
            </div>

            <div 
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap: "40px",
                    width: "100%"
                }}
            >
                {items.map((item, index) => (
                    <FloatingCardItem
                        key={item.id}
                        item={item}
                        index={index}
                        isInView={isInView}
                        isHovered={hoveredIndex === index}
                        onHover={() => setHoveredIndex(index)}
                        onLeave={() => setHoveredIndex(null)}
                    />
                ))}
            </div>
        </section>
    );
}

function FloatingCardItem({ 
    item, 
    index, 
    isInView, 
    isHovered,
    onHover,
    onLeave 
}: {
    item: FloatingCard;
    index: number;
    isInView: boolean;
    isHovered: boolean;
    onHover: () => void;
    onLeave: () => void;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = (e.clientX - centerX) / rect.width;
        const mouseY = (e.clientY - centerY) / rect.height;
        x.set(mouseX);
        y.set(mouseY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        onLeave();
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1]
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={onHover}
            style={{
                perspective: "1000px",
                cursor: "pointer"
            }}
        >
            <motion.div
                animate={{
                    scale: isHovered ? 1.05 : 1
                }}
                transition={{ duration: 0.3 }}
                style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    position: "relative",
                    aspectRatio: "4/3",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    transformStyle: "preserve-3d",
                    rotateX,
                    rotateY
                }}
            >
                <motion.img
                    src={item.image}
                    alt={item.title}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "30px",
                        background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
                        color: "#fff"
                    }}
                >
                    {item.category && (
                        <span className="sub-label" style={{ fontSize: "0.6rem", opacity: 0.7 }}>
                            {item.category}
                        </span>
                    )}
                    <h4 style={{ fontSize: "1.2rem", marginTop: "0.5rem", letterSpacing: "-0.02em" }}>
                        {item.title}
                    </h4>
                    {item.description && (
                        <p style={{ fontSize: "0.8rem", opacity: 0.6, marginTop: "0.5rem", lineHeight: "1.4" }}>
                            {item.description}
                        </p>
                    )}
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

