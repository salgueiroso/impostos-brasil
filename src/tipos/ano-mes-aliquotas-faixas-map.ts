import { fromValorCronologico, toValorCronologico } from "../utils/datas";
import { AliquotasTetoFaixas, Ano, AnoMes } from "./tipos-basicos";

/**
 * Implementação especializada de um Map que utiliza {@link AnoMes} como chave.
 * 
 * Diferente de um Map padrão, esta classe converte as chaves do tipo objeto para um 
 * valor numérico cronológico internamente. Isso permite que dois objetos {@link AnoMes} 
 * diferentes, mas com os mesmos valores de Ano e Mês, sejam referenciados como a mesma chave.
 * 
 * @template K - Tipo da chave que estende {@link AnoMes}.
 * @template V - Tipo do valor que estende {@link AliquotasTetoFaixas}.
 */
export class AnoMesAliquotasFaixasMap<K extends AnoMes = AnoMes, V extends AliquotasTetoFaixas = AliquotasTetoFaixas> implements Map<K, V> {

    /** Armazenamento interno indexado por valor numérico cronológico. */
    private readonly mapa: Map<number, V>;

    /**
     * Inicializa uma nova instância do mapa de vigências.
     * 
     * @param entries - Uma lista opcional de pares [Chave, Valor] para popular o mapa. 
     * As chaves serão automaticamente convertidas para o formato numérico interno.
     */
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

    /** 
     * @param key - O objeto {@link AnoMes} que define a vigência.
     */
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

    /**
     * Gera um iterador que percorre apenas os anos civis únicos presentes nas chaves deste mapa.
     * 
     * @returns Um iterador de valores do tipo {@link Ano}.
     */
    *anos(): MapIterator<Ano> {
        for (const k of this.mapa.keys()) {
            yield fromValorCronologico(k).Ano;
        }
    }
}