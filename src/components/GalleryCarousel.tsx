"use client";

import { Carousel, useCarousel } from "motion-plus/react";
import { animate, motion, useMotionValue } from "motion/react";
import { useEffect } from "react";

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

    // Filtrar apenas imagens da categoria "A Clínica" (case-insensitive)
    const clinicImages = data.filter((item) => 
        item.cat && item.cat.toLowerCase() === "a clínica"
    );

    // Se não houver imagens filtradas, usar todas as imagens como fallback
    const imagesToShow = clinicImages.length > 0 ? clinicImages : data;

    if (imagesToShow.length === 0) return null;

    return (
        <section className="clinic-carousel-section" style={{ padding: "100px 0", backgroundColor: "#000" }}>
            <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>
                <div style={{ marginBottom: "4rem" }}>
                    <span className="sub-label" style={{ color: "rgba(255,255,255,0.5)" }}>[ VIVÊNCIA ]</span>
                    <h2 style={{ fontSize: "3rem", color: "#fff", marginTop: "1rem", letterSpacing: "-0.04em" }}>Explore o Ambiente</h2>
                </div>

                <article style={{ width: "100%", maxWidth: "600px", display: "flex", flexDirection: "column", gap: "20px", margin: "0 auto" }}>
                    <Carousel
                        axis="x"
                        className="carousel"
                        items={imagesToShow.map((item, index) => (
                            <motion.div
                                key={index}
                                className="photo-container"
                                style={{
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    position: "relative",
                                    aspectRatio: "4/3",
                                    width: "100%",
                                    maxWidth: "600px",
                                    height: "400px"
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
                        ))}
                        gap={20}
                        snap="page"
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
                </article>

                <style jsx>{`
                    .carousel {
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 20px 50px;
                    }

                    .photo {
                        height: 400px;
                        border-radius: 12px;
                        object-fit: cover;
                    }

                    @media (max-width: 600px) {
                        .photo {
                            height: 250px;
                        }
                    }

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

                    .photo-container {
                        cursor: grab;
                    }
                    .photo-container:active {
                        cursor: grabbing;
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
