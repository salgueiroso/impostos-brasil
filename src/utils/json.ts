import { MapaChaveAnoMes } from "../tipos/ano-mes-aliquotas-faixas-map";
import { ItemMapaJson } from "../tipos/item-mapa-json";
import { Aliquota, AliquotasTetoFaixas, Meses, TetoFaixa } from "../tipos/tipos-basicos";
import { toAno } from "./datas";


/**
 * Converte uma lista de registros brutos oriundos de arquivos JSON para a estrutura de mapa cronológico.
 * 
 * Esta função atua como o motor de desserialização da biblioteca. Ela processa o array de {@link ItemMapaJson},
 * validando os anos de competência através de {@link toAno}, normalizando a precisão dos valores numéricos 
 * e organizando as faixas progressivas (se presentes) em instâncias de `Map` interno.
 * 
 * @template T - O tipo de valor armazenado nas vigências, podendo ser uma tabela de faixas 
 * ({@link AliquotasTetoFaixas}) ou um valor escalar numérico.
 * 
 * @param content - Array de objetos brutos seguindo o contrato {@link ItemMapaJson}.
 * @returns Uma instância de {@link MapaChaveAnoMes} devidamente indexada e pronta para o consumo.
 * 
 * @throws {Error} Caso algum ano presente no JSON seja inferior ao limite mínimo suportado pelo sistema.
 */
export function carregarDoJson<T extends AliquotasTetoFaixas | number = AliquotasTetoFaixas>(content: ItemMapaJson[]): MapaChaveAnoMes<T> {

    let mapa = new MapaChaveAnoMes<T>();

    for (let item of content) {
        const ano = toAno(item.Chave.Ano);
        const mes = item.Chave.Mes as Meses;
        let valor: T | null = null;

        if (typeof item.Valor === "number") {
            valor = Number(item.Valor) as T;
        }

        else if (Array.isArray(item.Valor)) {
            valor = new Map<Aliquota, TetoFaixa>(
                item.Valor.map(v => {
                    return [
                        v.Aliquota,
                        Number(v.ValorTeto)
                    ];
                })
            ) as T;
        }


        mapa.set(
            { Ano: ano, Mes: mes },
            valor!
        );

    }

    return mapa;
}
