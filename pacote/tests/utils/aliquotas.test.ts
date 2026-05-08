import { describe, test, expect } from "@jest/globals";
import { getFaixasVigentes, getValorVigente } from '../../src/utils/aliquotas';
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

describe("getValorVigente", () => {

    test("Deve retornar null se faixas=null", () => {
        const resultado = getValorVigente(2026, 1);
        expect(resultado).toBeNull();
    });

    test("Deve estourar um Error se periodo nao está configurado", () => {
        const faixas = new MapaChaveAnoMes<number>();
        expect(() => getValorVigente(2026, 1, faixas)).toThrow();
    });

    test("Deve encontar o periodo 2026 janeiro com um item no mapa", () => {
        const faixas = new MapaChaveAnoMes<number>([
            [{ Ano: 2026, Mes: 1 }, 100]
        ]);
        const resultado = getValorVigente(2026, 1, faixas);
        expect(resultado).not.toBeNull();
        expect(resultado).toBeGreaterThan(0);
    });

    test("Deve encontar o periodo 2026 janeiro com vários itens no mapa", () => {
        const faixas = new MapaChaveAnoMes<number>([
            [{ Ano: 2020, Mes: 1 }, 1],
            [{ Ano: 2021, Mes: 1 }, 2],
            [{ Ano: 2022, Mes: 1 }, 3],
            [{ Ano: 2023, Mes: 1 }, 4],
            [{ Ano: 2024, Mes: 1 }, 5],
        ]);
        const resultado = getValorVigente(2026, 1, faixas);
        expect(resultado).not.toBeNull();
        expect(resultado).toBeGreaterThan(0);
    });

    test("Deve encontar o periodo 2022 maio, utilizando vários itens no mapa e pesquisando por 2022 agosto", () => {
        const faixas = new MapaChaveAnoMes<number>([
            [{ Ano: 2020, Mes: 1 }, 1],
            [{ Ano: 2021, Mes: 1 }, 2],
            [{ Ano: 2022, Mes: 1 }, 3],
            [{ Ano: 2022, Mes: 5 }, 4],
            [{ Ano: 2023, Mes: 1 }, 5],
            [{ Ano: 2024, Mes: 1 }, 6],
        ]);
        const resultado = getFaixasVigentes(2022, 8, faixas);
        expect(resultado).not.toBeNull();
        expect(resultado).toBeGreaterThan(0);
        expect(resultado).toBe(4);
    });
});