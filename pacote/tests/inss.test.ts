import { describe, test, expect } from '@jest/globals';
import { calcularINSS, vigenciaFaixasInss } from '../src/inss';
import { getFaixasVigentes } from '../src/utils/aliquotas';
import { Meses } from '../src/tipos/tipos-basicos';
import { precisao } from '../src/valores';

describe("calcularINSS", () => {

    test.each([
        { salario: 1621, mes: Meses[Meses.Janeiro], ano: 2026, imposto: 121.574 },
        { salario: 2261.92, mes: Meses[Meses.Janeiro], ano: 2026, imposto: 179.256 },
        { salario: 2902.84, mes: Meses[Meses.Janeiro], ano: 2026, imposto: 236.939 },
        { salario: 3628.56, mes: Meses[Meses.Janeiro], ano: 2026, imposto: 324.025 },
        { salario: 4354.27, mes: Meses[Meses.Janeiro], ano: 2026, imposto: 411.11 },
        { salario: 6414.91, mes: Meses[Meses.Janeiro], ano: 2026, imposto: 699.598 },
        { salario: 8475.55, mes: Meses[Meses.Janeiro], ano: 2026, imposto: 988.089 },
        { salario: 10737.78, mes: Meses[Meses.Janeiro], ano: 2026, imposto: 988.089 },
        { salario: 13000.00, mes: Meses[Meses.Janeiro], ano: 2026, imposto: 988.089 }
    ])("Um salário de R$ $salario, vigente em $mes de $ano, deve gerar um imposto de INSS no valor de R$ $imposto", ({ salario, mes, ano, imposto }) => {

        const mesEnum = Meses[mes as keyof typeof Meses];

        const resultado = calcularINSS(salario, { vigenciaAno: ano, vigenciaMes: mesEnum });

        expect(resultado.vlImposto).toBeCloseTo(imposto, precisao);
    });

});