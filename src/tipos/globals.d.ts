//globals.d.ts

/**
 * Extensões do escopo global do ambiente (Node.js ou Browser) para a biblioteca de impostos.
 */
declare global {
    /**
     * O ano mínimo de vigência suportado pelo motor de cálculo.
     * 
     * Esta variável define o limite inferior para consultas em tabelas de alíquotas históricas,
     * garantindo que o sistema não tente processar períodos sem dados de referência.
     */
    var anoMinimo: number;
}

export { };
