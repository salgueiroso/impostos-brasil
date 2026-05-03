import { MapaChaveAnoMes } from "../tipos/ano-mes-aliquotas-faixas-map";
import { AliquotasTetoFaixas, Ano, Meses } from "../tipos/tipos-basicos";
import { toValorCronologico } from "./datas";

/**
 * Localiza a configuração tributária (alíquotas, faixas ou valores) vigente para uma determinada data.
 * 
 * A função realiza uma busca regressiva no tempo: ela encontra a entrada mais recente no mapa 
 * cuja chave (Ano/Mês) seja menor ou igual à data solicitada.
 * 
 * @param ano - Ano de referência da competência.
 * @param mes - Mês de referência da competência.
 * @param faixas - Instância de {@link MapaChaveAnoMes} contendo o histórico de vigências.
 * @returns O valor ou conjunto de faixas vigentes na data. Retorna `null` se `faixas` não for fornecido.
 * @throws Lança uma exceção se não houver nenhuma configuração válida para a data informada ou períodos anteriores.
 */
export function getFaixasVigentes<V extends AliquotasTetoFaixas | number = AliquotasTetoFaixas>(ano: Ano, mes: Meses, faixas?: MapaChaveAnoMes<V> | null): V | null {

    if (!faixas) return null;


    let keys = Array
        // Ordena ascendente
        .from(faixas.keys()).sort((a, b) => toValorCronologico(a) - toValorCronologico(b))
        // Inverte a ordem
        .reverse();

    let firstLessKey = keys.find(k => {
        let valido = toValorCronologico(k) <= toValorCronologico({ Ano: ano, Mes: mes })
        return valido;
    });

    if (!firstLessKey) throw "Ano de vigencia nao configurado";


    return faixas.get(firstLessKey)!;

}

/**
 * Recupera um valor numérico vigente (ex: teto de isenção ou dedução fixa) para a data informada.
 * 
 * Esta é uma especialização de {@link getFaixasVigentes} para casos onde o valor armazenado 
 * no mapa é um escalar numérico em vez de uma tabela progressiva.
 * 
 * @param ano - Ano de referência.
 * @param mes - Mês de referência.
 * @param faixas - Mapa cronológico de valores numéricos.
 * @returns O valor numérico vigente ou `null` se o mapa não for fornecido.
 */
export function getValorVigente(ano: Ano, mes: Meses, faixas?: MapaChaveAnoMes<number> | null): number | null {
    return getFaixasVigentes<number>(ano, mes, faixas) ?? null;
}