import { Imposto } from "../tipos/imposto";

/**
 * Incrementa e consolida os montantes de um resultado de imposto em um objeto acumulador.
 * 
 * Esta função realiza a soma aritmética dos campos financeiros (base de cálculo, valor bruto, 
 * valor do imposto e valor líquido) e atualiza a alíquota efetiva média do período acumulado. 
 * Também processa a consolidação cumulativa dos valores detalhados por fatia da tabela progressiva.
 * 
 * @param origem - O objeto {@link Imposto} contendo os novos dados a serem adicionados.
 * @param acumulador - O objeto {@link Imposto} de destino que manterá o somatório. 
 * **Nota: Este objeto é modificado diretamente (mutação).**
 * 
 * @throws {Error} Disparado se a definição das faixas (quantidade, alíquotas ou limites superiores) 
 * entre a origem e o acumulador for divergente, impossibilitando a soma por índice.
 * 
 * @example
 * ```typescript
 * // Acumula o imposto calculado de um mês específico em um totalizador anual
 * incrementarImposto(impostoMensal, impostoAnual);
 * ```
 */
export function incrementarImposto(origem: Imposto, acumulador: Imposto): void {

    if (acumulador.faixas.length !== origem.faixas.length
        || !acumulador.faixas.every(fa => origem.faixas.some(fo => fa.aliquota === fo.aliquota))
        // || !acumulador.faixas.every(fa => origem.faixas.some(fo => fa.vlFinal === fo.vlFinal))
        // || !acumulador.faixas.every(fa => origem.faixas.some(fo => fa.vlInicial === fo.vlInicial))
    )
        throw new Error("Faixas dos impostos a serem incrementados não são iguais");

    acumulador.vlBaseDeCalculo += origem.vlBaseDeCalculo.normalizarPrecisao();
    acumulador.vlBruto += origem.vlBruto.normalizarPrecisao();
    acumulador.vlImposto += origem.vlImposto.normalizarPrecisao();
    acumulador.vlLiquido += origem.vlLiquido.normalizarPrecisao();
    acumulador.aliquotaEfetiva = (acumulador.vlImposto / acumulador.vlBruto);
    for (let [idx, faixaAcumulador] of acumulador.faixas.entries()) {
        faixaAcumulador.deducao += origem.faixas[idx]!.deducao.normalizarPrecisao();
        faixaAcumulador.vlBaseFaixa ??= 0;
        faixaAcumulador.vlBaseFaixa += origem.faixas[idx]!.vlBaseFaixa?.normalizarPrecisao() ?? 0;
    }
}