// Sistema de Diseño Saprix - Basado en Figma
// Este archivo contiene todas las clases de utilidad para mantener consistencia

export const designSystem = {
  // Colores principales
  colors: {
    primary: "saprix-electric-blue",
    primaryLight: "saprix-electric-blue-light", 
    primaryDark: "saprix-electric-blue-dark",
    secondary: "saprix-indigo",
    accent: "saprix-red-orange",
    background: "saprix-black-blue",
    text: "saprix-white",
  },

  // Estados semánticos
  states: {
    success: "saprix-success",
    warning: "saprix-warning", 
    error: "saprix-error",
    info: "saprix-info",
  },

  // Neutros
  neutrals: {
    light: "saprix-gray-50",
    medium: "saprix-gray-300",
    dark: "saprix-gray-700",
    text: "saprix-gray-800",
  },

  // Espaciado
  spacing: {
    xs: "spacing-xs",
    sm: "spacing-sm", 
    md: "spacing-md",
    lg: "spacing-lg",
    xl: "spacing-xl",
    "2xl": "spacing-2xl",
    "3xl": "spacing-3xl",
  },

  // Tipografía
  typography: {
    heading: "font-inter font-bold",
    body: "font-inter font-normal",
    caption: "font-inter font-light text-sm",
  },

  // Sombras
  shadows: {
    sm: "shadow-sm",
    md: "shadow-md", 
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
  },

  // Bordes
  borders: {
    rounded: "rounded-lg",
    roundedMd: "rounded-xl",
    roundedLg: "rounded-2xl",
  },

  // Animaciones
  animations: {
    fadeIn: "animate-fade-in",
    slideUp: "animate-slide-up",
    slideDown: "animate-slide-down", 
    scaleIn: "animate-scale-in",
  },
} as const;

// Clases de utilidad predefinidas
export const buttonStyles = {
  primary: "bg-saprix-electric-blue hover:bg-saprix-electric-blue-dark text-white font-inter font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
  secondary: "bg-saprix-indigo hover:bg-saprix-indigo/90 text-white font-inter font-semibold px-6 py-3 rounded-lg transition-all duration-200",
  accent: "bg-saprix-red-orange hover:bg-saprix-red-orange/90 text-white font-inter font-semibold px-6 py-3 rounded-lg transition-all duration-200",
  outline: "border-2 border-saprix-electric-blue text-saprix-electric-blue hover:bg-saprix-electric-blue hover:text-white font-inter font-semibold px-6 py-3 rounded-lg transition-all duration-200",
  ghost: "text-saprix-electric-blue hover:bg-saprix-electric-blue/10 font-inter font-semibold px-6 py-3 rounded-lg transition-all duration-200",
} as const;

export const cardStyles = {
  base: "bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden",
  hover: "hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
  padding: "p-6",
} as const;

export const containerStyles = {
  section: "py-16 px-4 sm:px-6 lg:px-8",
  container: "max-w-7xl mx-auto",
  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
} as const;

export const formStyles = {
  input: "w-full px-4 py-3 border border-saprix-gray-300 rounded-lg focus:ring-2 focus:ring-saprix-electric-blue focus:border-transparent font-inter transition-all duration-200",
  label: "block text-sm font-inter font-medium text-saprix-gray-700 mb-2",
  error: "text-saprix-error text-sm font-inter mt-1",
} as const;

// Utilidades para responsive design
export const responsive = {
  mobile: "sm:",
  tablet: "md:", 
  desktop: "lg:",
  wide: "xl:",
} as const;

// Utilidades para layout
export const layout = {
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  flexStart: "flex items-center justify-start",
  flexEnd: "flex items-center justify-end",
  absoluteCenter: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
} as const;