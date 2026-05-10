import { describe, test, expect } from '@jest/globals';
import { deducaoMaximaInstrucao, precisao } from '../src/valores';
import { varsName } from '../src/utils/helper';

describe(varsName({ deducaoMaximaInstrucao }), () => {

    test("Tem que ter um valor positivo", () => {
        expect(deducaoMaximaInstrucao).toBeGreaterThan(0);
    });

});

describe(varsName({ precisao }), () => {
    test("Tem que ter um valor positivo", () => {
        expect(precisao).toBeGreaterThan(0);
    });

});