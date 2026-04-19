import { DeducaoFaixa } from "./types/deducao-faixa";
import { Imposto } from "./types/imposto";
import { AliquotasTetoFaixas } from "./types/types";
import { vigenciaFaixasInss } from "./values";

/* istanbul ignore next */
const vigenciaAtual = Math.max(...[...vigenciaFaixasInss.keys()].filter(v => v <= new Date().getFullYear()));
/* istanbul ignore next */
const faixasInss = vigenciaFaixasInss.get(vigenciaAtual) ?? new Map();

/**
 * Calcula o INSS com base em uma unica receita/mes
 * @param vlBruto Valor bruto da receita
 * @param vlBaseDeCalculo Base de calculo a ser utilizada para o calculo da receita
 * @param aliquotasTetoFaixas Aliquotas e faixas a serem utilizadas para o calculo
 * @returns Retorna um objeto {@link Imposto} com informações do calculo de um item único da série
 */
export const calcularINSS = function (vlBruto: number, vlBaseDeCalculo: number | null = null, aliquotasTetoFaixas: AliquotasTetoFaixas = faixasInss): Imposto {
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
        vlinicialAtual = dadosFaixa.vlFinal + 0.01;
    }


    let imposto: Imposto = {
        faixas,
        vlImposto: 0,
        aliquotaEfetiva: 0,
        vlBruto: 0,
        vlBaseDeCalculo: 0
    };

    imposto.vlImposto = faixas
        .map(faixa => faixa.deducao)
        .reduce((a, b) => a + b, 0);
    imposto.aliquotaEfetiva = imposto.vlImposto / vlBruto;
    imposto.vlBruto = vlBruto;
    imposto.vlBaseDeCalculo = vlBaseDeCalculo;

    return imposto;

}