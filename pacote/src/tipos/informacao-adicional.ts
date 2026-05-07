/**
 * Identificadores de eventos ou tipos de rendimentos presentes em um item da série temporal.
 * 
 * Este enum é utilizado para marcar quais componentes financeiros e eventos trabalhistas 
 * foram processados no cálculo de um determinado mês, permitindo a rastreabilidade do resultado.
 */
export enum InformacaoAdicional {
    /** Indica o processamento do salário base regular. */
    Salario = 'Salario',
    /** Indica o recebimento de Participação nos Lucros e Resultados (PLR). */
    PLR = 'PLR',
    /** Indica o pagamento da gratificação natalina (13º salário). */
    DecimoTerceiro = 'DecimoTerceiro',
    /** Indica o pagamento de férias ou do respectivo terço constitucional. */
    Ferias = 'Ferias',
    /** Indica o que aplicou desconto simplificado no mes */
    DescontoSimplificadoIRPF = 'DescontoSimplificadoIRPF',
    IsencaoAte5000Isento = 'IsencaoAte5000Isento',
    IsencaoEntre5000e7350Parcial = 'IsencaoEntre5000e7350Parcial'

}