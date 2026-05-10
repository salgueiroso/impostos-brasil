import { describe, test, expect } from '@jest/globals';
import { varsName } from '../../src/utils/helper';
import { ParametroInvalido } from '../../src/tipos/erros';


describe(varsName({ ParametroInvalido }), () => {


    test('deve instanciar o erro com a mensagem padrão quando apenas o nome do parâmetro é fornecido', () => {
        const nome = 'meuParametro';
        const erro = new ParametroInvalido(nome);

        expect(erro.message).toBe(`O parâmetro "${nome}" é inválido. `);
        expect(erro.name).toBe('ParametroInvalido');
    });

    test('deve incluir a mensagem adicional quando fornecida', () => {
        const nome = 'valor';
        const mensagem = 'Deve ser um número positivo.';
        const erro = new ParametroInvalido(nome, mensagem);

        expect(erro.message).toBe(`O parâmetro "${nome}" é inválido. ${mensagem}`);
    });



    test('deve ser uma instância de Error e de ParametroInvalido', () => {
        const erro = new ParametroInvalido('teste');
        expect(erro).toBeInstanceOf(Error);
        expect(erro).toBeInstanceOf(ParametroInvalido);
    });


});