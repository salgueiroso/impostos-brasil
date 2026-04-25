import { Imposto } from "./imposto";
import { InformacaoAdicional } from "./informacao-adicional";
import { Meses } from "./tipos-basicos";

export interface DadosDoMes {

    /**
     * Imposto IRPF calculado do mês
     */
    irpf: Imposto;

    /**
     * Imposto IRPF PLR calculado do mês
     */
    irpfPLR?: Imposto | null

    /**
     * Imposto INSS calculado do mês
     */
    inss: Imposto;

    /**
     * Número do mês
     */
    mes: Meses;

    /**
     * Indice do mes na lista
     */
    indice: number;

    /**
     * Valor das deduções do mês
     */
    vlDeducoes: number;

    /**
     * Valor bruto do mês
     */
    vlSalarioBruto: number;

    /**
     * Valor liquido do mes
     */
    vlSalarioLiquido: number;

    informacoesAdicionais: InformacaoAdicional[];
}


export type PartialDadosDoMes = Partial<DadosDoMes>;
