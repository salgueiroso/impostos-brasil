import { AnoMesAliquotasFaixasMap } from "./tipos/ano-mes-aliquotas-faixas-map";
import { carregarDoJson } from "./utils/json";
import { MapaVigencia as MapaVigenciaInss } from "./recursos/inss.json";
import { AliquotasTetoFaixas, Meses } from "./tipos/tipos-basicos";
import { Imposto } from "./tipos/imposto";
import { toAno } from "./utils/datas";
import { DeducaoFaixa } from "./tipos/deducao-faixa";
import { getAliquotasVigentes } from "./utils/aliquotas";

/**
 * Mapa global contendo o histórico de vigências de alíquotas e faixas do INSS (Previdência Social).
 * 
 * Esta constante é inicializada a partir do arquivo estático `inss.json` e serve como a base
 * de dados padrão para as buscas de tabelas progressivas indexadas por ano e mês.
 */
export const vigenciaFaixasInss: AnoMesAliquotasFaixasMap = carregarDoJson(MapaVigenciaInss);

/**
 * Calcula a contribuição previdenciária (INSS) utilizando o método de cálculo progressivo.
 * 
 * O cálculo percorre cada faixa da tabela de alíquotas, aplicando a porcentagem correspondente
 * apenas sobre o montante que se enquadra naquela faixa específica. Se a base de cálculo
 * ultrapassar o teto máximo da última faixa, a contribuição é limitada ao valor máximo permitido.
 * 
 * @param vlBruto - O valor bruto total (utilizado como denominador para o cálculo da alíquota efetiva).
 * @param vlBaseDeCalculo - O valor sobre o qual o imposto será calculado (ex: Salário de Contribuição).
 * Se for `null`, utiliza o valor de `vlBruto`.
 * @param aliquotasTetoFaixas - Tabela opcional com faixas e alíquotas customizadas.
 * Caso seja `null` ou `undefined`, a função tentará buscar a tabela vigente para o **mês e ano atual** 
 * do sistema em {@link vigenciaFaixasInss}.
 * 
 * @returns Um objeto do tipo {@link Imposto} contendo:
 * - `faixas`: Detalhamento de cada faixa de tributação processada.
 * - `vlImposto`: O somatório total do imposto a ser retido.
 * - `aliquotaEfetiva`: Percentual real pago sobre o valor bruto.
 * - `vlLiquido`: Valor bruto subtraído do imposto calculado.
 * 
 * @example
 * // Calcula o INSS para um salário de R$ 5.000,00 usando a tabela vigente.
 * const resultado = calcularINSS(5000);
 */
export function calcularINSS(vlBruto: number, vlBaseDeCalculo: number | null = null, aliquotasTetoFaixas?: AliquotasTetoFaixas | null): Imposto {

    const dataAtual = new Date();

    aliquotasTetoFaixas ??= getAliquotasVigentes(toAno(dataAtual.getFullYear()), dataAtual.getMonth() + 1, vigenciaFaixasInss) ?? new Map();

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