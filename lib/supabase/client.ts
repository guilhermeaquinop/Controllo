import { createBrowserClient } from '@supabase/ssr'
import { variaveisSupabase } from './env'
import type { Database } from './database.types'

/** Cliente do Supabase para Client Components. Só leitura na tela: toda escrita passa por Server Action. */
export function criarClienteNavegador() {
  const { url, chave } = variaveisSupabase()
  return createBrowserClient<Database>(url, chave)
}
