import MainHeroSlider from '@/components/home/MainHeroSlider';
import NewCollectionSection from '@/components/home/NewCollectionSection';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import ProductShowcase from '@/components/home/ProductShowcase';
import BrandStory from '@/components/home/BrandStory';
import StatsSection from '@/components/home/StatsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import InstagramFeed from '@/components/social/InstagramFeed';
import { getAllProductCategories, wcFetchRaw } from '@/lib/woocommerce';

async function getHeroProducts() {
  try {
    const resp = await wcFetchRaw<any[]>("products", { per_page: 5, featured: true, status: "publish" }, 600);
    const products = Array.isArray(resp.data) ? resp.data : [];
    if (products.length >= 3) return products;
    const fallback = await wcFetchRaw<any[]>("products", { per_page: 5, orderby: "date", order: "desc", status: "publish" }, 600);
    const fallbackProducts = Array.isArray(fallback.data) ? fallback.data : [];
    return fallbackProducts;
  } catch (error) {
    console.error("Error fetching hero products:", error);
    return [];
  }
}

async function getFeaturedProducts() {
  try {
    const resp = await wcFetchRaw<any[]>("products", { per_page: 6, featured: true, status: "publish" }, 600);
    const products = Array.isArray(resp.data) ? resp.data : [];
    if (products.length > 0) return products;
    const fallback = await wcFetchRaw<any[]>("products", { per_page: 6, orderby: "date", order: "desc", status: "publish" }, 600);
    const fallbackProducts = Array.isArray(fallback.data) ? fallback.data : [];
    return fallbackProducts;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export default async function HomePage() {
  // Fetch data en paralelo
  const [heroProducts, categories, products] = await Promise.all([
    getHeroProducts(),
    getAllProductCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <main className="min-h-screen">
      {/* Main Hero Slider (Banners) */}
      <MainHeroSlider />

      {/* New Collection Section (Old Hero) - Temporalmente deshabilitado */}
      {/* <NewCollectionSection products={heroProducts} /> */}

      {/* Featured Categories */}
      {categories && categories.length > 0 && (
        <FeaturedCategories categories={categories} />
      )}

      {/* Product Showcase */}
      {products && products.length > 0 && (
        <ProductShowcase
          products={products}
          title="Productos Destacados"
          subtitle="Lo mejor de nuestra colección seleccionado para ti"
        />
      )}

      {/* Stats Section (Logros) */}
      <StatsSection />

      {/* Testimonials Section (Comentarios) */}
      <TestimonialsSection />

      {/* Brand Story */}
      <BrandStory />

      {/* Newsletter Section */}
      <section className="py-20 bg-black text-white relative overflow-hidden">
        {/* Decorative Background Image */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="relative w-full h-full">
            {/* Usamos img tag para evitar problemas de importación estática si no es necesario optimizar al máximo esta decoración */}
            <img
              src="/LONDRES/Zapatillas Londres Saprix Futsal Microfutbol  (1).png"
              alt="Saprix Background"
              className="w-full h-full object-cover object-center mask-image-gradient"
              style={{ maskImage: 'linear-gradient(to left, black, transparent)' }}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl sm:text-5xl font-bold">
              Únete a la Comunidad Saprix
            </h2>
            <p className="text-xl text-gray-300">
              Recibe ofertas exclusivas, lanzamientos anticipados y consejos de entrenamiento directamente en tu inbox
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-6 py-4 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-lime-400"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-lime-400 text-black font-semibold rounded-full hover:bg-lime-300 transition-colors duration-300 whitespace-nowrap"
              >
                Suscribirse
              </button>
            </form>
            <p className="text-sm text-gray-400">
              Al suscribirte, aceptas recibir correos de marketing. Puedes darte de baja en cualquier momento.
            </p>
          </div>
        </div>
      </section>

      <InstagramFeed username="saprixoficial" />
    </main>
  );
}
