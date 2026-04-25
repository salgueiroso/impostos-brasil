import { Imposto } from "../tipos/imposto";

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