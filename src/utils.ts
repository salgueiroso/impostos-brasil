export const toBRL = (value: number) => value
    .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    .trim()
    .replace('\u00a0', ' ');

export const toPercent = (value: number) => value
    .toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 3 })
    .trim();
