export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;

  const R = 6371; // Raio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return parseFloat(d.toFixed(2));
}

export function formatDecimal(value: number): number {
  return parseFloat(value.toFixed(2)); // Garante 2 casas decimais
}

export function convertRealToCents(value: string | number): number {
  // Se já for número, assume que está em reais e converte
  if (typeof value === 'number') {
    return Math.round(value * 100);
  }

  // Remove caracteres não numéricos e trata separador decimal
  const numericString = value
    .replace(/[^\d,-]/g, '') // Remove tudo exceto dígitos, vírgula e hífen
    .replace(',', '.') // Substitui vírgula por ponto (padrão internacional)
    .replace(/[^0-9.-]/g, ''); // Remove qualquer outro caractere não numérico

  const amount = parseFloat(numericString);

  if (isNaN(amount)) {
    console.error('Valor inválido para conversão:', value);
    return 0; // Ou lance um erro se preferir
  }

  return Math.round(amount * 100); // Converte reais para centavos
}
