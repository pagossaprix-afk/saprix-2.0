/**
 * Mapeo de nombres de colores a códigos hexadecimales y gradientes
 * Usado para mostrar swatches de color en la UI
 */

export const COLOR_MAP: Record<string, string> = {
    // Colores básicos
    'Amarillo': '#FFD700',
    'Azul': '#0066CC',
    'Azul Rey': '#4169E1',
    'Azul Menta': '#98D8C8',
    'Azul Oscuro': '#00008B',
    'Blanco': '#FFFFFF',
    'Bronce': '#CD7F32',
    'Dorado': '#FFD700',
    'Fucsia': '#FF00FF',
    'Fuccsia': '#FF00FF', // Variante de escritura
    'Gris': '#808080',
    'Jade': '#00A86B',
    'Morado': '#800080',
    'Naranja': '#FF8C00',
    'Negro': '#000000',
    'Neón': '#39FF14',
    'Rojo': '#DC143C',
    'Verde': '#228B22',
    'Verde Jade': '#00A86B',
    'Verde Neón': '#39FF14',

    // Combinaciones de 2 colores (gradientes 50/50)
    'Amarillo + Azul': 'linear-gradient(90deg, #FFD700 50%, #0066CC 50%)',
    'Amarillo + Negro': 'linear-gradient(90deg, #FFD700 50%, #000000 50%)',
    'Azul + Blanco': 'linear-gradient(90deg, #0066CC 50%, #FFFFFF 50%)',
    'Azul + Fucsia': 'linear-gradient(90deg, #0066CC 50%, #FF00FF 50%)',
    'Azul + Negro': 'linear-gradient(90deg, #0066CC 50%, #000000 50%)',
    'Azul + Neón': 'linear-gradient(90deg, #0066CC 50%, #39FF14 50%)',
    'Azul + Verde': 'linear-gradient(90deg, #0066CC 50%, #228B22 50%)',
    'Azul y Blanco': 'linear-gradient(90deg, #0066CC 50%, #FFFFFF 50%)',
    'Azul y Verde': 'linear-gradient(90deg, #0066CC 50%, #228B22 50%)',
    'Blanco + Azul': 'linear-gradient(90deg, #FFFFFF 50%, #0066CC 50%)',
    'Blanco + Fucsia': 'linear-gradient(90deg, #FFFFFF 50%, #FF00FF 50%)',
    'Blanco + Negro': 'linear-gradient(90deg, #FFFFFF 50%, #000000 50%)',
    'Blanco + Neón': 'linear-gradient(90deg, #FFFFFF 50%, #39FF14 50%)',
    'Blanco + Rojo': 'linear-gradient(90deg, #FFFFFF 50%, #DC143C 50%)',
    'Blanco + Verde': 'linear-gradient(90deg, #FFFFFF 50%, #228B22 50%)',
    'Blanco Azul Neón': 'linear-gradient(90deg, #FFFFFF 33%, #0066CC 33%, #0066CC 66%, #39FF14 66%)',
    'Blanco Rojo + Neón': 'linear-gradient(90deg, #FFFFFF 33%, #DC143C 33%, #DC143C 66%, #39FF14 66%)',
    'Blanco y Azul': 'linear-gradient(90deg, #FFFFFF 50%, #0066CC 50%)',
    'Blanco y Fucsia': 'linear-gradient(90deg, #FFFFFF 50%, #FF00FF 50%)',
    'Blanco y Negro': 'linear-gradient(90deg, #FFFFFF 50%, #000000 50%)',
    'Blanco y Neón': 'linear-gradient(90deg, #FFFFFF 50%, #39FF14 50%)',
    'Blanco+ Negro': 'linear-gradient(90deg, #FFFFFF 50%, #000000 50%)',
    'Colombia': 'linear-gradient(180deg, #FFD700 33%, #0066CC 33%, #0066CC 66%, #DC143C 66%)',
    'Dorado + Negro': 'linear-gradient(90deg, #FFD700 50%, #000000 50%)',
    'Fucsia + Azul': 'linear-gradient(90deg, #FF00FF 50%, #0066CC 50%)',
    'Fucsia + Celeste': 'linear-gradient(90deg, #FF00FF 50%, #87CEEB 50%)',
    'Naranja + Verde': 'linear-gradient(90deg, #FF8C00 50%, #228B22 50%)',
    'Negro + Amarillo': 'linear-gradient(90deg, #000000 50%, #FFD700 50%)',
    'Negro + Azul': 'linear-gradient(90deg, #000000 50%, #0066CC 50%)',
    'Negro + Blanco': 'linear-gradient(90deg, #000000 50%, #FFFFFF 50%)',
    'Negro + Gris': 'linear-gradient(90deg, #000000 50%, #808080 50%)',
    'Negro y Amarillo': 'linear-gradient(90deg, #000000 50%, #FFD700 50%)',
    'Negro y Blanco': 'linear-gradient(90deg, #000000 50%, #FFFFFF 50%)',
    'Negro y Gris': 'linear-gradient(90deg, #000000 50%, #808080 50%)',
    'Rojo + Blanco': 'linear-gradient(90deg, #DC143C 50%, #FFFFFF 50%)',
    'Rojo y Blanco': 'linear-gradient(90deg, #DC143C 50%, #FFFFFF 50%)',
    'Verde + Azul': 'linear-gradient(90deg, #228B22 50%, #0066CC 50%)',
    'Verde Jade + Verde': 'linear-gradient(90deg, #00A86B 50%, #228B22 50%)',
    'Verde Neón + Negro': 'linear-gradient(90deg, #39FF14 50%, #000000 50%)',

    // Especiales
    'Chispas': 'radial-gradient(circle, #FFD700 20%, #000000 20%, #000000 40%, #FFD700 40%, #FFD700 60%, #000000 60%)',
    'Colores': 'linear-gradient(90deg, #FF0000 0%, #FF7F00 14%, #FFFF00 28%, #00FF00 42%, #0000FF 57%, #4B0082 71%, #9400D3 85%)',
    'Cualquier Color': 'linear-gradient(90deg, #FF0000 0%, #FF7F00 14%, #FFFF00 28%, #00FF00 42%, #0000FF 57%, #4B0082 71%, #9400D3 85%)',
    'Variedad': 'linear-gradient(90deg, #FF0000 0%, #FF7F00 14%, #FFFF00 28%, #00FF00 42%, #0000FF 57%, #4B0082 71%, #9400D3 85%)',
};

/**
 * Obtiene el valor de color para un nombre dado
 * Si no existe, retorna un color gris por defecto
 */
export function getColorValue(colorName: string): string {
    return COLOR_MAP[colorName] || '#CCCCCC';
}

/**
 * Verifica si un color es un gradiente
 */
export function isGradient(colorName: string): boolean {
    const value = getColorValue(colorName);
    return value.startsWith('linear-gradient') || value.startsWith('radial-gradient');
}

/**
 * Lista de todos los colores disponibles (ordenados alfabéticamente)
 */
export const AVAILABLE_COLORS = Object.keys(COLOR_MAP).sort();
