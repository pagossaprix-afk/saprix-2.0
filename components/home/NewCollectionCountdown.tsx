"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(target: Date): TimeLeft {
  const now = new Date().getTime();
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function NewCollectionCountdown({ targetDate }: { targetDate?: string }) {
  // Usar useMemo para evitar recrear el objeto Date en cada render
  const target = useMemo(() => {
    return targetDate
      ? new Date(targetDate)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }, [targetDate]);

  const [left, setLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLeft(getTimeLeft(target));
    const id = setInterval(() => setLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const boxes = [
    { value: left.days, label: "DÍAS" },
    { value: left.hours, label: "HORAS" },
    { value: left.minutes, label: "MINUTOS" },
    { value: left.seconds, label: "SEGUNDOS" },
  ];

  return (
    <section className="relative w-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-saprix-electric-blue/10 dark:bg-saprix-electric-blue/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-saprix-lime/10 dark:bg-saprix-lime/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-4"
            >
              <div className="px-6 py-2 bg-saprix-lime text-black text-sm font-bold uppercase tracking-wider -skew-x-6">
                <span className="block skew-x-6">Próximamente</span>
              </div>
            </motion.div>

            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-gray-900 dark:text-white">Nueva </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-400 to-lime-400">
                Colección
              </span>
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Prepárate para la revolución del calzado deportivo. Innovación, estilo y rendimiento como nunca antes.
            </p>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-12"
          >
            {boxes.map((box, idx) => (
              <motion.div
                key={box.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 + idx * 0.1 }}
                className="relative group"
              >
                {/* Glassmorphism card */}
                <div className="relative bg-white dark:bg-gray-900/40 dark:backdrop-blur-md dark:border dark:border-white/10 p-6 sm:p-8 shadow-lg dark:shadow-saprix-electric-blue/10 hover:shadow-xl dark:hover:shadow-saprix-electric-blue/20 transition-all duration-500 -skew-x-6">
                  {/* Animated border glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-saprix-electric-blue to-saprix-lime opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 blur-xl transition-opacity duration-500" />

                  {/* Content */}
                  <div className="relative skew-x-6">
                    <motion.div
                      key={`${box.label}-${box.value}`}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-5xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-400 to-lime-400 mb-2"
                      suppressHydrationWarning
                    >
                      {mounted ? String(box.value).padStart(2, "0") : "00"}
                    </motion.div>
                    <div className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 tracking-widest uppercase">
                      {box.label}
                    </div>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-saprix-lime dark:border-saprix-electric-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-saprix-electric-blue dark:border-saprix-lime opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/tienda"
              className="group px-8 py-4 bg-saprix-electric-blue text-white font-semibold hover:bg-saprix-electric-blue-dark transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl -skew-x-6"
            >
              <span className="flex items-center gap-2 skew-x-6">
                Explorar Tienda
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>

            <Link
              href="/contacto"
              className="px-8 py-4 bg-transparent border-2 border-saprix-lime text-saprix-lime dark:text-saprix-lime font-semibold hover:bg-saprix-lime hover:text-black dark:hover:text-black transition-all duration-300 -skew-x-6"
            >
              <span className="block skew-x-6">Notificarme</span>
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16"
          >
            {[
              { icon: "⚡", title: "Tecnología Avanzada", desc: "Materiales de última generación" },
              { icon: "🎨", title: "Diseño Exclusivo", desc: "Edición limitada única" },
              { icon: "🏆", title: "Rendimiento Elite", desc: "Para atletas exigentes" },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.1 + idx * 0.1 }}
                className="text-center p-6 bg-white/50 dark:bg-gray-900/20 dark:backdrop-blur-sm dark:border dark:border-white/5 -skew-x-6"
              >
                <div className="skew-x-6">
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
