"use client";

import { Carousel, useCarousel } from "motion-plus/react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useRef } from "react";
import ProxyImage from "./ProxyImage";

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
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    // Debug: Monitor dimensions
    useEffect(() => {
        const logDimensions = () => {
            const viewport = { width: window.innerWidth, height: window.innerHeight };
            const container = containerRef.current?.getBoundingClientRect();
            const img = imgRef.current?.getBoundingClientRect();
            
            console.log('[MainImage DEBUG] Viewport:', viewport);
            console.log('[MainImage DEBUG] Container:', container ? { width: container.width, height: container.height } : 'NOT FOUND');
            console.log('[MainImage DEBUG] Image:', img ? { width: img.width, height: img.height } : 'NOT FOUND');
            
            // Check if image has zero dimensions
            if (img && (img.width === 0 || img.height === 0)) {
                console.error('[MainImage DEBUG] ⚠️ IMAGE HAS ZERO DIMENSIONS!');
                // Try to force a repaint
                if (imgRef.current) {
                    imgRef.current.style.display = 'none';
                    imgRef.current.offsetHeight; // Force reflow
                    imgRef.current.style.display = 'block';
                }
            }
        };

        // Log on mount
        setTimeout(logDimensions, 100);
        setTimeout(logDimensions, 500);
        setTimeout(logDimensions, 1000);

        // Log on resize
        window.addEventListener('resize', logDimensions);
        return () => window.removeEventListener('resize', logDimensions);
    }, [image]);

    console.log('[MainImage] Rendering image:', image?.title, 'src:', image?.img);
    
    if (!image || !image.img) {
        console.warn('[MainImage] Image not found or missing src:', image);
        return (
            <div className="main-image-container" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "white", width: "100%", height: "100%" }}>
                <p>Imagem não encontrada</p>
            </div>
        );
    }

    return (
        <div className="main-image-container" ref={containerRef}>
            <img
                ref={imgRef}
                className="main-photo"
                src={image.img}
                alt={image.title || "Imagem"}
                onLoad={() => console.log('[MainImage] Image loaded successfully:', image.img)}
                onError={(e) => {
                    console.error('[MainImage] Image failed to load:', image.img);
                    // Fallback to proxy
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('/api/image')) {
                        target.src = `/api/image?url=${encodeURIComponent(image.img)}`;
                    }
                }}
                style={{ 
                    maxWidth: '100%',
                    maxHeight: 'calc(100vh - 200px)',
                    width: 'auto',
                    height: 'auto',
                    minWidth: '200px',
                    minHeight: '200px',
                    objectFit: 'contain',
                    display: 'block'
                }}
            />
            <div className="main-image-info">
                <span className="sub-label" style={{ fontSize: "0.7rem", opacity: 0.7 }}>
                    {image.cat || ""}
                </span>
                <h3 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", marginTop: "1rem", letterSpacing: "-0.02em" }}>
                    {image.title || ""}
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

function SidebarNavigation({ onPageChange, currentSelectedPage }: { onPageChange: (page: number) => void; currentSelectedPage: number }) {
    const carouselInfo = useCarousel();
    const { currentPage, totalPages, nextPage, prevPage } = carouselInfo;
    const goToPage = (carouselInfo as any).goToPage;

    // Sincronizar o carrossel com a página selecionada externamente
    useEffect(() => {
        if (totalPages > 0 && currentSelectedPage >= 0 && currentSelectedPage < totalPages) {
            const normalizedCarouselPage = currentPage % totalPages;
            if (normalizedCarouselPage !== currentSelectedPage && goToPage) {
                try {
                    (goToPage as any)(currentSelectedPage);
                } catch (e) {
                    console.error('[SidebarNavigation] Error calling goToPage:', e);
                }
            }
        }
    }, [currentSelectedPage, totalPages, currentPage]);

    // Notificar quando a página mudar
    useEffect(() => {
        if (totalPages > 0) {
            // Normalizar o índice para o range válido (0 a totalPages-1)
            const normalizedPage = currentPage % totalPages;
            console.log('[SidebarNavigation] Carousel page changed:', currentPage, 'normalized:', normalizedPage, 'calling onPageChange');
            onPageChange(normalizedPage);
        }
    }, [currentPage, totalPages, onPageChange]);


    return (
        <div className="navigation">
            <motion.button
                className="nav-button"
                onClick={prevPage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <ChevronUpIcon />
            </motion.button>

            <div className="dots">
                {Array.from({ length: totalPages }).map((_, index) => {
                    const normalizedPage = currentPage % totalPages;
                    return (
                        <div
                            key={index}
                            className={`dot ${index === normalizedPage ? "active" : ""}`}
                            onClick={() => {
                                if (goToPage && typeof goToPage === 'function') {
                                    goToPage(index);
                                }
                            }}
                            style={{ cursor: "pointer" }}
                        />
                    );
                })}
            </div>

            <motion.button
                className="nav-button"
                onClick={nextPage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{ willChange: "transform" }}
            >
                <ChevronDownIcon />
            </motion.button>
        </div>
    );
}

function SidebarPhotoItemWrapper({ image, index, isSelected, onPhotoClick }: { image: GalleryImage; index: number; isSelected: boolean; onPhotoClick: (index: number) => void }) {
    return (
        <motion.div
            className={`sidebar-photo-wrapper ${isSelected ? "selected" : ""}`}
            initial={false}
            animate={{
                scale: isSelected ? 1.05 : 1,
                opacity: isSelected ? 1 : 0.5
            }}
            transition={{ duration: 0.3 }}
            onClick={() => onPhotoClick(index)}
            style={{ cursor: "pointer" }}
        >
            <ProxyImage
                className="sidebar-photo"
                src={image.img}
                alt={image.title}
                style={{ aspectRatio: "4/3", pointerEvents: "none" }}
            />
        </motion.div>
    );
}

function SidebarCarousel({ images, onPageChange, initialPage, currentSelectedPage, carouselKey }: { images: GalleryImage[]; onPageChange: (page: number) => void; initialPage: number; currentSelectedPage: number; carouselKey: number }) {
    // Garantir que initialPage está dentro do range válido
    const validInitialPage = Math.max(0, Math.min(initialPage, images.length - 1));
    
    return (
        <Carousel
            key={`carousel-${carouselKey}-${validInitialPage}`}
            className="sidebar-carousel"
            items={images.map((image, index) => (
                <SidebarPhotoItemWrapper
                    key={image.id}
                    image={image}
                    index={index}
                    isSelected={index === currentSelectedPage}
                    onPhotoClick={onPageChange}
                />
            ))}
            gap={20}
            snap="page"
            loop={true}
            axis="y"
            overflow
        >
            <SidebarNavigation onPageChange={onPageChange} currentSelectedPage={currentSelectedPage} />
        </Carousel>
    );
}

export default function GalleryModal({ images, initialIndex, isOpen, onClose }: GalleryModalProps) {
    const [currentPage, setCurrentPage] = useState(initialIndex);
    const [carouselKey, setCarouselKey] = useState(0);

    console.log('[GalleryModal] Component rendered, isOpen:', isOpen, 'images:', images?.length || 0, 'initialIndex:', initialIndex);
    
    // Log quando currentPage muda
    useEffect(() => {
        console.log('[GalleryModal] currentPage changed to:', currentPage, 'image:', images[currentPage]);
    }, [currentPage, images]);

    useEffect(() => {
        if (isOpen && images && images.length > 0) {
            console.log('[GalleryModal] Opening modal with', images.length, 'images, initialIndex:', initialIndex);
            // Garantir que o índice inicial está dentro do range válido
            const validIndex = Math.max(0, Math.min(initialIndex, images.length - 1));
            console.log('[GalleryModal] Valid index:', validIndex, 'current image:', images[validIndex]);
            setCurrentPage(validIndex);
            // Forçar re-render do carrossel para começar na página correta
            setCarouselKey(prev => prev + 1);
            document.body.style.overflow = "hidden";
        } else {
            console.log('[GalleryModal] Modal closed or no images');
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, initialIndex, images]);


    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                console.log('[GalleryModal] Escape key pressed, closing modal');
                onClose();
            }
        };

        if (isOpen) {
            console.log('[GalleryModal] Adding escape key listener');
            window.addEventListener("keydown", handleEscape);
        }

        return () => {
            console.log('[GalleryModal] Removing escape key listener');
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen || images.length === 0) {
        console.log('[GalleryModal] Not rendering - isOpen:', isOpen, 'images.length:', images.length);
        return null;
    }
    
    // Garantir que currentPage está dentro do range válido
    const validCurrentPage = Math.max(0, Math.min(currentPage, images.length - 1));
    const currentImage = images[validCurrentPage];
    
    console.log('[GalleryModal] Rendering modal, currentPage:', currentPage, 'validCurrentPage:', validCurrentPage, 'current image:', currentImage);

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
                                {currentImage && currentImage.img ? (
                                    <MainImage image={currentImage} />
                                ) : (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", color: "white" }}>
                                        <p>Nenhuma imagem disponível (página: {validCurrentPage}, total: {images?.length || 0})</p>
                                    </div>
                                )}
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
                display: flex !important;
                flex-direction: row !important;
                gap: 30px;
                width: 100% !important;
                max-width: 1800px;
                height: 95vh !important;
                min-height: 600px !important;
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
                flex: 1;
                min-width: 0;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                background: #111;
                overflow: hidden;
                padding: 20px;
                box-sizing: border-box;
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
                align-items: center;
                justify-content: center;
                position: relative;
            }

            .main-photo {
                max-width: 100%;
                max-height: 100%;
                width: auto;
                height: auto;
                object-fit: contain;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }

            .main-image-info {
                color: white;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 1.5rem;
                background: linear-gradient(to top, rgba(0, 0, 0, 0.95), transparent);
                border-radius: 0 0 12px 12px;
                z-index: 10;
                pointer-events: none;
            }

            .gallery-sidebar {
                width: 280px;
                flex-shrink: 0;
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
                height: 250px;
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

