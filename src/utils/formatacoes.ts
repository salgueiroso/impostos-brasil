/**
 * Converte um valor numerico para sua representação em BRL no formato string
 * @param value Valor a ser convertido 
 * @returns Retorna uma string no formato BRL (ex.: R$30,45)
 */
export function toBRL(value: Number): string {
    return value
        .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        .trim()
        .replace('\u00a0', ' ');
}

/**
 * Converte um valor numerico para sua representação em percentual no formato string
 * @param value Valor a ser convertido 
 * @returns Retorna uma string no formato percentual (ex.: 30%)
 */
export function toPercent(value: Number): string {
    return value
        .toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 3 })
        .trim();
}

