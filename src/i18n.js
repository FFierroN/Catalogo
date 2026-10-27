// Idioma de la interfaz (ES / EN). Las marcas y los nombres de los perfumes no se traducen.
const KEY = 'bruma:idioma';

let idioma = 'es';
try { idioma = localStorage.getItem(KEY) === 'en' ? 'en' : 'es'; } catch {}

const TEXTOS = {
  es: {
    titulo: 'Bruma, catálogo de perfumes',
    catalogo_aria: 'Catálogo de perfumes. Desliza hacia arriba para ver el siguiente.',
    idioma: 'Idioma',
    orden: 'Orden',
    filtros: 'Filtros',
    ordenar_por: 'Ordenar por',
    por_marca: 'Marca',
    por_numero: 'Número',
    cerrar_filtros: 'Cerrar filtros',
    cerrar_orden: 'Cerrar orden',
    buscar: 'Buscar',
    buscar_ph: 'Marca, nombre o familia',
    solo_favs: 'Solo mis favoritos',
    marca: 'Marca',
    todas_marcas: 'Todas las marcas',
    para: 'Para',
    hombre: 'Hombre',
    mujer: 'Mujer',
    unisex: 'Unisex',
    uso: 'Uso ideal',
    cualquier_uso: 'Cualquier uso',
    notas: 'Notas',
    todas_notas: 'Todas las notas',
    limpiar: 'Limpiar',
    ver_n: (n) => (n === 1 ? 'Ver 1 perfume' : `Ver ${n} perfumes`),
    contador: (i, n) => `${i} de ${n}`,
    sin_resultados: 'Sin resultados',
    vacio_favs: 'Aún no tienes favoritos. Toca el corazón de un perfume para guardarlo.',
    vacio_filtros: 'No hay perfumes con esos filtros. Abre Filtros y prueba con otra opción.',
    sin_conexion: 'Sin conexión. Mostrando la última versión guardada.',
    cargando: 'Cargando catálogo…',
    error_carga: 'No pudimos cargar el catálogo. Revisa tu conexión y vuelve a abrir la app.',
    fav_guardar: 'Guardar en favoritos',
    fav_quitar: 'Quitar de favoritos',
    ver_ficha: (nombre) => `Ver ficha de ${nombre}`,
    frasco_alt: 'Frasco de',
    num: 'N°',
    volver: 'Volver al catálogo',
    wa_cotizar: 'Cotizar por WhatsApp',
    wa_consulta: 'Consultar por WhatsApp',
    wa_msg_perfume: (n, num) => `Hola, estuve viendo el catálogo y me gustaría cotizar el perfume "${n}" (N° ${num}). ¿Me podrían dar más información?`,
    wa_msg_general: 'Hola, estuve viendo el catálogo y tengo una consulta.',
    no_encontrado: 'No encontramos ese perfume.',
    familia: 'Familia',
    concentracion: 'Concentración',
    salida: 'Salida',
    corazon: 'Corazón',
    fondo: 'Fondo',
    fragantica: 'Ver en Fragantica'
  },
  en: {
    titulo: 'Bruma, perfume catalog',
    catalogo_aria: 'Perfume catalog. Swipe up to see the next one.',
    idioma: 'Language',
    orden: 'Sort',
    filtros: 'Filters',
    ordenar_por: 'Sort by',
    por_marca: 'Brand',
    por_numero: 'Number',
    cerrar_filtros: 'Close filters',
    cerrar_orden: 'Close sort',
    buscar: 'Search',
    buscar_ph: 'Brand, name or family',
    solo_favs: 'Only my favorites',
    marca: 'Brand',
    todas_marcas: 'All brands',
    para: 'For',
    hombre: 'Men',
    mujer: 'Women',
    unisex: 'Unisex',
    uso: 'Best for',
    cualquier_uso: 'Any occasion',
    notas: 'Notes',
    todas_notas: 'All notes',
    limpiar: 'Clear',
    ver_n: (n) => (n === 1 ? 'Show 1 perfume' : `Show ${n} perfumes`),
    contador: (i, n) => `${i} of ${n}`,
    sin_resultados: 'No results',
    vacio_favs: "You don't have any favorites yet. Tap the heart on a perfume to save it.",
    vacio_filtros: 'No perfumes match these filters. Open Filters and try another option.',
    sin_conexion: "You're offline. Showing the last saved version.",
    cargando: 'Loading catalog…',
    error_carga: "We couldn't load the catalog. Check your connection and reopen the app.",
    fav_guardar: 'Save to favorites',
    fav_quitar: 'Remove from favorites',
    ver_ficha: (nombre) => `View details for ${nombre}`,
    frasco_alt: 'Bottle of',
    num: 'No.',
    volver: 'Back to catalog',
    wa_cotizar: 'Get a quote on WhatsApp',
    wa_consulta: 'Ask on WhatsApp',
    wa_msg_perfume: (n, num) => `Hi, I was browsing the catalog and I'd like a quote for the perfume "${n}" (No. ${num}). Could you give me more information?`,
    wa_msg_general: 'Hi, I was browsing the catalog and I have a question.',
    no_encontrado: "We couldn't find that perfume.",
    familia: 'Family',
    concentracion: 'Concentration',
    salida: 'Top',
    corazon: 'Heart',
    fondo: 'Base',
    fragantica: 'View on Fragantica'
  }
};

// Familia olfativa (columna "Familia Olfativa" del CSV), palabra por palabra
const PALABRAS = {
  'Acuática': 'Aquatic', 'Aldehídica': 'Aldehydic', 'Almizcladas': 'Musky', 'Amaderada': 'Woody',
  'Ámbar': 'Amber', 'Aromática': 'Aromatic', 'Blanco': 'White', 'Chipre': 'Chypre', 'Cítrica': 'Citrus',
  'Cuero': 'Leather', 'Dulce': 'Sweet', 'Especiada': 'Spicy', 'Floral': 'Floral', 'Fougère': 'Fougère',
  'Fresca': 'Fresh', 'Frutal': 'Fruity', 'Futurista': 'Futuristic', 'Gourmand': 'Gourmand',
  'Intenso': 'Intense', 'Iris': 'Iris', 'Licorosa': 'Boozy', 'Marina': 'Marine', 'Marinas': 'Marine',
  'Oriental': 'Oriental', 'Pachulí': 'Patchouli', 'Vainilla': 'Vanilla', 'Verde': 'Green', 'Violeta': 'Violet'
};
// Familias donde el orden natural en inglés es distinto
const FRASES = {
  'Floral Blanco': 'White Floral',
  'Floral Verde': 'Green Floral',
  'Almizcladas Marinas': 'Marine Musk',
  'Floral Marina Gourmand': 'Marine Floral Gourmand',
  'Floral Licorosa Gourmand': 'Boozy Floral Gourmand',
  'Oriental Fougère Intenso': 'Intense Oriental Fougère'
};
// Palabras que significan lo mismo y se agrupan en el filtro de Notas
const ALIAS = { Marinas: 'Marina' };

// Uso ideal (columna "Uso Ideal" del CSV, separada por "/")
const USO = {
  'Noche': 'Night', 'Día': 'Day', 'Citas': 'Dates', 'Verano': 'Summer', 'Otoño': 'Autumn',
  'Primavera': 'Spring', 'Invierno': 'Winter', 'Diario': 'Everyday', 'Versátil': 'Versatile',
  'Fiesta': 'Party', 'Elegante': 'Elegant', 'Oficina': 'Office', 'Formal': 'Formal', 'Casual': 'Casual',
  'Deporte': 'Sport', 'Eventos': 'Events', 'Juventud': 'Youthful', 'Salidas': 'Nights out', 'Gala': 'Gala',
  'Día y Noche': 'Day & Night', 'Moderno': 'Modern', 'Dulce': 'Sweet', 'Playa': 'Beach', 'Fresco': 'Fresh',
  'Seducción': 'Seduction', 'Urbano': 'Urban', 'Eventos Elegantes': 'Elegant Events',
  'Clima Frío': 'Cold Weather', 'Eventos Especiales': 'Special Events', 'Llamativo': 'Eye-catching',
  'Alta Costura': 'Haute Couture', 'Noche de Verano': 'Summer Night', 'Profesional': 'Professional',
  'Eventos Exclusivos': 'Exclusive Events', 'Eventos Modernos': 'Modern Events', 'Frío': 'Cold',
  'Firma': 'Signature', 'Todo el año': 'All Year', 'Clásico': 'Classic', 'Impacto': 'Impact',
  'Sofisticado': 'Sophisticated', 'Lluvia': 'Rain', 'Especial': 'Special', 'Intenso': 'Intense',
  'Glamour': 'Glamour'
};

const GENERO_EN = { Masculino: 'Men', Femenino: 'Women', Unisex: 'Unisex' };

export const getIdioma = () => idioma;

export function setIdioma(l) {
  idioma = l === 'en' ? 'en' : 'es';
  try { localStorage.setItem(KEY, idioma); } catch {}
  aplicarIdioma();
}

export function aplicarIdioma() {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = idioma;
  document.title = t('titulo');
}

export function t(clave, ...args) {
  const v = TEXTOS[idioma][clave];
  return typeof v === 'function' ? v(...args) : v;
}

// ----- traducción de datos del catálogo (si no hay traducción, se muestra el original) -----
export const palabras = (s) => String(s ?? '').split(/\s+/).filter(Boolean);
export const canonNota = (w) => ALIAS[w] || w;
export const palabraTxt = (w, l = idioma) => (l === 'en' ? PALABRAS[w] || w : w);
export const familiaTxt = (s, l = idioma) =>
  l === 'en' ? FRASES[s] || palabras(s).map((w) => PALABRAS[w] || w).join(' ') : s;
export const usoTxt = (tag, l = idioma) => (l === 'en' ? USO[tag] || tag : tag);
export const generoTxt = (g, l = idioma) => (l === 'en' ? GENERO_EN[g] || g : g);

// ----- banderas dibujadas en SVG (los emojis de bandera no se ven en Windows) -----
export function bandera(l) {
  if (l === 'es') {
    return '<svg viewBox="0 0 22 15" aria-hidden="true"><rect width="22" height="15" fill="#AA151B"/><rect y="3.75" width="22" height="7.5" fill="#F1BF00"/></svg>';
  }
  const h = 15 / 13;
  let s = '<svg viewBox="0 0 22 15" aria-hidden="true"><rect width="22" height="15" fill="#fff"/>';
  for (let i = 0; i < 13; i += 2) s += `<rect y="${(i * h).toFixed(2)}" width="22" height="${h.toFixed(2)}" fill="#B22234"/>`;
  s += `<rect width="9.4" height="${(7 * h).toFixed(2)}" fill="#3C3B6E"/>`;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    s += `<circle cx="${(1.6 + c * 2.1).toFixed(1)}" cy="${(1.5 + r * 2.4).toFixed(1)}" r=".5" fill="#fff"/>`;
  }
  return s + '</svg>';
}

// ---------- WhatsApp (número de prueba) ----------
export const WA_NUMERO = '15416300493';
export function waLink(mensaje) {
  return `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}
