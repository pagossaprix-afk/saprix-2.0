import type { MappingItem } from "@/types/mapping";

// Mapeo por defecto para Single Product (mínimo viable UI)
export const productSingleMapping: MappingItem[] = [
  { id: "id", source: "id", label: "id", type: "number" },
  { id: "name", source: "name", label: "name", type: "string" },
  { id: "slug", source: "slug", label: "slug", type: "string" },
  { id: "type", source: "type", label: "type", type: "string" },
  { id: "image", source: "images[].src", label: "image", type: "string", defaultValue: "/placeholder-image.png" },
  { id: "regular_price", source: "regular_price", label: "regular_price", type: "string" },
  { id: "sale_price", source: "sale_price", label: "sale_price", type: "string" },
  { id: "price", source: "price", label: "price", type: "string" },
  { id: "final_price", source: null, label: "final_price", type: "string", computed: "sale_price || regular_price || price" },
  { id: "stock_status", source: "stock_status", label: "stock_status", type: "string" },
  { id: "short_description", source: "short_description", label: "short_description", type: "string" },
  // Nuevos campos
  { id: "description", source: "description", label: "description", type: "string" },
  { id: "tags", source: "tags", label: "tags", type: "array", computed: "Array.isArray(tags) ? tags.map(t => t.name) : []" },
  { id: "categories", source: "categories", label: "categories", type: "array" },
  { id: "attributes", source: "attributes", label: "attributes", type: "array" },
  { id: "weight", source: "weight", label: "weight", type: "string" },
  { id: "dimensions", source: "dimensions", label: "dimensions", type: "object" },
];