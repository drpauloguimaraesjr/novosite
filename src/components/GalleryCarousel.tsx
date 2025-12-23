"use client";

import { animate, motion, useMotionValue } from "motion/react";
import { useEffect, useState } from "react";

function AutoplayProgress({ duration }: { duration: number }) {
    const progress = useMotionValue(0);

    useEffect(() => {
        const animation = animate(progress, [0, 1], {
            duration,
            ease: "linear",
            repeat: Infinity,
        });

        return () => animation.stop();
    }, [duration, progress]);

    return (
        <div className="autoplay-progress">
            <motion.div
                className="progress-bar"
                style={{ scaleX: progress, willChange: "transform" }}
            />
        </div>
    );
}

export default function GalleryCarousel({ data }: { data: any[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    if (!data || data.length === 0) return null;

    const clinicImages = data;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % clinicImages.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + clinicImages.length) % clinicImages.length);
    };

    return (
        <section className="clinic-carousel-section" style={{ padding: "100px 0", backgroundColor: "#000" }}>
            <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>
                <div style={{ marginBottom: "4rem" }}>
                    <span className="sub-label" style={{ color: "rgba(255,255,255,0.5)" }}>[ VIVÊNCIA ]</span>
                    <h2 style={{ fontSize: "3rem", color: "#fff", marginTop: "1rem", letterSpacing: "-0.04em" }}>Explore o Ambiente</h2>
                </div>

                <article style={{ width: "100%", maxWidth: "600px", display: "flex", flexDirection: "column", gap: "20px", margin: "0 auto" }}>
                    <motion.div
                        style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "20px 50px",
                            overflow: "hidden"
                        }}
                    >
                        <motion.div
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragStart={() => setIsDragging(true)}
                            onDragEnd={(event, info) => {
                                setIsDragging(false);
                                const threshold = 50;
                                if (info.offset.x < -threshold) {
                                    nextSlide();
                                } else if (info.offset.x > threshold) {
                                    prevSlide();
                                }
                            }}
                            animate={{ x: -currentIndex * 100 + "%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            style={{
                                display: "flex",
                                width: `${clinicImages.length * 100}%`,
                                cursor: isDragging ? "grabbing" : "grab"
                            }}
                        >
                            {clinicImages.map((image, index) => (
                                <motion.div
                                    key={index}
                                    style={{
                                        flex: "0 0 100%",
                                        padding: "0 20px",
                                        display: "flex",
                                        justifyContent: "center"
                                    }}
                                >
                                    <motion.div
                                        style={{
                                            borderRadius: "12px",
                                            overflow: "hidden",
                                            position: "relative",
                                            aspectRatio: "4/3",
                                            width: "100%",
                                            maxWidth: "600px",
                                            height: "400px"
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.img
                                            src={image.img}
                                            alt={image.title}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover"
                                            }}
                                        />
                                        <div style={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            padding: "40px",
                                            background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                                            color: "#fff"
                                        }}>
                                            <span style={{ fontSize: "0.6rem", opacity: 0.7 }}>{image.cat}</span>
                                            <h4 style={{ fontSize: "1.2rem", marginTop: "0.5rem", letterSpacing: "-0.02em" }}>{image.title}</h4>
                                            {image.description && (
                                                <p style={{ fontSize: "0.8rem", opacity: 0.5, marginTop: "1rem", maxWidth: "400px", lineHeight: "1.6" }}>
                                                    {image.description}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <AutoplayProgress duration={3} />
                        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                            <span style={{ opacity: 0.3, letterSpacing: "0.2em", color: "#fff" }}>DRAG TO EXPLORE</span>
                            <div style={{ display: "flex", gap: "8px" }}>
                                {clinicImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        style={{
                                            width: "8px",
                                            height: "8px",
                                            borderRadius: "50%",
                                            border: "1px solid rgba(255,255,255,0.3)",
                                            backgroundColor: index === currentIndex ? "#fff" : "transparent",
                                            cursor: "pointer"
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </article>

                <style jsx>{`
                    .autoplay-progress {
                        width: 120px;
                        height: 6px;
                        background: rgba(255, 255, 255, 0.3);
                        border-radius: 3px;
                        overflow: hidden;
                        backdrop-filter: blur(10px);
                        z-index: 10;
                        margin-left: 50px;
                    }

                    .progress-bar {
                        width: 100%;
                        height: 100%;
                        background: white;
                        transform-origin: left;
                        border-radius: 3px;
                    }

                    @media (max-width: 600px) {
                        article {
                            max-width: 100% !important;
                        }

                        .autoplay-progress {
                            width: 80px;
                            margin-left: 20px;
                        }
                    }
                `}</style>
            </div>
        </section>
    );
}
