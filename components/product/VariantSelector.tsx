"use client";

type VariantSelectorProps = {
  attributeName: string;
  options: string[];
  selectedOption?: string;
  onSelect: (option: string) => void;
};

function titleCase(input: string) {
  return (input || "")
    .replace(/^pa_/, "")
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function VariantSelector({
  attributeName,
  options,
  selectedOption,
  onSelect,
}: VariantSelectorProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-saprix-white">
        {titleCase(attributeName)}
      </h3>
      <div className="mt-3 flex flex-wrap gap-3">
        {options.map((opt) => {
          const isSelected = selectedOption === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              className={`px-3 py-2 rounded-md border-2 transition
                ${isSelected ? "border-saprix-indigo bg-saprix-indigo text-white" : "border-saprix-indigo/40 text-saprix-white hover:border-saprix-indigo"}
              `}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}