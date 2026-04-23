import { DadosDoMes, ImpostoAcumulado, PartialDadosDosMeses } from "./types/imposto-acumulado";
import { calcularINSS } from "./inss";
import { calcularIRPF } from "./irpf";
import { AliquotasTetoFaixas, Ano, Meses, TipoRecorrencia, toAno } from "./types/types";
import { deducaoMaximaInstrucao, vigenciaFaixasInss, vigenciaFaixasIrpf, vigenciaFaixasIrpfPLR } from "./values";
import { getAliquotasVigentes } from "./utils";



/**
 * Opções com mapas de faixas a serem utilizadas 
 */
export interface OpcoesMapasFaixas {

    /**
     * Faixas do INSS
     * @default Faixas vigentes na data corrente
     */
    faixasInss?: AliquotasTetoFaixas,

    /**
     * Faixas do IRPF
     * @default Faixas vigentes na data corrente
     */
    faixasIrpf?: AliquotasTetoFaixas,

    /**
     * Faixas do IRPF PLR
     * @default Faixas vigentes na data corrente
     */
    faixasIrpfPLR?: AliquotasTetoFaixas
}

/**
 * Opções para a simulação de uma série
 */
export interface OpcoesSerie {
    /**
     * Numero de series/meses a ser considerada na simulação.
     * Se omitido o valor assumido será 12 (meses)
     * @default 12 Meses
     */
    qtdSeries?: number,

    /**
     * Valor bruto mensal utilizaso na simulação da serie.
     * @default R$ 1621.00
     */
    vlBrutoMensal: number,

    /**
     * Incluir o 13 na serie
     * @default false
     */
    incluir13?: boolean,

    /**
     * Incluir o salario de ferias na simulação
     * @default false
     */
    incluirFerias?: boolean,

    /**
     * Percentual do adicional de salario das ferias
     * @default 1/3 ou (0.333...)
     */
    percentualFerias?: number,

    /**
     * Mes onde as ferias será calculada
     * @default Mes Atual
     */
    mesFerias?: Meses,

    /**
     * Valor dos gastos com saude
     * @default R$ 0.00
     */
    deducaoSaude?: number,

    /**
     * Tipo da recorrencia da dedução dos gastos da saude.
     * @default {@link TipoRecorrencia.Anual}
     */
    deducaoSaudeTipo?: TipoRecorrencia,

    /**
     * Valor da dedução dos gastos com instrução.
     * @default R$ 0.00
     */
    deducaoInstrucao?: number,

    /**
     * Tipo da recorrencia da dedução dos gastos dcom instrução/educação
     * @default {@link TipoRecorrencia.Anual}
     */
    deducaoInstrucaoTipo?: TipoRecorrencia,

    /**
     * Mes para o calculo da PLR
     * @default Mes Atual
     */
    mesPLR?: Meses,

    /**
     * Valor da PLR, se houver.
     * @default R$ 0.00
     */
    vlPLR?: number,

    /**
     * Mapas das aliquotas e faixas do irpf e inss a serem considerados para o calculo. 
     * Caso nao sejam informadas as faixas, serão utilizadas as faixas vigentes atualmente.
     */
    mapasDeFaixas?: null | OpcoesMapasFaixas;

    /**
     * Ano da vigencia das faixas. Se omitido, o ano atual será utilizado.
     * @default Ano atual
     */
    vigenciaAno?: Ano,

    /**
     * Mês de vigência das faixas. Se omitido, o mês atual será utilizado.
     * @default Mes atual
     */
    vigenciaMes?: Meses

}

/**
 * Realiza a contagem de decimos terceiros de acordo com a quantidade de meses informada
 * @param qtdMeses A quantidade de meses a ser realizada a contagem de dcimos terceiros.
 * @returns Retorna um numero com a quantidade de decimos terceiros existentes no periodo informado.
 */
function Contar13(qtdMeses: number): number {
    let qtd12 = Math.floor(qtdMeses / 12);
    return qtd12;
}

/**
 * Descobre o mes de acordo com a a posicao informada considerando os decimos terceiros.
 * @param posicaoNaSerie A posicao a ser extraido o mes.
 * @returns Retorna o mes relacionado a posicao informada.
 */
export function toMes(posicaoNaSerie: number): Meses {
    let mes = posicaoNaSerie % 13;
    mes = posicaoNaSerie > 0 && mes === 0 ? 13 : mes;
    return mes as Meses;
}


/**
 * Executa o calculo de uma série temporal.
 * @param opcoes Opções de entrada da série temporal
 * @returns Retorna um objeto {@link ImpostoAcumulado} com os dados da série temporal
 */
export const calcularSerie = function (
    opcoes: OpcoesSerie
): ImpostoAcumulado {

    let anoAtual = toAno(new Date().getFullYear());
    let mesAtual = new Date().getMonth() + 1 as Meses;

    let {
        qtdSeries = 12,
        vlBrutoMensal,
        incluir13 = false,
        incluirFerias = false,
        percentualFerias = 1 / 3,
        mesFerias: mesDasFerias = mesAtual,
        deducaoSaude = 0,
        deducaoSaudeTipo = TipoRecorrencia.Anual,
        deducaoInstrucao = 0,
        deducaoInstrucaoTipo = TipoRecorrencia.Anual,
        mesPLR = mesAtual,
        vlPLR = 0,
        mapasDeFaixas = null,
        vigenciaAno = anoAtual,
        vigenciaMes = mesAtual
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

    let impostosMensais = Array.from({ length: qtdSeries + (incluir13 ? Contar13(qtdSeries) : 0) }, (_, index) => index + 1)
        .map(numeroMes =>
        ({
            mes: numeroMes,
            vlSalarioBruto:
                (incluirFerias && toMes(numeroMes) === mesDasFerias ? vlBrutoMensal * percentualFerias : 0) + vlBrutoMensal
        } as PartialDadosDosMeses))
        .map(mes => ({ ...mes, inss: calcularINSS(mes.vlSalarioBruto ?? 0, mes.vlSalarioBruto ?? 0, mapasDeFaixas?.faixasInss) }))
        .map(mes => {
            return {
                ...mes,
                vlDeducoes: mes.inss.vlImposto + deducaoSaude + deducaoInstrucao
            };
        })
        .map(mes => ({ ...mes, irpf: calcularIRPF(mes.vlSalarioBruto ?? 0, (mes.vlSalarioBruto ?? 0) - mes.vlDeducoes, true, mapasDeFaixas?.faixasIrpf) }))
        .map(mes => ({ ...mes, irpfPLR: mes.numeroMes === mesPLR && vlPLR > 0 ? calcularIRPF(vlPLR, vlPLR, false, mapasDeFaixas!.faixasIrpfPLR) : null }))

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