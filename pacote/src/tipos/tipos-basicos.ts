/**
 * Representa o valor percentual de uma alíquota de imposto.
 * Deve ser utilizado em formato decimal (ex: 0.11 para 11%).
 */
export type Aliquota = number;

/**
 * Representa o valor monetário limite (teto) de uma faixa de tributação.
 */
export type TetoFaixa = number;

/**
 * Estrutura de mapa que associa uma {@link Aliquota} (chave) ao seu respectivo {@link TetoFaixa} (valor).
 * Utilizado para definir tabelas progressivas de impostos.
 */
export type AliquotasTetoFaixas = Map<Aliquota, TetoFaixa>;

/**
 * Representa um ano civil no formato de 4 dígitos (ex: 2024).
 */
export type Ano = number;

/**
 * Enumeração dos meses do ano com mapeamento numérico (1 a 12).
 */
export enum Meses {
    Janeiro = 1,
    Fevereiro = 2,
    Marco = 3,
    Abril = 4,
    Maio = 5,
    Junho = 6,
    Julho = 7,
    Agosto = 8,
    Setembro = 9,
    Outubro = 10,
    Novembro = 11,
    Dezembro = 12
}

/**
 * Define o comportamento do cálculo de férias na série temporal.
 */
export enum Ferias {
    /** Não inclui pagamento de férias no período. */
    Nao = 'Nao',
    /** Ignora o pagamento no primeiro ano da série, simulando o período aquisitivo. */
    IgnorarPrimeiroAno = 'IgnorarPrimeiroAno',
    /** Aplica o pagamento de férias (1/3 constitucional) no mês definido. */
    Sim = 'Sim'
}

/**
 * Interface para representação de uma data de vigência composta por Ano e Mês.
 */
export interface AnoMes {
    /** Ano de vigência da tabela. */
    Ano: Ano;
    /** Mês de vigência da tabela. */
    Mes: Meses;
};

/**
 * Define como uma dedução ou valor deve ser interpretado pelo motor de cálculo.
 * Utilizado principalmente para gastos com saúde e instrução.
 */
export enum TipoRecorrencia {
    /** O valor informado é aplicado integralmente a cada mês da série. */
    Mensal = 'Mensal',
    /** O valor informado é considerado o total anual e será diluído pelos 12 meses. */
    Anual = 'Anual'
};
