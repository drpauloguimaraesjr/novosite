"use client";

import { Carousel, useCarousel } from "motion-plus/react";
import { animate, motion, useMotionValue } from "motion/react";
import { useEffect, useState } from "react";

function AutoplayProgress({ duration }: { duration: number }) {
    const { currentPage, nextPage } = useCarousel();
    const progress = useMotionValue(0);

    useEffect(() => {
        const animation = animate(progress, [0, 1], {
            duration,
            ease: "linear",
            onComplete: nextPage,
        });

        return () => animation.stop();
    }, [duration, nextPage, progress, currentPage]);

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
    if (!data || data.length === 0) return null;

    // Filter items that have "A Clínica" category or just show all in a carousel
    // The user mentioned "fotos da galeria de fotos da clinica"
    // We can filter by cat: "A Clínica" or just use the passed data
    const clinicImages = data;

    return (
        <section className="clinic-carousel-section" style={{ padding: "100px 0", backgroundColor: "#000" }}>
            <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>
                <div style={{ marginBottom: "4rem" }}>
                    <span className="sub-label" style={{ color: "rgba(255,255,255,0.5)" }}>[ VIVÊNCIA ]</span>
                    <h2 style={{ fontSize: "3rem", color: "#fff", marginTop: "1rem", letterSpacing: "-0.04em" }}>Explore o Ambiente</h2>
                </div>

                <div style={{ position: "relative" }}>
                    <Carousel
                        axis="x"
                        className="carousel"
                        items={clinicImages.map((item, index) => (
                            <div key={index} className="carousel-item-wrapper" style={{ padding: "0 20px" }}>
                                <motion.div 
                                    className="photo-container"
                                    style={{ 
                                        borderRadius: "2px", 
                                        overflow: "hidden", 
                                        position: "relative",
                                        aspectRatio: "16/9",
                                        width: "80vw",
                                        maxWidth: "1000px"
                                    }}
                                >
                                    <motion.img
                                        draggable={false}
                                        className="photo"
                                        src={item.img}
                                        alt={item.title}
                                        style={{ 
                                            width: "100%", 
                                            height: "100%", 
                                            objectFit: "cover" 
                                        }}
                                    />
                                    <div className="photo-overlay" style={{ 
                                        position: "absolute", 
                                        bottom: 0, 
                                        left: 0, 
                                        right: 0, 
                                        padding: "40px",
                                        background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                                        color: "#fff"
                                    }}>
                                        <span className="sub-label" style={{ fontSize: "0.6rem", opacity: 0.7 }}>{item.cat}</span>
                                        <h4 style={{ fontSize: "1.2rem", marginTop: "0.5rem", letterSpacing: "-0.02em" }}>{item.title}</h4>
                                        {item.description && (
                                            <p style={{ fontSize: "0.8rem", opacity: 0.5, marginTop: "1rem", maxWidth: "400px", lineHeight: "1.6" }}>
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                        gap={0}
                        snap="center"
                        loop={true}
                        fade={80}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "2rem" }}>
                            <AutoplayProgress duration={5} />
                            <div style={{ display: "flex", gap: "20px" }}>
                                <span className="sub-label" style={{ opacity: 0.3, letterSpacing: "0.2em" }}>DRAG TO EXPLORE</span>
                            </div>
                        </div>
                    </Carousel>
                </div>
            </div>

            <style jsx global>{`
                .carousel {
                    width: 100%;
                }
                .photo-container {
                    cursor: grab;
                }
                .photo-container:active {
                    cursor: grabbing;
                }
                .autoplay-progress {
                    width: 150px;
                    height: 2px;
                    background: rgba(255, 255, 255, 0.1);
                    position: relative;
                    border-radius: 1px;
                }
                .progress-bar {
                    width: 100%;
                    height: 100%;
                    background: white;
                    transform-origin: left;
                    border-radius: 1px;
                }
            `}</style>
        </section>
    );
}
