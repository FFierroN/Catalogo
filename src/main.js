import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/figtree/400.css';
import '@fontsource/figtree/600.css';
import './style.css';
import { registerSW } from 'virtual:pwa-register';
import { cargarPerfumes } from './data.js';
import { frasco, colorDe } from './bottle.js';
import {
  t, getIdioma, setIdioma, aplicarIdioma,
  palabras, waLink, canonNota, palabraTxt, familiaTxt, usoTxt, generoTxt, bandera
} from './i18n.js';

registerSW({ immediate: true });
aplicarIdioma();

const app = document.querySelector('#app');

// ---------- utilidades ----------
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const peso = (n) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);
const normaliza = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const urlSegura = (u) => (/^https?:\/\//.test(u || '') ? u : '');
const urlFragantica = (u) => {
  try {
    const url = new URL(u);
    return url.protocol === 'https:' && /(^|\.)fragrantica\./.test(url.hostname) ? url.href : '';
  } catch { return ''; }
};
// "Standard" significa versión base: no se muestra
const versionTxt = (p) => (p.version && p.version !== 'Standard' ? p.version : '');
const tienePrecio = (p) => p.price != null && p.price !== '';
const palabrasNota = (p) => palabras(p.family).map(canonNota);

// ---------- estado ----------
const FAV_KEY = 'bruma:favoritos';
function leerFavs() {
  try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]')); } catch { return new Set(); }
}
const estado = {
  perfumes: [],
  guardado: false,
  q: '',
  marca: 'Todas',
  genero: 'Todos',
  uso: 'Todos',
  nota: 'Todas',
  orden: 'marca',
  soloFavs: false,
  favs: leerFavs(),
  indice: 0 // perfume que se está viendo, para volver al mismo lugar desde la ficha
};
function alternarFav(id) {
  estado.favs.has(id) ? estado.favs.delete(id) : estado.favs.add(id);
  try { localStorage.setItem(FAV_KEY, JSON.stringify([...estado.favs])); } catch {}
}

// Texto para buscar: va en español e inglés para que "woody" y "amaderada" encuentren lo mismo
function textoBusqueda(p) {
  return normaliza(
    [
      p.brand, p.name, versionTxt(p), p.concentration,
      p.family, familiaTxt(p.family, 'en'),
      p.usage, (p.usage_tags || []).map((u) => usoTxt(u, 'en')).join(' '),
      ...(p.notes_top || []), ...(p.notes_heart || []), ...(p.notes_base || [])
    ].join(' ')
  );
}

// Si una foto no carga, se reemplaza por el frasco dibujado
document.addEventListener(
  'error',
  (e) => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement) || !img.dataset.color) return;
    const tpl = document.createElement('template');
    tpl.innerHTML = frasco(img.dataset.color).trim();
    img.replaceWith(tpl.content.firstElementChild);
  },
  true
);

// Cambio de idioma: botones ES / EN (en el catálogo y en la ficha)
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-idioma]');
  if (!b || b.dataset.idioma === getIdioma()) return;
  setIdioma(b.dataset.idioma);
  ruta();
});

function selectorIdioma() {
  const l = getIdioma();
  return `
  <div class="idioma" role="group" aria-label="${esc(t('idioma'))}">
    <button type="button" class="idioma-btn" data-idioma="es" lang="es" aria-pressed="${l === 'es'}" aria-label="Español"><span class="bandera">${bandera('es')}</span>ES</button>
    <button type="button" class="idioma-btn" data-idioma="en" lang="en" aria-pressed="${l === 'en'}" aria-label="English"><span class="bandera">${bandera('en')}</span>EN</button>
  </div>`;
}

// ---------- piezas de interfaz ----------
function arte(p, animado = false) {
  const url = urlSegura(p.image_url);
  return url
    ? `<img src="${esc(url)}" data-color="${esc(colorDe(p))}" alt="${esc(t('frasco_alt'))} ${esc(p.brand)} ${esc(p.name)}" loading="lazy" decoding="async" />`
    : frasco(colorDe(p), animado);
}

const CORAZON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"/></svg>';
const WA_ICONO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.5A9.9 9.9 0 1 0 12.04 2zm0 1.8a8.1 8.1 0 0 1 0 16.2 8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.1.89.9-3.02-.2-.31A8.1 8.1 0 0 1 12.04 3.8zM8.8 7.4c-.2 0-.5.07-.75.35-.26.28-1 1-1 2.4s1.03 2.8 1.17 3c.15.2 2 3.2 4.95 4.35 2.45.97 2.95.78 3.48.73.53-.05 1.7-.7 1.95-1.37.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.56-.34-.3-.15-1.7-.84-1.97-.94-.26-.1-.46-.15-.65.15-.2.3-.75.94-.92 1.13-.17.2-.34.22-.63.07-.3-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.3-.02-.46.13-.6.13-.13.3-.34.44-.5.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.65-1.6-.9-2.18-.23-.56-.47-.48-.65-.49z"/></svg>';
const CERRAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

function botonFav(p) {
  const fav = estado.favs.has(p.id);
  return `<button class="fav" data-id="${esc(p.id)}" aria-pressed="${fav}" aria-label="${esc(fav ? t('fav_quitar') : t('fav_guardar'))}">${CORAZON}</button>`;
}

// Tarjeta: foto, marca, nombre, versión (si no es Standard) y número
function waPerfume(p) {
  const n = [p.brand, p.name, versionTxt(p)].filter(Boolean).join(' ');
  return waLink(t('wa_msg_perfume', n, p.codigo));
}
function botonWaPerfume(p, clase = '') {
  return `<a class="wa-btn ${clase}" href="${esc(waPerfume(p))}" target="_blank" rel="noopener noreferrer">${WA_ICONO}<span>${esc(t('wa_cotizar'))}</span></a>`;
}

function slide(p) {
  const ver = versionTxt(p);
  const nombre = `${p.brand} ${p.name}`;
  return `
  <section class="slide" aria-label="${esc(nombre)}">
    <a class="slide-foto" href="#/perfume/${encodeURIComponent(p.id)}" aria-label="${esc(t('ver_ficha', nombre))}">${arte(p)}</a>
    ${botonFav(p)}
    <a class="wa-slide" href="${esc(waPerfume(p))}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t('wa_cotizar'))}" title="${esc(t('wa_cotizar'))}">${WA_ICONO}</a>
    <div class="slide-texto">
      <p class="marca">${esc(p.brand)}</p>
      <h2 class="nombre">${esc(p.name)}</h2>
      ${ver ? `<p class="version">${esc(ver)}</p>` : ''}
      <p class="numero">${esc(t('num'))} ${esc(p.codigo)}</p>
    </div>
  </section>`;
}

function filtrados() {
  const q = normaliza(estado.q.trim());
  const lista = estado.perfumes.filter((p) => {
    if (estado.marca !== 'Todas' && p.brand !== estado.marca) return false;
    if (estado.genero !== 'Todos' && p.gender !== estado.genero) return false;
    if (estado.uso !== 'Todos' && !(p.usage_tags || []).includes(estado.uso)) return false;
    if (estado.nota !== 'Todas' && !palabrasNota(p).includes(estado.nota)) return false;
    if (estado.soloFavs && !estado.favs.has(p.id)) return false;
    if (!q) return true;
    return q.split(/\s+/).every((palabra) => p._busq.includes(palabra));
  });
  const por = {
    marca: (a, b) => a.brand.localeCompare(b.brand, 'es') || a.name.localeCompare(b.name, 'es'),
    numero: (a, b) => (a.codigo ?? 0) - (b.codigo ?? 0)
  }[estado.orden];
  return lista.sort(por);
}

function filtrosActivos() {
  return [estado.q.trim(), estado.marca !== 'Todas', estado.nota !== 'Todas', estado.genero !== 'Todos', estado.uso !== 'Todos', estado.soloFavs]
    .filter(Boolean).length;
}

// ---------- vista: lista (un perfume por pantalla) ----------
const GENEROS = [['hombre', 'Masculino'], ['mujer', 'Femenino'], ['unisex', 'Unisex']];

const opciones = (lista, actual) =>
  lista.map(({ v, e }) => `<option value="${esc(v)}" ${v === actual ? 'selected' : ''}>${esc(e)}</option>`).join('');

function vistaLista() {
  const l = getIdioma();
  const porTexto = (a, b) => a.e.localeCompare(b.e, l);
  const marcas = [...new Set(estado.perfumes.map((p) => p.brand).filter(Boolean))]
    .map((m) => ({ v: m, e: m })).sort(porTexto);
  const conteo = {};
  estado.perfumes.forEach((p) => (p.usage_tags || []).forEach((u) => (conteo[u] = (conteo[u] || 0) + 1)));
  const usos = Object.keys(conteo).filter((u) => conteo[u] >= 5)
    .map((u) => ({ v: u, e: usoTxt(u) })).sort(porTexto);
  // Notas: cada palabra de la familia olfativa (un perfume "Floral Frutal" sale en Floral y en Frutal)
  const notas = [...new Set(estado.perfumes.flatMap(palabrasNota))]
    .map((w) => ({ v: w, e: palabraTxt(w) })).sort(porTexto);

  app.innerHTML = `
  <header class="barra">
    <div class="barra-izq">
      <span class="logo">Bruma</span>
      ${selectorIdioma()}
    </div>
    <a class="wa-circulo" href="${esc(waLink(t('wa_msg_general')))}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t('wa_consulta'))}" title="${esc(t('wa_consulta'))}">${WA_ICONO}</a>
    <button id="abrir-orden" class="btn-barra" aria-haspopup="dialog">${esc(t('orden'))}</button>
    <button id="abrir" class="btn-barra" aria-haspopup="dialog">${esc(t('filtros'))}<span id="badge" class="badge" hidden></span></button>
  </header>
  ${estado.guardado ? `<p class="aviso" role="status">${esc(t('sin_conexion'))}</p>` : ''}
  <div id="pager" class="pager" tabindex="0" aria-label="${esc(t('catalogo_aria'))}"></div>
  <p id="contador" class="contador" aria-live="polite"></p>

  <dialog id="filtros" aria-labelledby="t-filtros">
    <form method="dialog">
      <div class="dlg-cab">
        <h2 id="t-filtros">${esc(t('filtros'))}</h2>
        <button class="cerrar" value="cerrar" aria-label="${esc(t('cerrar_filtros'))}">${CERRAR}</button>
      </div>
      <label class="campo"><span>${esc(t('buscar'))}</span>
        <input id="q" type="search" placeholder="${esc(t('buscar_ph'))}" value="${esc(estado.q)}" autocomplete="off" />
      </label>
      <button type="button" id="f-favs" class="alterna" aria-pressed="${estado.soloFavs}">${esc(t('solo_favs'))}</button>
      <label class="campo"><span>${esc(t('marca'))}</span>
        <select id="f-marca">${opciones([{ v: 'Todas', e: t('todas_marcas') }, ...marcas], estado.marca)}</select>
      </label>
      <div class="campo" role="group" aria-labelledby="l-para">
        <span id="l-para">${esc(t('para'))}</span>
        <div class="seg">
          ${GENEROS.map(([clave, val]) => `<button type="button" class="seg-btn" data-genero="${val}" aria-pressed="${estado.genero === val}">${esc(t(clave))}</button>`).join('')}
        </div>
      </div>
      <label class="campo"><span>${esc(t('uso'))}</span>
        <select id="f-uso">${opciones([{ v: 'Todos', e: t('cualquier_uso') }, ...usos], estado.uso)}</select>
      </label>
      <label class="campo"><span>${esc(t('notas'))}</span>
        <select id="f-nota">${opciones([{ v: 'Todas', e: t('todas_notas') }, ...notas], estado.nota)}</select>
      </label>
      <div class="dlg-pie">
        <button type="button" id="limpiar" class="boton secundario">${esc(t('limpiar'))}</button>
        <button id="ver" class="boton" value="ok"></button>
      </div>
    </form>
  </dialog>

  <dialog id="orden-dlg" aria-labelledby="t-orden">
    <form method="dialog">
      <div class="dlg-cab">
        <h2 id="t-orden">${esc(t('ordenar_por'))}</h2>
        <button class="cerrar" value="cerrar" aria-label="${esc(t('cerrar_orden'))}">${CERRAR}</button>
      </div>
      <div class="opciones" role="radiogroup" aria-labelledby="t-orden">
        <button type="button" class="opcion" role="radio" data-orden="marca" aria-checked="${estado.orden === 'marca'}">${esc(t('por_marca'))}</button>
        <button type="button" class="opcion" role="radio" data-orden="numero" aria-checked="${estado.orden === 'numero'}">${esc(t('por_numero'))}</button>
      </div>
    </form>
  </dialog>`;

  const pager = document.querySelector('#pager');
  const dlg = document.querySelector('#filtros');
  const dlgOrden = document.querySelector('#orden-dlg');

  pintarSlides(false);
  // Vuelve al perfume en el que estabas antes de abrir la ficha o cambiar de idioma
  pager.scrollTop = estado.indice * pager.clientHeight;
  actualizarContador();

  let pendiente = false;
  pager.addEventListener('scroll', () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => {
      pendiente = false;
      estado.indice = Math.round(pager.scrollTop / pager.clientHeight);
      actualizarContador();
    });
  });

  pager.addEventListener('click', (e) => {
    const btn = e.target.closest('.fav');
    if (!btn) return;
    alternarFav(btn.dataset.id);
    const fav = estado.favs.has(btn.dataset.id);
    btn.setAttribute('aria-pressed', fav);
    btn.setAttribute('aria-label', fav ? t('fav_quitar') : t('fav_guardar'));
  });

  document.querySelector('#abrir').addEventListener('click', () => dlg.showModal());
  document.querySelector('#abrir-orden').addEventListener('click', () => dlgOrden.showModal());
  [dlg, dlgOrden].forEach((d) => d.addEventListener('click', (e) => { if (e.target === d) d.close(); })); // tocar fuera cierra

  // Orden: marca o número
  document.querySelectorAll('[data-orden]').forEach((b) =>
    b.addEventListener('click', () => {
      estado.orden = b.dataset.orden;
      document.querySelectorAll('[data-orden]').forEach((x) => x.setAttribute('aria-checked', x === b));
      pintarSlides(true);
      dlgOrden.close();
    })
  );

  // Filtros
  const enlazar = (id, campo) =>
    document.querySelector(id).addEventListener('input', (e) => { estado[campo] = e.target.value; pintarSlides(true); });
  enlazar('#q', 'q');
  enlazar('#f-marca', 'marca');
  enlazar('#f-uso', 'uso');
  enlazar('#f-nota', 'nota');

  const favs = document.querySelector('#f-favs');
  favs.addEventListener('click', () => {
    estado.soloFavs = !estado.soloFavs;
    favs.setAttribute('aria-pressed', estado.soloFavs);
    pintarSlides(true);
  });

  const botonesGenero = document.querySelectorAll('[data-genero]');
  botonesGenero.forEach((b) =>
    b.addEventListener('click', () => {
      // tocar el botón activo lo desactiva y vuelve a mostrar todos
      estado.genero = estado.genero === b.dataset.genero ? 'Todos' : b.dataset.genero;
      botonesGenero.forEach((x) => x.setAttribute('aria-pressed', x.dataset.genero === estado.genero));
      pintarSlides(true);
    })
  );

  document.querySelector('#limpiar').addEventListener('click', () => {
    Object.assign(estado, { q: '', marca: 'Todas', genero: 'Todos', uso: 'Todos', nota: 'Todas', soloFavs: false });
    document.querySelector('#q').value = '';
    ['#f-marca', '#f-uso', '#f-nota'].forEach((id) => (document.querySelector(id).selectedIndex = 0));
    botonesGenero.forEach((x) => x.setAttribute('aria-pressed', false));
    favs.setAttribute('aria-pressed', false);
    pintarSlides(true);
  });
}

function pintarSlides(volverAlInicio) {
  const lista = filtrados();
  const pager = document.querySelector('#pager');
  pager.innerHTML = lista.length
    ? lista.map(slide).join('')
    : `<section class="slide vacio-slide"><p class="vacio">${esc(
        estado.soloFavs && !estado.favs.size ? t('vacio_favs') : t('vacio_filtros')
      )}</p></section>`;
  if (volverAlInicio) { pager.scrollTop = 0; estado.indice = 0; }
  const n = lista.length;
  const ver = document.querySelector('#ver');
  ver.textContent = t('ver_n', n);
  ver.disabled = n === 0;
  const badge = document.querySelector('#badge');
  const activos = filtrosActivos();
  badge.hidden = activos === 0;
  badge.textContent = activos;
  actualizarContador();
}

function actualizarContador() {
  const el = document.querySelector('#contador');
  if (!el) return;
  const total = document.querySelectorAll('#pager .slide:not(.vacio-slide)').length;
  el.textContent = total ? t('contador', Math.min(estado.indice + 1, total), total) : t('sin_resultados');
}

// ---------- vista: detalle ----------
function capa(titulo, notas, tono) {
  if (!notas?.length) return '';
  return `
  <div class="capa" style="--tono:${tono}%">
    <div class="capa-barra"></div>
    <div>
      <h3>${esc(titulo)}</h3>
      <ul>${notas.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
    </div>
  </div>`;
}

function vistaDetalle(id) {
  const p = estado.perfumes.find((x) => String(x.id) === id);
  const barraSup = `<div class="fila-sup"><a class="volver" href="#/">${esc(t('volver'))}</a>${selectorIdioma()}</div>`;
  if (!p) {
    app.innerHTML = `<main class="detalle">${barraSup}<p class="vacio">${esc(t('no_encontrado'))}</p></main>`;
    return;
  }
  const fav = estado.favs.has(p.id);
  const ver = versionTxt(p);
  const tieneNotas = [p.notes_top, p.notes_heart, p.notes_base].some((n) => n?.length);
  const fragantica = urlFragantica(p.fragrantica_url);
  app.innerHTML = `
  <main class="detalle" style="--liquido:${colorDe(p)}">
    ${barraSup}
    <div class="detalle-arte">${arte(p, true)}</div>
    <p class="marca">${esc(p.brand)}</p>
    <h1 class="nombre">${esc(p.name)}</h1>
    ${ver ? `<p class="version">${esc(ver)}</p>` : ''}
    <p class="numero">${esc(t('num'))} ${esc(p.codigo)}</p>
    ${tienePrecio(p) ? `<p class="precio grande">${peso(p.price)}${p.size_ml ? ` <span>${esc(p.size_ml)} ml</span>` : ''}</p>` : ''}
    ${p.description ? `<p class="descripcion">${esc(p.description)}</p>` : ''}
    <dl class="datos">
      <div><dt>${esc(t('familia'))}</dt><dd>${esc(familiaTxt(p.family))}</dd></div>
      <div><dt>${esc(t('concentracion'))}</dt><dd>${esc(p.concentration)}</dd></div>
      <div><dt>${esc(t('para'))}</dt><dd>${esc(generoTxt(p.gender))}</dd></div>
    </dl>
    ${p.usage_tags?.length ? `<h2>${esc(t('uso'))}</h2><ul class="etiquetas">${p.usage_tags.map((u) => `<li>${esc(usoTxt(u))}</li>`).join('')}</ul>` : ''}
    ${tieneNotas ? `<h2>${esc(t('notas'))}</h2>
    <div class="capas">
      ${capa(t('salida'), p.notes_top, 30)}
      ${capa(t('corazon'), p.notes_heart, 60)}
      ${capa(t('fondo'), p.notes_base, 100)}
    </div>` : ''}
    ${fragantica ? `<a class="boton enlace" href="${esc(fragantica)}" target="_blank" rel="noopener noreferrer">${esc(t('fragantica'))}</a>` : ''}
    ${botonWaPerfume(p, 'wa-ficha')}
    <button id="fav-detalle" class="boton secundario" aria-pressed="${fav}">${esc(fav ? t('fav_quitar') : t('fav_guardar'))}</button>
  </main>`;
  document.querySelector('#fav-detalle').addEventListener('click', () => {
    alternarFav(p.id);
    vistaDetalle(id);
  });
}

// ---------- rutas ----------
function ruta() {
  const m = location.hash.match(/^#\/perfume\/(.+)$/);
  document.body.classList.toggle('modo-lista', !m);
  if (m) { vistaDetalle(decodeURIComponent(m[1])); window.scrollTo(0, 0); }
  else vistaLista();
}
window.addEventListener('hashchange', ruta);

// ---------- arranque ----------
app.innerHTML = `<p class="cargando" role="status">${esc(t('cargando'))}</p>`;
cargarPerfumes()
  .then(({ items, guardado }) => {
    items.forEach((p) => { p._busq = textoBusqueda(p); });
    estado.perfumes = items;
    estado.guardado = guardado;
    ruta();
  })
  .catch(() => {
    app.innerHTML = `<p class="vacio" role="alert">${esc(t('error_carga'))}</p>`;
  });
