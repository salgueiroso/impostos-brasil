import { AnoMesAliquotasFaixasMap } from "../tipos/ano-mes-aliquotas-faixas-map";
import { AliquotasTetoFaixas, Ano, Meses } from "../tipos/tipos-basicos";
import { toValorCronologico } from "./datas";

/**
 * Busca a alíquota vigente no período informado
 * @param ano Ano com 4 dígitos. Ex.: 2025, 2027
 * @param mes Mês da vigencia.
 * @param faixas Mapa das faixas de impostos.
 * @returns Retorna um mapa com as aliquotas vigentes no periodo informada ou null se o periodo não for encontrado.
 */
export function getAliquotasVigentes(ano: Ano, mes: Meses, faixas?: AnoMesAliquotasFaixasMap | null): AliquotasTetoFaixas | null {

    if (!faixas) return null;

    let keys = Array.from(faixas.keys()).sort((a, b) => toValorCronologico(a) - toValorCronologico(b)).reverse();

    let firstLessKey = keys.find(k => {
        let valido = toValorCronologico(k) <= toValorCronologico({ Ano: ano, Mes: mes })
        return valido;
    });

    if (!firstLessKey) throw "Ano de vigencia nao configurado";


    return faixas.get(firstLessKey) ?? null;

}
