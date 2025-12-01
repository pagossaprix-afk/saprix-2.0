"use client";

import React from "react";

export default function BrandMarquee() {
  return (
    <section className="relative bg-white">
      <div className="overflow-hidden py-4">
        <div className="flex whitespace-nowrap [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <p className="animate-[marquee_22s_linear_infinite] text-2xl font-extrabold tracking-widest">
            <span className="mx-8 text-saprix-gray-900">SAPRIX</span>
            <span className="mx-8 text-saprix-electric-blue">RENDIMIENTO</span>
            <span className="mx-8 text-saprix-success">DEPORTE</span>
            <span className="mx-8 text-saprix-gray-900">SAPRIX</span>
            <span className="mx-8 text-saprix-electric-blue">RENDIMIENTO</span>
            <span className="mx-8 text-saprix-success">DEPORTE</span>
            <span className="mx-8 text-saprix-gray-900">SAPRIX</span>
            <span className="mx-8 text-saprix-electric-blue">RENDIMIENTO</span>
            <span className="mx-8 text-saprix-success">DEPORTE</span>
          </p>
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </section>
  );
}
