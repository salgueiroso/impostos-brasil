import { describe, test, expect } from '@jest/globals';
import { nameOf, varName } from "../../src/utils/helper";
import { Imposto } from "../../src/tipos/imposto";




describe("nameOf", () => {

    test("Deve retornar o nome correto da propriedade", () => {

        const result = nameOf<Imposto>("vlImposto");

        expect(result).toBe("vlImposto");
    });

});


describe("varName", () => {

    test("Deve retornar o nome correto da variavel", () => {

        var vlImposto = 1000;

        const result = varName({ vlImposto });

        expect(result).toBe("vlImposto");
    });

    test("Deve retornar gerar um erro quando nenhum nome for encontrado", () => {

        expect(() => varName({})).toThrow();
    });

});