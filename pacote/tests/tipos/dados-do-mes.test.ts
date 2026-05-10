import { describe, test, expect } from '@jest/globals';
import { DadosDoMes } from '../../src/tipos/dados-do-mes';
import { Meses, InformacaoAdicional } from '../../src/tipos';
import { Imposto } from '../../src/tipos/imposto';


describe("DadosDoMes", () => {

    const mockImposto: Imposto = {
        faixas: [],
        vlImposto: 0,
        aliquotaEfetiva: 0,
        vlBruto: 0,
        vlBaseDeCalculo: 0,
        vlLiquido: 0
    };

    test('deve permitir a criação de um objeto válido que respeite a interface DadosDoMes', () => {
        const dados: DadosDoMes = {
            irpf: { ...mockImposto, vlImposto: 250.50 },
            inss: { ...mockImposto, vlImposto: 120.00 },
            anoMes: { Ano: 2024, Mes: Meses.Janeiro },
            indice: 0,
            vlDeducoes: 500,
            vlDeducoesDependentes: 189.59,
            vlBruto: 5000,
            vlLiquido: 4629.50,
            informacoesAdicionais: [
                InformacaoAdicional.Salario,
                InformacaoAdicional.DeducaoDependentes
            ]
        };

        expect(dados.irpf.vlImposto).toBe(250.50);
        expect(dados.inss.vlImposto).toBe(120.00);
        expect(dados.anoMes.Ano).toBe(2024);
        expect(dados.indice).toBe(0);
        expect(dados.vlBruto).toBe(5000);
        expect(dados.informacoesAdicionais).toContain(InformacaoAdicional.Salario);
    });

    test('deve permitir que o campo irpfPLR seja nulo ou opcional', () => {
        const dados: DadosDoMes = {
            irpf: mockImposto,
            inss: mockImposto,
            anoMes: { Ano: 2024, Mes: Meses.Marco },
            indice: 2,
            vlDeducoes: 0,
            vlDeducoesDependentes: 0,
            vlBruto: 3000,
            vlLiquido: 3000,
            informacoesAdicionais: [],
            irpfPLR: null // Testando a nulidade explícita permitida pela interface
        };

        expect(dados.irpfPLR).toBeNull();
        expect(dados.indice).toBe(2);
    });

});