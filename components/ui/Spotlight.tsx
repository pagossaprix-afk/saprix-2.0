"use client";

import React from "react";

type Props = {
  color?: string;
  size?: number;
  className?: string;
};

export default function Spotlight({ color = "#2500ff", size = 280, className = "" }: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState<{ x: number; y: number }>({ x: -9999, y: -9999 });
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function onMove(e: MouseEvent) {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);
  const style: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background: `radial-gradient(${size}px ${size}px at ${pos.x}px ${pos.y}px, ${color}30, transparent 70%)`,
    transition: "background 80ms linear",
  };
  return <div ref={ref} className={className} style={{ position: "relative" }}><div style={style} /></div>;
}

