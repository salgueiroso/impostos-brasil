import { Imposto } from "../tipos/imposto";

/**
 * Incrementa e consolida os valores de um imposto de origem em um imposto acumulador.
 * 
 * Esta função realiza a soma dos valores monetários (base de cálculo, valor bruto, imposto e líquido)
 * e recalcula a alíquota efetiva. Também consolida os valores detalhados por faixa.
 * 
 * @param origem - O objeto de imposto contendo os dados a serem somados.
 * @param acumulador - O objeto de imposto que receberá o acréscimo dos valores. **Nota: Este objeto é modificado diretamente.**
 * @throws {Error} Disparado se as estruturas de faixas (alíquotas ou limites) entre origem e acumulador forem divergentes.
 */
export function incrementarImposto(origem: Imposto, acumulador: Imposto): void {

    if (acumulador.faixas.length !== origem.faixas.length
        || !acumulador.faixas.every(fa => origem.faixas.some(fo => fa.aliquota === fo.aliquota))
        || !acumulador.faixas.every(fa => origem.faixas.some(fo => fa.vlFinal === fo.vlFinal))
        || !acumulador.faixas.every(fa => origem.faixas.some(fo => fa.vlInicial === fo.vlInicial))
    )
        throw new Error("Faixas dos impostos a serem incrementados não são iguais");

    acumulador.vlBaseDeCalculo += origem.vlBaseDeCalculo;
    acumulador.vlBruto += origem.vlBruto;
    acumulador.vlImposto += origem.vlImposto;
    acumulador.vlLiquido += origem.vlLiquido;
    acumulador.aliquotaEfetiva = (acumulador.vlImposto / acumulador.vlBruto);
    for (let [idx, faixaAcumulador] of acumulador.faixas.entries()) {
        faixaAcumulador.deducao ??= 0;
        faixaAcumulador.deducao += origem.faixas[idx]?.deducao ?? 0;
        faixaAcumulador.vlBaseFaixa ??= 0;
        faixaAcumulador.vlBaseFaixa += origem.faixas[idx]?.vlBaseFaixa ?? 0;
    }
}