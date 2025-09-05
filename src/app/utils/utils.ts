import { AbstractControl } from '@angular/forms';

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
  // Sempre trata como reais (ex: "19,90", "19.90" ou 19.90)
  if (typeof value === 'number') {
    return Math.round(value * 100); // 19.90 -> 1990
  }

  // Remove tudo que não for dígito ou vírgula/ponto
  const numericString = value.replace(/[^\d,.-]/g, '').replace(',', '.');

  const amount = parseFloat(numericString);
  return isNaN(amount) ? 0 : Math.round(amount * 100); // "19,90" -> 1990
}

export function cpfValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  const cpf = control.value?.replace(/\D/g, ''); // Remove caracteres não numéricos

  if (!cpf) {
    return { required: true };
  }

  if (cpf.length !== 11) {
    return { invalidLength: true };
  }

  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cpf)) {
    return { invalidCpf: true };
  }

  // Validação dos dígitos verificadores
  let sum = 0;
  let remainder;

  // Primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) {
    return { invalidCpf: true };
  }

  // Segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) {
    return { invalidCpf: true };
  }

  return null; // CPF válido
}
