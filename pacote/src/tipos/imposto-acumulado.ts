import { DadosDoMes } from "./dados-do-mes";

/**
 * Representa o consolidado dos resultados de uma simulação ou série temporal de impostos.
 * 
 * Esta interface armazena o somatório de todos os valores financeiros processados
 * (Bruto, Líquido, Impostos) e as alíquotas efetivas médias do período, além de
 * manter o detalhamento individual de cada mês.
 */
export interface ImpostoAcumulado {

    /**
     * Listagem detalhada dos cálculos realizados para cada mês da série.
     * @see {@link DadosDoMes}
     */
    meses: DadosDoMes[],

    /**
     * Somatório de todos os rendimentos líquidos recebidos no período total da série.
     */
    vlLiquidoTotal: number;

    /**
     * Somatório de todos os rendimentos brutos (incluindo salário, férias, 13º e PLR) do período.
     */
    vlBrutoTotal: number;

    /**
     * Montante total retido para a Previdência Social (INSS) ao longo da série.
     */
    vlImpostoInssTotal: number,

    /**
     * Alíquota efetiva média do INSS em relação ao bruto total (vlImpostoInssTotal / vlBrutoTotal).
     */
    pAliquotaInssEfetiva: number,

    /**
     * Montante total de Imposto de Renda (IRPF) mensal retido ao longo da série.
     */
    vlImpostoIrpfTotal: number,

    /**
     * Alíquota efetiva média do IRPF mensal (vlImpostoIrpfTotal / vlBrutoTotal).
     */
    pAliquotaIrpfEfetiva: number,

    /**
     * Montante total de imposto retido especificamente sobre a Participação nos Lucros (PLR).
     */
    vlImpostoIrpfPLRTotal: number,

    /**
     * Alíquota efetiva média do imposto sobre PLR em relação ao bruto total.
     */
    pAliquotaIrpfPLREfetiva: number,

    /**
     * Somatório de todos os impostos retidos (INSS + IRPF + IRPF PLR) no período.
     */
    vlImpostoTotal: number;

    /**
     * Carga tributária real total do período (vlImpostoTotal / vlBrutoTotal).
     */
    pAliquotaEfetivaTotal: number;
}
