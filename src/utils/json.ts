import { AnoMesAliquotasFaixasMap } from "../tipos/ano-mes-aliquotas-faixas-map";
import { ItemMapaJson } from "../tipos/item-mapa-json";
import { Meses } from "../tipos/tipos-basicos";
import { toAno } from "./datas";

/**
 * Converte uma lista de itens vindos de um arquivo JSON para a estrutura de mapa tipado.
 * 
 * Esta função é responsável por realizar o parsing dos dados brutos, normalizando o valor do Ano
 * e organizando as alíquotas e seus respectivos valores teto em um `AnoMesAliquotasFaixasMap`.
 * 
 * @param content - Array de objetos seguindo o contrato `ItemMapaJson`.
 * @returns Um mapa estruturado e indexado por Ano e Mês para consulta de alíquotas.
 */
export function carregarDoJson(content: ItemMapaJson[]): AnoMesAliquotasFaixasMap {

    let mapa = new AnoMesAliquotasFaixasMap([]);

    for (let item of content) {
        mapa.set(
            { Ano: toAno(item.Chave.Ano), Mes: item.Chave.Mes as Meses },
            new Map(item.Valor.map(v => [v.Aliquota, Number(v.ValorTeto)]))
        );
    }

    return mapa;
}
