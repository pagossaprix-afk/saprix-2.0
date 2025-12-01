'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { SlidersHorizontal, X, ChevronDown, ChevronUp, ArrowRight, Check } from 'lucide-react';
import { Category, Product } from '@/types/woocommerce';

interface ShopClientProps {
    initialProducts: Product[];
    categories: Category[];
}

// Configuración de Filtros Estáticos
const SORT_OPTIONS = [
    { label: 'Precio (de menor a mayor)', value: 'price_asc' },
    { label: 'Precio (de mayor a menor)', value: 'price_desc' },
    { label: 'Novedades', value: 'newest' },
    { label: 'Los más vendidos', value: 'popularity' },
];

const GENDER_OPTIONS = [
    { label: 'Hombre', value: 'Hombre' },
    { label: 'Niño', value: 'Niño' },
];

const COLOR_OPTIONS = [
    { label: 'Negro', value: 'Negro', hex: '#000000' },
    { label: 'Blanco', value: 'Blanco', hex: '#FFFFFF' },
    { label: 'Azul', value: 'Azul', hex: '#0066CC' },
    { label: 'Verde', value: 'Verde', hex: '#228B22' },
    { label: 'Verde Jade', value: 'Verde Jade', hex: '#00A86B' },
    { label: 'Rojo', value: 'Rojo', hex: '#DC143C' },
    { label: 'Amarillo', value: 'Amarillo', hex: '#FFD700' },
    { label: 'Naranja', value: 'Naranja', hex: '#FF8C00' },
    { label: 'Gris', value: 'Gris', hex: '#808080' },
    { label: 'Dorado', value: 'Dorado', hex: '#FFD700' },
    { label: 'Plateado', value: 'Plateado', hex: '#C0C0C0' },
    { label: 'Neón', value: 'Neón', hex: '#39FF14' },
];

const DISCOUNT_OPTIONS = [
    { label: '10%', value: '10' },
    { label: '25%', value: '25' },
    { label: '50%', value: '50' },
];

export function ShopClient({ initialProducts, categories }: ShopClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
    const [priceRange, setPriceRange] = useState<[string, string]>(['', '']);
    const [sortOption, setSortOption] = useState<string>('newest');
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedDiscount, setSelectedDiscount] = useState<string | null>(null);

    // New filters from URL
    const [isFeatured, setIsFeatured] = useState<boolean>(searchParams.get('featured') === 'true');
    const [isOnSale, setIsOnSale] = useState<boolean>(searchParams.get('sale') === 'true');
    const [isNew, setIsNew] = useState<boolean>(searchParams.get('new') === 'true');

    // UI states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        sort: true,
        gender: true,
        color: true,
        categories: true,
        discounts: true,
        price: true,
    });

    // Prevent body scroll when filter drawer is open
    useEffect(() => {
        if (isFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isFilterOpen]);

    // Sync URL parameters with state when they change
    useEffect(() => {
        setSelectedCategory(searchParams.get('category'));
        setIsFeatured(searchParams.get('featured') === 'true');
        setIsOnSale(searchParams.get('sale') === 'true');
        setIsNew(searchParams.get('new') === 'true');
    }, [searchParams]);

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Build category tree
    const categoryTree = useMemo(() => {
        return categories
            .filter(c => c.parent === 0)
            .map(parent => ({
                ...parent,
                children: categories.filter(c => c.parent === parent.id)
            }));
    }, [categories]);

    // Filter products logic -FIXED
    const filteredProducts = useMemo(() => {
        let result = initialProducts.filter(product => {
            // Category filter
            if (selectedCategory) {
                const hasCategory = product.categories?.some(c => c.slug === selectedCategory);
                if (!hasCategory) return false;
            }

            // Price filter
            const price = parseFloat(product.price || '0');
            const minPrice = priceRange[0] ? parseFloat(priceRange[0]) : 0;
            const maxPrice = priceRange[1] ? parseFloat(priceRange[1]) : Infinity;

            if (price < minPrice || price > maxPrice) {
                return false;
            }

            // Gender filter
            if (selectedGender) {
                const productName = product.name.toLowerCase();

                if (selectedGender === 'Niño') {
                    if (!productName.includes('kids') &&
                        !productName.includes('niño') &&
                        !productName.includes('niños') &&
                        !productName.includes('junior')) {
                        return false;
                    }
                } else if (selectedGender === 'Hombre') {
                    if (productName.includes('kids') ||
                        productName.includes('niño') ||
                        productName.includes('niños') ||
                        productName.includes('junior')) {
                        return false;
                    }
                }
            }

            // Color filter
            if (selectedColor) {
                const colorAttr = product.attributes?.find((attr: any) =>
                    attr.name.toLowerCase().includes('color')
                );

                if (!colorAttr || !colorAttr.options.some((opt: string) =>
                    opt.toLowerCase().includes(selectedColor.toLowerCase()) ||
                    selectedColor.toLowerCase().includes(opt.toLowerCase())
                )) {
                    return false;
                }
            }

            // Discount filter
            if (selectedDiscount) {
                if (!product.sale_price || !product.regular_price) {
                    return false;
                }

                const regularPrice = parseFloat(product.regular_price);
                const salePrice = parseFloat(product.sale_price);
                const discountPercent = ((regularPrice - salePrice) / regularPrice) * 100;
                const requiredDiscount = parseInt(selectedDiscount);

                if (discountPercent < requiredDiscount) {
                    return false;
                }
            }

            // Featured filter
            if (isFeatured) {
                // Placeholder logic
            }

            // Sale filter (URL param)
            if (isOnSale) {
                if (!product.sale_price || product.sale_price === product.regular_price) {
                    return false;
                }
            }

            // New filter (URL param)
            if (isNew) {
                const isNewProduct = product.categories?.some(c => c.slug === 'nuevo' || c.name.toLowerCase() === 'nuevo') ||
                    product.attributes?.some(a => a.name.toLowerCase() === 'estado' && a.options.includes('Nuevo'));

                if (!isNewProduct) return false;
            }

            return true;
        });

        // Sorting
        if (sortOption === 'price_asc') {
            result.sort((a, b) => parseFloat(a.price || '0') - parseFloat(b.price || '0'));
        } else if (sortOption === 'price_desc') {
            result.sort((a, b) => parseFloat(b.price || '0') - parseFloat(a.price || '0'));
        }

        return result;
    }, [initialProducts, selectedCategory, priceRange, sortOption, selectedGender, selectedColor, selectedDiscount, isFeatured, isOnSale, isNew]);

    const handleCategoryClick = (slug: string | null) => {
        if (slug === null) {
            setSelectedCategory(null);
            router.push('/tienda');
        } else {
            setSelectedCategory(slug);
            router.push(`/tienda?category=${slug}`);
        }
    };

    const clearAllFilters = () => {
        setSelectedCategory(null);
        setPriceRange(['', '']);
        setSortOption('newest');
        setSelectedGender(null);
        setSelectedColor(null);
        setSelectedDiscount(null);
        setIsFeatured(false);
        setIsOnSale(false);
        setIsNew(false);
        router.push('/tienda');
    };

    const handlePriceChange = (index: 0 | 1, value: string) => {
        const newRange = [...priceRange] as [string, string];
        newRange[index] = value;
        setPriceRange(newRange);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 relative">
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-black italic tracking-tighter uppercase flex items-center gap-2">
                            TODOS LOS PRODUCTOS
                            <span className="text-gray-500 font-medium not-italic text-sm normal-case">[{filteredProducts.length}]</span>
                        </h1>
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-3 px-6 py-2 border border-black hover:bg-black hover:text-white transition-all uppercase text-sm font-bold tracking-widest"
                    >
                        <span>Filtrar y Ordenar</span>
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>
                {(selectedCategory || selectedGender || selectedColor || selectedDiscount || priceRange[0] || priceRange[1] || isFeatured || isOnSale || isNew) && (
                    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap gap-2 items-center border-t border-gray-100">
                        {selectedCategory && (
                            <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-bold uppercase transition-colors">
                                {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory} <X className="w-3 h-3" />
                            </button>
                        )}
                        {selectedGender && (
                            <button onClick={() => setSelectedGender(null)} className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-bold uppercase transition-colors">
                                {selectedGender} <X className="w-3 h-3" />
                            </button>
                        )}
                        {selectedColor && (
                            <button onClick={() => setSelectedColor(null)} className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-bold uppercase transition-colors">
                                {selectedColor} <X className="w-3 h-3" />
                            </button>
                        )}
                        {selectedDiscount && (
                            <button onClick={() => setSelectedDiscount(null)} className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-bold uppercase transition-colors">
                                {selectedDiscount}% descuento <X className="w-3 h-3" />
                            </button>
                        )}
                        {isFeatured && (
                            <button onClick={() => setIsFeatured(false)} className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-bold uppercase transition-colors">
                                Destacados <X className="w-3 h-3" />
                            </button>
                        )}
                        {isOnSale && (
                            <button onClick={() => setIsOnSale(false)} className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-bold uppercase transition-colors">
                                Ofertas <X className="w-3 h-3" />
                            </button>
                        )}
                        {isNew && (
                            <button onClick={() => setIsNew(false)} className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-bold uppercase transition-colors">
                                Nuevos <X className="w-3 h-3" />
                            </button>
                        )}
                        <button onClick={clearAllFilters} className="text-xs underline font-medium text-gray-500 hover:text-black ml-auto">
                            Borrar todo
                        </button>
                    </div>
                )}
            </div>
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <main className="w-full">
                    {filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <h2 className="text-2xl font-black italic uppercase mb-2">No encontramos nada</h2>
                            <p className="text-gray-500 mb-6">Intenta ajustar tus filtros.</p>
                            <button onClick={clearAllFilters} className="px-8 py-3 bg-black text-white font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors">
                                Limpiar filtros
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="group">
                                    <ProductCard
                                        id={product.id}
                                        name={product.name}
                                        price={product.price || '0'}
                                        imageUrl={product.images[0]?.src || ''}
                                        slug={product.slug}
                                        category={product.categories?.[0]?.slug}
                                        images={product.images?.map(img => img.src) || []}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
            {isFilterOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 backdrop-blur-sm cursor-pointer" onClick={() => setIsFilterOpen(false)}></div>
            )}
            <aside className={`fixed top-0 left-0 h-full w-full md:w-[500px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-black uppercase tracking-tighter italic">FILTRAR Y ORDENAR</h2>
                    <div className="flex items-center gap-2">
                        {(selectedCategory || selectedGender || selectedColor || selectedDiscount || priceRange[0] || priceRange[1]) && (
                            <button onClick={clearAllFilters} className="text-xs font-bold uppercase underline text-gray-600 hover:text-black transition-colors">Limpiar todo</button>
                        )}
                        <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="border-b border-gray-200">
                        <button onClick={() => toggleSection('sort')} className="flex items-center justify-between w-full p-6 hover:bg-gray-50">
                            <h3 className="text-base font-bold uppercase tracking-wide">Ordenar por</h3>
                            {expandedSections.sort ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        {expandedSections.sort && (
                            <div className="px-6 pb-6 space-y-4">
                                {SORT_OPTIONS.map((option) => (
                                    <label key={option.value} className="flex items-center cursor-pointer group">
                                        <div className={`w-6 h-6 rounded-full border border-gray-300 mr-4 flex items-center justify-center transition-colors ${sortOption === option.value ? 'bg-black border-black' : 'group-hover:border-black'}`}>
                                            {sortOption === option.value && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                        </div>
                                        <input type="radio" name="sort" value={option.value} checked={sortOption === option.value} onChange={(e) => setSortOption(e.target.value)} className="hidden" />
                                        <span className="text-base text-gray-700 group-hover:text-black">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="border-b border-gray-200">
                        <button onClick={() => toggleSection('gender')} className="flex items-center justify-between w-full p-6 hover:bg-gray-50">
                            <h3 className="text-base font-bold uppercase tracking-wide">Sexo</h3>
                            {expandedSections.gender ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        {expandedSections.gender && (
                            <div className="px-6 pb-6 space-y-4">
                                {GENDER_OPTIONS.map((option) => (
                                    <label key={option.value} className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center">
                                            <div className={`w-6 h-6 rounded-full border border-gray-300 mr-4 flex items-center justify-center transition-colors ${selectedGender === option.value ? 'bg-black border-black' : 'group-hover:border-black'}`}>
                                                {selectedGender === option.value && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                            </div>
                                            <input type="radio" name="gender" value={option.value} checked={selectedGender === option.value} onChange={(e) => setSelectedGender(e.target.value === selectedGender ? null : e.target.value)} className="hidden" />
                                            <span className="text-base text-gray-700 group-hover:text-black">{option.label}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="border-b border-gray-200">
                        <button onClick={() => toggleSection('color')} className="flex items-center justify-between w-full p-6 hover:bg-gray-50">
                            <h3 className="text-base font-bold uppercase tracking-wide">Color</h3>
                            {expandedSections.color ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        {expandedSections.color && (
                            <div className="px-6 pb-6 grid grid-cols-2 gap-3">
                                {COLOR_OPTIONS.map((option) => (
                                    <button key={option.value} onClick={() => setSelectedColor(selectedColor === option.value ? null : option.value)} className={`flex items-center p-2 border transition-all hover:border-black ${selectedColor === option.value ? 'border-black bg-gray-50' : 'border-gray-300'}`}>
                                        <div className="w-6 h-6 mr-3 border border-gray-200 shadow-sm" style={{ backgroundColor: option.hex }} />
                                        <div className="text-left"><span className="block text-sm font-medium text-gray-900">{option.label}</span></div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="border-b border-gray-200">
                        <button onClick={() => toggleSection('categories')} className="flex items-center justify-between w-full p-6 hover:bg-gray-50">
                            <h3 className="text-base font-bold uppercase tracking-wide">Categoría de producto</h3>
                            {expandedSections.categories ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        {expandedSections.categories && (
                            <div className="px-6 pb-6 space-y-4">
                                <button onClick={() => handleCategoryClick(null)} className="flex items-center justify-between w-full group text-left">
                                    <div className="flex items-center">
                                        <div className={`w-6 h-6 border border-gray-400 mr-4 flex items-center justify-center transition-colors ${!selectedCategory ? 'bg-black border-black' : 'bg-white group-hover:border-black'}`}>
                                            {!selectedCategory && <Check className="w-4 h-4 text-white" />}
                                        </div>
                                        <span className={`text-base group-hover:underline ${!selectedCategory ? 'font-bold text-black' : 'text-gray-700'}`}>Ver todo</span>
                                    </div>
                                </button>
                                {categoryTree.map(parent => (
                                    <div key={parent.id} className="space-y-3">
                                        <button onClick={() => handleCategoryClick(parent.slug)} className="flex items-center justify-between w-full group text-left">
                                            <div className="flex items-center">
                                                <div className={`w-6 h-6 border border-gray-400 mr-4 flex items-center justify-center transition-colors ${selectedCategory === parent.slug ? 'bg-black border-black' : 'bg-white group-hover:border-black'}`}>
                                                    {selectedCategory === parent.slug && <Check className="w-4 h-4 text-white" />}
                                                </div>
                                                <span className={`text-base group-hover:underline ${selectedCategory === parent.slug ? 'font-bold text-black' : 'text-gray-700'}`}>{parent.name}</span>
                                            </div>
                                        </button>
                                        {parent.children && parent.children.length > 0 && (
                                            <div className="pl-10 space-y-3">
                                                {parent.children.map((child: any) => (
                                                    <button key={child.id} onClick={() => handleCategoryClick(child.slug)} className="flex items-center justify-between w-full group text-left">
                                                        <div className="flex items-center">
                                                            <div className={`w-5 h-5 border border-gray-300 mr-4 flex items-center justify-center transition-colors ${selectedCategory === child.slug ? 'bg-black border-black' : 'bg-white group-hover:border-black'}`}>
                                                                {selectedCategory === child.slug && <Check className="w-3 h-3 text-white" />}
                                                            </div>
                                                            <span className={`text-sm group-hover:underline ${selectedCategory === child.slug ? 'font-bold text-black' : 'text-gray-600'}`}>{child.name}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="border-b border-gray-200">
                        <button onClick={() => toggleSection('discounts')} className="flex items-center justify-between w-full p-6 hover:bg-gray-50">
                            <h3 className="text-base font-bold uppercase tracking-wide">Descuentos</h3>
                            {expandedSections.discounts ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        {expandedSections.discounts && (
                            <div className="px-6 pb-6 space-y-4">
                                {DISCOUNT_OPTIONS.map((option) => (
                                    <button key={option.value} onClick={() => setSelectedDiscount(selectedDiscount === option.value ? null : option.value)} className="flex items-center justify-between w-full group text-left">
                                        <div className="flex items-center">
                                            <div className={`w-6 h-6 border border-gray-400 mr-4 flex items-center justify-center transition-colors ${selectedDiscount === option.value ? 'bg-black border-black' : 'bg-white group-hover:border-black'}`}>
                                                {selectedDiscount === option.value && <Check className="w-4 h-4 text-white" />}
                                            </div>
                                            <span className={`text-base group-hover:underline ${selectedDiscount === option.value ? 'font-bold text-black' : 'text-gray-700'}`}>{option.label}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="border-b border-gray-200">
                        <button onClick={() => toggleSection('price')} className="flex items-center justify-between w-full p-6 hover:bg-gray-50">
                            <h3 className="text-base font-bold uppercase tracking-wide">Precio</h3>
                            {expandedSections.price ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        {expandedSections.price && (
                            <div className="px-6 pb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <label className="text-xs font-bold uppercase mb-1 block">Mínimo (COP)</label>
                                        <input type="number" value={priceRange[0]} onChange={(e) => handlePriceChange(0, e.target.value)} placeholder="0" className="w-full border border-gray-400 p-3 text-lg font-medium focus:border-black focus:ring-0 outline-none transition-colors" />
                                    </div>
                                    <div className="relative">
                                        <label className="text-xs font-bold uppercase mb-1 block">Máximo (COP)</label>
                                        <input type="number" value={priceRange[1]} onChange={(e) => handlePriceChange(1, e.target.value)} placeholder="500000" className="w-full border border-gray-400 p-3 text-lg font-medium focus:border-black focus:ring-0 outline-none transition-colors" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-6 border-t border-gray-200 bg-white">
                    <button onClick={() => setIsFilterOpen(false)} className="w-full py-4 bg-black text-white font-black uppercase tracking-widest hover:bg-gray-900 transition-all flex items-center justify-between px-6 shadow-lg group">
                        <span>Aplicar</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </aside>
        </div>
    );
}
