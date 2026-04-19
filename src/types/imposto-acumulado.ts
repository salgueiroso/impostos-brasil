import { Imposto } from "./imposto";

export interface DadosDoMes {

    /**
     * Imposto IRPF calculado do mês
     */
    irpf: Imposto;

    /**
     * Imposto IRPF PLR calculado do mês
     */
    irpfPLR?: Imposto

    /**
     * Imposto INSS calculado do mês
     */
    inss: Imposto;

    /**
     * Número do mês entre 1 e 12
     */
    mes: number;

    /**
     * Valor bruto do mês
     */
    vlSalarioBruto: number;

    /**
     * Valor liquido do mes
     */
    vlSalarioLiquido: number;
}


export type PartialDadosDosMeses = Partial<DadosDoMes>;

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

