
import { describe, test, expect } from "@jest/globals";
import { toBRL, toPercent } from "../../src/utils/formatacoes";

describe('toBRL', () => {

    test('1123.45 deve retornar R$ 1123,45', () => {
        const brlString = toBRL(1123.45);
        expect(brlString).not.toBeNull();
        expect(brlString).toEqual('R$ 1.123,45');
    });

    test('123.45 deve retornar R$ 123,45', () => {
        const brlString = toBRL(123.45);
        expect(brlString).not.toBeNull();
        expect(brlString).toEqual('R$ 123,45');
    });

    test('23.45 deve retornar R$ 23,45', () => {
        const brlString = toBRL(23.45);
        expect(brlString).not.toBeNull();
        expect(brlString).toEqual('R$ 23,45');
    });

    test('3.45 deve retornar R$ 3,45', () => {
        const brlString = toBRL(3.45);
        expect(brlString).not.toBeNull();
        expect(brlString).toEqual('R$ 3,45');
    });
});

describe('toPercent', () => {

    test('1123.450456 deve retornar 112.345,0457%', () => {
        const brlString = toPercent(1123.450456);
        expect(brlString).not.toBeNull();
        expect(brlString).toEqual('112.345,046%');
    });

    test('1.2345 deve retornar 123,45%', () => {
        const brlString = toPercent(1.2345);
        expect(brlString).not.toBeNull();
        expect(brlString).toEqual('123,45%');
    });

    test('23.45 deve retornar 2.345%', () => {
        const brlString = toPercent(23.45);
        expect(brlString).not.toBeNull();
        expect(brlString).toEqual('2.345%');
    });

    test('3.45 deve retornar 345%', () => {
        const brlString = toPercent(3.45);
        expect(brlString).not.toBeNull();
        expect(brlString).toEqual('345%');
    });
});
