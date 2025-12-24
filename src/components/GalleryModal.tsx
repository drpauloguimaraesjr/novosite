"use client";

import { Carousel, useCarousel } from "motion-plus/react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

interface GalleryImage {
    id: number;
    title: string;
    cat: string;
    img: string;
    description?: string;
}

interface GalleryModalProps {
    images: GalleryImage[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}


function MainImage({ image }: { image: GalleryImage }) {
    return (
        <div className="main-image-container">
            <img
                draggable={false}
                className="main-photo"
                src={image.img}
                alt={image.title}
            />
            <div className="main-image-info">
                <span className="sub-label" style={{ fontSize: "0.7rem", opacity: 0.7 }}>
                    {image.cat}
                </span>
                <h3 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", marginTop: "1rem", letterSpacing: "-0.02em" }}>
                    {image.title}
                </h3>
                {image.description && (
                    <p style={{ fontSize: "clamp(0.9rem, 1.2vw, 1rem)", opacity: 0.6, marginTop: "1.5rem", lineHeight: "1.6", maxWidth: "500px" }}>
                        {image.description}
                    </p>
                )}
            </div>
        </div>
    );
}

function SidebarNavigation({ onPageChange, initialPage }: { onPageChange: (page: number) => void; initialPage: number }) {
    const { currentPage, totalPages, nextPage, prevPage, goToPage } = useCarousel();

    // Sincronizar com a página inicial quando o componente montar
    useEffect(() => {
        if (currentPage !== initialPage) {
            goToPage(initialPage);
            onPageChange(initialPage);
        }
    }, []); // Apenas na montagem

    // Notificar quando a página mudar
    useEffect(() => {
        onPageChange(currentPage);
    }, [currentPage, onPageChange]);

    return (
        <div className="navigation">
            <motion.button
                className={`nav-button ${currentPage === 0 ? "disabled" : ""}`}
                onClick={prevPage}
                disabled={currentPage === 0}
                whileHover={{ scale: currentPage === 0 ? 1 : 1.1 }}
                whileTap={{ scale: currentPage === 0 ? 1 : 0.9 }}
            >
                <ChevronUpIcon />
            </motion.button>

            <div className="dots">
                {Array.from({ length: totalPages }).map((_, index) => (
                    <div
                        key={index}
                        className={`dot ${index === currentPage ? "active" : ""}`}
                        onClick={() => goToPage(index)}
                        style={{ cursor: "pointer" }}
                    />
                ))}
            </div>

            <motion.button
                className={`nav-button ${currentPage === totalPages - 1 ? "disabled" : ""}`}
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                whileHover={{ scale: currentPage === totalPages - 1 ? 1 : 1.1 }}
                whileTap={{ scale: currentPage === totalPages - 1 ? 1 : 0.9 }}
                style={{ willChange: "transform" }}
            >
                <ChevronDownIcon />
            </motion.button>
        </div>
    );
}

function SidebarPhotoItem({ image, index, isSelected }: { image: GalleryImage; index: number; isSelected: boolean }) {
    return (
        <motion.div
            className={`sidebar-photo-wrapper ${isSelected ? "selected" : ""}`}
            initial={false}
            animate={{
                scale: isSelected ? 1.05 : 1,
                opacity: isSelected ? 1 : 0.5
            }}
            transition={{ duration: 0.3 }}
        >
            <img
                draggable={false}
                className="sidebar-photo"
                src={image.img}
                alt={image.title}
                style={{ aspectRatio: "4/3" }}
            />
        </motion.div>
    );
}

function SidebarCarousel({ images, onPageChange, initialPage, currentSelectedPage, carouselKey }: { images: GalleryImage[]; onPageChange: (page: number) => void; initialPage: number; currentSelectedPage: number; carouselKey: number }) {
    return (
        <Carousel
            key={`carousel-${carouselKey}-${initialPage}`}
            className="sidebar-carousel"
            items={images.map((image, index) => (
                <SidebarPhotoItem
                    key={image.id}
                    image={image}
                    index={index}
                    isSelected={index === currentSelectedPage}
                />
            ))}
            gap={20}
            snap="page"
            loop={false}
            axis="y"
            overflow
        >
            <SidebarNavigation onPageChange={onPageChange} initialPage={initialPage} />
        </Carousel>
    );
}

export default function GalleryModal({ images, initialIndex, isOpen, onClose }: GalleryModalProps) {
    const [currentPage, setCurrentPage] = useState(initialIndex);
    const [carouselKey, setCarouselKey] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setCurrentPage(initialIndex);
            // Forçar re-render do carrossel para começar na página correta
            setCarouselKey(prev => prev + 1);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, initialIndex]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleEscape);
        }

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen || images.length === 0) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="gallery-modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="gallery-modal"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        {/* Close Button */}
                        <button
                            className="gallery-modal-close"
                            onClick={onClose}
                            aria-label="Fechar"
                        >
                            <CloseIcon />
                        </button>

                        <div className="gallery-modal-content">
                            {/* Imagem Principal à Esquerda */}
                            <div className="gallery-main-image">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentPage}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <MainImage image={images[currentPage]} />
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Carrossel Vertical à Direita */}
                            <div className="gallery-sidebar">
                                <SidebarCarousel 
                                    images={images} 
                                    onPageChange={setCurrentPage}
                                    initialPage={initialIndex}
                                    currentSelectedPage={currentPage}
                                    carouselKey={carouselKey}
                                />
                            </div>
                        </div>
                    </motion.div>

                    <Stylesheet />
                </>
            )}
        </AnimatePresence>
    );
}

function ChevronUpIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 15l-6-6-6 6" />
        </svg>
    );
}

function ChevronDownIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 9l6 6 6-6" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
        </svg>
    );
}

function Stylesheet() {
    return (
        <style jsx global>{`
            .gallery-modal-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(10px);
                z-index: 9998;
            }

            .gallery-modal {
                position: fixed;
                inset: 0;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 40px;
                pointer-events: none;
            }

            .gallery-modal-content {
                display: grid;
                grid-template-columns: 1fr 400px;
                gap: 40px;
                width: 100%;
                max-width: 1400px;
                height: 90vh;
                pointer-events: all;
            }

            .gallery-modal-close {
                position: absolute;
                top: 40px;
                right: 40px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: white;
                transition: all 0.3s ease;
                z-index: 10000;
                pointer-events: all;
            }

            .gallery-modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }

            .gallery-main-image {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .main-carousel {
                width: 100%;
                height: 100%;
                position: relative;
            }

            .main-image-container {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                position: relative;
            }

            .main-photo {
                width: 100%;
                height: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 12px;
                flex: 1;
            }

            .main-image-info {
                color: white;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 2rem;
                background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
                border-radius: 0 0 12px 12px;
            }

            .gallery-sidebar {
                width: 100%;
                height: 100%;
                position: relative;
            }

            .sidebar-carousel {
                width: 100%;
                height: 100%;
                position: relative;
            }

            .sidebar-photo-wrapper {
                position: relative;
                border-radius: 12px;
                overflow: hidden;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }

            .sidebar-photo-wrapper.selected {
                border: 2px solid white;
                box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
                z-index: 10;
            }

            .sidebar-photo {
                width: 100%;
                height: 300px;
                border-radius: 10px;
                object-fit: cover;
                cursor: pointer;
                display: block;
            }

            .sidebar-photo-wrapper:not(.selected) {
                filter: grayscale(0.3);
            }

            .sidebar-photo-wrapper:not(.selected):hover {
                opacity: 0.8;
                filter: grayscale(0.1);
            }

            .navigation {
                position: absolute;
                right: -80px;
                top: 50%;
                transform: translateY(-50%);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 12px;
                padding: 12px 8px;
                background: rgba(0, 0, 0, 0.6);
                border-radius: 24px;
                backdrop-filter: blur(10px);
                z-index: 10;
            }

            .nav-button {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 4px;
                transition: opacity 0.2s ease;
            }

            .nav-button.disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }

            .nav-button:not(.disabled):hover {
                opacity: 0.8;
            }

            .dots {
                display: flex;
                flex-direction: column;
                gap: 8px;
                align-items: center;
            }

            .dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.4);
                transition: background-color 0.2s ease;
            }

            .dot.active {
                background: white;
            }

            @media (max-width: 1024px) {
                .gallery-modal-content {
                    grid-template-columns: 1fr;
                    gap: 30px;
                }

                .gallery-sidebar {
                    height: 300px;
                }

                .navigation {
                    right: 20px;
                    top: auto;
                    bottom: -80px;
                    transform: none;
                    flex-direction: row;
                }

                .dots {
                    flex-direction: row;
                }
            }

            @media (max-width: 768px) {
                .gallery-modal {
                    padding: 20px;
                }

                .gallery-modal-content {
                    height: 85vh;
                }

                .gallery-modal-close {
                    top: 20px;
                    right: 20px;
                    width: 40px;
                    height: 40px;
                }

                .main-photo {
                    max-height: 60%;
                }

                .main-image-info h3 {
                    font-size: 1.5rem !important;
                }

                .sidebar-photo {
                    height: 200px;
                }

                .navigation {
                    right: 10px;
                    bottom: -60px;
                }
            }
        `}</style>
    );
}

