import { Ano, AnoMes, Meses } from "../tipos/tipos-basicos";
import { MapaVigencia as MapaVigenciaInss } from "../recursos/inss.json";
import { MapaVigencia as MapaVigenciaIrpf } from "../recursos/irpf.json";
import { MapaVigencia as MapaVigenciaIrpfPLR } from "../recursos/irpfPLR.json";



/**
 * Realiza a contagem de decimos terceiros de acordo com a quantidade de meses informada
 * @param qtdMeses A quantidade de meses a ser realizada a contagem de dcimos terceiros. 
 * @returns Retorna um numero com a quantidade de decimos terceiros existentes no periodo informado.
 */
export function Contar13(qtdMeses: number): number {
    let qtd12 = Math.floor(qtdMeses / 12);
    return qtd12;
}

/**
 * Descobre o mes de acordo com a a posicao informada.
 * @param posicaoNaSerie A posicao a ser extraido o mes. Note, o valor informado tem que ser index zero based
 * @returns Retorna o mes relacionado a posicao informada.
 */
export function toMes(posicaoNaSerie: number): Meses {
    let mes = (posicaoNaSerie % 12) + 1;
    // mes = posicaoNaSerie > 0 && mes === 0 ? 13 : mes;
    return mes as Meses;
}

export function getAnoMinimo(): number {
    return globalThis.anoMinimo ??= Math.min(...new Set<number>([
        ...MapaVigenciaInss.map(m => m.Chave.Ano),
        ...MapaVigenciaIrpf.map(m => m.Chave.Ano),
        ...MapaVigenciaIrpfPLR.map(m => m.Chave.Ano)
    ]));
}


export function toAno(valor: number): Ano {
    const minimo = getAnoMinimo();
    if (valor < minimo) throw new Error(`Ano informado tem que ser maior que ${minimo}`);
    return valor as Ano;
}


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