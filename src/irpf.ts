import { MapaVigencia as MapaVigenciaIrpf } from "./recursos/irpf.json";
import { MapaVigencia as MapaVigenciaIrpfPLR } from "./recursos/irpfPLR.json";
import { MapaVigencia as MapaVigenciaIrpfDescontoSimplificado } from "./recursos/irpf-desconto-simplificado.json";
import { MapaChaveAnoMes } from "./tipos/ano-mes-aliquotas-faixas-map";
import { DeducaoFaixa } from "./tipos/deducao-faixa";
import { Imposto } from "./tipos/imposto";
import { AliquotasTetoFaixas, Ano, Meses } from "./tipos/tipos-basicos";
import { carregarDoJson } from "./utils/json";
import { toAno } from "./utils/datas";
import { getFaixasVigentes } from "./utils/aliquotas";
import { ParametroInvalido } from "./tipos/erros";
import { varName } from "./utils/helper";

/**
 * Mapa global indexado por vigência (Ano/Mês) contendo as alíquotas e faixas do IRPF mensal.
 * 
 * Os dados são carregados do recurso estático `irpf.json`. Este mapa é utilizado pelo 
 * motor de cálculo para selecionar a tabela progressiva correta conforme a competência informada.
 * 
 * @see {@link MapaChaveAnoMes}
 */
export const vigenciaFaixasIrpf: MapaChaveAnoMes<AliquotasTetoFaixas> = carregarDoJson(MapaVigenciaIrpf);

/**
 * Mapa global contendo as vigências de alíquotas e faixas do IRPF sobre PLR (Participação nos Lucros).
 * 
 * A PLR possui tributação exclusiva na fonte e uma tabela progressiva própria, 
 * independente da tabela mensal, carregada a partir do arquivo `irpfPLR.json`.
 */
export const vigenciaFaixasIrpfPLR: MapaChaveAnoMes<AliquotasTetoFaixas> = carregarDoJson(MapaVigenciaIrpfPLR);

/**
 * Mapa global contendo os valores vigentes para o desconto simplificado do IRPF.
 * 
 * O desconto simplificado é um valor fixo que pode ser utilizado como alternativa às 
 * deduções legais (INSS, dependentes, etc) na base de cálculo do imposto.
 */
export const vigenciaIrpfDescontoSimplificado: MapaChaveAnoMes<number> = carregarDoJson(MapaVigenciaIrpfDescontoSimplificado);

/**
 * Calcula o Imposto de Renda Pessoa Física (IRPF) utilizando o método de cálculo progressivo mensal.
 * 
 * O motor percorre as faixas da tabela vigente, aplicando as alíquotas nominais sobre a 
 * base de cálculo informada. Implementa as regras de isenção total para rendimentos 
 * até R$ 5.000,00 e o desconto progressivo para rendas até R$ 7.350,00.
 * 
 * @param vlBruto - O valor bruto total (base para o cálculo da alíquota efetiva).
 * @param opcoes - Configurações opcionais para o cálculo:
 *   - `vlBaseDeCalculo`: O montante que sofrerá a incidência após as deduções legais. Se omitido, usa `vlBruto`.
 *   - `usarIsencao5k7k`: Habilita a lógica de isenção progressiva para rendas até R$ 7.350,00 (padrão: true).
 *   - `aliquotasTetoFaixas`: Tabela customizada de faixas para simulações específicas.
 *   - `vigenciaAno`: Ano de referência para busca da tabela oficial (padrão: ano atual).
 *   - `vigenciaMes`: Mês de referência para busca da tabela oficial (padrão: mês atual).
 * 
 * @throws {@link ParametroInvalido} Se a base de cálculo for maior que o bruto ou se houver conflito entre parâmetros de vigência e tabelas customizadas.
 * 
 * @returns Um objeto do tipo {@link Imposto} contendo:
 * o detalhamento por faixas, o valor total do imposto, a alíquota efetiva real e o valor líquido.
 * 
 * @example
 * // Calcula o IRPF para um salário bruto de 10k com base de cálculo (após INSS) de 9k.
 * const resultado = calcularIRPF(10000, 9000);
 */
export function calcularIRPF(
    vlBruto: number,
    opcoes?: null | {
        vlBaseDeCalculo?: number | null,
        usarIsencao5k7k?: boolean | null,
        aliquotasTetoFaixas?: AliquotasTetoFaixas | null,
        vigenciaAno?: Ano,
        vigenciaMes?: Meses
    }
): Imposto {

    const dataAtual = new Date();

    if (opcoes?.aliquotasTetoFaixas && (opcoes.vigenciaAno || opcoes.vigenciaMes))
        throw new ParametroInvalido("opcoes.aliquotasTetoFaixas", "opcoes.aliquotasTetoFaixas não pode ser utilizado com opcoes.vigenciaAno ou opcoes.vigenciaMes, pois são mutuamente exclusivos.");

    let {
        vlBaseDeCalculo = null,
        usarIsencao5k7k = true,
        aliquotasTetoFaixas = null,
        vigenciaAno = toAno(dataAtual.getFullYear()),
        vigenciaMes = (dataAtual.getMonth() + 1) as Meses
    } = opcoes ?? {};

    vlBruto = vlBruto.normalizarPrecisao();
    vlBaseDeCalculo = vlBaseDeCalculo?.normalizarPrecisao() ?? null;
    vlBaseDeCalculo ??= vlBruto;

    if (vlBaseDeCalculo > vlBruto)
        throw new ParametroInvalido(varName({ vlBaseDeCalculo }), "Base de calculo não pode ser maior que o valor bruto");

    aliquotasTetoFaixas ??= getFaixasVigentes(vigenciaAno, vigenciaMes, vigenciaFaixasIrpf) ?? new Map();

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

    imposto.vlImposto = imposto.faixas
        .map(faixa => faixa.deducao)
        .reduce((a, b) => a + b, 0)
        .normalizarPrecisao();

    if (usarIsencao5k7k && vlBruto <= 5000) {

        imposto.vlImposto = 0;

    } else if (usarIsencao5k7k && vlBruto <= 7350) {

        imposto.vlImposto -= 978.62 - (0.133145 * vlBruto)
        imposto.vlImposto = Math.max(0, imposto.vlImposto).normalizarPrecisao();

    }

    imposto.aliquotaEfetiva = imposto.vlImposto / vlBruto;
    imposto.vlBruto = vlBruto;
    imposto.vlBaseDeCalculo = vlBruto;
    imposto.vlLiquido = (imposto.vlBruto - imposto.vlImposto).normalizarPrecisao();


    return imposto;
}
