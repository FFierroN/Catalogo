// Gráfico de acordes: colores propios y nombres en español.
// Cada acorde es [fondo, texto]. Los anchos de las barras son decorativos (decrecientes),
// porque la base de datos solo trae el orden de los 5 acordes, no su intensidad.
import { getIdioma } from './i18n.js';

const D = '#141414', L = '#ffffff';
const COLOR = {
  citrus: ['#e8d23a', D], fruity: ['#e0577a', L], floral: ['#e89ab8', D], 'white floral': ['#f0e6ee', D],
  'yellow floral': ['#f3d65c', D], rose: ['#d6456b', L], woody: ['#8a6040', L], amber: ['#d98a2b', D],
  'warm spicy': ['#b5452a', L], 'fresh spicy': ['#7fb069', D], 'soft spicy': ['#c9764a', L],
  aromatic: ['#5aa38f', D], green: ['#4f9a4f', L], herbal: ['#6aa86a', D], lavender: ['#9a82c9', D],
  vanilla: ['#f2dba0', D], sweet: ['#e58fa5', D], musky: ['#cdbfd6', D], powdery: ['#ead9e4', D],
  iris: ['#b7a4d6', D], leather: ['#6b3f2a', L], oud: ['#4a3328', L], patchouli: ['#7a6a3a', L],
  earthy: ['#8b7355', L], smoky: ['#666666', L], tobacco: ['#8a5a2c', L], coffee: ['#5b3a29', L],
  chocolate: ['#5a3320', L], cacao: ['#6b4030', L], caramel: ['#c68642', D], honey: ['#e3a72f', D],
  cinnamon: ['#a8502b', L], almond: ['#d8b48a', D], nutty: ['#b88a5a', D], coconut: ['#efe6d6', D],
  aquatic: ['#4aa3c7', D], marine: ['#3b8fb5', L], salty: ['#9cc6d8', D], fresh: ['#88cfe0', D],
  soapy: ['#cfe8ef', D], lactonic: ['#f4ead8', D], animalic: ['#7a4a3a', L], aldehydic: ['#dfe6ea', D]
};

const ES = {
  aldehydic: 'aldehídico', almond: 'almendra', amber: 'ámbar', animalic: 'animálico', aquatic: 'acuático',
  aromatic: 'aromático', cacao: 'cacao', caramel: 'caramelo', chocolate: 'chocolate', cinnamon: 'canela',
  citrus: 'cítrico', coconut: 'coco', coffee: 'café', earthy: 'terroso', floral: 'floral', fresh: 'fresco',
  'fresh spicy': 'especiado fresco', fruity: 'frutal', green: 'verde', herbal: 'herbal', honey: 'miel',
  iris: 'iris', lactonic: 'lactónico', lavender: 'lavanda', leather: 'cuero', marine: 'marino',
  musky: 'almizclado', nutty: 'frutos secos', oud: 'oud', patchouli: 'pachulí', powdery: 'polvoso',
  rose: 'rosa', salty: 'salado', smoky: 'ahumado', soapy: 'jabonoso', 'soft spicy': 'especiado suave',
  sweet: 'dulce', tobacco: 'tabaco', vanilla: 'vainilla', 'warm spicy': 'especiado cálido',
  'white floral': 'floral blanco', woody: 'amaderado', 'yellow floral': 'floral amarillo'
};

const ANCHOS = [100, 93, 86, 79, 72];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function acordeNombre(a) {
  return cap(getIdioma() === 'es' ? (ES[a] || a) : a);
}

export function graficoAcordes(lista, esc) {
  return lista.slice(0, 5).map((a, i) => {
    const [bg, fg] = COLOR[a] || ['#d9d9d9', D];
    return `<li class="acorde" style="--w:${ANCHOS[i]}%;--bg:${bg};--fg:${fg}"><span>${esc(acordeNombre(a))}</span></li>`;
  }).join('');
}
