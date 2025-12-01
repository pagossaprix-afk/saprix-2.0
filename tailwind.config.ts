import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Colores de Marca Saprix (alineados al mini manual)
        "saprix-black-blue": "#060321", // Fondos muy oscuros (ambientales)
        "saprix-black": "#1F2937", // Negro intenso para títulos y contraste
        "saprix-electric-blue": "#3B00FF", // Azul vibrante primario (CTA, identidad)
        "saprix-lime": "#90FF00", // Verde neón/acento
        "saprix-electric-blue-light": "#4d33ff",
        "saprix-electric-blue-dark": "#1a00cc",
        "saprix-indigo": "#233775", // Color secundario
        "saprix-white": "#FFFFFF",
        "saprix-red-orange": "#FF4500", // Acentos y CTAs

        // Colores Semánticos
        "saprix-success": "#00B341",
        "saprix-warning": "#FF9500",
        "saprix-error": "#FF3E7F",
        "saprix-info": "#00C2FF",

        // Neutros extendidos
        "saprix-gray": {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#6B7280", // secundario según manual
          700: "#374151",
          800: "#1f2937", // alinear con negro intenso
          900: "#111827",
        },
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        lg: "4px", // Bordes ligeramente redondeados
        xl: "8px",
        "2xl": "12px",
        "3xl": "16px",
      },
      spacing: {
        // Sistema de espaciado profesional
        xs: "0.25rem", // 4px
        sm: "0.5rem", // 8px
        md: "1rem", // 16px
        lg: "1.5rem", // 24px
        xl: "2rem", // 32px
        "2xl": "3rem", // 48px
        "3xl": "4rem", // 64px
        "4xl": "6rem", // 96px
        "5xl": "8rem", // 128px
      },
      fontSize: {
        // Sistema de tipografía escalable
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
      },
      boxShadow: {
        // Sombras profesionales
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      },
      animation: {
        // Animaciones de marca
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
