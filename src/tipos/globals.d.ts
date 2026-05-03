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


    interface Number {
        /**
         * Normaliza a precisão decimal do número para evitar erros de arredondamento inerentes ao ponto flutuante.
         * 
         * @param precisaoLocal - Quantidade de casas decimais (opcional).
         * @returns O número ajustado para a precisão desejada.
         */
        normalizarPrecisao(precisaoLocal?: number | null): number;

        /**
         * Formata o número para o padrão de moeda brasileiro (R$) com tratamento de espaços.
         * 
         * @returns Valor monetário formatado.
         */
        toBRL(): string;

        /**
         * Formata o número (ratio decimal) para sua representação percentual (ex: 0.1 -> "10%").
         * 
         * @returns Valor percentual formatado.
         */
        toPercent(): string;
    }
}

export { };
