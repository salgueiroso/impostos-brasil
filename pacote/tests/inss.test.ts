import { describe, test, expect } from '@jest/globals';
import { calcularINSS, vigenciaFaixasInss } from '../src/inss';
import { Aliquota, Meses, TetoFaixa } from '../src/tipos/tipos-basicos';
import { precisao } from '../src/valores';
import { varsName } from '../src/utils/helper';
import { getFaixasVigentes } from '../src/utils/aliquotas';

describe(varsName({ calcularINSS }), () => {

    test.each([
        { salario: 1621, mes: Meses.Janeiro, ano: 2026, imposto: 121.574 },
        { salario: 2261.92, mes: Meses.Janeiro, ano: 2026, imposto: 179.256 },
        { salario: 2902.84, mes: Meses.Janeiro, ano: 2026, imposto: 236.939 },
        { salario: 3628.56, mes: Meses.Janeiro, ano: 2026, imposto: 324.025 },
        { salario: 4354.27, mes: Meses.Janeiro, ano: 2026, imposto: 411.11 },
        { salario: 6414.91, mes: Meses.Janeiro, ano: 2026, imposto: 699.598 },
        { salario: 8475.55, mes: Meses.Janeiro, ano: 2026, imposto: 988.089 },
        { salario: 10737.78, mes: Meses.Janeiro, ano: 2026, imposto: 988.089 },
        { salario: 13000.00, mes: Meses.Janeiro, ano: 2026, imposto: 988.089 }
    ])("Um salário de R$$salario, vigente em $ano/$mes, deve gerar um imposto de INSS no valor de R$$imposto", ({ salario, mes, ano, imposto }) => {


        const resultado = calcularINSS(salario, { vigenciaAno: ano, vigenciaMes: mes });

        expect(resultado.vlImposto).toBeCloseTo(imposto, precisao);
    });

    test.each([
        { salario: 13000, mes: Meses.Janeiro, ano: 2026, imposto: 1300, aliquotasTetoFaixas: new Map<Aliquota, TetoFaixa>([[0.1, Infinity]]) }
    ])("Um salário de R$$salario, vigente em $ano/$mes com aliquotasTetoFaixas=$aliquotasTetoFaixas, deve gerar um imposto de INSS no valor de R$$imposto", ({ salario, mes, ano, imposto, aliquotasTetoFaixas }) => {


        const resultado = calcularINSS(salario, { aliquotasTetoFaixas });

        expect(resultado.vlImposto).toBeCloseTo(imposto, precisao);
    });


    test("Deve gerar um erro se informar aliquotasTetoFaixas com vigenciaAno ou vigenciaMes", () => {
        const vigenciaAno = 2026;
        const vigenciaMes = Meses.Janeiro;
        expect(() => calcularINSS(100, {
            vigenciaAno,
            vigenciaMes,
            aliquotasTetoFaixas: getFaixasVigentes(vigenciaAno, vigenciaMes, vigenciaFaixasInss)
        })).toThrow();
    });


    test("Deve gerar um erro se informar aliquotasTetoFaixas com vigenciaAno", () => {
        const vigenciaAno = 2026;
        const vigenciaMes = Meses.Janeiro;
        expect(() => calcularINSS(100, {
            vigenciaAno,
            aliquotasTetoFaixas: getFaixasVigentes(vigenciaAno, vigenciaMes, vigenciaFaixasInss)
        })).toThrow();
    });


    test("Deve gerar um erro se informar aliquotasTetoFaixas com vigenciaMes", () => {
        const vigenciaAno = 2026;
        const vigenciaMes = Meses.Janeiro;
        expect(() => calcularINSS(100, {
            vigenciaMes,
            aliquotasTetoFaixas: getFaixasVigentes(vigenciaAno, vigenciaMes, vigenciaFaixasInss)
        })).toThrow();
    });


    test("Deve gerar um erro se informar aliquotasTetoFaixas com vigenciaMes", () => {
        const vigenciaAno = 2026;
        const vigenciaMes = Meses.Janeiro;
        expect(() => calcularINSS(100, {
            vigenciaMes,
            aliquotasTetoFaixas: getFaixasVigentes(vigenciaAno, vigenciaMes, vigenciaFaixasInss)
        })).toThrow();
    });


    test("Deve calcular com sucesso se informar apenas o valor bruto e opcoes null", () => {
        expect(calcularINSS(127)).toBeTruthy();
    });

    test("Deve gerar erro se base de calculo for maior que o valor bruto", () => {
        expect(() => calcularINSS(100, { vlBaseDeCalculo: 150 })).toThrow();
    });

});

describe(varsName({ vigenciaFaixasInss }), () => {

    test.each([
        2010, 2024, 2025, 2026
    ])("Deve ter ano %i cadastrado", (vl) => {
        expect(Array.from(vigenciaFaixasInss.anos())).toContain(vl);
    });

});