"use client";
import React from "react";

type VariantOption = {
  id?: number;
  name?: string;
  option?: string;
};

type Props = {
  product?: any;
  variants?: VariantOption[];
  onAddToCart?: (payload: { variantId?: number; quantity: number }) => void;
};

const ProductForm: React.FC<Props> = ({ product, variants = [], onAddToCart }) => {
  const [quantity, setQuantity] = React.useState<number>(1);
  const [variantId, setVariantId] = React.useState<number | undefined>(
    variants?.[0]?.id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToCart?.({ variantId, quantity });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {Array.isArray(variants) && variants.length > 0 && (
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-300">Variante</span>
          <select
            className="px-3 py-2 rounded bg-dark-performance-800 border border-saprix-indigo text-saprix-white"
            value={variantId ?? ""}
            onChange={(e) => setVariantId(Number(e.target.value))}
          >
            {variants.map((v) => (
              <option key={String(v.id ?? v.option ?? v.name)} value={v.id ?? ""}>
                {v.name ?? v.option ?? v.id}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-300">Cantidad</span>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value) || 1)}
          className="px-3 py-2 rounded bg-dark-performance-800 border border-saprix-indigo text-saprix-white w-28"
        />
      </label>
      <button
        type="submit"
        className="px-5 py-2 rounded bg-saprix-electric-blue text-dark-performance-900 font-bold"
      >
        Añadir al carrito
      </button>
    </form>
  );
};

export default ProductForm;
export { ProductForm };