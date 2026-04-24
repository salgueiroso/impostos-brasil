import { DeducaoFaixa } from "./deducao-faixa";

/**
 * Representa um imposto/dedução por faixas
 * 
 * Ex.: pode representar um item da serie temporal como inss ou irpf
 */
export interface Imposto {

    /**
     * Faixas deste imposto
     */
    faixas: DeducaoFaixa[];

    /**
     * Valor do imposto a ser deduzido e um item da serie temporal
     */
    vlImposto: number;

    /**
     * Aliquota efetiva deste imposto
     */
    aliquotaEfetiva: number;

    /**
     * Valor bruto informado
     */
    vlBruto: number;

    /**
     * Valor de base de calculo para uso neste imposto
     */
    vlBaseDeCalculo: number;

    /**
     * Valor liquido apos desconto do imposto.
     */
    vlLiquido: number;
}