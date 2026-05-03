import { DeducaoFaixa } from "./deducao-faixa";

/**
 * Estrutura consolidada que representa o resultado do cálculo de um imposto ou dedução.
 * 
 * Esta interface é utilizada para armazenar tanto os totais calculados quanto o 
 * detalhamento progressivo por faixas, sendo o modelo padrão para retornos de funções 
 * como INSS, IRPF ou PLR.
 */
export interface Imposto {

    /**
     * Detalhamento do cálculo distribuído pelas faixas progressivas da tabela vigente.
     * @see {@link DeducaoFaixa}
     */
    faixas: DeducaoFaixa[];

    /**
     * O valor monetário total do imposto calculado a ser retido ou deduzido.
     */
    vlImposto: number;

    /**
     * O percentual real pago sobre o valor bruto (vlImposto / vlBruto).
     * Representa o peso real do imposto no rendimento total, diferindo da alíquota nominal de cada faixa.
     */
    aliquotaEfetiva: number;

    /**
     * O montante bruto total que serviu de referência para o cálculo.
     */
    vlBruto: number;

    /**
     * O montante que efetivamente sofreu a tributação após a aplicação de deduções legais 
     * permitidas (ex: descontos de dependentes ou previdência).
     */
    vlBaseDeCalculo: number;

    /**
     * O rendimento líquido após a subtração do valor do imposto do montante bruto.
     */
    vlLiquido: number;
}