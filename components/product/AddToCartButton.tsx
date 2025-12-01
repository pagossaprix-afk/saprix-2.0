"use client";

type AddToCartButtonProps = {
  disabled?: boolean;
  onAdd: () => void;
};

export default function AddToCartButton({ disabled, onAdd }: AddToCartButtonProps) {
  return (
    <div className="mt-8">
      <button
        type="button"
        disabled={disabled}
        onClick={onAdd}
        className={`w-full md:w-auto px-6 py-3 rounded-md font-semibold transition
          ${disabled ? "bg-saprix-indigo/40 text-saprix-white/60 cursor-not-allowed" : "bg-saprix-indigo text-white hover:bg-saprix-indigo/90"}
        `}
      >
        Añadir al Carrito
      </button>
    </div>
  );
}