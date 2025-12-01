"use client";

import { useEffect, useRef } from "react";

const MESSAGE = "Ey Crack no te vayas tu compra te espera, nuestros productos son excelentes, ¡compra ahora! ";
const DISPLAY_MS = 12000;
const PAUSE_MS = 18000;

export default function TabNotifier() {
  const intervalRef = useRef<number | null>(null);
  const cycleRef = useRef<number | null>(null);
  const stepRef = useRef<number>(0);
  const baseTitleRef = useRef<string>("");

  useEffect(() => {
    baseTitleRef.current = document.title || "Saprix Tienda Deportiva Futsal Microfutbol";

    const startRotate = () => {
      if (intervalRef.current) return;
      stepRef.current = 0;
      intervalRef.current = window.setInterval(() => {
        const s = stepRef.current++;
        const i = s % MESSAGE.length;
        const rotated = MESSAGE.slice(i) + MESSAGE.slice(0, i);
        document.title = rotated;
      }, 250);
    };

    const stopRotate = () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      document.title = baseTitleRef.current;
    };

    const scheduleCycle = () => {
      if (!document.hidden) return;
      startRotate();
      if (cycleRef.current) window.clearTimeout(cycleRef.current);
      cycleRef.current = window.setTimeout(() => {
        stopRotate();
        if (document.hidden) {
          cycleRef.current = window.setTimeout(scheduleCycle, PAUSE_MS);
        }
      }, DISPLAY_MS);
    };

    const onVisibility = () => {
      if (document.hidden) scheduleCycle();
      else {
        if (cycleRef.current) window.clearTimeout(cycleRef.current);
        stopRotate();
      }
    };

    const onBlur = () => scheduleCycle();
    const onFocus = () => {
      if (cycleRef.current) window.clearTimeout(cycleRef.current);
      stopRotate();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    onVisibility();
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      if (cycleRef.current) window.clearTimeout(cycleRef.current);
      stopRotate();
    };
  }, []);

  return null;
}
