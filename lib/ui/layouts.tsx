"use client";

import React from "react";

type SectionProps = {
  children: React.ReactNode;
  bg?: string;
  spacing?: "none" | "sm" | "md" | "lg";
  className?: string;
};

export function Section({ children, bg = "bg-white", spacing = "lg", className = "" }: SectionProps) {
  const py = spacing === "none" ? "py-0" : spacing === "sm" ? "py-8" : spacing === "md" ? "py-12" : "py-20";
  return <section className={`${bg} ${py} ${className}`}>{children}</section>;
}

type ContainerProps = { children: React.ReactNode; className?: string };
export function Container({ children, className = "" }: ContainerProps) {
  return <div className={`mx-auto max-w-7xl px-6 ${className}`}>{children}</div>;
}

type GridProps = {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
};

export function Grid({ children, columns = 3, gap = "md", className = "" }: GridProps) {
  const g = gap === "sm" ? "gap-4" : gap === "md" ? "gap-6" : "gap-8";
  const cols = columns === 2 ? "grid-cols-1 sm:grid-cols-2" : columns === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  return <div className={`grid ${cols} ${g} ${className}`}>{children}</div>;
}

