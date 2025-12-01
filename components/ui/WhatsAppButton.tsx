"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function WhatsAppButton() {
    const [showTooltip, setShowTooltip] = useState(true);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 pointer-events-none">
            {/* Bocadillo de texto */}
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-2 rounded-lg shadow-lg text-[10px] sm:text-xs font-medium max-w-[150px] text-center relative mb-1 mr-1 pointer-events-auto border border-gray-100 dark:border-gray-700"
                    >
                        <button
                            onClick={() => setShowTooltip(false)}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-full flex items-center justify-center hover:bg-gray-900 dark:hover:bg-gray-300 transition-colors"
                            aria-label="Cerrar mensaje"
                        >
                            <X className="w-2.5 h-2.5" />
                        </button>
                        ¿Dudas? Habla aquí con un agente inteligente
                        {/* Triángulo del bocadillo */}
                        <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-gray-800 border-b border-r border-gray-100 dark:border-gray-700 transform rotate-45"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Botón WhatsApp */}
            <motion.a
                href="https://wa.me/573019086637"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-saprix-electric-blue to-lime-400 text-white rounded-full shadow-lg hover:shadow-saprix-electric-blue/50 transition-shadow duration-300 relative overflow-hidden pointer-events-auto"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                    y: [0, -8, 0], // Movimiento arriba/abajo suave
                }}
                transition={{
                    y: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    },
                }}
                aria-label="Chat en WhatsApp"
            >
                {/* Efecto de destello/brillo */}
                <motion.div
                    className="absolute inset-0 bg-white rounded-full"
                    animate={{
                        scale: [1, 1.5],
                        opacity: [0, 0.3, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                        repeatDelay: 1
                    }}
                />
                <FaWhatsapp className="w-8 h-8 sm:w-9 sm:h-9 relative z-10" />
            </motion.a>
        </div>
    );
}
