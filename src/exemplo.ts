import './utils/extensoes';
import { calcularSerie } from "./serie";
import { Ferias, Meses, TipoRecorrencia } from "./tipos/tipos-basicos";
import { toAno } from "./utils/datas";

/**
 * Executa uma demonstração completa do motor de cálculo de impostos.
 * 
 * Esta função exemplifica como utilizar a função `calcularSerie` para projetar
 * os custos e rendimentos líquidos em um cenário de 12 meses, cobrindo eventos como:
 * - Provisão ou pagamento de 13º salário.
 * - Regras de férias (ex: gozo após o primeiro ano).
 * - Recebimento de PLR com tributação exclusiva.
 * - Deduções mensais e anuais (saúde e instrução).
 * 
 * O resultado é impresso no console com formatação monetária brasileira (BRL).
 */
/* istanbul ignore next */
export function exemplo() {
    /** Valor base do salário bruto para a simulação */
    const salarioBruto = 8000;
    /** Define se o cálculo deve considerar o pagamento do 13º salário */
    const incluir13 = true;

    /** 
     * Objeto contendo o consolidado do período (totais) e o 
     * detalhamento individual de cada mês processado.
     */
    const resultadoAnual = calcularSerie({
        qtdSeries: 12,
        vlBruto: salarioBruto,
        incluir13: incluir13,
        incluirFerias: Ferias.IgnorarPrimeiroAno,
        mesFerias: Meses.Setembro,
        deducaoSaude: 0,
        deducaoSaudeRecorrencia: TipoRecorrencia.Mensal,
        deducaoInstrucao: 0,
        deducaoInstrucaoRecorrencia: TipoRecorrencia.Anual,
        mesPLR: Meses.Abril,
        vlPLR: 5000,
        vigenciaAno: toAno(2025),
        vigenciaMes: Meses.Novembro
    });


    console.log(`Bruto Mensal: ${salarioBruto.toBRL()}`);
    console.log(`Bruto Periodo: ${resultadoAnual.vlBrutoTotal.toBRL()}`);
    console.log(`INSS Periodo: ${resultadoAnual.vlImpostoInssTotal.toBRL()}`);
    console.log(`IRPF Periodo: ${resultadoAnual.vlImpostoIrpfTotal.toBRL()}`);
    console.log(`Líquido Periodo: ${resultadoAnual.vlLiquidoTotal.toBRL()}`);
    console.log(`Aliquota Efetiva: ${resultadoAnual.pAliquotaEfetivaTotal.toPercent()}`);
    console.log(`Imposto Periodo: ${resultadoAnual.vlImpostoTotal.toBRL()}`);

    for (let mes of resultadoAnual.meses) {
        console.log(`Mês ${Meses[mes.mes]} (${mes.indice}):`);
        console.log(`  Informacoes: ${mes.informacoesAdicionais.join(', ')}`);
        console.log(`  Salário Bruto: ${mes.vlBruto.toBRL()}`);
        console.log(`  INSS: ${mes.inss.vlImposto.toBRL()}`);
        console.log(`  Base de calculo IRPF: ${mes.irpf.vlBaseDeCalculo.toBRL()}`);
        console.log(`  IRPF: ${mes.irpf.vlImposto.toBRL()}`);
        if (!!mes.irpfPLR) {
            console.log(`  Base de calculo IRPF PLR: ${(mes.irpfPLR?.vlBaseDeCalculo ?? 0).toBRL()}`);
            console.log(`  IRPF PLR: ${(mes.irpfPLR?.vlImposto ?? 0).toBRL()}`);
        }
        console.log(`  Salário Líquido: ${mes.vlLiquido.toBRL()}`);
    }
}