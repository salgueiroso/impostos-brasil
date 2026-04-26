import { Aliquota, AnoMes, TetoFaixa } from "./tipos-basicos";

/**
 * Representa a estrutura bruta de um registro de vigência nos arquivos JSON de configuração (ex: inss.json, irpf.json).
 * 
 * Esta interface é utilizada exclusivamente no processo de desserialização dos dados estáticos que alimentam 
 * as tabelas progressivas de impostos antes de serem convertidas para mapas indexados.
 */
export interface ItemMapaJson {
    /**
     * Objeto de chave que define o início da vigência desta tabela.
     */
    Chave: AnoMes;

    /**
     * Lista de faixas tributárias que compõem a tabela progressiva.
     */
    Valor: Array<{
        /** Alíquota aplicada à faixa (ex: 0.075 para 7.5%). */
        Aliquota: Aliquota;
        /** Valor teto da faixa. Pode vir como string do JSON para suportar representações de infinito ou precisão. */
        ValorTeto: TetoFaixa | string;
    }>;
}
