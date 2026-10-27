// Frasco dibujado en SVG, relleno con un color. Se usa cuando el perfume no tiene image_url.

const HEX = /^#[0-9a-fA-F]{3,8}$/;

// Color por defecto según la familia olfativa principal (si el perfume no trae su propio color)
const COLOR_FAMILIA = {
  Oriental: '#8A5A2B', Floral: '#D9A5B3', Amaderada: '#8A6A3D', 'Aromática': '#6F9B7A',
  'Cítrica': '#E2B93B', 'Ámbar': '#B9771E', Chipre: '#7A8F5A', Frutal: '#E58A7B',
  'Fougère': '#5E8B7E', Cuero: '#6B3F25', Gourmand: '#C98A4B', 'Acuática': '#7FB3C4',
  Almizcladas: '#C9D3E0', 'Aldehídica': '#D8D4C4'
};

export function colorDe(p) {
  if (HEX.test(p?.color || '')) return p.color;
  return COLOR_FAMILIA[p?.family_main] || '#B9771E';
}

export function frasco(color, animado = false) {
  const liquido = HEX.test(color || '') ? color : '#B9771E';
  return `
  <svg viewBox="0 0 120 160" class="frasco" aria-hidden="true">
    <rect x="48" y="6" width="24" height="18" rx="3" fill="var(--ink)"/>
    <rect x="54" y="24" width="12" height="10" fill="var(--sage-deep)"/>
    <rect x="20" y="34" width="80" height="116" rx="14" fill="#fff" fill-opacity=".6" stroke="var(--ink)" stroke-width="2"/>
    <rect class="${animado ? 'liquido liquido-anima' : 'liquido'}" x="26" y="70" width="68" height="74" rx="9" fill="${liquido}"/>
    <rect x="30" y="40" width="8" height="100" rx="4" fill="#fff" fill-opacity=".55"/>
  </svg>`;
}
