import { normalizarPrecisao, toBRL, toPercent } from "./formatacoes";

/**
 * Normaliza a precisão decimal do número para evitar erros de ponto flutuante em cálculos financeiros.
 * 
 * @param precisaoLocal - Número de casas decimais para o truncamento. Se omitido, utiliza a precisão global definida em {@link precisao}.
 * @returns O valor numérico normalizado.
 */
Number.prototype.normalizarPrecisao = function (precisaoLocal?: number | null): number {
    return normalizarPrecisao(this, precisaoLocal);
}

/**
 * Converte o valor numérico (decimal) para uma string formatada em percentual no padrão brasileiro.
 * 
 * @returns String formatada seguindo a localização 'pt-BR' (ex: 0.075 vira "7,5%").
 */
Number.prototype.toPercent = function (): string {
    return toPercent(this);
}

/**
 * Converte o valor numérico para uma string formatada no padrão monetário brasileiro (BRL).
 * 
 * @returns String formatada incluindo o símbolo da moeda (ex: 1250.5 vira "R$ 1.250,50").
 */
Number.prototype.toBRL = function (): string {
    return toBRL(this);
}
