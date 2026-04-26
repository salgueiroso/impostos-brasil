import { describe, test, expect } from "@jest/globals";
import { incrementarImposto } from "../../src/utils/impostos";
import { Imposto } from "../../src/tipos/imposto";


describe("incrementarImposto", () => {

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

});