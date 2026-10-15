// Erros do Supabase Auth em português. O código vem em error.code.
const MENSAGENS: Record<string, string> = {
  invalid_credentials: 'E-mail ou senha incorretos.',
  email_not_confirmed: 'Confirme seu e-mail antes de entrar. Procure a mensagem que enviamos.',
  user_already_exists: 'Já existe uma conta com este e-mail.',
  email_exists: 'Já existe uma conta com este e-mail.',
  weak_password: 'Senha fraca. Use pelo menos 8 caracteres, misturando letras e números.',
  same_password: 'A nova senha precisa ser diferente da atual.',
  over_email_send_rate_limit: 'Muitos e-mails enviados. Espere alguns minutos e tente de novo.',
  over_request_rate_limit: 'Muitas tentativas. Espere alguns minutos e tente de novo.',
  signup_disabled: 'Cadastro desativado no momento.',
  session_not_found: 'Sua sessão expirou. Entre de novo.',
  otp_expired: 'O link expirou ou já foi usado. Peça outro.',
}

export const ERRO_GENERICO = 'Algo deu errado. Tente de novo em instantes.'

export function mensagemDeErroAuth(codigo: string | undefined | null): string {
  return (codigo && MENSAGENS[codigo]) || ERRO_GENERICO
}
