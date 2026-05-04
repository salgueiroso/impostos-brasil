import { calcularSerie, Ferias, Meses, TipoRecorrencia, toAno } from "impostos-brasil";

// /** Valor base do salário bruto para a simulação */
// const salarioBruto = 8000;
// /** Define se o cálculo deve considerar o pagamento do 13º salário */
// const incluir13 = true;

// /** 
//  * Objeto contendo o consolidado do período (totais) e o 
//  * detalhamento individual de cada mês processado.
//  */
// const resultadoAnual = calcularSerie({
//     qtdSeries: 12,
//     vlBruto: salarioBruto,
//     incluir13: incluir13,
//     incluirFerias: Ferias.IgnorarPrimeiroAno,
//     mesFerias: Meses.Setembro,
//     deducaoSaude: 0,
//     deducaoSaudeRecorrencia: TipoRecorrencia.Mensal,
//     deducaoInstrucao: 0,
//     deducaoInstrucaoRecorrencia: TipoRecorrencia.Anual,
//     mesPLR: Meses.Abril,
//     vlPLR: 5000,
//     vigenciaAno: toAno(2025),
//     vigenciaMes: Meses.Novembro
// });


// console.log(`Bruto Mensal: ${salarioBruto.toBRL()}`);
// console.log(`Bruto Periodo: ${resultadoAnual.vlBrutoTotal.toBRL()}`);
// console.log(`INSS Periodo: ${resultadoAnual.vlImpostoInssTotal.toBRL()}`);
// console.log(`IRPF Periodo: ${resultadoAnual.vlImpostoIrpfTotal.toBRL()}`);
// console.log(`Líquido Periodo: ${resultadoAnual.vlLiquidoTotal.toBRL()}`);
// console.log(`Aliquota Efetiva: ${resultadoAnual.pAliquotaEfetivaTotal.toPercent()}`);
// console.log(`Imposto Periodo: ${resultadoAnual.vlImpostoTotal.toBRL()}`);

// for (let mes of resultadoAnual.meses) {
//     console.log(`Mês ${Meses[mes.mes]} (${mes.indice}):`);
//     console.log(`  Informacoes: ${mes.informacoesAdicionais.join(', ')}`);
//     console.log(`  Salário Bruto: ${mes.vlBruto.toBRL()}`);
//     console.log(`  INSS: ${mes.inss.vlImposto.toBRL()}`);
//     console.log(`  Base de calculo IRPF: ${mes.irpf.vlBaseDeCalculo.toBRL()}`);
//     console.log(`  IRPF: ${mes.irpf.vlImposto.toBRL()}`);
//     if (!!mes.irpfPLR) {
//         console.log(`  Base de calculo IRPF PLR: ${(mes.irpfPLR?.vlBaseDeCalculo ?? 0).toBRL()}`);
//         console.log(`  IRPF PLR: ${(mes.irpfPLR?.vlImposto ?? 0).toBRL()}`);
//     }
//     console.log(`  Salário Líquido: ${mes.vlLiquido.toBRL()}`);
// }
