import { calcularSerie, toMes } from "./serie";
import { Meses, TipoRecorrencia, toAno } from "./types/types";

/**
 * Metodo de implementação de exemplo 
 */
export const exemplo = () => {

    const salarioBruto = 10000;
    const incluir13 = true;
    const incluirFerias = true;

    const resultadoAnual = calcularSerie({
        qtdSeries: 12,
        vlBrutoMensal: salarioBruto,
        incluir13: incluir13,
        incluirFerias: incluirFerias,
        mesFerias: Meses.Setembro,
        deducaoSaude: 0,
        deducaoSaudeRecorrencia: TipoRecorrencia.Mensal,
        deducaoInstrucao: 0,
        deducaoInstrucaoRecorrencia: TipoRecorrencia.Anual,
        mesPLR: Meses.Abril,
        vlPLR: 5000,
        vigenciaAno: toAno(2026),
        vigenciaMes: Meses.Janeiro
    });


    console.log(`Bruto Mensal: ${salarioBruto.toBRL()}`);
    console.log(`Bruto Anual: ${resultadoAnual.vlBrutoTotal.toBRL()}`);
    console.log(`INSS Anual: ${resultadoAnual.vlImpostoInssTotal.toBRL()}`);
    console.log(`IRPF Anual: ${resultadoAnual.vlImpostoIrpfTotal.toBRL()}`);
    console.log(`Líquido Anual: ${resultadoAnual.vlLiquidoTotal.toBRL()}`);
    console.log(`Aliquota Efetiva: ${resultadoAnual.pAliquotaEfetivaTotal.toPercent()}`);
    console.log(`Imposto Anual: ${resultadoAnual.vlImpostoTotal.toBRL()}`);

    for (let mes of resultadoAnual.meses) {
        // if (mes.mes !== 4) continue;
        console.log(`Mês ${toMes(mes.numeroMes)} (${mes.numeroMes}):`);
        console.log(`  Salário Bruto: ${mes.vlSalarioBruto.toBRL()}`);
        console.log(`  INSS: ${mes.inss.vlImposto.toBRL()}`);
        console.log(`  Base de calculo IRPF: ${mes.irpf.vlBaseDeCalculo.toBRL()}`);
        console.log(`  IRPF: ${mes.irpf.vlImposto.toBRL()}`);
        if (!!mes.irpfPLR) {
            console.log(`  Base de calculo IRPF PLR: ${(mes.irpfPLR?.vlBaseDeCalculo ?? 0).toBRL()}`);
            console.log(`  IRPF PLR: ${(mes.irpfPLR?.vlImposto ?? 0).toBRL()}`);
        }
        console.log(`  Salário Líquido: ${mes.vlSalarioLiquido.toBRL()}`);
    }



}