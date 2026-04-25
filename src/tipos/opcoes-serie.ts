import { OpcoesMapasFaixas } from "./opcoes-mapas-faixas";
import { Ano, Ferias, Meses, TipoRecorrencia } from "./tipos-basicos";

/**
 * Opções para a simulação de uma série
 */
export interface OpcoesSerie {
    /**
     * Numero de series/meses a ser considerada na simulação.
     * Se omitido o valor assumido será 12 (meses)
     * @default 12 Meses
     */
    qtdSeries?: number,

    /**
     * Valor bruto mensal utilizaso na simulação da serie.
     * @default R$ 1621.00
     */
    vlBrutoMensal: number,

    /**
     * Incluir o 13 na serie
     * @default false
     */
    incluir13?: boolean,

    /**
     * Incluir o salario de ferias na simulação
     * @default false
     */
    incluirFerias?: Ferias,

    /**
     * Percentual do adicional de salario das ferias
     * @default 1/3 ou (0.333...)
     */
    percentualFerias?: number,

    /**
     * Mes onde as ferias será calculada
     * @default Mes Atual
     */
    mesFerias?: Meses,

    /**
     * Valor dos gastos com saude
     * @default R$ 0.00
     */
    deducaoSaude?: number,

    /**
     * Tipo da recorrencia da dedução dos gastos da saude.
     * @default {@link TipoRecorrencia.Anual}
     */
    deducaoSaudeRecorrencia?: TipoRecorrencia,

    /**
     * Valor da dedução dos gastos com instrução.
     * @default R$ 0.00
     */
    deducaoInstrucao?: number,

    /**
     * Tipo da recorrencia da dedução dos gastos dcom instrução/educação
     * @default {@link TipoRecorrencia.Anual}
     */
    deducaoInstrucaoRecorrencia?: TipoRecorrencia,

    /**
     * Mes para o calculo da PLR
     * @default Mes Atual
     */
    mesPLR?: Meses,

    /**
     * Valor da PLR, se houver.
     * @default R$ 0.00
     */
    vlPLR?: number,

    /**
     * Mapas das aliquotas e faixas do irpf e inss a serem considerados para o calculo. 
     * Caso nao sejam informadas as faixas, serão utilizadas as faixas vigentes atualmente.
     */
    mapasDeFaixas?: null | OpcoesMapasFaixas;

    /**
     * Ano da vigencia das faixas. Se omitido, o ano atual será utilizado.
     * @default Ano atual
     */
    vigenciaAno?: Ano,

    /**
     * Mês de vigência das faixas. Se omitido, o mês atual será utilizado.
     * @default Mes atual
     */
    vigenciaMes?: Meses

}