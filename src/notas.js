// Traducción de las notas olfativas (salida, corazón, fondo).
// Si una nota no está en el diccionario se muestra en inglés, tal como viene de la base.
import { getIdioma } from './i18n.js';

// Errores de escritura frecuentes en la base de origen (para inglés)
const FIX = {
  hiacynth: 'hyacinth', vanila: 'vanilla', vanille: 'vanilla', marshamallow: 'marshmallow',
  'oak moss': 'oakmoss', 'ylang ylang': 'ylang-ylang', citruses: 'citrus', 'fruity notes': 'fruity notes'
};

const ES = {
  'agarwood (oud)': 'agar (oud)', aldehydes: 'aldehídos', almond: 'almendra', 'amalfi lemon': 'limón de Amalfi',
  amber: 'ámbar', ambergris: 'ámbar gris', ambertonic: 'ambertonic', amberwood: 'madera ámbar', ambrette: 'ambrette',
  'ambrette (musk mallow)': 'ambrette (malva almizclera)', ambrofix: 'ambrofix', ambroxan: 'ambroxan', apple: 'manzana',
  apricot: 'damasco', aquozone: 'aquozone', artemisia: 'artemisa', 'atlas cedar': 'cedro del Atlas', 'australian sandalwood': 'sándalo australiano',
  bamboo: 'bambú', 'banana leaf': 'hoja de banano', basil: 'albahaca', 'bay leaf': 'hoja de laurel', 'belambra tree': 'árbol de belambra',
  bellflower: 'campanilla', benzoin: 'benjuí', bergamot: 'bergamota', 'bergamot leaf': 'hoja de bergamota', 'berry fruits': 'frutos del bosque',
  birch: 'abedul', 'bitter almond': 'almendra amarga', 'bitter orange': 'naranja amarga', 'black currant': 'grosella negra',
  'black pepper': 'pimienta negra', 'black vanilla husk': 'vaina de vainilla negra', blackberry: 'mora', 'blonde woods': 'maderas claras',
  'blood mandarin': 'mandarina roja', 'blood orange': 'naranja sanguina', 'blue lotus': 'loto azul', 'bourbon geranium': 'geranio bourbon',
  'bourbon vanilla': 'vainilla bourbon', 'brazilian orange': 'naranja brasileña', 'brazilian rosewood': 'palo de rosa brasileño',
  'brown sugar': 'azúcar morena', 'bulgarian rose': 'rosa búlgara', cacao: 'cacao', 'calabrian bergamot': 'bergamota de Calabria',
  'calabrian mandarin': 'mandarina de Calabria', calone: 'calone', calypsone: 'calypsone', 'candied lemon': 'limón confitado',
  cannabis: 'cannabis', cappuccino: 'capuchino', caramel: 'caramelo', caraway: 'alcaravea', cardamom: 'cardamomo', carnation: 'clavel',
  cascalone: 'cascalone', cashmeran: 'cashmeran', 'cashmere wood': 'madera cachemira', cassis: 'casis', cedar: 'cedro', cedarwood: 'madera de cedro',
  chamomile: 'manzanilla', cherry: 'cereza', 'chili pepper': 'ají', 'chinese jasmine': 'jazmín chino', chinotto: 'chinotto', chocolate: 'chocolate',
  cinnamon: 'canela', citron: 'cidra', citruses: 'cítricos', citrus: 'cítricos', civet: 'algalia', 'clary sage': 'salvia esclarea', clearwood: 'clearwood',
  clove: 'clavo de olor', clover: 'trébol', coconut: 'coco', 'coconut water': 'agua de coco', coffee: 'café', coriander: 'cilantro',
  'cotton candy': 'algodón de azúcar', coumarin: 'cumarina', cucumber: 'pepino', cypress: 'ciprés', 'damask rose': 'rosa damascena',
  datura: 'datura', dewberry: 'zarzamora', 'earthy notes': 'notas terrosas', 'egyptian jasmine': 'jazmín egipcio', elemi: 'elemí',
  'fig leaf': 'hoja de higuera', 'fir resin': 'resina de abeto', flowers: 'flores', 'forget me not': 'nomeolvides', frangipani: 'frangipani',
  frankincense: 'incienso', freesia: 'fresia', fruits: 'frutas', 'fruity notes': 'notas frutales', galbanum: 'gálbano', 'galbanum leaf': 'hoja de gálbano',
  gardenia: 'gardenia', geranium: 'geranio', ginger: 'jengibre', 'gourmand accord': 'acorde gourmand', 'granny smith apple': 'manzana Granny Smith',
  grapefruit: 'pomelo', 'grasse rose': 'rosa de Grasse', 'green apple': 'manzana verde', 'green mandarin': 'mandarina verde', 'green notes': 'notas verdes',
  'guaiac wood': 'palo de guayaco', guava: 'guayaba', 'haitian vetiver': 'vetiver de Haití', hazelnut: 'avellana', hedione: 'hedione',
  hyacinth: 'jacinto', honey: 'miel', honeysuckle: 'madreselva', 'ice cream': 'helado', incense: 'incienso', 'indian jasmine': 'jazmín indio',
  'indonesian patchouli leaf': 'hoja de pachulí indonesio', iris: 'iris', 'iris pallida': 'iris pallida', 'iso e super': 'iso e super',
  'italian jasmine': 'jazmín italiano', 'italian mandarin': 'mandarina italiana', 'italian orange': 'naranja italiana', jasmine: 'jazmín',
  'jasmine sambac': 'jazmín sambac', 'jasmine tea': 'té de jazmín', 'java vetiver oil': 'aceite de vetiver de Java', juniper: 'enebro',
  'juniper berries': 'bayas de enebro', kiwi: 'kiwi', labdanum: 'láudano', 'laotian oud': 'oud de Laos', 'lapsang souchong tea': 'té lapsang souchong',
  lavender: 'lavanda', leather: 'cuero', lemon: 'limón', 'lemon blossom': 'flor de limón', 'lemon verbena': 'hierba luisa', 'lemon zest': 'ralladura de limón',
  licorice: 'regaliz', lilac: 'lila', lily: 'lirio', 'lily-of-the-valley': 'lirio de los valles', lime: 'lima', liquor: 'licor', litchi: 'lichi',
  'litsea cubeba': 'litsea cubeba', 'longan berries': 'longan', lotus: 'loto', loukhoum: 'delicia turca', 'madagascar pepper': 'pimienta de Madagascar',
  'madagascar vanilla': 'vainilla de Madagascar', magnolia: 'magnolia', 'magnolia petals': 'pétalos de magnolia', mahogany: 'caoba', mahonial: 'mahonial',
  'mandarin orange': 'mandarina', 'marine notes': 'notas marinas', marshmallow: 'malvavisco', 'mastic or lentisque': 'mástique o lentisco', melon: 'melón',
  meringue: 'merengue', mimosa: 'mimosa', 'mineral notes': 'notas minerales', mint: 'menta', 'mirabelle plum': 'ciruela mirabel', 'moroccan jasmine': 'jazmín marroquí',
  moss: 'musgo', musk: 'almizcle', 'musk vodka': 'musk vodka', myrrh: 'mirra', myrtle: 'mirto', narcissus: 'narciso', neroli: 'neroli', 'neroli essence': 'esencia de neroli',
  'night blooming jasmine': 'jazmín de noche', nutmeg: 'nuez moscada', oak: 'roble', oakmoss: 'musgo de roble', olibanum: 'olíbano', 'olive tree': 'olivo',
  opoponax: 'opopónax', orange: 'naranja', 'orange blossom': 'azahar', 'orange peel': 'cáscara de naranja', orchid: 'orquídea', 'oriental notes': 'notas orientales',
  orris: 'orris', 'orris root': 'raíz de orris', osmanthus: 'osmanthus', oud: 'oud', panacotta: 'panna cotta', paprika: 'pimentón', papyrus: 'papiro',
  patchouli: 'pachulí', peach: 'durazno', pear: 'pera', 'pear blossom': 'flor de peral', peony: 'peonía', pepper: 'pimienta', pepperwood: 'pepperwood',
  petalia: 'petalia', petitgrain: 'petitgrain', 'pimento seeds': 'semillas de pimienta de Jamaica', pineapple: 'piña', 'pink peony': 'peonía rosada',
  'pink pepper': 'pimienta rosa', pistachio: 'pistacho', plum: 'ciruela', 'plum blossom': 'flor de ciruelo', pomarose: 'pomarose', pomegranate: 'granada',
  'powdery notes': 'notas polvosas', praline: 'praliné', 'rangoon creeper': 'enredadera de Rangún', raspberry: 'frambuesa', 'red apple': 'manzana roja',
  'red berries': 'frutos rojos', 'red currant': 'grosella roja', 'red fruits': 'frutas rojas', 'red lily': 'lirio rojo', 'red pepper': 'pimiento rojo',
  resins: 'resinas', rice: 'arroz', 'roasted coffee beans': 'granos de café tostado', rose: 'rosa', 'rose hip': 'escaramujo', rosemary: 'romero',
  rum: 'ron', saffron: 'azafrán', sage: 'salvia', salt: 'sal', sandalwood: 'sándalo', 'sea notes': 'notas marinas', 'sea salt': 'sal marina',
  serenolide: 'serenolide', shiso: 'shiso', 'sichuan pepper': 'pimienta de Sichuan', 'sicilian lemon': 'limón siciliano', 'sicilian mandarin': 'mandarina siciliana',
  'sicilian orange': 'naranja siciliana', smoke: 'humo', soap: 'jabón', 'solar notes': 'notas solares', 'sour cherry': 'cereza ácida', spices: 'especias',
  'spicy notes': 'notas especiadas', 'spun sugar': 'azúcar hilado', strawberry: 'frutilla', styrax: 'estoraque', suede: 'gamuza', sylkolide: 'sylkolide',
  'tahitian vetiver': 'vetiver de Tahití', tangerine: 'mandarina', 'teak wood': 'madera de teca', 'texas cedar': 'cedro de Texas', thyme: 'tomillo',
  'tiare flower': 'flor de tiaré', tobacco: 'tabaco', 'tobacco leaf': 'hoja de tabaco', toffee: 'toffee', tonka: 'tonka', 'tonka bean': 'haba tonka',
  truffle: 'trufa', tuberose: 'nardo', 'tunisian neroli': 'neroli de Túnez', 'tunisian orange blossom': 'azahar de Túnez', 'turkish rose': 'rosa turca',
  'tuscan iris': 'iris toscano', vanilla: 'vainilla', 'vanilla absolute': 'absoluto de vainilla', 'vanilla caviar': 'caviar de vainilla', verbena: 'verbena',
  vetiver: 'vetiver', violet: 'violeta', 'violet leaf': 'hoja de violeta', 'virginia cedar': 'cedro de Virginia', 'virginian cedar': 'cedro de Virginia',
  'water hyacinth': 'jacinto de agua', 'water lily': 'nenúfar', 'water notes': 'notas acuáticas', 'watery notes': 'notas acuosas', 'whipped cream': 'crema batida',
  whiskey: 'whisky', 'white honey': 'miel blanca', 'white musk': 'almizcle blanco', 'white peach': 'durazno blanco', 'white pepper': 'pimienta blanca',
  'white rose': 'rosa blanca', 'white wood': 'madera blanca', 'white woods': 'maderas blancas', wisteria: 'glicina', 'woodsy notes': 'notas amaderadas',
  'woody notes': 'notas amaderadas', 'ylang-ylang': 'ilang ilang', yuzu: 'yuzu'
};

export function notaTxt(n) {
  const k = String(n).replace(/[^\x20-\x7e]/g, '').trim().toLowerCase();
  const base = FIX[k] || k;
  const txt = getIdioma() === 'es' ? (ES[base] || base) : base;
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}
