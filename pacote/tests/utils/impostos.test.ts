import { describe, test, expect } from "@jest/globals";
import { incrementarImposto } from "../../src/utils/impostos";
import { Imposto } from "../../src/tipos/imposto";
import { varsName } from "../../src/utils/helper";


describe(varsName({ incrementarImposto }), () => {

    test("Deve retornar 2500 de vlBruto do acumulador se informar vlBruto com valores 1000 no acumulador e 1500 na origem", () => {

        const origem: Imposto = {
            vlBruto: 1500,
            vlImposto: 0,
            vlLiquido: 0,
            faixas: [],
            aliquotaEfetiva: 0,
            vlBaseDeCalculo: 0
        };

        const acumulador: Imposto = {
            vlBruto: 1000,
            vlImposto: 0,
            vlLiquido: 0,
            faixas: [],
            aliquotaEfetiva: 0,
            vlBaseDeCalculo: 0
        };
        incrementarImposto(origem, acumulador);

        expect(acumulador.vlBruto).toBe(2500);
    });

    test("Deve retornar 25 de vlImposto do acumulador se informar vlImposto com valores 10 no acumulador e 15 na origem", () => {

        const origem: Imposto = {
            vlBruto: 0,
            vlImposto: 15,
            vlLiquido: 0,
            faixas: [],
            aliquotaEfetiva: 0,
            vlBaseDeCalculo: 0,
        };

        const acumulador: Imposto = {
            vlBruto: 0,
            vlImposto: 10,
            vlLiquido: 0,
            faixas: [],
            aliquotaEfetiva: 0,
            vlBaseDeCalculo: 0
        };

        incrementarImposto(origem, acumulador);

        expect(acumulador.vlImposto).toBe(25);
    });

    test("Deve retornar 1700 de vlBaseDeCalculo do acumulador se informar vlBaseDeCalculo com valores 1000 no acumulador e 700 na origem", () => {

        const acumulador: Imposto = {
            vlBruto: 0,
            vlImposto: 0,
            vlLiquido: 0,
            faixas: [],
            aliquotaEfetiva: 0,
            vlBaseDeCalculo: 1000
        };

        const origem: Imposto = {
            vlBruto: 0,
            vlImposto: 0,
            vlLiquido: 0,
            faixas: [],
            aliquotaEfetiva: 0,
            vlBaseDeCalculo: 700,
        };

        incrementarImposto(origem, acumulador);

        expect(acumulador.vlBaseDeCalculo).toBe(1700);
    });

    test("Deve retornar 1350 de vlLiquido do acumulador se informar vlLiquido com valores 1000 no acumulador e 350 na origem", () => {

        const acumulador: Imposto = {
            vlBruto: 0,
            vlImposto: 0,
            vlLiquido: 1000,
            faixas: [],
            aliquotaEfetiva: 0,
            vlBaseDeCalculo: 0
        };

        const origem: Imposto = {
            vlBruto: 0,
            vlImposto: 0,
            vlLiquido: 350,
            faixas: [],
            aliquotaEfetiva: 0,
            vlBaseDeCalculo: 0,
        };

        incrementarImposto(origem, acumulador);

        expect(acumulador.vlLiquido).toBe(1350);
    });

    test("Deve estourar um erro caso os tamanhos das faixas de origem e acumulador sejam diferentes", () => {

        const acumulador: Imposto = {
            vlBruto: 0,
            vlImposto: 0,
            vlLiquido: 1000,
            faixas: [{ vlFinal: 0, deducao: 0 }],
            aliquotaEfetiva: 0,
            vlBaseDeCalculo: 0
        };

        const origem: Imposto = {
            vlBruto: 0,
            vlImposto: 0,
            vlLiquido: 350,
            faixas: [{ vlFinal: 0, deducao: 0 }, { vlFinal: 0, deducao: 0 }],
            aliquotaEfetiva: 0,
            vlBaseDeCalculo: 0,
        };

        expect(() => incrementarImposto(origem, acumulador)).toThrow();
    });

    test("Deve estourar um erro caso alguma aliquota de quaisquer faixas não exista no outro imposto", () => {

        const acumulador: Imposto = {
            vlBruto: 0,
            vlImposto: 0,
            vlLiquido: 1000,
            faixas: [{ vlFinal: 0, deducao: 0, aliquota: 0.14 }],
            aliquotaEfetiva: 0,
            vlBaseDeCalculo: 0
        };

        const origem: Imposto = {
            vlBruto: 0,
            vlImposto: 0,
            vlLiquido: 350,
            faixas: [{ vlFinal: 0, deducao: 0 }],
            aliquotaEfetiva: 0,
            vlBaseDeCalculo: 0,
        };

        expect(() => incrementarImposto(origem, acumulador)).toThrow();
    });


    test("Deve somar os campos deducao de origem e acumulador", () => {

        const acumulador: Imposto = {
            vlBruto: 0,
            vlImposto: 0,
            vlLiquido: 0,
            faixas: [{ vlInicial: 0, vlFinal: 0, deducao: 100, aliquota: 1 }],
            aliquotaEfetiva: 0,
            vlBaseDeCalculo: 0
        };

        const origem: Imposto = {
            vlBruto: 0,
            vlImposto: 0,
            vlLiquido: 0,
            faixas: [{ vlInicial: 0, vlFinal: 0, deducao: 50, aliquota: 1 }],
            aliquotaEfetiva: 0,
            vlBaseDeCalculo: 0,
        };

        incrementarImposto(origem, acumulador);

        expect(acumulador.faixas[0].deducao).toBe(150);
    });

    test("Deve somar os campos vlBaseFaixa de origem e acumulador", () => {

        const acumulador: Imposto = {
            vlBruto: 0,
            vlImposto: 0,
            vlLiquido: 0,
            faixas: [{ vlInicial: 0, vlFinal: 0, deducao: 0, aliquota: 1, vlBaseFaixa: 5 }],
            aliquotaEfetiva: 0,
            vlBaseDeCalculo: 0
        };

        const origem: Imposto = {
            vlBruto: 0,
            vlImposto: 0,
            vlLiquido: 0,
            faixas: [{ vlInicial: 0, vlFinal: 0, deducao: 0, aliquota: 1, vlBaseFaixa: 7 }],
            aliquotaEfetiva: 0,
            vlBaseDeCalculo: 0,
        };

        incrementarImposto(origem, acumulador);

        expect(acumulador.faixas[0].vlBaseFaixa).toBe(12);
    });

    test("Deve somar os campos vlBaseFaixa de origem e acumulador, considerando origem.faixas[0].vlBaseFaixa com valor null", () => {

        const acumulador: Imposto = {
            vlBruto: 0,
            vlImposto: 0,
            vlLiquido: 0,
            faixas: [{ vlInicial: 0, vlFinal: 0, deducao: 0, aliquota: 1, vlBaseFaixa: 5 }],
            aliquotaEfetiva: 0,
            vlBaseDeCalculo: 0
        };

        const origem: Imposto = {
            vlBruto: 0,
            vlImposto: 0,
            vlLiquido: 0,
            faixas: [{ vlInicial: 0, vlFinal: 0, deducao: 0, aliquota: 1, vlBaseFaixa: null }],
            aliquotaEfetiva: 0,
            vlBaseDeCalculo: 0,
        };

        incrementarImposto(origem, acumulador);

        expect(acumulador.faixas[0].vlBaseFaixa).toBe(5);
    });

});