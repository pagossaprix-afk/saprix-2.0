"use client";

import { Truck, ShieldCheck, Zap, BadgeCheck } from "lucide-react";

const items = [
  { icon: Truck, title: "Envío Rápido", desc: "Cobertura nacional" },
  { icon: ShieldCheck, title: "Garantía", desc: "6 meses Saprix" },
  { icon: Zap, title: "Rendimiento", desc: "Agarre extremo" },
  { icon: BadgeCheck, title: "Calidad", desc: "Probado en cancha" },
];

export default function NeonFeatureGrid() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="relative p-[2px]"
              style={{ background: "linear-gradient(135deg,#2500ff,#C6FF00)" }}
            >
              <div className="bg-white p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center bg-saprix-lime/10 text-saprix-lime">
                    <Icon size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-saprix-gray-900">{title}</p>
                    <p className="text-xs text-saprix-gray-600">{desc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
