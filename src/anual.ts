import { DadosDoMes, ImpostoAcumulado, PartialDadosDosMeses } from "./types/imposto-acumulado";
import { calcularINSS } from "./inss";
import { calcularIRPF } from "./irpf";
import { AliquotasTetoFaixas, Meses, TipoRecorrencia } from "./types/types";
import { deducaoMaximaInstrucao, getAliquotasVigentes, vigenciaFaixasInss, vigenciaFaixasIrpf, vigenciaFaixasIrpfPLR } from "./values";

/**
 * Opções para a simulação de uma série
 */
export interface OpcoesSimulacaoAnual {
    /**
     * Numero de series a ser considerada na simulação
     */
    qtdSeries?: number,

    /**
     * Valor bruto mensal utilizaso na simulação da serie.
     */
    vlBrutoMensal: number,

    /**
     * Incluir o 13 na serie
     */
    incluir13?: boolean,

    /**
     * Incluir o salario de ferias na simulação
     */
    incluirFerias?: boolean,

    /**
     * Percentual do adicional de salario das ferias
     */
    percentualFerias?: number,

    /**
     * Mes onde as ferias será calculada
     */
    mesDasFerias?: Meses,

    /**
     * Valor dos gastos com saude
     */
    deducaoSaude?: number,

    /**
     * Tipo da recorrencia da dedução dos gastos da saude
     */
    deducaoSaudeTipo?: TipoRecorrencia,

    /**
     * Valor da dedução dos gastos com instrução
     */
    deducaoInstrucao?: number,

    /**
     * Tipo da recorrencia da dedução dos gastos dcom instrução/educação
     */
    deducaoInstrucaoTipo?: TipoRecorrencia,

    /**
     * Mes para o calculo da PLR
     */
    mesPLR?: Meses,

    /**
     * Valor da PLR, se houver.
     */
    vlPLR?: number,

    /**
     * Mapas das aliquotas e faixas do irpf e inss a serem considerados para o calculo. 
     */
    mapasDeFaixas?: null | {
        faixasInss?: AliquotasTetoFaixas,
        faixasIrpf?: AliquotasTetoFaixas,
        faixasIrpfPLR?: AliquotasTetoFaixas
    }

    /**
     * Ano da vigencia das faixas
     */
    vigenciaAno?: number,

    /**
     * Mês de vigência das faixas
     */
    vigenciaMes?: Meses

}

/**
 * Executa a simulação temporal/serial/anual de INSS e IRPF
 * @param opcoes Opções de entrada da simulação temporal
 * @returns Retorna um objeto {@link ImpostoAcumulado} com os dados da simulação temporal
 */
export const simulacaoSerie = function (
    opcoes: OpcoesSimulacaoAnual
): ImpostoAcumulado {


    let {
        qtdSeries = 12,
        vlBrutoMensal,
        incluir13 = false,
        incluirFerias = false,
        percentualFerias = 0.3,
        mesDasFerias = Meses.Outubro,
        deducaoSaude = 0,
        deducaoSaudeTipo = TipoRecorrencia.Anual,
        deducaoInstrucao = 0,
        deducaoInstrucaoTipo = TipoRecorrencia.Anual,
        mesPLR = Meses.Abril,
        vlPLR = 0,
        mapasDeFaixas = null,
        vigenciaAno = null,
        vigenciaMes = null
    } = opcoes;


    switch (deducaoSaudeTipo) {
        case TipoRecorrencia.Anual:
            deducaoSaude = deducaoSaude / 12;
            break;
        case TipoRecorrencia.Mensal:
        default:
            deducaoSaude = deducaoSaude;
    }

    switch (deducaoInstrucaoTipo) {
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

    let impostosMensais = Array.from({ length: qtdSeries + (incluir13 ? 1 : 0) }, (_, index) => index + 1)
        .map(numeroMes =>
        ({
            mes: numeroMes,
            vlSalarioBruto:
                (incluirFerias && numeroMes === mesDasFerias ? vlBrutoMensal * percentualFerias : 0)
                // + (numeroMes === mesPLR ? vlPLR : 0)
                + vlBrutoMensal
        } as PartialDadosDosMeses))
        .map(mes => ({ ...mes, inss: calcularINSS(mes.vlSalarioBruto ?? 0, mes.vlSalarioBruto ?? 0, mapasDeFaixas?.faixasInss) }))
        .map(mes => {
            return {
                ...mes,
                vlDeducoes: mes.inss.vlImposto + deducaoSaude + deducaoInstrucao //+ (mes.mes === mesPLR ? vlPLR : 0)
            };
        })
        .map(mes => ({ ...mes, irpf: calcularIRPF(mes.vlSalarioBruto ?? 0, (mes.vlSalarioBruto ?? 0) - mes.vlDeducoes, true, mapasDeFaixas?.faixasIrpf) }))
        .map(mes => ({ ...mes, irpfPLR: mes.mes === mesPLR && vlPLR > 0 ? calcularIRPF(vlPLR, vlPLR, false, mapasDeFaixas!.faixasIrpfPLR) : null }))

        .map(mes => ({ ...mes, vlSalarioBruto: (mes.vlSalarioBruto ?? 0) + (mes.irpfPLR?.vlBruto ?? 0) }))
        .map(mes => ({ ...mes, vlSalarioLiquido: mes.vlSalarioBruto - mes.inss.vlImposto - mes.irpf.vlImposto - (mes.irpfPLR?.vlImposto ?? 0) }))

        .map(mes => mes as DadosDoMes);

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