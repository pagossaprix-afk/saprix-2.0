import { getColorValue } from '@/config/color-mapping';

interface ColorSwatchProps {
    color: string;
    selected?: boolean;
    onClick?: () => void;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

/**
 * Componente para mostrar un swatch de color circular
 * Soporta colores sólidos y gradientes
 */
export function ColorSwatch({
    color,
    selected = false,
    onClick,
    size = 'md',
    showLabel = false
}: ColorSwatchProps) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    };

    const colorValue = getColorValue(color);
    const isWhite = color === 'Blanco' || color.includes('Blanco');

    return (
        <div className="flex flex-col items-center gap-1">
            <button
                onClick={onClick}
                className={`
          ${sizeClasses[size]}
          rounded-full
          border-2
          transition-all
          duration-200
          hover:scale-110
          ${selected
                        ? 'border-saprix-electric-blue ring-2 ring-saprix-electric-blue ring-offset-2 scale-110'
                        : isWhite
                            ? 'border-gray-300 hover:border-gray-400'
                            : 'border-gray-200 hover:border-gray-300'
                    }
          ${onClick ? 'cursor-pointer' : 'cursor-default'}
          shadow-sm
          hover:shadow-md
        `}
                style={{
                    background: colorValue,
                }}
                title={color}
                aria-label={`Color ${color}${selected ? ' (seleccionado)' : ''}`}
                type="button"
            />
            {showLabel && (
                <span className="text-xs text-gray-600 dark:text-gray-400 text-center max-w-[60px] truncate">
                    {color}
                </span>
            )}
        </div>
    );
}

/**
 * Grid de swatches de color
 */
interface ColorSwatchGridProps {
    colors: string[];
    selectedColors?: string[];
    onColorToggle?: (color: string) => void;
    size?: 'sm' | 'md' | 'lg';
    showLabels?: boolean;
    maxColumns?: number;
}

export function ColorSwatchGrid({
    colors,
    selectedColors = [],
    onColorToggle,
    size = 'md',
    showLabels = false,
    maxColumns = 6
}: ColorSwatchGridProps) {
    const gridClass = `grid gap-3 ${maxColumns === 4 ? 'grid-cols-4' :
            maxColumns === 5 ? 'grid-cols-5' :
                maxColumns === 6 ? 'grid-cols-6' :
                    maxColumns === 8 ? 'grid-cols-8' :
                        'grid-cols-auto-fit'
        }`;

    return (
        <div className={gridClass}>
            {colors.map((color) => (
                <ColorSwatch
                    key={color}
                    color={color}
                    selected={selectedColors.includes(color)}
                    onClick={onColorToggle ? () => onColorToggle(color) : undefined}
                    size={size}
                    showLabel={showLabels}
                />
            ))}
        </div>
    );
}
