import { AliquotasTetoFaixas, Ano, AnoMes, AnoMesAliquotasFaixasMap, Meses, toValorCronologico } from "./types/types";

/**
 * Converte um valor numerico para sua representação em BRL no formato string
 * @param value Valor a ser convertido 
 * @returns Retorna uma string no formato BRL (ex.: R$30,45)
 */
export const toBRL = (value: Number): string => value
    .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    .trim()
    .replace('\u00a0', ' ');

/**
 * Converte um valor numerico para sua representação em percentual no formato string
 * @param value Valor a ser convertido 
 * @returns Retorna uma string no formato percentual (ex.: 30%)
 */
export const toPercent = (value: Number): string => value
    .toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 3 })
    .trim();


/**
 * Declaração global dos metodos de extensao
 */
declare global {
    interface Number {
        toBRL(): string;
        toPercent(): string;
    }
}
Number.prototype.toBRL = function () { return toBRL(this) };
Number.prototype.toPercent = function () { return toPercent(this) };




/**
 * Busca a alíquota vigente no período informado
 * @param ano Ano com 4 dígitos. Ex.: 2025, 2027
 * @param mes Mês da vigencia.
 * @param faixas Mapa das faixas de impostos.
 * @returns Retorna um mapa com as aliquotas vigentes no periodo informada ou null se o periodo não for encontrado.
 */
export const getAliquotasVigentes = (ano: Ano, mes: Meses, faixas?: AnoMesAliquotasFaixasMap | null): AliquotasTetoFaixas | null => {

    if (!faixas) return null;

    let keys = Array.from(faixas.keys()).sort((a, b) => toValorCronologico(a) - toValorCronologico(b)).reverse();

    let firstLessKey = keys.find(k => {
        let valido = toValorCronologico(k) <= toValorCronologico({ Ano: ano, Mes: mes })
        return valido;
    });

    if (!firstLessKey) throw "Ano de vigencia nao configurado";


    return faixas.get(firstLessKey) ?? null;

}