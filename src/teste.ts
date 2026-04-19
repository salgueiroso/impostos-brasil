import { simulacaoSerie } from "./anual";
import { TipoRecorrencia } from "./types/types";
import { toBRL, toPercent } from "./utils";


const salarioBruto = 13031.71;
const incluir13 = true;
const incluirFerias = true;

const resultadoAnual = simulacaoSerie({
    // qtdSeries: 12,
    vlBrutoMensal: salarioBruto,
    incluir13: incluir13,
    incluirFerias: incluirFerias,
    // percentualFerias: 0.3,
    mesDasFerias: 9,
    deducaoSaude: 0,
    deducaoSaudeTipo: TipoRecorrencia.Mensal,
    deducaoInstrucao: 0,
    deducaoInstrucaoTipo: TipoRecorrencia.Anual,
    mesPLR: 4,
    vlPLR: 5000,
    vigenciaAno: 2026,
    vigenciaMes: 1
});


console.log(`Bruto Mensal: ${toBRL(salarioBruto)}`);
console.log(`Bruto Anual: ${toBRL(resultadoAnual.vlBrutoTotal)}`);
console.log(`INSS Anual: ${toBRL(resultadoAnual.vlImpostoInssTotal)}`);
console.log(`IRPF Anual: ${toBRL(resultadoAnual.vlImpostoIrpfTotal)}`);
console.log(`Líquido Anual: ${toBRL(resultadoAnual.vlLiquidoTotal)}`);
console.log(`Aliquota Efetiva: ${toPercent(resultadoAnual.pAliquotaEfetivaTotal)}`);
console.log(`Imposto Anual: ${toBRL(resultadoAnual.vlImpostoTotal)}`);

for (let mes of resultadoAnual.meses) {
    // if (mes.mes !== 4) continue;
    console.log(`Mês ${mes.mes}:`);
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



