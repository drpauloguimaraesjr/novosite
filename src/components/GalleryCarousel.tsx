"use client";

import { Carousel } from "motion-plus/react";
import { useState } from "react";
import GalleryModal from "./GalleryModal";

export default function GalleryCarousel({ data }: { data: any[] }) {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!data || data.length === 0) return null;

    // Filtrar apenas imagens da categoria "A Clínica" (case-insensitive)
    const clinicImages = data.filter((item) => 
        item.cat && item.cat.toLowerCase() === "a clínica"
    );

    // Se não houver imagens filtradas, usar todas as imagens como fallback
    const imagesToShow = clinicImages.length > 0 ? clinicImages : data;

    if (imagesToShow.length === 0) return null;

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <section className="clinic-carousel-section" style={{ padding: "20vh 0", backgroundColor: "#000", marginTop: "10vh", marginBottom: "10vh" }}>
                <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>
                    <div style={{ marginBottom: "4rem" }}>
                        <span className="sub-label" style={{ color: "rgba(255,255,255,0.5)" }}>[ VIVÊNCIA ]</span>
                        <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "#fff", marginTop: "1rem", letterSpacing: "-0.04em" }}>Explore o Ambiente</h2>
                    </div>

                    <Carousel
                        className="carousel"
                        items={imagesToShow.map((item, index) => (
                            <div
                                key={index}
                                className="photo-container"
                                style={{
                                    position: "relative",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    cursor: "pointer"
                                }}
                                onClick={() => handleImageClick(index)}
                            >
                                <img
                                    draggable={false}
                                    className="photo"
                                    src={item.img}
                                    alt={item.title}
                                    style={{ aspectRatio: "4/3" }}
                                />
                                <div className="photo-overlay" style={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    padding: "40px",
                                    background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                                    color: "#fff",
                                    pointerEvents: "none"
                                }}>
                                    <span className="sub-label" style={{ fontSize: "0.6rem", opacity: 0.7 }}>{item.cat}</span>
                                    <h4 style={{ fontSize: "1.2rem", marginTop: "0.5rem", letterSpacing: "-0.02em" }}>{item.title}</h4>
                                    {item.description && (
                                        <p style={{ fontSize: "0.8rem", opacity: 0.5, marginTop: "1rem", maxWidth: "400px", lineHeight: "1.6" }}>
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                        overflow
                        gap={20}
                        snap={false}
                    />
                </div>
            </section>

            {/* Modal */}
            {selectedImageIndex !== null && (
                <GalleryModal
                    images={imagesToShow}
                    initialIndex={selectedImageIndex}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}

            <Stylesheet />
        </>
    );
}

function Stylesheet() {
    return (
        <style jsx global>{`
            body {
                overflow-x: clip;
            }

            .clinic-carousel-section .carousel {
                width: 100%;
                max-width: 800px;
                margin: 0 auto;
            }

            .clinic-carousel-section .photo {
                height: 300px;
                border-radius: 12px;
                object-fit: cover;
                width: 100%;
                display: block;
            }

            .clinic-carousel-section .photo-container {
                cursor: grab;
                user-select: none;
            }

            .clinic-carousel-section .photo-container:active {
                cursor: grabbing;
            }

            @media (max-width: 768px) {
                .clinic-carousel-section .photo {
                    height: 250px;
                }

                .clinic-carousel-section .photo-overlay {
                    padding: 30px 20px !important;
                }

                .clinic-carousel-section .photo-overlay h4 {
                    font-size: 1rem !important;
                }

                .clinic-carousel-section .photo-overlay p {
                    font-size: 0.7rem !important;
                }
            }

            @media (max-width: 480px) {
                .clinic-carousel-section .photo {
                    height: 200px;
                }
            }
        `}</style>
    );
}
