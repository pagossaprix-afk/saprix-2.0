export type Resource = "products" | "orders" | "customers";

export type MappingItemType = "string" | "number" | "boolean" | "date" | "array" | "object" | "any";

export interface MappingItem {
  id: string;
  source: string | null;
  label: string;
  type: MappingItemType;
  defaultValue?: string;
  computed?: string; // expresión JS que puede referenciar labels y/o paths de source
}