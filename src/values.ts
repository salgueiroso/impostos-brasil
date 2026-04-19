import { AliquotasTetoFaixas, Meses, VigenciaFaixas } from "./types";

/**
 * Valor maximo da dedução com instrução
 */
export const deducaoMaximaInstrucao = 3561.50;


/**
 * Mapa preenchido com as vigencias de aliquotas e faixas INSS
 */
export const vigenciaFaixasInss: VigenciaFaixas = new Map([
    [2026.01, new Map([
        [0.075, 1621.00],
        [0.09, 3242.00],
        [0.12, 4863.00],
        [0.14, 8157.41]])
    ]
]);

/**
 * Mapa preenchido com as vigencias de aliquotas e faixas IRPF
 */
export const vigenciaFaixasIrpf: VigenciaFaixas = new Map([
    [2026.01, new Map([
        [0, 2428.80],
        [0.075, 2826.65],
        [0.15, 3751.05],
        [0.225, 4664.68],
        [0.275, Infinity]])
    ]
]);

/**
 * Mapa preenchido com as vigencias de aliquotas e faixas IRPF para PLR
 */
export const vigenciaFaixasIrpfPLR: VigenciaFaixas = new Map([
    [2025.05, new Map([
        [0, 8214.40],
        [0.075, 9922.28],
        [0.15, 13167.00],
        [0.225, 16380.38],
        [0.275, Infinity]])
    ]
]);



/**
 * Busca a alíquota vigente no período informado
 * @param ano Ano com 4 dígitos. Ex.: 2025, 2027
 * @param mes Mês.
 * @param faixas Mapa das faixas de impostos.
 * @returns Retorna um mapa com as aliquotas vigentes na data informada.
 */
export const getAliquotasVigentes = (ano: number, mes: Meses, faixas: VigenciaFaixas): AliquotasTetoFaixas | null => {

    let searchKey = ano + (mes / 100);

    let keys = Array.from(faixas.keys()).sort().reverse();

    let firstLessKey = keys.find(k => k <= searchKey);

    if (!firstLessKey) throw "nenhum periodo de vigencia encontrado";

    return faixas.get(firstLessKey) ?? null;

}
