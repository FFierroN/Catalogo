// Nombres de los acordes en español (en inglés se muestran tal como vienen).
import { getIdioma } from './i18n.js';

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

export function acordeNombre(a) {
  const n = getIdioma() === 'es' ? (ES[a] || a) : a;
  return n.charAt(0).toUpperCase() + n.slice(1);
}
