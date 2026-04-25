import { MapaVigencia as MapaVigenciaIrpf } from "./recursos/irpf.json";
import { MapaVigencia as MapaVigenciaIrpfPLR } from "./recursos/irpfPLR.json";
import { AnoMesAliquotasFaixasMap } from "./tipos/ano-mes-aliquotas-faixas-map";
import { DeducaoFaixa } from "./tipos/deducao-faixa";
import { Imposto } from "./tipos/imposto";
import { AliquotasTetoFaixas, Meses } from "./tipos/tipos-basicos";
import { carregarDoJson } from "./utils/json";
import { toAno } from "./utils/datas";

/**
 * Mapa preenchido com as vigencias de aliquotas e faixas IRPF
 */
export const vigenciaFaixasIrpf: AnoMesAliquotasFaixasMap = carregarDoJson(MapaVigenciaIrpf);

/**
 * Mapa preenchido com as vigencias de aliquotas e faixas IRPF para PLR
 */
export const vigenciaFaixasIrpfPLR: AnoMesAliquotasFaixasMap = carregarDoJson(MapaVigenciaIrpfPLR);

/**
 * Calcula o IRPF com base em uma unica receita/mes
 * @param salarioBruto Valor bruto da receita
 * @param baseDeCalculo Valor a ser utilizado como base de calculo do imposto
 * @param usarIsencao5k7k Informa se deve ser utilizada a insenção de 5k e o desconto progressivo até 7k
 * @param aliquotasTetoFaixas Aliquotas e faixas a serem utilizadas para o calculo
 * @returns Retorna um objeto {@link Imposto} com informações do calculo de um item único da série
 */
export function calcularIRPF(salarioBruto: number, baseDeCalculo: number, usarIsencao5k7k: boolean = true, aliquotasTetoFaixas?: AliquotasTetoFaixas | null): Imposto {

    aliquotasTetoFaixas ??= vigenciaFaixasIrpf.get({ Ano: toAno(new Date().getFullYear()), Mes: Meses.Janeiro }) ?? new Map();

    let vlinicialAtual = 0.0;
    let faixas: DeducaoFaixa[] = [];
    for (const [aliquota, vlFinal] of aliquotasTetoFaixas) {
        if (vlinicialAtual > baseDeCalculo)
            break;
        const dadosFaixa: DeducaoFaixa = { vlFinal, deducao: 0 };
        dadosFaixa.vlInicial = vlinicialAtual;
        dadosFaixa.vlFinal = Math.min(dadosFaixa.vlFinal, baseDeCalculo);
        dadosFaixa.vlBaseFaixa = dadosFaixa.vlFinal - dadosFaixa.vlInicial;
        dadosFaixa.aliquota = aliquota;
        dadosFaixa.deducao = dadosFaixa.vlBaseFaixa * dadosFaixa.aliquota;
        faixas.push(dadosFaixa);
        vlinicialAtual = dadosFaixa.vlFinal + Number.EPSILON;
    }

    let imposto: Imposto = {
        faixas: [],
        vlImposto: 0,
        aliquotaEfetiva: 0,
        vlBruto: 0,
        vlBaseDeCalculo: 0,
        vlLiquido: 0
    };

    imposto.faixas = faixas;
    if (usarIsencao5k7k && salarioBruto <= 5000) {
        imposto.vlImposto = 0;
    } else {

        imposto.vlImposto = faixas
            .map(faixa => faixa.deducao)
            .reduce((a, b) => a + b, 0);

        if (usarIsencao5k7k && salarioBruto <= 7350) {
            imposto.vlImposto -= 978.62 - (0.133145 * salarioBruto)
            imposto.vlImposto = Math.max(0, imposto.vlImposto);
        }

    }
    imposto.aliquotaEfetiva = imposto.vlImposto / salarioBruto;
    imposto.vlBruto = salarioBruto;
    imposto.vlBaseDeCalculo = baseDeCalculo;
    imposto.vlLiquido = imposto.vlBruto - imposto.vlImposto;


    return imposto;
}
