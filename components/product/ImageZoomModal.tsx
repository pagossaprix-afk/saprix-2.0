"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageZoomModalProps {
    images: Array<{ src: string; alt?: string }>;
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function ImageZoomModal({ images, initialIndex, isOpen, onClose }: ImageZoomModalProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        const handleArrowKeys = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") goToPrevious();
            if (e.key === "ArrowRight") goToNext();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.addEventListener("keydown", handleArrowKeys);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.removeEventListener("keydown", handleArrowKeys);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, currentIndex]);

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
                    onClick={onClose}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-[110] p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
                        aria-label="Cerrar"
                    >
                        <X size={24} />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[110] px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                        {currentIndex + 1} / {images.length}
                    </div>

                    {/* Main Image Container */}
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={images[currentIndex].src}
                            alt={images[currentIndex].alt || `Imagen ${currentIndex + 1}`}
                            width={1200}
                            height={1200}
                            className="max-w-full max-h-full object-contain"
                            priority
                        />
                    </motion.div>

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrevious();
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-[110] p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
                                aria-label="Imagen anterior"
                            >
                                <ChevronLeft size={32} />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNext();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-[110] p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
                                aria-label="Imagen siguiente"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </>
                    )}

                    {/* Thumbnail Navigation */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[110] flex gap-2 max-w-full overflow-x-auto px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentIndex(idx);
                                    }}
                                    className={`relative w-16 h-16 flex-shrink-0 overflow-hidden transition-all ${idx === currentIndex
                                            ? "ring-2 ring-white scale-110"
                                            : "opacity-60 hover:opacity-100"
                                        }`}
                                >
                                    <Image
                                        src={img.src}
                                        alt={img.alt || `Miniatura ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
