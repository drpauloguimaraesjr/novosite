"use client";

import { Carousel } from "motion-plus/react";
import { useState, useEffect, useRef, useCallback } from "react";
import GalleryModal from "./GalleryModal";
import ProxyImage from "./ProxyImage";

// Hook to detect mobile
function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= breakpoint);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, [breakpoint]);

    return isMobile;
}

// =============================================
// MOBILE GALLERY — Swipe fullscreen, minimalista
// =============================================
function MobileGallery({ images }: { images: any[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fullscreenScrollRef = useRef<HTMLDivElement>(null);

    // Detect current slide from scroll position
    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const scrollLeft = container.scrollLeft;
        const itemWidth = container.clientWidth;
        const index = Math.round(scrollLeft / itemWidth);
        setCurrentIndex(Math.max(0, Math.min(index, images.length - 1)));
    }, [images.length]);

    // Open fullscreen
    const openFullscreen = (index: number) => {
        setFullscreenIndex(index);
        document.body.style.overflow = "hidden";
    };

    // Close fullscreen
    const closeFullscreen = () => {
        setFullscreenIndex(null);
        document.body.style.overflow = "";
    };

    // Scroll fullscreen to correct position when opening
    useEffect(() => {
        if (fullscreenIndex !== null && fullscreenScrollRef.current) {
            const container = fullscreenScrollRef.current;
            container.scrollTo({ left: fullscreenIndex * container.clientWidth, behavior: "instant" });
        }
    }, [fullscreenIndex]);

    // Handle fullscreen swipe tracking
    const handleFullscreenScroll = useCallback(() => {
        if (!fullscreenScrollRef.current) return;
        const container = fullscreenScrollRef.current;
        const scrollLeft = container.scrollLeft;
        const itemWidth = container.clientWidth;
        const index = Math.round(scrollLeft / itemWidth);
        setFullscreenIndex(Math.max(0, Math.min(index, images.length - 1)));
    }, [images.length]);

    // Scroll to dot
    const scrollToDot = (index: number) => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTo({
            left: index * scrollRef.current.clientWidth,
            behavior: "smooth"
        });
    };

    return (
        <>
            <section className="mobile-gallery-section">
                <div className="mobile-gallery-header">
                    <span className="sub-label" style={{ color: "rgba(255,255,255,0.5)" }}>[ VIVÊNCIA ]</span>
                    <h2 style={{ fontSize: "clamp(1.5rem, 6vw, 2rem)", color: "#fff", marginTop: "0.75rem", letterSpacing: "-0.03em" }}>
                        Explore o Ambiente
                    </h2>
                </div>

                {/* Swipeable Carousel */}
                <div
                    ref={scrollRef}
                    className="mobile-gallery-scroll"
                    onScroll={handleScroll}
                >
                    {images.map((item, index) => (
                        <div key={index} className="mobile-gallery-slide" onClick={() => openFullscreen(index)}>
                            <div className="mobile-gallery-image-wrapper">
                                <ProxyImage
                                    className="mobile-gallery-img"
                                    src={item.img}
                                    alt={item.title}
                                    style={{ aspectRatio: "4/3" }}
                                />
                                <div className="mobile-gallery-gradient" />
                            </div>
                            <div className="mobile-gallery-info">
                                <span className="mobile-gallery-cat">{item.cat}</span>
                                <h4 className="mobile-gallery-title">{item.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dots */}
                <div className="mobile-gallery-dots">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`mobile-gallery-dot ${index === currentIndex ? "active" : ""}`}
                            onClick={() => scrollToDot(index)}
                            aria-label={`Foto ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Counter */}
                <div className="mobile-gallery-counter">
                    {String(currentIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                </div>
            </section>

            {/* Fullscreen Overlay */}
            {fullscreenIndex !== null && (
                <div className="mobile-fullscreen-overlay" onClick={closeFullscreen}>
                    <button className="mobile-fullscreen-close" onClick={closeFullscreen} aria-label="Fechar">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                        </svg>
                    </button>

                    <div
                        ref={fullscreenScrollRef}
                        className="mobile-fullscreen-scroll"
                        onScroll={handleFullscreenScroll}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {images.map((item, index) => (
                            <div key={index} className="mobile-fullscreen-slide">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="mobile-fullscreen-img"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        if (!target.src.includes('/api/image')) {
                                            target.src = `/api/image?url=${encodeURIComponent(item.img)}`;
                                        }
                                    }}
                                />
                                <div className="mobile-fullscreen-info">
                                    <span>{item.cat}</span>
                                    <h4>{item.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Fullscreen dots */}
                    <div className="mobile-fullscreen-dots">
                        {images.map((_, index) => (
                            <div
                                key={index}
                                className={`mobile-gallery-dot ${index === fullscreenIndex ? "active" : ""}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            <MobileGalleryStyles />
        </>
    );
}

function MobileGalleryStyles() {
    return (
        <style jsx global>{`
            .mobile-gallery-section {
                background: #000;
                padding: 10vh 0 8vh;
                margin: 5vh 0;
                position: relative;
                overflow: hidden;
            }

            .mobile-gallery-header {
                padding: 0 20px;
                margin-bottom: 2rem;
            }

            .mobile-gallery-scroll {
                display: flex;
                overflow-x: auto;
                scroll-snap-type: x mandatory;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none;
                -ms-overflow-style: none;
                gap: 0;
            }

            .mobile-gallery-scroll::-webkit-scrollbar {
                display: none;
            }

            .mobile-gallery-slide {
                flex: 0 0 100%;
                scroll-snap-align: center;
                padding: 0 16px;
                box-sizing: border-box;
                cursor: pointer;
            }

            .mobile-gallery-image-wrapper {
                position: relative;
                border-radius: 16px;
                overflow: hidden;
            }

            .mobile-gallery-img {
                width: 100%;
                height: auto;
                aspect-ratio: 4/3;
                object-fit: cover;
                display: block;
            }

            .mobile-gallery-gradient {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 40%;
                background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
                pointer-events: none;
            }

            .mobile-gallery-info {
                padding: 12px 4px 0;
                color: #fff;
            }

            .mobile-gallery-cat {
                font-size: 0.6rem;
                text-transform: uppercase;
                letter-spacing: 0.12em;
                opacity: 0.5;
                font-weight: 600;
            }

            .mobile-gallery-title {
                font-size: 1rem;
                font-weight: 500;
                margin-top: 4px;
                letter-spacing: -0.02em;
                line-height: 1.3;
            }

            .mobile-gallery-dots {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-top: 1.5rem;
                padding: 0 20px;
            }

            .mobile-gallery-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                border: none;
                background: rgba(255, 255, 255, 0.25);
                transition: all 0.3s ease;
                padding: 0;
                cursor: pointer;
            }

            .mobile-gallery-dot.active {
                background: #fff;
                width: 20px;
                border-radius: 3px;
            }

            .mobile-gallery-counter {
                text-align: center;
                margin-top: 0.75rem;
                color: rgba(255, 255, 255, 0.35);
                font-size: 0.7rem;
                font-family: monospace;
                letter-spacing: 0.1em;
            }

            /* ======= FULLSCREEN OVERLAY ======= */
            .mobile-fullscreen-overlay {
                position: fixed;
                inset: 0;
                background: #000;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            .mobile-fullscreen-close {
                position: absolute;
                top: 16px;
                right: 16px;
                z-index: 10001;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                cursor: pointer;
            }

            .mobile-fullscreen-scroll {
                display: flex;
                overflow-x: auto;
                scroll-snap-type: x mandatory;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none;
                width: 100%;
                height: 100%;
                align-items: center;
            }

            .mobile-fullscreen-scroll::-webkit-scrollbar {
                display: none;
            }

            .mobile-fullscreen-slide {
                flex: 0 0 100%;
                scroll-snap-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                padding: 60px 16px 100px;
                box-sizing: border-box;
            }

            .mobile-fullscreen-img {
                max-width: 100%;
                max-height: 70vh;
                object-fit: contain;
                border-radius: 8px;
            }

            .mobile-fullscreen-info {
                color: #fff;
                text-align: center;
                margin-top: 16px;
            }

            .mobile-fullscreen-info span {
                font-size: 0.6rem;
                text-transform: uppercase;
                letter-spacing: 0.12em;
                opacity: 0.5;
            }

            .mobile-fullscreen-info h4 {
                font-size: 1.1rem;
                margin-top: 6px;
                font-weight: 500;
            }

            .mobile-fullscreen-dots {
                position: absolute;
                bottom: 40px;
                left: 0;
                right: 0;
                display: flex;
                justify-content: center;
                gap: 6px;
            }
        `}</style>
    );
}

// =============================================
// DESKTOP GALLERY — Original (intocado)
// =============================================
export default function GalleryCarousel({ data }: { data: any[] }) {
    const isMobile = useIsMobile();
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!data || data.length === 0) {
        return null;
    }

    // Filtrar apenas imagens da categoria "A Clínica" (case-insensitive)
    const clinicImages = data.filter((item) =>
        item.cat && item.cat.toLowerCase() === "a clínica"
    );

    const imagesToShow = clinicImages.length > 0 ? clinicImages : data;

    if (imagesToShow.length === 0) {
        return null;
    }

    // ========== MOBILE: Render minimalista ==========
    if (isMobile) {
        return <MobileGallery images={imagesToShow} />;
    }

    // ========== DESKTOP: Render original (intocado) ==========
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
                                <ProxyImage
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

            {/* Modal - Desktop only */}
            {selectedImageIndex !== null && (
                <GalleryModal
                    images={imagesToShow}
                    initialIndex={selectedImageIndex}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}

            <DesktopStylesheet />
        </>
    );
}

function DesktopStylesheet() {
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
        `}</style>
    );
}
