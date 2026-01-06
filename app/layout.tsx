import type { Metadata } from "next";
import { Inter, Jost } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";

import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import TabNotifier from "@/components/ui/TabNotifier";
import HeaderMobileClient from "@/components/layout/HeaderMobileClient";
import FutsalHeader from "@/components/layout/FutsalHeader";

import DixorFooter from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
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
  metadataBase: new URL("https://saprix.com.co"),
  alternates: {
    canonical: "/",
  },
  title: "Saprix | Calzado Deportivo Premium",
  description: "Tienda oficial de Saprix. Encuentra los mejores guayos y zapatillas deportivas.",
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      )}
      <body className={`${inter.variable} ${jost.variable} font-inter bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300`} suppressHydrationWarning>

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <CartProvider>
            <WishlistProvider>
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
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
