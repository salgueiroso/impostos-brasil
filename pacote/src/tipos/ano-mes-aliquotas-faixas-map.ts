import { fromValorCronologico, toValorCronologico } from "../utils/datas";
import { AliquotasTetoFaixas, Ano, AnoMes } from "./tipos-basicos";

/**
 * Implementação especializada da interface `Map` que utiliza {@link AnoMes} como chave.
 * 
 * Esta classe resolve a limitação do Map nativo do JavaScript ao comparar objetos por referência.
 * Internamente, as chaves do tipo {@link AnoMes} são convertidas para um valor numérico cronológico,
 * garantindo que chaves com os mesmos valores de Ano e Mês sejam tratadas como idênticas, 
 * independentemente da instância do objeto.
 * 
 * @template V - Tipo do valor armazenado (ex: {@link AliquotasTetoFaixas} ou `number`).
 * @template K - Tipo da chave de vigência, padrão é {@link AnoMes}.
 */
export class MapaChaveAnoMes<V extends AliquotasTetoFaixas | number, K extends AnoMes = AnoMes> implements Map<K, V> {

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
     * @param value - O valor a ser amazenado no mapa
     */
    set(key: K, value: V): this {
        this.mapa.set(toValorCronologico(key), value);
        return this
    }

    /**
     * Obtém um valor do mapa
     * @param key Periodo de vigencia a ser obtido
     * @returns O objeto armazenado na key informada
     */
    get(key: K): V | undefined {
        return this.mapa.get(toValorCronologico(key));
    }

    /**
     * Verifica se a chave informada existe
     * @param key Chave a ser verificada
     * @returns `true` se o valor existir ou `false` caso contrário.
     */
    has(key: K): boolean {
        return this.mapa.has(toValorCronologico(key));
    }

    /**
     * Remove um registro do mapa a partir da chave informada
     * @param key A chave para remoção
     * @returns `true` se um elemento no mapa existir e foi removido, ou `false` se o elemento não existir.
     */
    delete(key: K): boolean {
        return this.mapa.delete(toValorCronologico(key));
    }

    clear(): void {
        this.mapa.clear();
    }


    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
        return this.mapa.forEach((value, key, map) => callbackfn(value, fromValorCronologico(key) as K, this), thisArg);
    }

    /**
     * Retorna um iterador para cada chave/valor no mapa.
     */
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
     * @returns Um iterador que percorre os valores do tipo {@link Ano}.
     */
    *anos(): IterableIterator<Ano> {
        const anosUnicos = new Set<Ano>();
        for (const k of this.mapa.keys()) {
            anosUnicos.add(fromValorCronologico(k).Ano);
        }
        yield* anosUnicos;
    }
}