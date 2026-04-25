import { DadosDoMes } from "./dados-do-mes";

/**
 * Informações de imposto acumulado de uma série temporal de meses
 */
export interface ImpostoAcumulado {

    /**
     * Array com informações de imposto de cada mes
     */
    meses: DadosDoMes[],

    /**
     * Valor liquido total da série temporal
     */
    vlLiquidoTotal: number;
    /**
     * Valor bruto total da série temporal
     */
    vlBrutoTotal: number;

    /**
     * Valor total do imposto INSS da série temporal
     */
    vlImpostoInssTotal: number,
    /**
     * Aliquota efetiva do INSS na série temporal.
     */
    pAliquotaInssEfetiva: number,

    /**
     * Valor total do imposto IRPF da série temporal
     */
    vlImpostoIrpfTotal: number,

    /**
     * Aliquota efetiva do IRPF na série temporal.
     */
    pAliquotaIrpfEfetiva: number,

    /**
     * Valor total do imposto IRPF PLR da série temporal
     */
    vlImpostoIrpfPLRTotal: number,

    /**
     * Aliquota efetiva do IRPF PLR na série temporal.
     */
    pAliquotaIrpfPLREfetiva: number,

    /**
     * Valor total dos impostos da série temporal
     */
    vlImpostoTotal: number;
    /**
     * Aliquota efetiva total da série temporal.
     */
    pAliquotaEfetivaTotal: number;

}

