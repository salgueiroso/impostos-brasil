/**
 * Representa o detalhamento do cálculo de imposto em uma faixa específica de uma tabela progressiva.
 * 
 * Esta estrutura é utilizada para descrever como o montante total foi distribuído e tributado 
 * em cada nível da tabela (fatias), permitindo a rastreabilidade do cálculo final.
 */
export interface DeducaoFaixa {
    /**
     * Limite inferior da faixa de tributação.
     */
    vlInicial?: number | null;

    /**
     * Limite superior da faixa de tributação.
     */
    vlFinal: number;

    /**
     * Alíquota nominal aplicada sobre o montante que incide nesta faixa específica.
     * Deve ser representada em formato decimal (ex: 0.075 para 7.5% ou 0.275 para 27.5%).
     */
    aliquota?: number | null;

    /**
     * O valor do imposto calculado exclusivamente para esta fatia (aliquota * vlBaseFaixa).
     */
    deducao: number;

    /**
     * A base de cálculo parcial, ou seja, a porção do valor total que se enquadrou dentro desta faixa.
     */
    vlBaseFaixa?: number | null;
}