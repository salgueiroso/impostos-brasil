
import { describe, test, expect } from "@jest/globals";
import { contarDecimais, normalizarPrecisao, toBRL, toPercent } from "../../src/utils/formatacoes";

describe('toBRL', () => {

    test.each([
        { entrada: 1123.45, saida: 'R$ 1.123,45' },
        { entrada: 123.45, saida: 'R$ 123,45' },
        { entrada: 23.45, saida: 'R$ 23,45' },
        { entrada: 3.45, saida: 'R$ 3,45' },
    ])('$entrada deve retornar $saida', ({ entrada, saida }) => {
        const brlString = toBRL(entrada);
        expect(brlString).not.toBeNull();
        expect(brlString).toEqual(saida);
    });


});

describe('toPercent', () => {

    test.each([
        { entrada: 1123.450456, saida: '112.345,045%' },
        { entrada: 1.2345, saida: '123,45%' },
        { entrada: 23.45, saida: '2.345%' },
        { entrada: 3.45, saida: '345%' },
        { entrada: 0.09557, saida: '9,557%' },
    ])('$entrada deve retornar $saida', ({ entrada, saida }) => {
        const brlString = toPercent(entrada);
        expect(brlString).not.toBeNull();
        expect(brlString).toEqual(saida);
    });
});


describe("normalizarPrecisao", () => {

    test.each([
        { entrada: 123.4567, decimais: 5, saida: 123.4567 },
        { entrada: 123.4567, decimais: 4, saida: 123.4567 },
        { entrada: 123.4567, decimais: 3, saida: 123.456 },
        { entrada: 123.4567, decimais: 2, saida: 123.45 },
        { entrada: 123.4567, decimais: 1, saida: 123.4 },
        { entrada: 123.4567, decimais: 0, saida: 123 },
    ])('$entrada deve retornar $saida com $decimais casas decimais', ({ entrada, decimais, saida }) => {
        const resultado = normalizarPrecisao(entrada, decimais)
        expect(resultado).not.toBeNull();
        expect(resultado).toBe(saida);
    });

    test('Deve retornar gerar um erro caso informe una quantodade negativa de casas decimais', () => {
        expect(() => normalizarPrecisao(123.456, -1)).toThrow();
    });

    test.each([1, 8, 6, 0, 3, 9, 10, 16])('Infinity deve retornar Infinity com %i casas decimais', (n) => {
        const resultado = normalizarPrecisao(Infinity, n)
        expect(resultado).not.toBeNull();
        expect(resultado).toBe(Infinity);
    });

    test.each([1, 8, 6, 0, 3, 9, 10, 16])('-Infinity deve retornar -Infinity com %i casas decimais', (n) => {
        const resultado = normalizarPrecisao(-Infinity, n)
        expect(resultado).not.toBeNull();
        expect(resultado).toBe(-Infinity);
    });

});


describe("contarDecimais", () => {
    test.each([
        { entrada: 123, saida: 0 },
        { entrada: 123.4, saida: 1 },
        { entrada: 123.45, saida: 2 },
        { entrada: 123.456, saida: 3 },
        { entrada: 123.4567, saida: 4 },
        { entrada: 123.45678, saida: 5 },
        { entrada: 123.456789, saida: 6 },
        { entrada: 123.45678901, saida: 8 },
        { entrada: Number.EPSILON, saida: 31 },
    ])("$entrada deve retornar $saida", ({ entrada, saida }) => {
        const resultado = contarDecimais(entrada)
        expect(resultado).not.toBeNull();
        expect(resultado).toBe(saida);
    })
});
