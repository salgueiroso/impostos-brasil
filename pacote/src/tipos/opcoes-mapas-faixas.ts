import { AliquotasTetoFaixas } from "./tipos-basicos";
import { OpcoesSerie } from "./opcoes";

/**
 * Define o conjunto de tabelas de alíquotas e faixas progressivas customizadas.
 * 
 * Esta interface permite injetar tabelas específicas para o cálculo, sobrepondo 
 * o comportamento padrão de busca automática nas tabelas oficiais baseadas na data de vigência.
 */
export interface OpcoesMapasFaixas {

    /**
     * Tabela de alíquotas e tetos para o cálculo da Previdência Social (INSS).
     * Se omitida, o sistema utiliza a tabela oficial carregada internamente.
     * @default Tabelas vigentes para o período informado em {@link OpcoesSerie}.
     */
    faixasInss?: AliquotasTetoFaixas,

    /**
     * Tabela progressiva mensal para o cálculo do Imposto de Renda Pessoa Física (IRPF).
     * Se omitida, o sistema utiliza a tabela oficial carregada internamente.
     * @default Tabelas vigentes para o período informado em {@link OpcoesSerie}.
     */
    faixasIrpf?: AliquotasTetoFaixas,

    /**
     * Tabela de tributação exclusiva na fonte para Participação nos Lucros e Resultados (PLR).
     * Se omitida, o sistema utiliza a tabela oficial carregada internamente.
     * @default Tabelas vigentes para o período informado em {@link OpcoesSerie}.
     */
    faixasIrpfPLR?: AliquotasTetoFaixas

    /**
     * Valor monetário fixo para o desconto simplificado do IRPF vigente no periodo.
     * 
     * Esta propriedade permite sobrepor o valor padrão de dedução simplificada definido 
     * nas tabelas oficiais para fins de simulação ou ajustes específicos.
     * @default Valor vigente em `irpf-desconto-simplificado.json`.
     */
    vlIrpfDescontoSimplificado?: number


    vlIrpfDeducaoDependentes?: number;
}
