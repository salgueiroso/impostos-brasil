import { describe, test, expect } from '@jest/globals';
import { eVazio, nameOf, varsName } from "../../src/utils/helper";
import { Imposto } from "../../src/tipos/imposto";




describe(varsName({ nameOf }), () => {

    test("Deve retornar o nome correto da propriedade", () => {

        const result = nameOf<Imposto>("vlImposto");

        expect(result).toBe("vlImposto");
    });

});


describe(varsName({ varsName }), () => {

    test("Deve retornar o nome correto da variavel", () => {

        var vlImposto = 1000;

        const result = varsName({ vlImposto });

        expect(result).toBe("vlImposto");
    });

    test("Deve retornar gerar um erro quando nenhum nome for encontrado", () => {

        expect(() => varsName({})).toThrow();
    });

});

describe(varsName({ eVazio }), () => {

    test.each([
        null, undefined, "", []
    ])("Retorna true se o valor for %s", (v) => {
        expect(eVazio(v)).toBe(true);
    });

    test.each([
        1, {}, "texto", [9], true
    ])("Retorna false se o valor for %s", (v) => {
        expect(eVazio(v)).toBe(false);
    });

});