
/**
 * Modelo de estrutura do item nos arquivos json
 */
export interface ItemMapaJson {
    Chave: {
        Ano: number;
        Mes: number;
    };
    Valor: {
        Aliquota: number;
        ValorTeto: number | string;
    }[];
}
