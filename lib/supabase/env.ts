// URL e chave pública do Supabase. As duas podem ir para o navegador (o RLS protege os dados).
// Referência direta a process.env.NEXT_PUBLIC_* para o Next embutir os valores no bundle do navegador.
export function variaveisSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const chave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !chave) {
    throw new Error('Faltam NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY no .env.local (veja .env.example).')
  }
  return { url, chave }
}
