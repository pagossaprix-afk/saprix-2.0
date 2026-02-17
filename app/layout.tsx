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
  icons: {
    icon: "/favicon Saprix.png",
  },
};


import { wcFetchRaw } from "@/lib/woocommerce";

import { ChatProvider } from "@/components/context/ChatContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch products for WhatsApp Widget (3 items)
  let detailedProducts = [];
  try {
    const resp = await wcFetchRaw<any[]>("products", { per_page: 3, featured: true, status: "publish" }, 3600);
    if (resp.data && Array.isArray(resp.data) && resp.data.length > 0) {
      detailedProducts = resp.data;
    } else {
      // Fallback to latest products if no featured ones
      const fallback = await wcFetchRaw<any[]>("products", { per_page: 3, orderby: "date", order: "desc", status: "publish" }, 3600);
      detailedProducts = Array.isArray(fallback.data) ? fallback.data : [];
    }
  } catch (err) {
    console.error("Error fetching products for WhatsApp Widget", err);
  }

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
              <ChatProvider>
                <div className="flex flex-col min-h-screen">
                  <CustomCursor />
                  <TabNotifier />
                  <HeaderMobileClient />
                  <FutsalHeader />
                  <main className="flex-grow">{children}</main>
                  <DixorFooter />
                  <CartDrawer />
                  <WhatsAppButton products={detailedProducts} />

                </div>
                <Toaster position="top-right" richColors />
              </ChatProvider>
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
