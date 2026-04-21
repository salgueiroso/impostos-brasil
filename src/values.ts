import { AliquotasTetoFaixas, Ano, AnoMesAliquotasFaixasMap, Meses } from "./types";

/**
 * Valor maximo da dedução com instrução
 */
export const deducaoMaximaInstrucao = 3561.50;


/**
 * Mapa preenchido com as vigencias de aliquotas e faixas INSS
 */
export const vigenciaFaixasInss: AnoMesAliquotasFaixasMap = new AnoMesAliquotasFaixasMap([
    [{ Ano: 2026 as Ano, Mes: Meses.Janeiro }, new Map([
        [0.075, 1621.00],
        [0.09, 3242.00],
        [0.12, 4863.00],
        [0.14, 8157.41]])
    ]
]);

/**
 * Mapa preenchido com as vigencias de aliquotas e faixas IRPF
 */
export const vigenciaFaixasIrpf: AnoMesAliquotasFaixasMap = new AnoMesAliquotasFaixasMap([
    [{ Ano: 2026 as Ano, Mes: Meses.Janeiro }, new Map([
        [0, 2428.80],
        [0.075, 2826.65],
        [0.15, 3751.05],
        [0.225, 4664.68],
        [0.275, Infinity]])
    ]
]);

/**
 * Mapa preenchido com as vigencias de aliquotas e faixas IRPF para PLR
 */
export const vigenciaFaixasIrpfPLR: AnoMesAliquotasFaixasMap = new AnoMesAliquotasFaixasMap([
    [{ Ano: 2025 as Ano, Mes: Meses.Maio }, new Map([
        [0, 8214.40],
        [0.075, 9922.28],
        [0.15, 13167.00],
        [0.225, 16380.38],
        [0.275, Infinity]])
    ]
]);
