import { describe, test, expect } from '@jest/globals';
import { calcularINSS, vigenciaFaixasInss } from '../src/inss';
import { getFaixasVigentes } from '../src/utils/aliquotas';
import { Meses } from '../src/tipos/tipos-basicos';
import { precisao } from '../src/valores';

describe("calcularINSS", () => {

    test("Um salário de R$ 1621,00, vigente em janeiro de 2016, deve gerar um imposto de INSS no valor de R$121,574", () => {
        const aliquotasINSS = getFaixasVigentes(2026, Meses.Janeiro, vigenciaFaixasInss);

        const resultado = calcularINSS(1621, { aliquotasTetoFaixas: aliquotasINSS });

        expect(resultado.vlImposto).toBeCloseTo(121.574, precisao);
    });

    test("Um salário de R$ 2261,92, vigente em janeiro de 2016, deve gerar um imposto de INSS no valor de R$179,256", () => {
        const aliquotasINSS = getFaixasVigentes(2026, Meses.Janeiro, vigenciaFaixasInss);

        const resultado = calcularINSS(2261.92, { aliquotasTetoFaixas: aliquotasINSS });

        expect(resultado.vlImposto).toBeCloseTo(179.256, precisao);
    });

    test("Um salário de R$2902,84, vigente em janeiro de 2016, deve gerar um imposto de INSS no valor de R$236,94", () => {
        const aliquotasINSS = getFaixasVigentes(2026, Meses.Janeiro, vigenciaFaixasInss);

        const resultado = calcularINSS(2902.84, { aliquotasTetoFaixas: aliquotasINSS });

        expect(resultado.vlImposto).toBeCloseTo(236.939, precisao);
    });

    test("Um salário de R$3628,56, vigente em janeiro de 2016, deve gerar um imposto de INSS no valor de R$324,03", () => {
        const aliquotasINSS = getFaixasVigentes(2026, Meses.Janeiro, vigenciaFaixasInss);

        const resultado = calcularINSS(3628.56, { aliquotasTetoFaixas: aliquotasINSS });

        expect(resultado.vlImposto).toBeCloseTo(324.025, precisao);
    });

    test("Um salário de R$4354,27 , vigente em janeiro de 2016, deve gerar um imposto de INSS no valor de R$411.11", () => {
        const aliquotasINSS = getFaixasVigentes(2026, Meses.Janeiro, vigenciaFaixasInss);

        const resultado = calcularINSS(4354.27, { aliquotasTetoFaixas: aliquotasINSS });

        expect(resultado.vlImposto).toBeCloseTo(411.110, precisao);
    });

    test("Um salário de R$6414,91, vigente em janeiro de 2016, deve gerar um imposto de INSS no valor de R$699,60 ", () => {
        const aliquotasINSS = getFaixasVigentes(2026, Meses.Janeiro, vigenciaFaixasInss);

        const resultado = calcularINSS(6414.91, { aliquotasTetoFaixas: aliquotasINSS });

        expect(resultado.vlImposto).toBeCloseTo(699.598, precisao);
    });

    test("Um salário de R$8475,55, vigente em janeiro de 2016, deve gerar um imposto de INSS no valor de R$988,09", () => {
        const aliquotasINSS = getFaixasVigentes(2026, Meses.Janeiro, vigenciaFaixasInss);

        const resultado = calcularINSS(8475.55, { aliquotasTetoFaixas: aliquotasINSS });

        expect(resultado.vlImposto).toBeCloseTo(988.089, precisao);
    });

    test("Um salário de R$10737,78, vigente em janeiro de 2016, deve gerar um imposto de INSS no valor de R$988,10", () => {
        const aliquotasINSS = getFaixasVigentes(2026, Meses.Janeiro, vigenciaFaixasInss);

        const resultado = calcularINSS(10737.78, { aliquotasTetoFaixas: aliquotasINSS });

        expect(resultado.vlImposto).toBeCloseTo(988.089, precisao);
    });

    test("Um salário de R$13000,00, vigente em janeiro de 2016, deve gerar um imposto de INSS no valor de R$ 179,256", () => {
        const aliquotasINSS = getFaixasVigentes(2026, Meses.Janeiro, vigenciaFaixasInss);

        const resultado = calcularINSS(13000.00, { aliquotasTetoFaixas: aliquotasINSS });

        expect(resultado.vlImposto).toBeCloseTo(988.089, precisao);
    });

});