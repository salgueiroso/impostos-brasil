/**
 * Representa o valor da aliquota
 */
export type Aliquota = number;

/**
 * Representa o valor teto da faixa
 */
export type TetoFaixa = number;

/**
 * Mapa com a relação do teto de cada faixa e sua aliquota
 */
export type AliquotasTetoFaixas = Map<Aliquota, TetoFaixa>;

export type Ano = number & { __toAno: true };

/**
 * Meses do ano
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

export enum Ferias {
    Nao = 1,
    IgnorarPrimeiroAno = 2,
    Sim = 3
}

export interface AnoMes {
    Ano: Ano;
    Mes: Meses;
};

/**
 * Tipo de recorrencia. Este item é utilizado na seção de deduções de saude, educação, ....
 */
export enum TipoRecorrencia {
    Mensal = 'Mensal',
    Anual = 'Anual'
};







