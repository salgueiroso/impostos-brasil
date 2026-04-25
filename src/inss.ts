import { AnoMesAliquotasFaixasMap } from "./tipos/ano-mes-aliquotas-faixas-map";
import { carregarDoJson } from "./utils/json";
import { MapaVigencia as MapaVigenciaInss } from "./recursos/inss.json";
import { AliquotasTetoFaixas, Meses } from "./tipos/tipos-basicos";
import { Imposto } from "./tipos/imposto";
import { toAno } from "./utils/datas";
import { DeducaoFaixa } from "./tipos/deducao-faixa";

/**
 * Mapa preenchido com as vigencias de aliquotas e faixas INSS
 */
export const vigenciaFaixasInss: AnoMesAliquotasFaixasMap = carregarDoJson(MapaVigenciaInss);


/**
 * Calcula o INSS com base em uma unica receita/mes
 * @param vlBruto Valor bruto da receita
 * @param vlBaseDeCalculo Base de calculo a ser utilizada para o calculo da receita
 * @param aliquotasTetoFaixas Aliquotas e faixas a serem utilizadas para o calculo
 * @returns Retorna um objeto {@link Imposto} com informações do calculo de um item único da série
 */
export function calcularINSS(vlBruto: number, vlBaseDeCalculo: number | null = null, aliquotasTetoFaixas?: AliquotasTetoFaixas | null): Imposto {

    aliquotasTetoFaixas ??= vigenciaFaixasInss.get({ Ano: toAno(new Date().getFullYear()), Mes: Meses.Janeiro }) ?? new Map();

    let vlinicialAtual = 0.0;
    vlBaseDeCalculo ??= vlBruto;
    let faixas: DeducaoFaixa[] = [];
    for (const [aliquota, vlFinal] of aliquotasTetoFaixas) {
        if (vlinicialAtual > vlBaseDeCalculo)
            break;
        const dadosFaixa: DeducaoFaixa = { vlFinal, deducao: 0 };
        dadosFaixa.vlInicial = vlinicialAtual;
        dadosFaixa.vlFinal = Math.min(dadosFaixa.vlFinal, vlBaseDeCalculo);
        dadosFaixa.vlBaseFaixa = dadosFaixa.vlFinal - dadosFaixa.vlInicial;
        dadosFaixa.aliquota = aliquota;
        dadosFaixa.deducao = dadosFaixa.vlBaseFaixa * dadosFaixa.aliquota;
        faixas.push(dadosFaixa);
        vlinicialAtual = dadosFaixa.vlFinal + Number.EPSILON;
    }


    let imposto: Imposto = {
        faixas,
        vlImposto: 0,
        aliquotaEfetiva: 0,
        vlBruto: 0,
        vlBaseDeCalculo: 0,
        vlLiquido: 0
    };

    imposto.vlImposto = faixas
        .map(faixa => faixa.deducao)
        .reduce((a, b) => a + b, 0);
    imposto.aliquotaEfetiva = imposto.vlImposto / vlBruto;
    imposto.vlBruto = vlBruto;
    imposto.vlBaseDeCalculo = vlBaseDeCalculo;
    imposto.vlLiquido = imposto.vlBruto - imposto.vlImposto;


    return imposto;

}