// Nombres de los acordes en español (en inglés se muestran tal como vienen).
import { getIdioma } from './i18n.js';

const D = '#141414', L = '#ffffff';
// Color característico de cada acorde: [fondo, texto]
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
  soapy: ['#cfe8ef', D], lactonic: ['#f4ead8', D], animalic: ['#7a4a3a', L], aldehydic: ['#dfe6ea', D],
  alcohol: ['#c9b27a', D], whiskey: ['#b8782e', L], cannabis: ['#6f9a45', L], cherry: ['#b3203f', L],
  mineral: ['#a9b4ba', D], mossy: ['#5f7a3a', L], ozonic: ['#b9e0ee', D], tropical: ['#f08f3c', D],
  tuberose: ['#f1dde6', D], violet: ['#8b5fbf', L]
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
  'white floral': 'floral blanco', woody: 'amaderado', 'yellow floral': 'floral amarillo',
  alcohol: 'alcohol', whiskey: 'whisky', cannabis: 'cannabis', cherry: 'cereza', mineral: 'mineral',
  mossy: 'musgoso', ozonic: 'ozónico', tropical: 'tropical', tuberose: 'nardo', violet: 'violeta'
};

export function acordeNombre(a) {
  const n = getIdioma() === 'es' ? (ES[a] || a) : a;
  return n.charAt(0).toUpperCase() + n.slice(1);
}

export function acordeColor(a) {
  return COLOR[a] || ['#e6e6e6', D];
}
