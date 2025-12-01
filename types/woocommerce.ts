export interface ProductImage {
  src: string;
  alt?: string;
}

export interface ProductAttribute {
  id: number;
  name: string; // "Color", "Tallas" o prefijado "pa_..."
  slug: string;
  options: string[];
  variation?: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  type: string; // 'simple' | 'variable'
  images: ProductImage[];
  attributes: ProductAttribute[];
  price_html?: string;
  meta_data?: MetaData[];
  categories?: Category[];
  tags?: Tag[];
  short_description?: string;
  description?: string;
  price?: string;
  regular_price?: string;
  sale_price?: string;
  stock_status?: string;
}

export interface VariationAttribute {
  name: string; // "Color"/"Tallas" o prefijado "pa_..."
  option: string;
  slug?: string;
}

export interface Variation {
  id: number;
  price?: string;
  image?: ProductImage | null;
  attributes: VariationAttribute[];
  meta_data?: MetaData[];
}

export interface MetaData {
  id: number;
  key: string;
  value: unknown;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description?: string;
  image?: ProductImage | null;
  count?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface AttributeTerm {
  id: number;
  name: string;
  slug: string;
  description?: string;
  menu_order?: number;
  count?: number;
}

export interface AttributeWithTerms {
  attribute: ProductAttribute;
  terms: AttributeTerm[];
}