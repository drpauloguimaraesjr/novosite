"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useInView } from "framer-motion";
import ProxyImage from "./ProxyImage";

interface TimelineItem {
    id: string | number;
    title: string;
    description: string;
    date?: string;
    image?: string;
    category?: string;
}

interface VerticalTimelineProps {
    items: TimelineItem[];
    title?: string;
}

export default function VerticalTimeline({ items, title = "Timeline" }: VerticalTimelineProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const isInView = useInView(containerRef, { once: true, margin: "-200px" });

    if (!items || items.length === 0) return null;

    return (
        <section 
            ref={containerRef}
            style={{
                padding: "20vh 40px",
                position: "relative",
                backgroundColor: "#000",
                color: "#fff",
                marginTop: "10vh",
                marginBottom: "10vh"
            }}
        >
            <div style={{ marginBottom: "6rem", maxWidth: "1200px", margin: "0 auto 6rem" }}>
                <span className="sub-label" style={{ opacity: 0.6 }}>[ {title.toUpperCase()} ]</span>
                <h2 style={{ fontSize: "5rem", marginTop: "1rem", letterSpacing: "-0.04em" }}>
                    Como é o nosso trabalho?
                </h2>
            </div>

            <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
                {/* Linha vertical */}
                <motion.div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: 0,
                        bottom: 0,
                        width: "2px",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        transform: "translateX(-50%)"
                    }}
                >
                    <motion.div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#fff",
                            scaleY: scrollYProgress,
                            transformOrigin: "top"
                        }}
                    />
                </motion.div>

                {/* Items */}
                <div style={{ position: "relative" }}>
                    {items.map((item, index) => (
                        <TimelineItemComponent
                            key={item.id}
                            item={item}
                            index={index}
                            isInView={isInView}
                            isEven={index % 2 === 0}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TimelineItemComponent({ 
    item, 
    index, 
    isInView,
    isEven 
}: {
    item: TimelineItem;
    index: number;
    isInView: boolean;
    isEven: boolean;
}) {
    const itemRef = useRef<HTMLDivElement>(null);
    const itemInView = useInView(itemRef, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={itemRef}
            initial={{ opacity: 1, x: 0 }}
            animate={{ 
                opacity: 1, 
                x: 0,
                transition: { 
                    duration: 0.8, 
                    delay: itemInView ? index * 0.15 : 0,
                    ease: [0.25, 0.1, 0.25, 1]
                }
            }}
            style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8rem",
                flexDirection: isEven ? "row" : "row-reverse",
                gap: "60px",
                opacity: 1
            }}
        >
            {/* Conteúdo */}
            <div style={{ flex: 1, maxWidth: "500px" }}>
                {item.date && (
                    <span className="sub-label" style={{ opacity: 0.5, fontSize: "0.7rem" }}>
                        {item.date}
                    </span>
                )}
                <h3 style={{ 
                    fontSize: "2.5rem", 
                    marginTop: "1rem",
                    marginBottom: "1rem",
                    letterSpacing: "-0.03em"
                }}>
                    {item.title}
                </h3>
                <p style={{ 
                    fontSize: "1.1rem", 
                    lineHeight: "1.6", 
                    opacity: 0.7 
                }}>
                    {item.description}
                </p>
                {item.category && (
                    <div style={{ marginTop: "1.5rem" }}>
                        <span className="sub-label" style={{ opacity: 0.6 }}>
                            [ {item.category.toUpperCase()} ]
                        </span>
                    </div>
                )}
            </div>

            {/* Ponto na linha */}
            <div style={{
                position: "absolute",
                left: "50%",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#fff",
                border: "4px solid #000",
                transform: "translateX(-50%)",
                zIndex: 10
            }} />

            {/* Imagem (se houver) */}
            {item.image && (
                <motion.div
                    style={{
                        flex: 1,
                        maxWidth: "400px",
                        aspectRatio: "4/3",
                        borderRadius: "12px",
                        overflow: "hidden"
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <ProxyImage
                        src={item.image}
                        alt={item.title}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }}
                    />
                </motion.div>
            )}
        </motion.div>
    );
}

