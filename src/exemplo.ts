import { calcularSerie } from "./serie";
import { Ferias, Meses, TipoRecorrencia } from "./tipos/tipos-basicos";
import { toAno } from "./utils/datas";
import { toBRL, toPercent } from "./utils/formatacoes";

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
export function exemplo() {
    /** Valor base do salário bruto para a simulação */
    const salarioBruto = 10000;
    /** Define se o cálculo deve considerar o pagamento do 13º salário */
    const incluir13 = true;

    /** 
     * Objeto contendo o consolidado do período (totais) e o 
     * detalhamento individual de cada mês processado.
     */
    const resultadoAnual = calcularSerie({
        qtdSeries: 12,
        vlBrutoMensal: salarioBruto,
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


    console.log(`Bruto Mensal: ${toBRL(salarioBruto)}`);
    console.log(`Bruto Periodo: ${toBRL(resultadoAnual.vlBrutoTotal)}`);
    console.log(`INSS Periodo: ${toBRL(resultadoAnual.vlImpostoInssTotal)}`);
    console.log(`IRPF Periodo: ${toBRL(resultadoAnual.vlImpostoIrpfTotal)}`);
    console.log(`Líquido Periodo: ${toBRL(resultadoAnual.vlLiquidoTotal)}`);
    console.log(`Aliquota Efetiva: ${toPercent(resultadoAnual.pAliquotaEfetivaTotal)}`);
    console.log(`Imposto Periodo: ${toBRL(resultadoAnual.vlImpostoTotal)}`);

    for (let mes of resultadoAnual.meses) {
        console.log(`Mês ${Meses[mes.mes]} (${mes.indice}):`);
        console.log(`  Informacoes: ${mes.informacoesAdicionais}`);
        console.log(`  Salário Bruto: ${toBRL(mes.vlSalarioBruto)}`);
        console.log(`  INSS: ${toBRL(mes.inss.vlImposto)}`);
        console.log(`  Base de calculo IRPF: ${toBRL(mes.irpf.vlBaseDeCalculo)}`);
        console.log(`  IRPF: ${toBRL(mes.irpf.vlImposto)}`);
        if (!!mes.irpfPLR) {
            console.log(`  Base de calculo IRPF PLR: ${toBRL(mes.irpfPLR?.vlBaseDeCalculo ?? 0)}`);
            console.log(`  IRPF PLR: ${toBRL(mes.irpfPLR?.vlImposto ?? 0)}`);
        }
        console.log(`  Salário Líquido: ${toBRL(mes.vlSalarioLiquido)}`);
    }
}