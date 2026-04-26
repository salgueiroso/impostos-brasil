/**
 * Formata um valor numérico para o padrão de moeda brasileiro (BRL).
 * 
 * @param value - O valor numérico a ser formatado.
 * @returns Uma string contendo o valor formatado como moeda (ex: "R$ 1.250,00").
 * 
 * @example
 * ```typescript
 * toBRL(1250.5); // "R$ 1.250,50"
 * ```
 */
export function toBRL(value: Number): string {
    return value
        .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        .trim()
        .replace('\u00a0', ' ');
}

/**
 * Formata um valor numérico para sua representação percentual em português do Brasil.
 * 
 * @param value - O valor decimal a ser convertido (ex: 0.1 para 10%).
 * @returns Uma string formatada em percentual com até 3 casas decimais (ex: "5,5%").
 * 
 * @example
 * ```typescript
 * toPercent(0.055); // "5,5%"
 * ```
 */
export function toPercent(value: Number): string {
    return value
        .toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 3 })
        .trim();
}
