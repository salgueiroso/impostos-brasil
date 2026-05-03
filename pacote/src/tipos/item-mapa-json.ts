import { Aliquota, AnoMes, TetoFaixa } from "./tipos-basicos";
import { MapaChaveAnoMes } from "./ano-mes-aliquotas-faixas-map";


/**
 * Representa a estrutura bruta de um registro de vigência nos arquivos JSON de configuração (recursos).
 * 
 * Esta interface define o contrato para os dados estáticos (ex: `inss.json`, `irpf.json`) 
 * antes de serem processados e convertidos para instâncias de {@link MapaChaveAnoMes}.
 * 
 * @internal Utilizada prioritariamente pelo motor de carregamento de dados da biblioteca.
 */
export interface ItemMapaJson {

    /**
     * Referência oficial (URL ou descrição) que valida a origem legal dos dados (ex: site do Planalto).
     */
    Fonte: string;

    /**
     * Identificador de competência (Ano e Mês) que marca o início da validade desta configuração.
     */
    Chave: AnoMes;

    /**
     * O conteúdo tributário da vigência. 
     * Pode ser um valor escalar (como uma dedução única) ou uma lista de faixas para cálculos progressivos.
     */
    Valor: number | Array<{
        /** Alíquota nominal aplicada sobre a faixa em formato decimal (ex: 0.075 para 7.5%). */
        Aliquota: Aliquota;
        /** Limite superior da faixa. Suporta a string "Infinity" para representar a última faixa progressiva. */
        ValorTeto: TetoFaixa | string;
    }>;
}
