
import { describe, test, expect } from "@jest/globals";
import { AliquotasTetoFaixas, Meses } from "../src/tipos/tipos-basicos";
import { getAliquotasVigentes } from "../src/utils/aliquotas";
import { toAno } from "../src/utils/datas";
import { calcularINSS, vigenciaFaixasInss } from "../src/inss";
import { calcularIRPF, vigenciaFaixasIrpf } from "../src/irpf";

describe('IRPF - Impostos', () => {

    const faixasInss: AliquotasTetoFaixas = getAliquotasVigentes(toAno(2026), Meses.Janeiro, vigenciaFaixasInss) ?? new Map();
    const faixasIrpf: AliquotasTetoFaixas = getAliquotasVigentes(toAno(2026), Meses.Janeiro, vigenciaFaixasIrpf) ?? new Map();

    test('Inicializar', () => {
        const vlSalarioBrutoMensal = 12530.49;
        const inss = calcularINSS(vlSalarioBrutoMensal, null, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);
        expect(inss).not.toBeNull();
        expect(irpf).not.toBeNull();
    });

    test('Valor bruto', () => {
        const vlSalarioBrutoMensal = 12530.49;
        const inss = calcularINSS(vlSalarioBrutoMensal, null, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);
        expect(irpf.vlBruto).toEqual(vlSalarioBrutoMensal);
    });

    test('Valor base de calculo', () => {
        const vlSalarioBrutoMensal = 12530.49;
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - 1000, true, faixasIrpf);
        expect(irpf.vlBaseDeCalculo).toEqual(vlSalarioBrutoMensal - 1000);
    });

    test('Imposto para 1 salario', () => {
        const vlSalarioBrutoMensal = 1621;
        const inss = calcularINSS(vlSalarioBrutoMensal, vlSalarioBrutoMensal, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);

        expect(irpf.vlImposto).toEqual(0);
    });

    test('Imposto para 2 salario', () => {
        const vlSalarioBrutoMensal = 3242;
        const inss = calcularINSS(vlSalarioBrutoMensal, vlSalarioBrutoMensal, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);

        expect(irpf.vlImposto).toEqual(0);
    });

    test('Imposto para 3 salario', () => {
        const vlSalarioBrutoMensal = 4863;
        const inss = calcularINSS(vlSalarioBrutoMensal, vlSalarioBrutoMensal, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);

        expect(irpf.vlImposto).toEqual(0);
    });

    test('Imposto para 4 salario', () => {
        const vlSalarioBrutoMensal = 6484;
        const inss = calcularINSS(vlSalarioBrutoMensal, vlSalarioBrutoMensal, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);

        expect(irpf.vlImposto).toEqual(569.6172675);
    });

    test('Imposto para 5 salario', () => {
        const vlSalarioBrutoMensal = 8105;
        const inss = calcularINSS(vlSalarioBrutoMensal, vlSalarioBrutoMensal, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);

        expect(irpf.vlImposto).toEqual(1068.2915874999999);
    });

    test('Imposto para 6 salario', () => {
        const vlSalarioBrutoMensal = 9726;
        const inss = calcularINSS(vlSalarioBrutoMensal, vlSalarioBrutoMensal, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);

        expect(irpf.vlImposto).toEqual(1512.0488025000004);
    });

    test('Imposto para 7 salario', () => {
        const vlSalarioBrutoMensal = 11347;
        const inss = calcularINSS(vlSalarioBrutoMensal, vlSalarioBrutoMensal, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);

        expect(irpf.vlImposto).toEqual(1957.8238025);
    });

    test('Imposto para 8 salario', () => {
        const vlSalarioBrutoMensal = 12968;
        const inss = calcularINSS(vlSalarioBrutoMensal, vlSalarioBrutoMensal, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);

        expect(irpf.vlImposto).toEqual(2403.5988025);
    });

    test('Imposto para 9 salario', () => {
        const vlSalarioBrutoMensal = 14589;
        const inss = calcularINSS(vlSalarioBrutoMensal, vlSalarioBrutoMensal, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);

        expect(irpf.vlImposto).toEqual(2849.3738025000002);
    });

    test('Imposto para 10 salario', () => {
        const vlSalarioBrutoMensal = 16210;
        const inss = calcularINSS(vlSalarioBrutoMensal, vlSalarioBrutoMensal, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);

        expect(irpf.vlImposto).toEqual(3295.1488025000003);
    });
});


describe('IRPF - Aliquotas efetivas', () => {

    const faixasInss: AliquotasTetoFaixas = getAliquotasVigentes(toAno(2026), Meses.Janeiro, vigenciaFaixasInss) ?? new Map();
    const faixasIrpf: AliquotasTetoFaixas = getAliquotasVigentes(toAno(2026), Meses.Janeiro, vigenciaFaixasIrpf) ?? new Map();

    test('Inicializar', () => {
        const vlSalarioBrutoMensal = 12530.49;
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal);
        expect(irpf).not.toBeNull();
    });

    test('Aliquota efetiva', () => {
        const vlSalarioBrutoMensal = 12530.49;
        const inss = calcularINSS(vlSalarioBrutoMensal, null, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);
        expect(irpf.aliquotaEfetiva).toEqual(0.18221821752381592);
    });

    test('Aliquota para 1 salario', () => {
        const vlSalarioBrutoMensal = 1621;
        const inss = calcularINSS(vlSalarioBrutoMensal, vlSalarioBrutoMensal, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);

        expect(irpf.aliquotaEfetiva).toEqual(0);
    });

    test('Aliquota para 2 salario', () => {
        const vlSalarioBrutoMensal = 3242;
        const inss = calcularINSS(vlSalarioBrutoMensal, vlSalarioBrutoMensal, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);

        expect(irpf.aliquotaEfetiva).toEqual(0);
    });

    test('Aliquota para 3 salario', () => {
        const vlSalarioBrutoMensal = 4863;
        const inss = calcularINSS(vlSalarioBrutoMensal, vlSalarioBrutoMensal, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);

        expect(irpf.aliquotaEfetiva).toEqual(0);
    });

    test('Aliquota para 4 salario', () => {
        const vlSalarioBrutoMensal = 6484;
        const inss = calcularINSS(vlSalarioBrutoMensal, vlSalarioBrutoMensal, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);

        expect(irpf.aliquotaEfetiva).toEqual(0.08784967111351018);
    });

    test('Aliquota para 5 salario', () => {
        const vlSalarioBrutoMensal = 8105;
        const inss = calcularINSS(vlSalarioBrutoMensal, vlSalarioBrutoMensal, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);

        expect(irpf.aliquotaEfetiva).toEqual(0.1318064882788402);
    });

    test('Aliquota para 6 salario', () => {
        const vlSalarioBrutoMensal = 9726;
        const inss = calcularINSS(vlSalarioBrutoMensal, vlSalarioBrutoMensal, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);

        expect(irpf.aliquotaEfetiva).toEqual(0.155464610579889);
    });

    test('Aliquota para 7 salario', () => {
        const vlSalarioBrutoMensal = 11347;
        const inss = calcularINSS(vlSalarioBrutoMensal, vlSalarioBrutoMensal, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);

        expect(irpf.aliquotaEfetiva).toEqual(0.17254109478276197);
    });

    test('Aliquota para 8 salario', () => {
        const vlSalarioBrutoMensal = 12968;
        const inss = calcularINSS(vlSalarioBrutoMensal, vlSalarioBrutoMensal, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);

        expect(irpf.aliquotaEfetiva).toEqual(0.18534845793491672);
    });

    test('Aliquota para 9 salario', () => {
        const vlSalarioBrutoMensal = 14589;
        const inss = calcularINSS(vlSalarioBrutoMensal, vlSalarioBrutoMensal, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);

        expect(irpf.aliquotaEfetiva).toEqual(0.19530974038659266);
    });

    test('Aliquota para 10 salario', () => {
        const vlSalarioBrutoMensal = 16210;
        const inss = calcularINSS(vlSalarioBrutoMensal, vlSalarioBrutoMensal, faixasInss);
        const irpf = calcularIRPF(vlSalarioBrutoMensal, vlSalarioBrutoMensal - inss.vlImposto, true, faixasIrpf);

        expect(irpf.aliquotaEfetiva).toEqual(0.2032787663479334);
    });
});

// faixas: DeducaoFaixa[];