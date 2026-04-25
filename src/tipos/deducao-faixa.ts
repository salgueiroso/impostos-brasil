/**
 * Informações de imposto da faixa.
 */
export interface DeducaoFaixa {
    /**
     * Valor inicial da faixa.
     */
    vlInicial?: number;

    /**
     * Valor final da faixa.
     */
    vlFinal: number;

    /**
     * Aliquota aplicada na faixa.
     * A aliquota será representada em percentual
     * Ex.:
     * - 0.35 corresponde a 35%
     * - 1.0 corresponde a 100%
     */
    aliquota?: number;

    /**
     * Dedução/Imposto aplicado na faixa.
     */
    deducao: number;

    /**
     * Valor delta entre a faixa inicial e final. Este valor é o valor base para o calculo do imposto da faixa
     */
    vlBaseFaixa?: number;
}