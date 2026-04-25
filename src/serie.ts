import { calcularINSS, vigenciaFaixasInss } from "./inss";
import { calcularIRPF, vigenciaFaixasIrpf, vigenciaFaixasIrpfPLR } from "./irpf";
import { DadosDoMes, PartialDadosDoMes } from "./tipos/dados-do-mes";
import { ImpostoAcumulado } from "./tipos/imposto-acumulado";
import { InformacaoAdicional } from "./tipos/informacao-adicional";
import { OpcoesSerie } from "./tipos/opcoes-serie";
import { Ferias, Meses, TipoRecorrencia } from "./tipos/tipos-basicos";
import { getAliquotasVigentes } from "./utils/aliquotas";
import { Contar13, toAno, toMes } from "./utils/datas";
import { incrementarImposto } from "./utils/impostos";
import { deducaoMaximaInstrucao } from "./valores";

/**
 * Executa o calculo de uma série temporal.
 * @param opcoes Opções de entrada da série temporal
 * @returns Retorna um objeto {@link ImpostoAcumulado} com os dados da série temporal
 */
export function calcularSerie(
    opcoes: OpcoesSerie
): ImpostoAcumulado {

    let anoAtual = toAno(new Date().getFullYear());
    let mesAtual = new Date().getMonth() + 1 as Meses;

    let {
        qtdSeries = 12,
        vlBrutoMensal,
        incluir13 = false,
        incluirFerias = Ferias.Nao,
        percentualFerias = 1 / 3,
        mesFerias = mesAtual,
        deducaoSaude = 0,
        deducaoSaudeRecorrencia = TipoRecorrencia.Anual,
        deducaoInstrucao = 0,
        deducaoInstrucaoRecorrencia = TipoRecorrencia.Anual,
        mesPLR = mesAtual,
        vlPLR = 0,
        mapasDeFaixas = null,
        vigenciaAno = anoAtual,
        vigenciaMes = mesAtual
    } = opcoes;


    switch (deducaoSaudeRecorrencia) {
        case TipoRecorrencia.Anual:
            deducaoSaude = deducaoSaude / 12;
            break;
        case TipoRecorrencia.Mensal:
        default:
            deducaoSaude = deducaoSaude;
    }

    switch (deducaoInstrucaoRecorrencia) {
        case TipoRecorrencia.Anual:
            deducaoInstrucao = Math.min(deducaoMaximaInstrucao, deducaoInstrucao)
            deducaoInstrucao = deducaoInstrucao / 12;
            break;
        case TipoRecorrencia.Mensal:
        default:
            deducaoInstrucao = Math.min(deducaoMaximaInstrucao / 12, deducaoInstrucao)
    }

    if (!!vigenciaAno && !!vigenciaMes) {
        mapasDeFaixas ??= {};
        mapasDeFaixas.faixasInss ??= getAliquotasVigentes(vigenciaAno, vigenciaMes, vigenciaFaixasInss) ?? new Map();
        mapasDeFaixas.faixasIrpf ??= getAliquotasVigentes(vigenciaAno, vigenciaMes, vigenciaFaixasIrpf) ?? new Map();
        mapasDeFaixas.faixasIrpfPLR ??= getAliquotasVigentes(vigenciaAno, vigenciaMes, vigenciaFaixasIrpfPLR) ?? new Map();
    }

    let itemsSerie: PartialDadosDoMes[] = Array
        .from({ length: qtdSeries }, (_, index) => index)
        .map(indice => ({ indice }));

    for (let item of itemsSerie) {

        let informacoesAdicionais = new Set<InformacaoAdicional>();
        informacoesAdicionais.add(InformacaoAdicional.Salario);

        item.mes = toMes(item.indice!)

        item.vlSalarioBruto = vlBrutoMensal;

        if (incluirFerias === Ferias.Sim && item.mes === mesFerias) {
            // Inclui ferias desde o primeiro ano
            item.vlSalarioBruto += vlBrutoMensal * percentualFerias;
            informacoesAdicionais.add(InformacaoAdicional.Ferias);
        } else if (incluirFerias === Ferias.IgnorarPrimeiroAno && item.indice! >= 12 && item.mes === mesFerias) {
            // Inclui ferias somente a partir do segundo ano (periodo aquisitivo)
            item.vlSalarioBruto += vlBrutoMensal * percentualFerias;
            informacoesAdicionais.add(InformacaoAdicional.Ferias);
        }


        item.inss = calcularINSS(item.vlSalarioBruto ?? 0, item.vlSalarioBruto ?? 0, mapasDeFaixas?.faixasInss);
        item.vlDeducoes = item.inss.vlImposto + deducaoSaude + deducaoInstrucao;
        item.irpf = calcularIRPF(item.vlSalarioBruto ?? 0, (item.vlSalarioBruto ?? 0) - item.vlDeducoes, true, mapasDeFaixas?.faixasIrpf);

        if (item.mes === mesPLR && vlPLR > 0) {
            item.irpfPLR = calcularIRPF(vlPLR, vlPLR, false, mapasDeFaixas!.faixasIrpfPLR);
            informacoesAdicionais.add(InformacaoAdicional.PLR);
        }
        item.vlSalarioBruto = (item.vlSalarioBruto ?? 0) + (item.irpfPLR?.vlBruto ?? 0);
        item.vlSalarioLiquido = item.vlSalarioBruto - item.inss.vlImposto - item.irpf.vlImposto - (item.irpfPLR?.vlImposto ?? 0)



        if (incluir13 && item.mes === Meses.Dezembro) {
            informacoesAdicionais.add(InformacaoAdicional.DecimoTerceiro);
            const decimoTerceiro = calcularSerie({
                vlBrutoMensal,
                qtdSeries: 1,
                incluir13: false,
                incluirFerias: Ferias.Nao,
                mapasDeFaixas,
                vigenciaAno,
                vigenciaMes
            });

            const mes13 = decimoTerceiro.meses[0]!;

            item.vlSalarioBruto += mes13.vlSalarioBruto;
            item.vlSalarioLiquido += mes13.vlSalarioLiquido;
            item.vlDeducoes += mes13.vlDeducoes;
            incrementarImposto(mes13.inss, item.inss);
            incrementarImposto(mes13.irpf, item.irpf);

        }


        item.informacoesAdicionais = Array.from(informacoesAdicionais);
    }

    let impostosMensais = itemsSerie as DadosDoMes[];

    let anual: ImpostoAcumulado = {
        meses: impostosMensais,
        vlLiquidoTotal: impostosMensais
            .map(mes => mes.vlSalarioLiquido)
            .reduce((a, b) => a + b, 0),
        vlBrutoTotal: impostosMensais
            .map(mes => mes.vlSalarioBruto)
            .reduce((a, b) => a + b, 0),
        vlImpostoInssTotal: impostosMensais
            .map(mes => mes.inss.vlImposto)
            .reduce((a, b) => a + b, 0),
        vlImpostoIrpfTotal: impostosMensais
            .map(mes => mes.irpf.vlImposto + (mes.irpfPLR?.vlImposto ?? 0))
            .reduce((a, b) => a + b, 0),
        vlImpostoIrpfPLRTotal: impostosMensais
            .map(mes => mes.irpfPLR?.vlImposto ?? 0)
            .reduce((a, b) => a + b, 0),
        pAliquotaIrpfPLREfetiva: 0,
        vlImpostoTotal: 0,
        pAliquotaInssEfetiva: 0,
        pAliquotaIrpfEfetiva: 0,
        pAliquotaEfetivaTotal: 0
    };
    anual.vlImpostoTotal = anual.vlImpostoInssTotal + anual.vlImpostoIrpfTotal + anual.vlImpostoIrpfPLRTotal;
    anual.pAliquotaInssEfetiva = anual.vlImpostoInssTotal / anual.vlBrutoTotal;
    anual.pAliquotaIrpfEfetiva = anual.vlImpostoIrpfTotal / anual.vlBrutoTotal;
    anual.pAliquotaIrpfPLREfetiva = anual.vlImpostoIrpfPLRTotal / anual.vlBrutoTotal;
    anual.pAliquotaEfetivaTotal = (anual.pAliquotaInssEfetiva + anual.pAliquotaIrpfEfetiva + anual.pAliquotaIrpfPLREfetiva)

    return anual;
}
