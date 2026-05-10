import { describe, test, expect } from '@jest/globals';
import { MapaChaveAnoMes } from '../../src/tipos/ano-mes-aliquotas-faixas-map';
import { varsName } from '../../src/utils/helper';
import { Meses, AnoMes } from '../../src/tipos/tipos-basicos';


describe(varsName({ MapaChaveAnoMes }), () => {

    test('deve permitir adicionar e recuperar valores usando objetos AnoMes diferentes com os mesmos valores', () => {
        const mapa = new MapaChaveAnoMes<number>();
        const chave1: AnoMes = { Ano: 2024, Mes: Meses.Janeiro };
        const chave2: AnoMes = { Ano: 2024, Mes: Meses.Janeiro };

        mapa.set(chave1, 100);

        expect(mapa.has(chave2)).toBe(true);
        expect(mapa.get(chave2)).toBe(100);
        expect(mapa.size).toBe(1);
    });

    test('deve inicializar com entradas no construtor', () => {
        const entries: [AnoMes, number][] = [
            [{ Ano: 2024, Mes: Meses.Janeiro }, 100],
            [{ Ano: 2024, Mes: Meses.Fevereiro }, 200],
        ];
        const mapa = new MapaChaveAnoMes<number>(entries);
        expect(mapa.size).toBe(2);
        expect(mapa.get({ Ano: 2024, Mes: Meses.Janeiro })).toBe(100);
        expect(mapa.get({ Ano: 2024, Mes: Meses.Fevereiro })).toBe(200);
    });

    test('deve deletar entradas corretamente usando chaves equivalentes', () => {
        const mapa = new MapaChaveAnoMes<number>();
        mapa.set({ Ano: 2024, Mes: Meses.Janeiro }, 100);

        expect(mapa.delete({ Ano: 2024, Mes: Meses.Janeiro })).toBe(true);
        expect(mapa.size).toBe(0);
        expect(mapa.has({ Ano: 2024, Mes: Meses.Janeiro })).toBe(false);
    });

    test('deve limpar o mapa completamente', () => {
        const mapa = new MapaChaveAnoMes<number>();
        mapa.set({ Ano: 2024, Mes: Meses.Janeiro }, 100);
        mapa.set({ Ano: 2024, Mes: Meses.Fevereiro }, 200);

        mapa.clear();
        expect(mapa.size).toBe(0);
    });

    test('deve iterar corretamente usando forEach e retornar chaves como AnoMes', () => {
        const mapa = new MapaChaveAnoMes<number>();
        const chaveOriginal: AnoMes = { Ano: 2024, Mes: Meses.Marco };
        mapa.set(chaveOriginal, 300);

        let itemsProcessados = 0;
        mapa.forEach((value, key, map) => {
            expect(value).toBe(300);
            expect(key).toEqual(chaveOriginal);
            expect(map).toBe(mapa);
            itemsProcessados++;
        });
        expect(itemsProcessados).toBe(1);
    });

    test('deve suportar iteradores de keys, values e entries', () => {
        const mapa = new MapaChaveAnoMes<number>();
        const c1 = { Ano: 2024, Mes: Meses.Janeiro };
        const c2 = { Ano: 2024, Mes: Meses.Fevereiro };
        mapa.set(c1, 10);
        mapa.set(c2, 20);

        expect(Array.from(mapa.keys())).toEqual([c1, c2]);
        expect(Array.from(mapa.values())).toEqual([10, 20]);
        expect(Array.from(mapa.entries())).toEqual([[c1, 10], [c2, 20]]);
        expect(Array.from(mapa)).toEqual([[c1, 10], [c2, 20]]);
    });

    test('deve retornar a lista de anos das chaves através do método anos() de forma única', () => {
        const mapa = new MapaChaveAnoMes<number>();
        mapa.set({ Ano: 2023, Mes: Meses.Dezembro }, 1);
        mapa.set({ Ano: 2024, Mes: Meses.Janeiro }, 2);
        mapa.set({ Ano: 2024, Mes: Meses.Fevereiro }, 3);

        const anos = Array.from(mapa.anos());
        // Esperamos que os anos sejam únicos conforme descrito no JSDoc
        expect(anos).toEqual([2023, 2024]);
        expect(anos.length).toBe(2);
    });

    test('deve expor o Symbol.toStringTag do mapa interno', () => {
        const mapa = new MapaChaveAnoMes<number>();
        // Object.prototype.toString.call utiliza internamente o [Symbol.toStringTag]
        expect(Object.prototype.toString.call(mapa)).toBe('[object Map]');
    });

});