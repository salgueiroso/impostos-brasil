import { MapaChaveAnoMes } from "./tipos/ano-mes-aliquotas-faixas-map";
import { carregarDoJson } from "./utils/json";
import { MapaVigencia as MapaVigenciaInss } from "./recursos/inss.json";
import { AliquotasTetoFaixas, Ano, Meses } from "./tipos/tipos-basicos";
import { Imposto } from "./tipos/imposto";
import { toAno } from "./utils/datas";
import { DeducaoFaixa } from "./tipos/deducao-faixa";
import { getFaixasVigentes } from "./utils/aliquotas";
import { ParametroInvalido } from "./tipos/erros";
import { nameOf, varsName } from "./utils";
import { OpcoesInss } from "./tipos";

/**
 * Mapa global indexado por vigência (Ano/Mês) contendo as alíquotas e faixas do INSS (Previdência Social).
 * 
 * Os dados são carregados do recurso estático `inss.json`. Este mapa é a fonte primária 
 * para o cálculo progressivo, permitindo a recuperação automática da tabela correta 
 * conforme a data de competência informada ou atual.
 * 
 * @see {@link MapaChaveAnoMes}
 */
export const vigenciaFaixasInss: MapaChaveAnoMes<AliquotasTetoFaixas> = carregarDoJson(MapaVigenciaInss);

/**
 * Calcula a contribuição previdenciária (INSS) seguindo as regras de tributação progressiva.
 * 
 * O motor percorre as faixas da tabela de alíquotas vigentes, tributando apenas a parcela do valor 
 * que se enquadra em cada nível. O cálculo respeita automaticamente o teto máximo da Previdência Social, 
 * garantindo que a contribuição não exceda o limite legal estabelecido para o período.
 * 
 * @param vlBruto - O valor bruto total (utilizado como denominador para o cálculo da alíquota efetiva).
 * @param opcoes - Configurações opcionais para o cálculo.
 * @param opcoes.vlBaseDeCalculo - O valor sobre o qual o imposto será calculado (ex: Salário de Contribuição).
 * Se for `null`, utiliza o valor de `vlBruto`.
 * @param opcoes.aliquotasTetoFaixas - Tabela opcional com faixas e alíquotas customizadas.
 * Caso seja `null` ou `undefined`, a função tentará buscar a tabela vigente para o **mês e ano atual** 
 * do sistema em {@link vigenciaFaixasInss}.
 * 
 * @returns Um objeto do tipo {@link Imposto} contendo:
 * o detalhamento por faixas, valor total do imposto, alíquota efetiva e valor líquido resultante.
 * 
 * @example
 * // Calcula o INSS para um salário de R$ 5.000,00 usando a tabela vigente.
 * const resultado = calcularINSS(5000);
 */
export function calcularINSS(
    vlBruto: number,
    opcoes?: null | OpcoesInss
): Imposto {

    const dataAtual = new Date();

    if (opcoes?.aliquotasTetoFaixas && (opcoes.vigenciaAno || opcoes.vigenciaMes))
        throw new ParametroInvalido(nameOf<OpcoesInss>("aliquotasTetoFaixas"), "opcoes.aliquotasTetoFaixas não pode ser utilizado simultaneamente com opcoes.vigenciaAno ou opcoes.vigenciaMes, pois são mutuamente exclusivos.");

    let {
        vlBaseDeCalculo = null,
        aliquotasTetoFaixas = null,
        vigenciaAno = toAno(dataAtual.getFullYear()),
        vigenciaMes = (dataAtual.getMonth() + 1) as Meses
    } = opcoes ?? {};

    vlBruto = vlBruto.normalizarPrecisao();
    vlBaseDeCalculo = vlBaseDeCalculo?.normalizarPrecisao() ?? null;
    vlBaseDeCalculo ??= vlBruto;


    if (vlBaseDeCalculo > vlBruto)
        throw new ParametroInvalido(varsName({ vlBaseDeCalculo }), "Base de calculo não pode ser maior que o valor bruto");

    if (!aliquotasTetoFaixas)
        aliquotasTetoFaixas = getFaixasVigentes(vigenciaAno, vigenciaMes, vigenciaFaixasInss);

    let vlinicialAtual = 0.0;

    let faixas: DeducaoFaixa[] = [];
    for (const [aliquota, vlFinal] of aliquotasTetoFaixas) {
        if (vlinicialAtual > vlBaseDeCalculo)
            break;
        const dadosFaixa: DeducaoFaixa = { vlFinal, deducao: 0 };
        dadosFaixa.vlInicial = vlinicialAtual;
        dadosFaixa.vlFinal = Math.min(dadosFaixa.vlFinal, vlBaseDeCalculo).normalizarPrecisao();
        dadosFaixa.vlBaseFaixa = (dadosFaixa.vlFinal - dadosFaixa.vlInicial).normalizarPrecisao();
        dadosFaixa.aliquota = aliquota;
        dadosFaixa.deducao = (dadosFaixa.vlBaseFaixa * dadosFaixa.aliquota).normalizarPrecisao();
        faixas.push(dadosFaixa);
        vlinicialAtual = dadosFaixa.vlFinal + (dadosFaixa.vlFinal * Number.EPSILON);
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
        .reduce((a, b) => a + b, 0)
        .normalizarPrecisao();
    imposto.aliquotaEfetiva = imposto.vlImposto / vlBruto;
    imposto.vlBruto = vlBruto;
    imposto.vlBaseDeCalculo = vlBaseDeCalculo;
    imposto.vlLiquido = (imposto.vlBruto - imposto.vlImposto).normalizarPrecisao();


    return imposto;

}