import { describe, test, expect } from '@jest/globals';
import { calcularINSS } from '../src/inss';
import { calcularIRPF, vigenciaFaixasIrpf, vigenciaFaixasIrpfPLR, vigenciaIrpfDeducaoDependenteMensal, vigenciaIrpfDescontoSimplificado } from '../src/irpf';
import { Aliquota, Meses, TetoFaixa } from '../src/tipos/tipos-basicos';
import { precisao } from '../src/valores';
import { varsName } from '../src/utils/helper';
import { getFaixasVigentes } from '../src/utils/aliquotas';

describe("calcularIRPF", () => {

    test.each([
        { salario: 1621, mes: Meses.Janeiro, ano: 2026, imposto: 0 },
        { salario: 2261.92, mes: Meses.Janeiro, ano: 2026, imposto: 0 },
        { salario: 2902.84, mes: Meses.Janeiro, ano: 2026, imposto: 0 },
        { salario: 3628.56, mes: Meses.Janeiro, ano: 2026, imposto: 0 },
        { salario: 4354.27, mes: Meses.Janeiro, ano: 2026, imposto: 0 },
        { salario: 6414.91, mes: Meses.Janeiro, ano: 2026, imposto: 538.479 },
        { salario: 8475.55, mes: Meses.Janeiro, ano: 2026, imposto: 1150.327 },
        { salario: 10737.78, mes: Meses.Janeiro, ano: 2026, imposto: 1772.44 },
        { salario: 13000.00, mes: Meses.Janeiro, ano: 2026, imposto: 2394.551 }
    ])("Um salário de R$$salario, vigente em $ano/$mes, deve gerar um imposto de IRPF no valor de R$$imposto", ({ salario, mes, ano, imposto }) => {

        const resultadoINSS = calcularINSS(salario, {
            vigenciaAno: ano,
            vigenciaMes: mes
        });

        const resultadoIRPF = calcularIRPF(salario, {
            vlBaseDeCalculo: resultadoINSS.vlLiquido,
            vigenciaAno: ano,
            vigenciaMes: mes
        });

        expect(resultadoIRPF.vlImposto).toBeCloseTo(imposto, precisao);
    });


    test.each([
        { salario: 13000, mes: Meses.Janeiro, ano: 2026, imposto: 1239.28, aliquotasTetoFaixas: new Map<Aliquota, TetoFaixa>([[0.1, Infinity]]) }
    ])("Um salário de R$$salario, vigente em $ano/$mes com aliquotasTetoFaixas=$aliquotasTetoFaixas, deve gerar um imposto de INSS no valor de R$$imposto", ({ salario, mes, ano, imposto, aliquotasTetoFaixas }) => {


        const resultado = calcularIRPF(salario, { aliquotasTetoFaixas });

        expect(resultado.vlImposto).toBeCloseTo(imposto, precisao);
    });


    test("Deve gerar um erro se informar aliquotasTetoFaixas com vigenciaAno ou vigenciaMes", () => {
        const vigenciaAno = 2026;
        const vigenciaMes = Meses.Janeiro;
        expect(() => calcularIRPF(100, {
            vigenciaAno,
            vigenciaMes,
            aliquotasTetoFaixas: getFaixasVigentes(vigenciaAno, vigenciaMes, vigenciaFaixasIrpf)
        })).toThrow();
    });


    test("Deve gerar um erro se informar aliquotasTetoFaixas com vigenciaAno", () => {
        const vigenciaAno = 2026;
        const vigenciaMes = Meses.Janeiro;
        expect(() => calcularIRPF(100, {
            vigenciaAno,
            aliquotasTetoFaixas: getFaixasVigentes(vigenciaAno, vigenciaMes, vigenciaFaixasIrpf)
        })).toThrow();
    });


    test("Deve gerar um erro se informar aliquotasTetoFaixas com vigenciaMes", () => {
        const vigenciaAno = 2026;
        const vigenciaMes = Meses.Janeiro;
        expect(() => calcularIRPF(100, {
            vigenciaMes,
            aliquotasTetoFaixas: getFaixasVigentes(vigenciaAno, vigenciaMes, vigenciaFaixasIrpf)
        })).toThrow();
    });


    test("Deve gerar um erro se informar aliquotasTetoFaixas com vigenciaMes", () => {
        const vigenciaAno = 2026;
        const vigenciaMes = Meses.Janeiro;
        expect(() => calcularIRPF(100, {
            vigenciaMes,
            aliquotasTetoFaixas: getFaixasVigentes(vigenciaAno, vigenciaMes, vigenciaFaixasIrpf)
        })).toThrow();
    });


    test("Deve calcular com sucesso se informar apenas o valor bruto e opcoes null", () => {
        expect(calcularIRPF(127)).toBeTruthy();
    });


    test("Deve gerar erro se base de calculo for maior que o valor bruto", () => {
        expect(() => calcularIRPF(100, { vlBaseDeCalculo: 150 })).toThrow();
    });


    test("Deve calcular com sucesso se informar apenas o valor bruto e vlDescontoSimplificado", () => {
        expect(calcularIRPF(127, { vlDescontoSimplificado: 100 })).toBeTruthy();
    });


    test("Deve calcular com sucesso se informar apenas o valor bruto e marcador", () => {
        expect(calcularIRPF(127, { marcador: new Set() })).toBeTruthy();
    });

});


describe(varsName({ vigenciaFaixasIrpf }), () => {

    test.each([
        2010, 2011, 2012, 2013, 2014, 2015, 2016, 2023, 2024, 2025, 2026
    ])("Deve ter ano %i cadastrado", (vl) => {
        expect(Array.from(vigenciaFaixasIrpf.anos())).toContain(vl);
    });

});


describe(varsName({ vigenciaFaixasIrpfPLR }), () => {

    test.each([
        2010, 2013, 2014, 2015, 2016, 2023, 2024, 2025
    ])("Deve ter ano %i cadastrado", (vl) => {
        expect(Array.from(vigenciaFaixasIrpfPLR.anos())).toContain(vl);
    });

});


describe(varsName({ vigenciaIrpfDescontoSimplificado }), () => {

    test.each([
        // 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2023, 2024, 2025, 2026
        2010, 2026
    ])("Deve ter ano %i cadastrado", (vl) => {
        expect(Array.from(vigenciaIrpfDescontoSimplificado.anos())).toContain(vl);
    });

});


describe(varsName({ vigenciaIrpfDeducaoDependenteMensal }), () => {

    test.each([
        2026
    ])("Deve ter ano %i cadastrado", (vl) => {
        expect(Array.from(vigenciaIrpfDeducaoDependenteMensal.anos())).toContain(vl);
    });

});