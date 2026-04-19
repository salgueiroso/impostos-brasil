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
/**
 * Tipo de recorrencia. Este item é utilizado na seção de deduções de saude, educação, ....
 */
export enum TipoRecorrencia {
    Mensal = 'Mensal',
    Anual = 'Anual'
};

/**
 * Mapa com o ano de vigencia de cada grupo de faixas
 */
export type VigenciaFaixas = Map<number, AliquotasTetoFaixas>;
