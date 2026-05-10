import { describe, test, expect } from '@jest/globals';
import { DeducaoFaixa } from '../../src/tipos/deducao-faixa';


describe("DeducaoFaixa", () => {

    test('deve permitir a criação de um objeto com todos os campos preenchidos', () => {
        const faixa: DeducaoFaixa = {
            vlInicial: 2259.21,
            vlFinal: 2826.65,
            aliquota: 0.075,
            deducao: 42.56,
            vlBaseFaixa: 567.44
        };

        expect(faixa.vlInicial).toBe(2259.21);
        expect(faixa.vlFinal).toBe(2826.65);
        expect(faixa.aliquota).toBe(0.075);
        expect(faixa.deducao).toBe(42.56);
        expect(faixa.vlBaseFaixa).toBe(567.44);
    });

    test('deve permitir a criação de um objeto apenas com os campos obrigatórios', () => {
        const faixa: DeducaoFaixa = {
            vlFinal: 2259.20,
            deducao: 0
        };

        expect(faixa.vlFinal).toBe(2259.20);
        expect(faixa.deducao).toBe(0);
        expect(faixa.vlInicial).toBeUndefined();
        expect(faixa.aliquota).toBeUndefined();
    });

    test('deve aceitar valores nulos nos campos opcionais conforme a interface', () => {
        const faixa: DeducaoFaixa = {
            vlInicial: null,
            vlFinal: 0,
            aliquota: null,
            deducao: 0,
            vlBaseFaixa: null
        };

        expect(faixa.vlInicial).toBeNull();
        expect(faixa.aliquota).toBeNull();
        expect(faixa.vlBaseFaixa).toBeNull();
    });

});