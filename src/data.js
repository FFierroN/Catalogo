// Capa de datos: si hay variables de Supabase las usa; si no, lee public/perfumes.json.
// Las columnas de la tabla y las claves del JSON son las mismas, así que
// el resto de la app no sabe de dónde vienen los datos.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const CACHE_KEY = 'bruma:catalogo';

export const usandoSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

async function desdeSupabase() {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data, error } = await supabase.from('perfumes').select('*').order('brand').order('name');
  if (error) throw error;
  return data;
}

async function desdeJson() {
  const res = await fetch(`${import.meta.env.BASE_URL}perfumes.json`);
  if (!res.ok) throw new Error('No se pudo cargar el catálogo');
  return res.json();
}

export async function cargarPerfumes() {
  try {
    const items = usandoSupabase ? await desdeSupabase() : await desdeJson();
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(items)); } catch {}
    return { items, guardado: false };
  } catch (err) {
    // Sin conexión: usa la última copia guardada
    try {
      const copia = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (copia?.length) return { items: copia, guardado: true };
    } catch {}
    throw err;
  }
}
