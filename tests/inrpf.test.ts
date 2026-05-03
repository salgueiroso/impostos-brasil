import { describe, test, expect } from '@jest/globals';
import { calcularINSS, vigenciaFaixasInss } from '../src/inss';
import { calcularIRPF, vigenciaFaixasIrpf } from '../src/irpf';
import { getFaixasVigentes } from '../src/utils/aliquotas';
import { Meses } from '../src/tipos/tipos-basicos';
import { precisao } from '../src/valores';

describe("calcularIRPF", () => {

    test("Um salário de R$ 1621,00, vigente em janeiro de 2026, deve gerar um imposto de IRPF no valor de R$0,00", () => {
        const aliquotasINSS = getFaixasVigentes(2026, Meses.Janeiro, vigenciaFaixasInss);
        const aliquotasIRPF = getFaixasVigentes(2026, Meses.Janeiro, vigenciaFaixasIrpf);

        const resultadoINSS = calcularINSS(1621, { aliquotasTetoFaixas: aliquotasINSS });
        const resultadoIRPF = calcularIRPF(1621, { vlBaseDeCalculo: resultadoINSS.vlLiquido, usarIsencao5k7k: true, aliquotasTetoFaixas: aliquotasIRPF });

        expect(resultadoIRPF.vlImposto).toBeCloseTo(0, precisao);
    });

    test("Um salário de R$ 2261,92, vigente em janeiro de 2026, deve gerar um imposto de IRPF no valor de R$0,00", () => {
        const aliquotasINSS = getFaixasVigentes(2026, Meses.Janeiro, vigenciaFaixasInss);
        const aliquotasIRPF = getFaixasVigentes(2026, Meses.Janeiro, vigenciaFaixasIrpf);

        const resultadoINSS = calcularINSS(2261.92, { aliquotasTetoFaixas: aliquotasINSS });
        const resultadoIRPF = calcularIRPF(2261.92, { vlBaseDeCalculo: resultadoINSS.vlLiquido, usarIsencao5k7k: true, aliquotasTetoFaixas: aliquotasIRPF });

        expect(resultadoIRPF.vlImposto).toBeCloseTo(0, precisao);
    });

});