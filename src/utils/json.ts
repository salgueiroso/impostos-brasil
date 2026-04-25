import { AnoMesAliquotasFaixasMap } from "../tipos/ano-mes-aliquotas-faixas-map";
import { ItemMapaJson } from "../tipos/item-mapa-json";
import { Meses } from "../tipos/tipos-basicos";
import { toAno } from "./datas";

export function carregarDoJson(content: ItemMapaJson[]): AnoMesAliquotasFaixasMap {

    let mapa = new AnoMesAliquotasFaixasMap([]);

    for (let item of content) {
        mapa.set({ Ano: toAno(item.Chave.Ano), Mes: item.Chave.Mes as Meses }, new Map(item.Valor.map(v => [v.Aliquota, Number(v.ValorTeto)])));
    }

    return mapa;
}
