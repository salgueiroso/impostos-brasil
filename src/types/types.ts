/**
 * Representa o valor da aliquota
 */
export type Aliquota = number;

/**
 * Representa o valor teto da faixa
 */
export type TetoFaixa = number;

/**
 * Mapa com a relação do teto de cada faixa e sua aliquota
 */
export type AliquotasTetoFaixas = Map<Aliquota, TetoFaixa>;

export type Ano = number & { __toAno: true };
export function toAno(valor: number): Ano {
    if (valor < 2010) throw new Error(`Ano informado tem que ser maior que 2010`);
    return valor as Ano;
}

/**
 * Meses do ano
 */
export enum Meses {
    Janeiro = 1,
    Fevereiro = 2,
    Marco = 3,
    Abril = 4,
    Maio = 5,
    Junho = 6,
    Julho = 7,
    Agosto = 8,
    Setembro = 9,
    Outubro = 10,
    Novembro = 11,
    Dezembro = 12
}

export type AnoMes = { Ano: Ano, Mes: Meses };

/**
 * Tipo de recorrencia. Este item é utilizado na seção de deduções de saude, educação, ....
 */
export enum TipoRecorrencia {
    Mensal = 'Mensal',
    Anual = 'Anual'
};

/**
 * Converte um objeto {@link AnoMes} em um valor inteiro.
 * @param anoMes Objeto com ano e mes
 * @returns Retorna um valor inteiro que representa o objeto {@link AnoMes} informado.
 */
export function toValorCronologico(anoMes: AnoMes): number {
    return toAno(anoMes.Ano) * 100 + anoMes.Mes;
}

/**
 * Converte um inteiro para sua representação {@link AnoMes}.
 * @param valor Numero inteiro a ser convertido
 * @returns Retorna um objeto {@link AnoMes} gerado a partir do numero inteiro informado.
 */
export function fromValorCronologico(valor: number): AnoMes {
    let ano = Math.trunc(valor / 100);
    let mes = valor % 100;

    return {
        Ano: toAno(ano),
        Mes: mes
    };
}


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
}

