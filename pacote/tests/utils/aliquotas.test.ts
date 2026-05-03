import { describe, test, expect } from "@jest/globals";
import { getFaixasVigentes } from '../../src/utils/aliquotas';
import { MapaChaveAnoMes } from "../../src/tipos/ano-mes-aliquotas-faixas-map";
import { Aliquota, TetoFaixa } from "../../src/tipos/tipos-basicos";


describe("getAliquotasVigentes", () => {

    test("Deve retornar null se faixas=null", () => {
        const resultado = getFaixasVigentes(2026, 1);
        expect(resultado).toBeNull();
    });

    test("Deve estourar um Error se periodo nao está configurado", () => {
        const faixas = new MapaChaveAnoMes();
        expect(() => getFaixasVigentes(2026, 1, faixas)).toThrow();
    });

    test("Deve encontar o periodo 2026 janeiro com um item no mapa", () => {
        const faixas = new MapaChaveAnoMes([
            [{ Ano: 2026, Mes: 1 }, new Map<Aliquota, TetoFaixa>()]
        ]);
        const resultado = getFaixasVigentes(2026, 1, faixas);
        expect(resultado).not.toBeNull();
    });

    test("Deve encontar o periodo 2026 janeiro com vários itens no mapa", () => {
        const faixas = new MapaChaveAnoMes([
            [{ Ano: 2020, Mes: 1 }, new Map<Aliquota, TetoFaixa>()],
            [{ Ano: 2021, Mes: 1 }, new Map<Aliquota, TetoFaixa>()],
            [{ Ano: 2022, Mes: 1 }, new Map<Aliquota, TetoFaixa>()],
            [{ Ano: 2023, Mes: 1 }, new Map<Aliquota, TetoFaixa>()],
            [{ Ano: 2024, Mes: 1 }, new Map<Aliquota, TetoFaixa>()],
        ]);
        const resultado = getFaixasVigentes(2026, 1, faixas);
        expect(resultado).not.toBeNull();
    });

    test("Deve encontar o periodo 2022 maio, utilizando vários itens no mapa e pesquisando por 2022 agosto", () => {
        const faixas = new MapaChaveAnoMes([
            [{ Ano: 2020, Mes: 1 }, new Map<Aliquota, TetoFaixa>()],
            [{ Ano: 2021, Mes: 1 }, new Map<Aliquota, TetoFaixa>()],
            [{ Ano: 2022, Mes: 1 }, new Map<Aliquota, TetoFaixa>()],
            [{ Ano: 2022, Mes: 5 }, new Map<Aliquota, TetoFaixa>([[0, 1000]])],
            [{ Ano: 2023, Mes: 1 }, new Map<Aliquota, TetoFaixa>()],
            [{ Ano: 2024, Mes: 1 }, new Map<Aliquota, TetoFaixa>()],
        ]);
        const resultado = getFaixasVigentes(2022, 8, faixas);
        expect(resultado).not.toBeNull();
        expect(resultado?.size).toBeGreaterThanOrEqual(1);
        expect(resultado?.get(0)).toBe(1000);
    });
});
