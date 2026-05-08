import { describe, test, expect } from '@jest/globals';
import { calcularINSS, vigenciaFaixasInss } from '../src/inss';
import { calcularIRPF, vigenciaFaixasIrpf } from '../src/irpf';
import { getFaixasVigentes } from '../src/utils/aliquotas';
import { Meses } from '../src/tipos/tipos-basicos';
import { precisao } from '../src/valores';

describe("calcularIRPF", () => {

    test.each([
        { salario: 1621, mes: Meses[Meses.Janeiro], ano: 2026, imposto: 0 },
        { salario: 2261.92, mes: Meses[Meses.Janeiro], ano: 2026, imposto: 0 },
        { salario: 2902.84, mes: Meses[Meses.Janeiro], ano: 2026, imposto: 0 },
        { salario: 3628.56, mes: Meses[Meses.Janeiro], ano: 2026, imposto: 0 },
        { salario: 4354.27, mes: Meses[Meses.Janeiro], ano: 2026, imposto: 0 },
        { salario: 6414.91, mes: Meses[Meses.Janeiro], ano: 2026, imposto: 538.48 },
        { salario: 8475.55, mes: Meses[Meses.Janeiro], ano: 2026, imposto: 1150.328 },
        { salario: 10737.78, mes: Meses[Meses.Janeiro], ano: 2026, imposto: 1772.442 },
        { salario: 13000.00, mes: Meses[Meses.Janeiro], ano: 2026, imposto: 2394.552 }
    ])("Um salário de R$ $salario, vigente em $mes de $ano, deve gerar um imposto de IRPF no valor de R$ $imposto", ({ salario, mes, ano, imposto }) => {

        const mesEnum = Meses[mes as keyof typeof Meses];

        const resultadoINSS = calcularINSS(salario, {
            vigenciaAno: ano,
            vigenciaMes: mesEnum
        });

        const resultadoIRPF = calcularIRPF(salario, {
            vlBaseDeCalculo: resultadoINSS.vlLiquido,
            vigenciaAno: ano,
            vigenciaMes: mesEnum
        });

        expect(resultadoIRPF.vlImposto).toBeCloseTo(imposto, precisao);
    });

});
