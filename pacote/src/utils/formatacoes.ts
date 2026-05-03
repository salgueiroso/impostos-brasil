import { precisao } from "../valores";

/**
 * Converte um valor numérico para uma string formatada no padrão monetário brasileiro (R$).
 * 
 * A formatação utiliza a localidade 'pt-BR' e realiza o tratamento de caracteres 
 * de espaço especiais (\u00a0) para garantir a compatibilidade em diferentes ambientes de exibição.
 * 
 * @param value - O montante numérico a ser formatado.
 * @returns Uma string contendo o valor formatado como moeda (ex: "R$ 1.250,00").
 * 
 * @example
 * ```typescript
 * toBRL(1250.5); // "R$ 1.250,50"
 * ```
 */
export function toBRL(value: Number): string {
    return value.normalizarPrecisao()
        .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        .trim()
        .replace('\u00a0', ' ');
}

/**
 * Converte um valor decimal em sua representação percentual formatada para o português do Brasil.
 * 
 * A quantidade máxima de casas decimais exibida é definida pela constante {@link precisao}.
 * Valores sem decimais serão exibidos de forma compacta (ex: "10%").
 * 
 * @param value - O valor decimal (ratio) a ser convertido (ex: 0.1 para 10%).
 * @returns Uma string formatada em percentual (ex: "10%" ou "5,55%").
 * 
 * @example
 * ```typescript
 * toPercent(0.055); // "5,5%"
 * ```
 */
export function toPercent(value: Number): string {

    value = value.normalizarPrecisao(precisao + 2);

    let r = value
        .toLocaleString('pt-BR', {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: precisao
        })
        .trim();

    return r;
}

/**
 * Identifica a quantidade de casas decimais presentes em um número.
 * 
 * Útil para validações de precisão ou para determinar a necessidade de arredondamento.
 * 
 * @param valor - O número a ser analisado.
 * @returns O número inteiro de casas decimais encontradas.
 */
export function contarDecimais(valor: number): number {
    let casas = 0;
    while ((valor * Math.pow(10, casas)) % 1 !== 0) casas++;
    return casas;
}

/**
 * Ajusta a precisão de um número através do truncamento de casas decimais excedentes.
 * 
 * Diferente do arredondamento padrão, esta função remove os dígitos além do limite
 * sem alterar os anteriores (floor para positivos), garantindo que somatórios 
 * de centavos não excedam os valores brutos por erros de ponto flutuante.
 * 
 * @param value - O valor numérico original.
 * @param precisaoLocal - A quantidade de casas decimais desejada. Caso seja omitido, 
 * utiliza o valor padrão da constante {@link precisao}.
 * @returns O valor numérico processado com a precisão solicitada.
 * 
 * @example
 * normalizarPrecisao(123.4567, 2); // 123.45
 */
export function normalizarPrecisao(value: Number, precisaoLocal?: number | null): number {

    if (!Number.isFinite(value) || Number.isNaN(value)) {
        return value.valueOf();
    }

    precisaoLocal ??= precisao;
    const fator = Math.pow(10, precisaoLocal);
    const result = Math.trunc(fator * value.valueOf()) / fator;
    return result;
}
