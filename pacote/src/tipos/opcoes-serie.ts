import { OpcoesMapasFaixas } from "./opcoes-mapas-faixas";
import { Ano, Ferias, Meses, TipoRecorrencia } from "./tipos-basicos";

/**
 * Define as configurações e parâmetros de entrada para o motor de cálculo de séries temporais.
 * Esta interface orquestra como o salário, benefícios (férias, 13º) e deduções são projetados ao longo dos meses.
 */
export interface OpcoesSerie {
    /**
     * Quantidade de meses (iterações) a serem processados na simulação.
     * @default 12
     */
    qtdSeries?: number;

    /**
     * Valor bruto utilizado como referência de cada item na série.
     */
    vlBruto: number;

    /**
     * Indica se a gratificação natalina (13º salário) deve ser incluída no cálculo.
     * Quando ativo, o cálculo é disparado tipicamente no mês de Dezembro.
     * @default false
     */
    incluir13?: boolean;

    /**
     * Configura a lógica de aplicação das férias (gozo e terço constitucional) na simulação.
     * @default Ferias.Nao {@link Ferias.Nao}
     */
    incluirFerias?: Ferias;

    /**
     * Percentual do adicional de férias aplicado sobre o valor bruto.
     * @default 1/3 (0.33333.... constitucional)
     */
    percentualFerias?: number;

    /**
     * Mês de referência em que o pagamento das férias será processado.
     * @default Mês atual do sistema {@link Meses}
     */
    mesFerias?: Meses;

    /**
     * Valor total das despesas com saúde passíveis de dedução na base de cálculo do IRPF.
     * @default 0.00
     */
    deducaoSaude?: number;

    /**
     * Define se a dedução de saúde é interpretada como um valor fixo mensal ou um montante anual.
     * @default TipoRecorrencia.Anual {@link TipoRecorrencia.Anual}
     */
    deducaoSaudeRecorrencia?: TipoRecorrencia;

    /**
     * Valor das despesas com instrução (educação). 
     * Nota: O motor aplica o limite legal definido em {@link deducaoMaximaInstrucao}.
     * @default 0.00
     */
    deducaoInstrucao?: number;

    /**
     * Define a periodicidade da dedução de gastos com instrução.
     * @default TipoRecorrencia.Anual {@link TipoRecorrencia.Anual}
     */
    deducaoInstrucaoRecorrencia?: TipoRecorrencia;

    /**
     * Mês em que o pagamento da PLR será provisionado.
     * @default Mês atual do sistema {@link Meses}
     */
    mesPLR?: Meses;

    /**
     * Valor bruto da Participação nos Lucros e Resultados (PLR) para cálculo de tributação exclusiva.
     * @default 0.00
     */
    vlPLR?: number;

    /**
     * Conjunto opcional de tabelas de alíquotas e faixas. 
     * Se omitido, o sistema buscará as tabelas oficiais baseadas em `vigenciaAno` e `vigenciaMes`.
     */
    mapasDeFaixas?: null | OpcoesMapasFaixas;

    /**
     * Ano de referência para seleção das tabelas de impostos (IRPF/INSS) vigentes.
     */
    vigenciaAno?: Ano;

    /**
     * Mês de referência para seleção das tabelas de impostos vigentes.
     */
    vigenciaMes?: Meses;

    /**
     * Habilita o uso do desconto simplificado no IRPF
     */
    usarDescontoSimplificadoIRPF?: boolean;

    /**
     * Habilita o uso da isenção/desconto entre 5000 e 7350
     */
    usarIsencao5k7k?: boolean;
}