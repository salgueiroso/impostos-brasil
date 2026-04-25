import { fromValorCronologico, toValorCronologico } from "../utils/datas";
import { AliquotasTetoFaixas, Ano, AnoMes } from "./tipos-basicos";


/**
 * Mapa com o ano de vigencia de cada grupo de faixas
 */
export class AnoMesAliquotasFaixasMap<K extends AnoMes = AnoMes, V extends AliquotasTetoFaixas = AliquotasTetoFaixas> implements Map<K, V> {

    private readonly mapa: Map<number, V>;

    constructor(entries?: readonly (readonly [K, V])[] | null) {

        let entriesWithNumericKeys = (entries ?? [])
            .map(([k, v]) => [toValorCronologico(k), v])
            .map(e => e as [number, V]);

        this.mapa = new Map<number, V>(entriesWithNumericKeys);

    }
    get size(): number {
        return this.mapa.size;
    }

    get [Symbol.toStringTag](): string {
        return this.mapa[Symbol.toStringTag];
    }

    set(key: K, value: V): this {
        this.mapa.set(toValorCronologico(key), value);
        return this
    }

    get(key: K): V | undefined {
        return this.mapa.get(toValorCronologico(key));
    }

    has(key: K): boolean {
        return this.mapa.has(toValorCronologico(key));
    }

    delete(key: K): boolean {
        return this.mapa.delete(toValorCronologico(key));
    }

    clear(): void {
        this.mapa.clear();
    }
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
        return this.mapa.forEach((value, key, map) => callbackfn(value, fromValorCronologico(key) as K, this), thisArg);
    }

    *entries(): MapIterator<[K, V]> {
        for (const [k, v] of this.mapa.entries()) {
            yield [fromValorCronologico(k) as K, v];
        }
    }

    *keys(): MapIterator<K> {
        for (const k of this.mapa.keys()) {
            yield fromValorCronologico(k) as K;
        }
    }
    values(): MapIterator<V> {
        return this.mapa.values();
    }
    *[Symbol.iterator](): MapIterator<[K, V]> {
        for (const [k, v] of this.mapa.entries()) {
            yield [fromValorCronologico(k) as K, v];
        }
    }
    *anos(): MapIterator<Ano> {
        for (const k of this.mapa.keys()) {
            yield fromValorCronologico(k).Ano;
        }
    }
}