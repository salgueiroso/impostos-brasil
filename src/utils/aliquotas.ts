import { AnoMesAliquotasFaixasMap } from "../tipos/ano-mes-aliquotas-faixas-map";
import { AliquotasTetoFaixas, Ano, Meses } from "../tipos/tipos-basicos";
import { toValorCronologico } from "./datas";

/**
 * Localiza as alíquotas e faixas de impostos vigentes para a data informada.
 * @param ano - Ano de referência com 4 dígitos (ex: 2025).
 * @param mes - Mês da vigência.
 * @param faixas - Mapa cronológico contendo as configurações de faixas de impostos.
 * @returns Retorna o conjunto de alíquotas e tetos aplicáveis ou `null` se o o periodo não for encontrado. Tambem retorna `null` se o parâmetro `faixas` não for fornecido.
 * @throws Lança uma exceção caso não exista uma configuração configurada para o período informado ou anterior.
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
