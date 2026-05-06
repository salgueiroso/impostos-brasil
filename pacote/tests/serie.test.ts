import { describe, test, expect } from '@jest/globals';
import { calcularSerie } from '../src/serie';
import { Ferias, Meses, TipoRecorrencia } from '../src/tipos/tipos-basicos';

describe("calcularSerie", () => {


    test("Salario bruto de R$1621 e deducao saude R$2000 com recorrencia anual, deve gerar um imposto IRPF de R$0", () => {

        const vlBruto = 1621;
        const qtdSeries = 12;
        const incluir13 = true;
        const deducaoSaude = 2000;
        const deducaoSaudeRecorrencia = TipoRecorrencia.Anual;
        const vigenciaAno = 2026;
        const vigenciaMes = Meses.Janeiro;
        const usarDescontoSimplificadoIRPF = false;


        const resultado = calcularSerie({
            vlBruto,
            qtdSeries,
            incluir13,
            deducaoSaude,
            deducaoSaudeRecorrencia,
            vigenciaAno,
            vigenciaMes,
            usarDescontoSimplificadoIRPF
        })

        expect(resultado.vlImpostoIrpfTotal).toBe(0);
    });

    test("Salario bruto de R$10.000,00 com deducao saude R$2.000,00 com recorrencia anual e decimo terceiro, deve gerar um imposto IRPF de R$19.854,18", () => {

        const vlBruto = 10000;
        const qtdSeries = 12;
        const incluir13 = true;
        const deducaoSaude = 2000;
        const deducaoSaudeRecorrencia = TipoRecorrencia.Anual;
        const vigenciaAno = 2026;
        const vigenciaMes = Meses.Janeiro;
        const usarDescontoSimplificadoIRPF = false;


        const resultado = calcularSerie({
            vlBruto,
            qtdSeries,
            incluir13,
            deducaoSaude,
            deducaoSaudeRecorrencia,
            vigenciaAno,
            vigenciaMes,
            usarDescontoSimplificadoIRPF
        })

        expect(resultado.vlImpostoIrpfTotal).toBe(19854.18);
    });

    test("Salario bruto de R$10.000,00 com deducao saude R$2.000,00 com recorrencia anual e decimo terceiro, no mes de maio de 2026, deve gerar um imposto IRPF de R$19.854,18", () => {

        const vlBruto = 10000;
        const qtdSeries = 12;
        const incluir13 = true;
        const deducaoSaude = 2000;
        const deducaoSaudeRecorrencia = TipoRecorrencia.Anual;
        const vigenciaAno = 2026;
        const vigenciaMes = Meses.Maio;
        const usarDescontoSimplificadoIRPF = false;


        const resultado = calcularSerie({
            vlBruto,
            qtdSeries,
            incluir13,
            deducaoSaude,
            deducaoSaudeRecorrencia,
            vigenciaAno,
            vigenciaMes,
            usarDescontoSimplificadoIRPF
        })

        expect(resultado.vlImpostoIrpfTotal).toBe(18916.168);
    });

});