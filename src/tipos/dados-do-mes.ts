import { Imposto } from "./imposto";
import { InformacaoAdicional } from "./informacao-adicional";
import { Meses } from "./tipos-basicos";

/**
 * Representa o resultado detalhado dos cálculos financeiros de um único mês dentro de uma série.
 * 
 * Esta interface consolida todos os impostos retidos, deduções aplicadas e os valores 
 * brutos e líquidos resultantes para um período específico.
 */
export interface DadosDoMes {

    /**
     * Detalhamento do Imposto de Renda Pessoa Física (IRPF) calculado para o mês.
     */
    irpf: Imposto;

    /**
     * Detalhamento do IRPF sobre Participação nos Lucros e Resultados (PLR), se houver.
     * Este imposto possui tributação exclusiva e não se soma à base de cálculo do IRPF mensal.
     */
    irpfPLR?: Imposto | null

    /**
     * Detalhamento da contribuição previdenciária (INSS) calculada para o mês.
     */
    inss: Imposto;

    /**
     * O mês de referência do cálculo.
     */
    mes: Meses;

    /**
     * Posição sequencial do mês dentro da série temporal (começando em 0).
     */
    indice: number;

    /**
     * Soma total das deduções aplicadas na base de cálculo do IRPF (INSS, Saúde, Instrução, etc).
     */
    vlDeducoes: number;

    /**
     * O rendimento bruto total recebido no mês (Salário + Férias + 13º + PLR).
     */
    vlSalarioBruto: number;

    /**
     * O valor final a ser recebido pelo contribuinte após todas as retenções de impostos.
     */
    vlSalarioLiquido: number;

    /**
     * Conjunto de sinalizadores que descrevem eventos específicos ocorridos no mês (ex: Férias, PLR).
     * @see {@link InformacaoAdicional}
     */
    informacoesAdicionais: InformacaoAdicional[];
}

/**
 * Representação parcial de {@link DadosDoMes}.
 * Utilizado internamente pelo motor de cálculo durante a construção incremental dos dados mensais.
 */
export type PartialDadosDoMes = Partial<DadosDoMes>;
