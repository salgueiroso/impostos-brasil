import { AliquotasTetoFaixas } from "./tipos-basicos";


/**
 * Opções com mapas de faixas a serem utilizadas 
 */
export interface OpcoesMapasFaixas {

    /**
     * Faixas do INSS
     * @default Faixas vigentes na data corrente
     */
    faixasInss?: AliquotasTetoFaixas,

    /**
     * Faixas do IRPF
     * @default Faixas vigentes na data corrente
     */
    faixasIrpf?: AliquotasTetoFaixas,

    /**
     * Faixas do IRPF PLR
     * @default Faixas vigentes na data corrente
     */
    faixasIrpfPLR?: AliquotasTetoFaixas
}
