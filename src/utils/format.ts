export function formatAmount(n: number): string {
  return n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatRate(n: number): string {
  return n.toFixed(3);
}

export function formatMoney(n: number | undefined, currency: string): string {
  if (!n) return '-';
  const sym = currency === 'USD' ? '$' : 'S/';
  return `${sym} ${n.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
}

/** Masks all but last 4 digits: "1234567890" → "**** 7890" */
export function maskAccount(number: string): string {
  return `**** ${number.slice(-4)}`;
}
