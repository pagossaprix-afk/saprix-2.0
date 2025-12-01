"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { IoFootball } from "react-icons/io5";

export default function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);

    // Coordenadas del mouse
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Física de resorte para suavizar el movimiento (el balón sigue con un poco de delay)
    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
    const ballX = useSpring(mouseX, springConfig);
    const ballY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Actualizamos valores brutos
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            // Mostrar cursor solo si se mueve
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, [mouseX, mouseY, isVisible]);

    // Ocultar en dispositivos táctiles/móviles (por CSS 'lg:block')
    // y si no se ha movido el mouse aún.
    if (!isVisible) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block overflow-hidden">
            {/* El Balón (Grisáceo, sutil) */}
            <motion.div
                className="absolute top-0 left-0 flex items-center justify-center text-gray-400/30 dark:text-gray-500/30"
                style={{
                    x: ballX,
                    y: ballY,
                    translateX: "-50%", // Centrar en el puntero
                    translateY: "-50%",
                }}
            >
                <IoFootball size={40} />
            </motion.div>

            {/* El Punto Azul Eléctrico (Pegado al puntero, sin delay) */}
            <motion.div
                className="absolute top-0 left-0 w-3 h-3 bg-saprix-electric-blue rounded-full shadow-[0_0_10px_rgba(37,0,255,0.5)]"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: "12px", // Pegado justo debajo/derecha del puntero
                    translateY: "12px",
                }}
            />
        </div>
    );
}
