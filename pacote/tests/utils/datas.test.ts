import { describe, test, expect } from "@jest/globals";
import { Contar13, fromValorCronologico, getAnoMinimo, toAno, toMes, toValorCronologico } from "../../src/utils/datas";
import { Meses } from "../../src/tipos/tipos-basicos";


describe("Contar13", () => {

    test("Deve retornar 0 se informar 1 mes", () => {
        const resultado = Contar13(1);
        expect(resultado).toBe(0);
    });

    test("Deve retornar 0 se informar 11 meses", () => {
        const resultado = Contar13(11);
        expect(resultado).toBe(0);
    });

    test("Deve retornar 1 se informar 12 meses", () => {
        const resultado = Contar13(12);
        expect(resultado).toBe(1);
    });

    test("Deve retornar 2 se informar 24 meses", () => {
        const resultado = Contar13(24);
        expect(resultado).toBe(2);
    });

    test("Deve retornar 4 se informar 48 meses", () => {
        const resultado = Contar13(48);
        expect(resultado).toBe(4);
    });

});

describe("toMes", () => {

    test("Deve retornar Janeiro se informar indice 0", () => {
        const resultado = toMes(0);
        expect(resultado).toBe(Meses.Janeiro);
    });

    test("Deve retornar Fevereiro se informar indice 1", () => {
        const resultado = toMes(1);
        expect(resultado).toBe(Meses.Fevereiro);
    });

    test("Deve retornar Dezembro se informar indice 11", () => {
        const resultado = toMes(11);
        expect(resultado).toBe(Meses.Dezembro);
    });

    test("Deve retornar Janeiro se informar indice 12", () => {
        const resultado = toMes(12);
        expect(resultado).toBe(Meses.Janeiro);
    });

    test("Deve retornar Janeiro se informar indice 24", () => {
        const resultado = toMes(24);
        expect(resultado).toBe(Meses.Janeiro);
    });

});


describe("getAnoMinimo", () => {

    test("Deve retornar 2010", () => {
        const resultado = getAnoMinimo();
        expect(resultado).toBe(2010);
    });

});

describe("toAno", () => {

    test("Deve estourar um erro se informar menor que o ano minimo", () => {
        expect(() => toAno(getAnoMinimo() - 1)).toThrow();
    });

    test("Deve retornar ano minimo se informar ano minimo", () => {
        const anoMinimo = getAnoMinimo();
        const resultado = toAno(anoMinimo);
        expect(resultado).toBe(anoMinimo);
    });

    test("Deve retornar 10 anos apos ano minimo se informar a0 anos apos ano minimo", () => {
        const ano = getAnoMinimo() + 10;
        const resultado = toAno(ano);
        expect(resultado).toBe(ano);
    });

});

describe("toValorCronologico", () => {

    test("Deve retornar 202301 se informar { Ano: 2023, Mes: 1 }", () => {
        const resultado = toValorCronologico({ Ano: 2023, Mes: 1 });
        expect(resultado).toBe(202301)
    });

    test("Deve retornar 202612 se informar { Ano: 2026, Mes: 12 }", () => {
        const resultado = toValorCronologico({ Ano: 2026, Mes: 12 });
        expect(resultado).toBe(202612)
    });

});

describe("fromValorCronologico", () => {

    test("Deve retornar { Ano: 2023, Mes: 1 } se informar 202301", () => {
        const resultado = fromValorCronologico(202301);
        expect(resultado).toEqual({ Ano: 2023, Mes: 1 })
    });

    test("Deve retornar { Ano: 2026, Mes: 12 } se informar 202612", () => {
        const resultado = fromValorCronologico(202612);
        expect(resultado).toEqual({ Ano: 2026, Mes: 12 })
    });

});