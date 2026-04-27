/**
 * Converte um unix timestamp (segundos) em string relativa em PT-BR.
 * Idêntico ao comportamento do Google Maps ("há X dias", "há 2 meses", etc.)
 *
 * @param unixSeconds - timestamp em segundos retornado pela Places API (campo `time`)
 * @returns string no formato "há X [segundo(s)|minuto(s)|hora(s)|dia(s)|semana(s)|mês/meses|ano(s)]"
 */
export function getRelativeTime(unixSeconds: number): string {
  const now = Date.now();
  const diffMs = now - unixSeconds * 1000;
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) return 'há alguns segundos';

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60)
    return diffMinutes === 1 ? 'há 1 minuto' : `há ${diffMinutes} minutos`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24)
    return diffHours === 1 ? 'há 1 hora' : `há ${diffHours} horas`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7)
    return diffDays === 1 ? 'há 1 dia' : `há ${diffDays} dias`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5)
    return diffWeeks === 1 ? 'há 1 semana' : `há ${diffWeeks} semanas`;

  const diffMonths = Math.floor(diffDays / 30.44);
  if (diffMonths < 12)
    return diffMonths === 1 ? 'há 1 mês' : `há ${diffMonths} meses`;

  const diffYears = Math.floor(diffDays / 365.25);
  return diffYears === 1 ? 'há 1 ano' : `há ${diffYears} anos`;
}
