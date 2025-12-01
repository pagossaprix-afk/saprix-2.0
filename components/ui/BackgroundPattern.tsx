"use client";

import React from "react";

type Props = {
  variant: "dots" | "grid" | "confetti" | "blobs";
  position?: "left" | "right" | "full";
  color?: string;
  opacity?: number;
  size?: number;
};

export default function BackgroundPattern({ variant, position = "full", color = "#00000010", opacity = 1, size = 12 }: Props) {
  const base: React.CSSProperties = { position: "absolute", inset: 0, pointerEvents: "none", opacity };
  if (position !== "full") {
    base.inset = undefined;
    base.top = 0;
    base.bottom = 0;
    base.width = "50%";
    base[position] = 0;
  }
  let style: React.CSSProperties = {};
  if (variant === "dots") {
    style.backgroundImage = `radial-gradient(${color} 1px, transparent 1px)`;
    style.backgroundSize = `${size}px ${size}px`;
  } else if (variant === "grid") {
    style.backgroundImage = `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`;
    style.backgroundSize = `${size}px ${size}px`;
  } else if (variant === "confetti") {
    style.backgroundImage = `radial-gradient(circle at 90% 10%, ${color} 2px, transparent 3px), radial-gradient(circle at 80% 8%, ${color} 2px, transparent 3px), radial-gradient(circle at 95% 14%, ${color} 2px, transparent 3px)`;
    style.backgroundRepeat = "no-repeat";
  } else if (variant === "blobs") {
    style.backgroundImage = `radial-gradient(60% 60% at 20% 30%, ${color} 0%, transparent 60%), radial-gradient(50% 50% at 80% 20%, ${color} 0%, transparent 60%)`;
  }
  return <div style={{ ...base, ...style }} />;
}

