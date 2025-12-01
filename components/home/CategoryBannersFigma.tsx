"use client";

import Link from "next/link";
import {
  IoShirt,
  IoWoman,
  IoHappy,
  IoFlame,
  IoFootsteps,
  IoGolf,
  IoColorPalette,
  IoStar
} from "react-icons/io5";
import { GiRunningShoe, GiSoccerKick, GiBasketballBasket, GiTennisRacket } from "react-icons/gi";
import { layout } from "@/lib/design-system";
import { Section, Container, Grid } from "@/lib/ui/layouts";
import { MotionDiv } from "@/lib/ui/motion";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
  gradient: string;
  productCount: number;
}

import { useState, useEffect } from "react";

// ... (imports remain same)

const iconMap: Record<string, any> = {
  default: IoStar,
  hombre: IoShirt,
  mujer: IoWoman,
  ninos: IoHappy,
  sala: GiSoccerKick,
  velocidad: GiRunningShoe,
  agarre: IoGolf,
  ofertas: IoFlame,
  accesorios: IoColorPalette
};

export default function CategoryBannersFigma() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCats() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          const mapped = data
            .filter((c: any) => c.parent === 0 && c.count > 0)
            .slice(0, 8) // Limit to 8 for the grid
            .map((c: any, idx: number) => {
              // Simple color cycle
              const colors = [
                { text: "text-saprix-electric-blue", grad: "from-saprix-electric-blue to-saprix-electric-blue-light" },
                { text: "text-saprix-red-orange", grad: "from-saprix-red-orange to-orange-500" },
                { text: "text-green-600", grad: "from-green-500 to-green-600" },
                { text: "text-purple-600", grad: "from-purple-600 to-purple-700" },
                { text: "text-yellow-600", grad: "from-yellow-500 to-yellow-600" },
                { text: "text-blue-600", grad: "from-blue-600 to-blue-700" },
                { text: "text-red-600", grad: "from-red-600 to-red-700" },
                { text: "text-indigo-600", grad: "from-indigo-600 to-indigo-700" }
              ];
              const colorSet = colors[idx % colors.length];

              // Try to match icon by slug, else default
              let Icon = iconMap.default;
              Object.keys(iconMap).forEach(k => {
                if (c.slug.includes(k)) Icon = iconMap[k];
              });

              return {
                id: String(c.id),
                name: c.name,
                description: c.description || `Explora nuestra colección de ${c.name}`,
                icon: Icon,
                href: `/productos?categoria=${c.slug}`,
                color: colorSet.text,
                gradient: colorSet.grad,
                productCount: c.count
              };
            });
          setCategories(mapped);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchCats();
  }, []);

  if (loading) return <div className="py-20 text-center">Cargando categorías...</div>;
  if (categories.length === 0) return null;

  return (
    <Section bg="bg-saprix-gray-50" spacing="lg">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="saprix-h2 saprix-title-underline mb-4">
            Categorías Populares
          </h2>
          <p className="saprix-body max-w-2xl mx-auto">
            Descubre nuestras colecciones especializadas para cada estilo de juego
          </p>
        </div>

        {/* Categories Grid */}
        <Grid columns={4} gap="md">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <MotionDiv key={category.id}>
                <Link
                  key={category.id}
                  href={category.href}
                  className={`group relative overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                  {/* Content */}
                  <div className="relative p-8 text-center">
                    {/* Icon */}
                    <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${category.gradient} ${layout.flexCenter} group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Text */}
                    <h3 className="text-xl font-inter font-bold text-saprix-gray-900 mb-2 group-hover:text-saprix-electric-blue transition-colors duration-200">
                      {category.name}
                    </h3>
                    <p className="text-sm text-saprix-gray-600 font-inter mb-4 leading-relaxed">
                      {category.description}
                    </p>

                    {/* Product Count */}
                    <div className="inline-flex items-center px-3 py-1 bg-saprix-lime text-black text-sm font-inter">
                      <span className="font-extrabold">{category.productCount}</span>
                      <span className="ml-1">productos</span>
                    </div>

                    {/* Hover Arrow */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className={`w-8 h-8 ${category.color} ${layout.flexCenter}`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Border Animation */}
                  <div className={`absolute inset-0 border-2 border-transparent group-hover:border-saprix-electric-blue transition-all duration-300 opacity-0 group-hover:opacity-100`} />
                </Link>
              </MotionDiv>
            );
          })}
        </Grid>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link
            href="/tienda"
            className="btn-primary px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Ver Todas las Categorías
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
