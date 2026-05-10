import { calcularINSS, vigenciaFaixasInss } from "./inss";
import { calcularIRPF, vigenciaFaixasIrpf, vigenciaFaixasIrpfPLR, vigenciaIrpfDeducaoDependenteMensal, vigenciaIrpfDescontoSimplificado } from "./irpf";
import { DadosDoMes, PartialDadosDoMes } from "./tipos/dados-do-mes";
import { ParametroInvalido } from "./tipos/erros";
import { ImpostoAcumulado } from "./tipos/imposto-acumulado";
import { InformacaoAdicional } from "./tipos/informacao-adicional";
import { OpcoesSerie } from "./tipos/opcoes";
import { Ferias, Meses, TipoRecorrencia } from "./tipos/tipos-basicos";
import { varsName } from "./utils";
import { getFaixasVigentes, getValorVigente } from "./utils/aliquotas";
import { contarMesesContabeisEntre, incrementaAnoMes, toAno, toMes } from "./utils/datas";
import { deducaoMaximaInstrucao } from "./valores";

/**
 * Projeta e calcula uma série temporal de impostos e rendimentos (fluxo mensal ou anual).
 * 
 * Esta função atua como o motor principal de projeção do sistema. Ela orquestra o cálculo 
 * de múltiplos meses (séries), aplicando regras de negócio complexas como:
 * - **Deduções:** Normalização de gastos com saúde e instrução (mensal vs anual).
 * - **Férias:** Aplicação do terço constitucional com base no período aquisitivo.
 * - **13º Salário:** Cálculo recursivo de impostos sobre a gratificação natalina.
 * - **PLR:** Integração de tributação exclusiva sobre participação nos lucros.
 * - **Consolidação:** Soma ponderada de alíquotas efetivas e totais acumulados.
 * 
 * @param opcoes - Configurações detalhadas da simulação, incluindo valores brutos, 
 *                 regras de recorrência e tabelas de vigência tributária.
 * @returns Um objeto {@link ImpostoAcumulado} contendo o somatório de todos os meses 
 *          e o detalhamento individual de cada item da série.
 * 
 * @example
 * const resultadoAnual = calcularSerie({ vlBrutoMensal: 10000, qtdSeries: 12, incluir13: true });
 */
export function calcularSerie(
    opcoes: OpcoesSerie
): ImpostoAcumulado {

    const dataAtual = new Date();
    const _mesAtual = (dataAtual.getMonth() + 1) as Meses;

    let {
        qtdSeries = 12,
        vlBruto,
        incluir13 = false,
        incluirFerias = Ferias.Nao,
        percentualFerias = 1 / 3,
        mesFerias = _mesAtual,
        deducaoSaude = 0,
        deducaoSaudeRecorrencia = TipoRecorrencia.Anual,
        deducaoInstrucao = 0,
        deducaoInstrucaoRecorrencia = TipoRecorrencia.Anual,
        mesPLR = _mesAtual,
        vlPLR = 0,
        mapasDeFaixas = null,
        vigenciaAno = toAno(dataAtual.getFullYear()),
        vigenciaMes = _mesAtual,
        usarDescontoSimplificadoIRPF = true,
        usarIsencao5k7k = true,
        qtdDependentes = 0
    } = opcoes;


    switch (deducaoSaudeRecorrencia) {
        case TipoRecorrencia.Anual:
            deducaoSaude = deducaoSaude / 12;
            break;
        case TipoRecorrencia.Mensal:
            deducaoSaude = deducaoSaude;
    }
    deducaoSaude = deducaoSaude.normalizarPrecisao();

    switch (deducaoInstrucaoRecorrencia) {
        case TipoRecorrencia.Anual:
            deducaoInstrucao = Math.min(deducaoMaximaInstrucao, deducaoInstrucao)
            deducaoInstrucao = deducaoInstrucao / 12;
            break;
        case TipoRecorrencia.Mensal:
            deducaoInstrucao = Math.min(deducaoMaximaInstrucao / 12, deducaoInstrucao)
    }
    deducaoInstrucao = deducaoInstrucao.normalizarPrecisao();

    let itemsSerie: PartialDadosDoMes[] = Array
        .from({ length: qtdSeries }, (_, index) => index)
        .map(indice => ({ indice }));

    for (let item of itemsSerie) {

        const vigenciaAnoMesItem = incrementaAnoMes({ Ano: vigenciaAno, Mes: vigenciaMes }, item.indice!);

        item.anoMes = vigenciaAnoMesItem;

        if (!mapasDeFaixas)
            mapasDeFaixas = {};

        if (!mapasDeFaixas.faixasInss)
            mapasDeFaixas.faixasInss = getFaixasVigentes(vigenciaAnoMesItem.Ano, vigenciaAnoMesItem.Mes, vigenciaFaixasInss);

        if (!mapasDeFaixas.faixasIrpf)
            mapasDeFaixas.faixasIrpf = getFaixasVigentes(vigenciaAnoMesItem.Ano, vigenciaAnoMesItem.Mes, vigenciaFaixasIrpf);

        if (!mapasDeFaixas.faixasIrpfPLR)
            mapasDeFaixas.faixasIrpfPLR = getFaixasVigentes(vigenciaAnoMesItem.Ano, vigenciaAnoMesItem.Mes, vigenciaFaixasIrpfPLR);

        if (!mapasDeFaixas.vlIrpfDescontoSimplificado)
            mapasDeFaixas.vlIrpfDescontoSimplificado = getValorVigente(vigenciaAnoMesItem.Ano, vigenciaAnoMesItem.Mes, vigenciaIrpfDescontoSimplificado);

        if (!mapasDeFaixas.vlIrpfDeducaoDependentes)
            mapasDeFaixas.vlIrpfDeducaoDependentes = getValorVigente(vigenciaAnoMesItem.Ano, vigenciaAnoMesItem.Mes, vigenciaIrpfDeducaoDependenteMensal);


        let informacoesAdicionais = new Set<InformacaoAdicional>();
        informacoesAdicionais.add(InformacaoAdicional.Salario);

        item.vlBruto = vlBruto;

        if (incluirFerias === Ferias.Sim && item.anoMes.Mes === mesFerias) {
            // Inclui ferias desde o primeiro ano
            item.vlBruto += vlBruto * percentualFerias;
            informacoesAdicionais.add(InformacaoAdicional.Ferias);
        } else if (incluirFerias === Ferias.IgnorarPrimeiroAno && item.indice! >= 12 && item.anoMes.Mes === mesFerias) {
            // Inclui ferias somente a partir do segundo ano (periodo aquisitivo)
            item.vlBruto += vlBruto * percentualFerias;
            informacoesAdicionais.add(InformacaoAdicional.Ferias);
        }
        item.vlBruto = item.vlBruto.normalizarPrecisao();

        item.inss = calcularINSS(item.vlBruto, {
            vlBaseDeCalculo: item.vlBruto,
            vigenciaAno: vigenciaAnoMesItem.Ano,
            vigenciaMes: vigenciaAnoMesItem.Mes
        });

        if (qtdDependentes > 0) {
            item.vlDeducoesDependentes = qtdDependentes * mapasDeFaixas.vlIrpfDeducaoDependentes;
            informacoesAdicionais.add(InformacaoAdicional.DeducaoDependentes);
        } else if (qtdDependentes < 0) {
            throw new ParametroInvalido(varsName({ qtdDependentes }), "Quantidade de dependentes não pode ser negativa");
        } else {
            item.vlDeducoesDependentes = 0;
        }

        item.vlDeducoes = item.inss.vlImposto + deducaoSaude + deducaoInstrucao + item.vlDeducoesDependentes;

        const vlIrpfDescontoSimplificado = mapasDeFaixas.vlIrpfDescontoSimplificado;

        const vlBaseDeCalculoIRPF = item.vlBruto - item.vlDeducoes;

        item.irpf = calcularIRPF(item.vlBruto!, {
            vlBaseDeCalculo: vlBaseDeCalculoIRPF,
            usarIsencao5k7k,
            usarDescontoSimplificadoIRPF,
            vlDescontoSimplificado: vlIrpfDescontoSimplificado,
            vigenciaAno: vigenciaAnoMesItem.Ano,
            vigenciaMes: vigenciaAnoMesItem.Mes,
            marcador: informacoesAdicionais
        });

        if (item.anoMes.Mes === mesPLR && vlPLR > 0) {
            item.irpfPLR = calcularIRPF(vlPLR, {
                vlBaseDeCalculo: vlPLR,
                usarIsencao5k7k: false,
                usarDescontoSimplificadoIRPF: false,
                vigenciaAno: vigenciaAnoMesItem.Ano,
                vigenciaMes: vigenciaAnoMesItem.Mes
            });
            informacoesAdicionais.add(InformacaoAdicional.PLR);
        }
        item.vlBruto += item.irpfPLR?.vlBruto ?? 0;
        item.vlBruto = item.vlBruto.normalizarPrecisao();
        item.vlLiquido = item.vlBruto - item.inss.vlImposto - item.irpf.vlImposto - (item.irpfPLR?.vlImposto ?? 0)
        item.vlLiquido = item.vlLiquido.normalizarPrecisao();



        if (incluir13 && item.anoMes.Mes === Meses.Dezembro) {
            informacoesAdicionais.add(InformacaoAdicional.DecimoTerceiro);

            const mesesContabeis = contarMesesContabeisEntre({ Ano: vigenciaAno, Mes: vigenciaMes }, vigenciaAnoMesItem);

            const vlBrutoDecimoTerceiro = mesesContabeis < 12
                ? ((vlBruto / 12) * mesesContabeis).normalizarPrecisao()
                : vlBruto;


            const decimoTerceiro = calcularSerie({
                vlBruto: vlBrutoDecimoTerceiro,
                qtdSeries: 1,
                incluir13: false,
                incluirFerias: Ferias.Nao,
                vigenciaAno: vigenciaAnoMesItem.Ano,
                vigenciaMes: vigenciaAnoMesItem.Mes,
                usarDescontoSimplificadoIRPF,
                qtdDependentes,
                usarIsencao5k7k,
                mapasDeFaixas: null
            });

            const mes13 = decimoTerceiro.meses[0]!;

            item.irpf13 = mes13.irpf;
            item.inss13 = mes13.inss;

            item.vlBruto += mes13.vlBruto;
            item.vlBruto = item.vlBruto.normalizarPrecisao();

            item.vlLiquido += mes13.vlLiquido;
            item.vlLiquido = item.vlLiquido.normalizarPrecisao();

            item.vlDeducoes += mes13.vlDeducoes;
            item.vlDeducoes = item.vlDeducoes.normalizarPrecisao();

            item.vlDeducoesDependentes += mes13.vlDeducoesDependentes;
            item.vlDeducoesDependentes = item.vlDeducoesDependentes.normalizarPrecisao();

        }


        item.informacoesAdicionais = Array.from(informacoesAdicionais);
    }

    let impostosMensais = itemsSerie as DadosDoMes[];

    let anual: ImpostoAcumulado = {
        meses: impostosMensais,
        vlLiquidoTotal: impostosMensais
            .map(mes => mes.vlLiquido)
            .reduce((a, b) => a + b, 0)
            .normalizarPrecisao(),
        vlBrutoTotal: impostosMensais
            .map(mes => mes.vlBruto)
            .reduce((a, b) => a + b, 0)
            .normalizarPrecisao(),
        vlImpostoInssTotal: impostosMensais
            .map(mes => mes.inss.vlImposto + (mes.inss13?.vlImposto ?? 0))
            .reduce((a, b) => a + b, 0)
            .normalizarPrecisao(),
        vlImpostoIrpfTotal: impostosMensais
            .map(mes => mes.irpf.vlImposto + (mes.irpfPLR?.vlImposto ?? 0) + (mes.irpf13?.vlImposto ?? 0))
            .reduce((a, b) => a + b, 0)
            .normalizarPrecisao(),
        vlImpostoIrpfPLRTotal: impostosMensais
            .map(mes => mes.irpfPLR?.vlImposto ?? 0)
            .reduce((a, b) => a + b, 0)
            .normalizarPrecisao(),
        vlDeducoesDependentes: impostosMensais
            .map(mes => mes.vlDeducoesDependentes)
            .reduce((a, b) => a + b, 0)
            .normalizarPrecisao(),
        vlDeducoesTotal: impostosMensais
            .map(mes => mes.vlDeducoes)
            .reduce((a, b) => a + b, 0)
            .normalizarPrecisao(),
        pAliquotaIrpfPLREfetiva: 0,
        vlImpostoTotal: 0,
        pAliquotaInssEfetiva: 0,
        pAliquotaIrpfEfetiva: 0,
        pAliquotaEfetivaTotal: 0
    };
    anual.vlImpostoTotal = anual.vlImpostoInssTotal + anual.vlImpostoIrpfTotal + anual.vlImpostoIrpfPLRTotal;
    anual.vlImpostoTotal = anual.vlImpostoTotal.normalizarPrecisao();

    anual.pAliquotaInssEfetiva = anual.vlImpostoInssTotal / anual.vlBrutoTotal;
    anual.pAliquotaIrpfEfetiva = anual.vlImpostoIrpfTotal / anual.vlBrutoTotal;
    anual.pAliquotaIrpfPLREfetiva = anual.vlImpostoIrpfPLRTotal / anual.vlBrutoTotal;
    anual.pAliquotaEfetivaTotal = (anual.pAliquotaInssEfetiva + anual.pAliquotaIrpfEfetiva + anual.pAliquotaIrpfPLREfetiva)

    return anual;
}
