import type { Metadata } from "next";
import { Inter, Jost } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import TabNotifier from "@/components/ui/TabNotifier";
import HeaderMobileClient from "@/components/layout/HeaderMobileClient";
import FutsalHeader from "@/components/layout/FutsalHeader";

import DixorFooter from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import { Toaster } from "sonner";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["400", "700", "900"],
  style: ["normal"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Saprix | Calzado Deportivo Premium",
  description: "Tienda oficial de Saprix. Encuentra los mejores guayos y zapatillas deportivas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${jost.variable} font-inter bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <CustomCursor />
              <TabNotifier />
              <HeaderMobileClient />
              <FutsalHeader />
              <main className="flex-grow">{children}</main>
              <DixorFooter />
              <CartDrawer />
              <WhatsAppButton />
            </div>
            <Toaster position="top-right" richColors />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
