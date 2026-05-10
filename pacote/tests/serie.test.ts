import { describe, test, expect } from '@jest/globals';
import { calcularSerie } from '../src/serie';
import { Ferias, Meses, TipoRecorrencia } from '../src/tipos/tipos-basicos';
import { varsName } from '../src/utils/helper';


describe(varsName({ calcularSerie }), () => {


    test.each([
        { salario: 1621, mes: Meses.Janeiro, ano: 2026, deducaoSaude: 2000, deducaoSaudeRecorrencia: TipoRecorrencia.Anual, imposto: 0 },
        { salario: 10000, mes: Meses.Janeiro, ano: 2026, deducaoSaude: 166.666, deducaoSaudeRecorrencia: TipoRecorrencia.Mensal, imposto: 19854.155 },
        { salario: 10000, mes: Meses.Maio, ano: 2026, deducaoSaude: 2000, deducaoSaudeRecorrencia: TipoRecorrencia.Anual, imposto: 18916.143 },
    ])("Salario bruto de R$$salario, deducao saude R$$deducaoSaude com recorrencia $deducaoSaudeRecorrencia, com vigencia em $ano/$mes deve gerar um imposto IRPF de R$$imposto", ({ salario, mes, ano, deducaoSaude, deducaoSaudeRecorrencia, imposto }) => {


        const qtdSeries = 12;
        const incluir13 = true;

        const resultado = calcularSerie({
            vlBruto: salario,
            qtdSeries,
            incluir13,
            deducaoSaude,
            deducaoSaudeRecorrencia: deducaoSaudeRecorrencia,
            vigenciaAno: ano,
            vigenciaMes: mes
        })

        expect(resultado.vlImpostoIrpfTotal).toBe(imposto);
    });

    test.each([
        { salario: 1621, mes: Meses.Janeiro, ano: 2026, deducaoInstrucao: 2000, deducaoInstrucaoRecorrencia: TipoRecorrencia.Anual, imposto: 0 },
        { salario: 10000, mes: Meses.Janeiro, ano: 2026, deducaoInstrucao: 166.666, deducaoInstrucaoRecorrencia: TipoRecorrencia.Mensal, imposto: 19854.155 },
        { salario: 10000, mes: Meses.Maio, ano: 2026, deducaoInstrucao: 2000, deducaoInstrucaoRecorrencia: TipoRecorrencia.Anual, imposto: 18916.143 },
        { salario: 10000, mes: Meses.Maio, ano: 2026, deducaoInstrucao: 2000, deducaoInstrucaoRecorrencia: TipoRecorrencia.Mensal, imposto: 18486.735 },
    ])("Salario bruto de R$$salario, deducao saude R$$deducaoInstrucao com recorrencia $deducaoInstrucaoRecorrencia, com vigencia em $ano/$mes deve gerar um imposto IRPF de R$$imposto", ({ salario, mes, ano, deducaoInstrucao, deducaoInstrucaoRecorrencia, imposto }) => {


        const qtdSeries = 12;
        const incluir13 = true;

        const resultado = calcularSerie({
            vlBruto: salario,
            qtdSeries,
            incluir13,
            deducaoInstrucao,
            deducaoInstrucaoRecorrencia,
            vigenciaAno: ano,
            vigenciaMes: mes
        })

        expect(resultado.vlImpostoIrpfTotal).toBe(imposto);
    });

    test.each([
        { salario: 1621, mes: Meses.Janeiro, ano: 2026, incluirFerias: Ferias.Sim, mesFerias: Meses.Maio, qtdSeries: 12, imposto: 0 },
        { salario: 10000, mes: Meses.Janeiro, ano: 2026, incluirFerias: Ferias.Sim, mesFerias: Meses.Maio, qtdSeries: 12, imposto: 21320.828 },
        { salario: 10000, mes: Meses.Fevereiro, ano: 2026, incluirFerias: Ferias.Sim, mesFerias: Meses.Maio, qtdSeries: 12, imposto: 21091.662 },
        { salario: 10000, mes: Meses.Fevereiro, ano: 2026, incluirFerias: Ferias.IgnorarPrimeiroAno, mesFerias: Meses.Maio, qtdSeries: 24, imposto: 41495.824 }
    ])("Salario bruto de R$$salario, com férias '$incluirFerias' no mês $mesFerias, vigencia em $ano/$mes, com $qtdSeries meses, deve gerar um imposto IRPF de R$$imposto", ({ salario, mes, ano, incluirFerias, mesFerias, qtdSeries, imposto }) => {


        const incluir13 = true;

        const resultado = calcularSerie({
            vlBruto: salario,
            qtdSeries,
            incluir13,
            incluirFerias,
            mesFerias,
            vigenciaAno: ano,
            vigenciaMes: mes
        })

        expect(resultado.vlImpostoIrpfTotal).toBe(imposto);
    });


    test.each([
        { dependentes: 0, deducao: 0, mes: Meses.Janeiro, ano: 2026 },
        { dependentes: 1, deducao: 189.59, mes: Meses.Janeiro, ano: 2026 },
        { dependentes: 2, deducao: 379.18, mes: Meses.Janeiro, ano: 2026 },
        { dependentes: 3, deducao: 568.77, mes: Meses.Janeiro, ano: 2026 },
    ])("$dependentes dependentes no periodo de vigencia $mes/$ano, deve gerar uma deducao de R$$deducao", ({ dependentes, deducao, mes, ano }) => {
        const qtdSeries = 1
        const resultado = calcularSerie({ vlBruto: 10000, qtdSeries, qtdDependentes: dependentes, vigenciaAno: ano, vigenciaMes: mes });
        expect(resultado.meses[0]?.vlDeducoesDependentes).toBe(deducao);
    })


    test.each([
        { dependentes: -1 },
        { dependentes: -2 },
        { dependentes: -3 },
    ])("Quantidade negativa ($dependentes) de dependentes deve gerar um erro", ({ dependentes }) => {

        expect(() => calcularSerie({ vlBruto: 10000, qtdDependentes: dependentes })).toThrow();
    });

    test.each([
        { salario: 1621, mes: Meses.Janeiro, ano: 2026, vlPLR: 2000, mesPLR: Meses.Janeiro, imposto: 0 },
        { salario: 10000, mes: Meses.Janeiro, ano: 2026, vlPLR: 166.666, mesPLR: Meses.Janeiro, imposto: 1569.551 },
        { salario: 10000, mes: Meses.Maio, ano: 2026, vlPLR: 2000, mesPLR: Meses.Janeiro, imposto: 1569.551 },
    ])("Salario bruto de R$$salario, com PLR de  R$$vlPLR no mes $mesPLR, com vigencia em $ano/$mes deve gerar um imposto IRPF de R$$imposto", ({ salario, mes, ano, vlPLR, mesPLR, imposto }) => {


        const qtdSeries = 1;
        const incluir13 = true;

        const resultado = calcularSerie({
            vlBruto: salario,
            qtdSeries,
            incluir13,
            vlPLR,
            mesPLR,
            vigenciaAno: ano,
            vigenciaMes: mes
        })

        expect(resultado.vlImpostoIrpfTotal).toBe(imposto);
    });

});