"use client";

import { motion } from "framer-motion";
import React from "react";

export const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.22, 0.61, 0.36, 1] },
};

export const stagger = { staggerChildren: 0.08 };

type MotionProps = { children: React.ReactNode; className?: string };
export function MotionSection({ children, className = "" }: MotionProps) {
  return (
    <motion.section initial="initial" whileInView="animate" viewport={{ once: true }} variants={{}} className={className}>
      {children}
    </motion.section>
  );
}

export function MotionDiv({ children, className = "" }: MotionProps) {
  return (
    <motion.div variants={fadeIn} className={className}>
      {children}
    </motion.div>
  );
}

