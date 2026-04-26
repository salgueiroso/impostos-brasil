import { MapaVigencia as MapaVigenciaIrpf } from "./recursos/irpf.json";
import { MapaVigencia as MapaVigenciaIrpfPLR } from "./recursos/irpfPLR.json";
import { AnoMesAliquotasFaixasMap } from "./tipos/ano-mes-aliquotas-faixas-map";
import { DeducaoFaixa } from "./tipos/deducao-faixa";
import { Imposto } from "./tipos/imposto";
import { AliquotasTetoFaixas, Meses } from "./tipos/tipos-basicos";
import { carregarDoJson } from "./utils/json";
import { toAno } from "./utils/datas";
import { getAliquotasVigentes } from "./utils/aliquotas";

/**
 * Mapa global contendo o histórico de vigências de alíquotas e faixas do IRPF (Imposto de Renda Pessoa Física).
 * 
 * Os dados são carregados do recurso estático `irpf.json` e organizados em uma estrutura 
 * indexada por Ano e Mês para facilitar a recuperação da tabela progressiva correta.
 */
export const vigenciaFaixasIrpf: AnoMesAliquotasFaixasMap = carregarDoJson(MapaVigenciaIrpf);

/**
 * Mapa global contendo o histórico de vigências de alíquotas e faixas do IRPF específico para PLR (Participação nos Lucros e Resultados).
 * 
 * A PLR possui uma tributação exclusiva na fonte e uma tabela de faixas distinta da tabela mensal padrão,
 * carregada a partir do arquivo `irpfPLR.json`.
 */
export const vigenciaFaixasIrpfPLR: AnoMesAliquotasFaixasMap = carregarDoJson(MapaVigenciaIrpfPLR);

/**
 * Calcula o Imposto de Renda Pessoa Física (IRPF) utilizando o método progressivo.
 * 
 * A função percorre as faixas de tributação vigentes, aplicando as alíquotas sobre a base de cálculo.
 * Além do cálculo padrão, implementa regras de ajuste para faixas de isenção específicas.
 * 
 * @param salarioBruto - O valor bruto total recebido (usado para validar regras de isenção e calcular a alíquota efetiva).
 * @param baseDeCalculo - O valor tributável líquido de deduções (como INSS, dependentes, pensão, etc).
 * @param usarIsencao5k7k - Se verdadeiro, aplica a isenção total para salários até R$ 5.000,00 e o desconto progressivo para salários até R$ 7.350,00.
 * @param aliquotasTetoFaixas - Tabela opcional com faixas customizadas. Se omitido, busca a tabela vigente para o mês e ano atual em {@link vigenciaFaixasIrpf}.
 * 
 * @returns Um objeto do tipo {@link Imposto} contendo:
 * - `vlImposto`: O valor total do imposto retido.
 * - `aliquotaEfetiva`: O percentual real pago sobre o valor bruto.
 * - `faixas`: O detalhamento de quanto foi tributado em cada nível da tabela.
 * - `vlLiquido`: O salário bruto menos o imposto calculado.
 * 
 * @example
 * // Calcula o IRPF para um salário bruto de 10k com base de cálculo (após INSS) de 9k.
 * const resultado = calcularIRPF(10000, 9000);
 */
export function calcularIRPF(salarioBruto: number, baseDeCalculo: number, usarIsencao5k7k: boolean = true, aliquotasTetoFaixas?: AliquotasTetoFaixas | null): Imposto {

    const dataAtual = new Date();

    aliquotasTetoFaixas ??= getAliquotasVigentes(toAno(dataAtual.getFullYear()), dataAtual.getMonth() + 1, vigenciaFaixasIrpf) ?? new Map();

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
