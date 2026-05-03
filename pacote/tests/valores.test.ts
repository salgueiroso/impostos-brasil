import { describe, test, expect } from '@jest/globals';
import { deducaoMaximaInstrucao, precisao } from '../src/valores';

describe("Constantes", () => {

    test("deducaoMaximaInstrucao tem que ter um valor positivo", () => {
        expect(deducaoMaximaInstrucao).toBeGreaterThan(0);
    });

    test("precisao tem que ter um valor positivo", () => {
        expect(precisao).toBeGreaterThan(0);
    });

});