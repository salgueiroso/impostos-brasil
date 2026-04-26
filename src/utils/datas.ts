import { Ano, AnoMes, Meses } from "../tipos/tipos-basicos";
import { MapaVigencia as MapaVigenciaInss } from "../recursos/inss.json";
import { MapaVigencia as MapaVigenciaIrpf } from "../recursos/irpf.json";
import { MapaVigencia as MapaVigenciaIrpfPLR } from "../recursos/irpfPLR.json";



/**
 * Calcula a quantidade de ciclos de 12 meses (décimos terceiros) contidos em um determinado período.
 * 
 * @param qtdMeses A quantidade total de meses a ser analisada.
 * @returns O número inteiro de décimos terceiros no período informado.
 */
export function Contar13(qtdMeses: number): number {
    let qtd12 = Math.floor(qtdMeses / 12);
    return qtd12;
}

/**
 * Converte uma posição sequencial (base zero) em um mês do calendário.
 * Utiliza operação de módulo para determinar o mês correspondente (1 a 12).
 * 
 * @param posicaoNaSerie A posição na série temporal (ex: 0 para Janeiro, 12 para Janeiro do ano seguinte).
 * @returns O mês correspondente como um valor do tipo {@link Meses}.
 */
export function toMes(posicaoNaSerie: number): Meses {
    let mes = (posicaoNaSerie % 12) + 1;
    // mes = posicaoNaSerie > 0 && mes === 0 ? 13 : mes;
    return mes as Meses;
}

/**
 * Recupera o ano mínimo de vigência com base nas tabelas de INSS, IRPF e IRPF PLR.
 * O valor é calculado uma única vez e armazenado em cache no escopo global.
 * 
 * @returns O menor ano encontrado nos mapas de vigência disponíveis.
 */
export function getAnoMinimo(): number {
    return globalThis.anoMinimo ??= Math.min(...new Set<number>([
        ...MapaVigenciaInss.map(m => m.Chave.Ano),
        ...MapaVigenciaIrpf.map(m => m.Chave.Ano),
        ...MapaVigenciaIrpfPLR.map(m => m.Chave.Ano)
    ]));
}


/**
 * Valida e converte um número para o tipo {@link Ano}.
 * 
 * @param valor O valor numérico do ano.
 * @returns O valor convertido para o tipo {@link Ano}.
 * @throws {Error} Caso o ano informado seja inferior ao ano mínimo permitido pelo sistema.
 */
export function toAno(valor: number): Ano {
    const minimo = getAnoMinimo();
    if (valor < minimo) throw new Error(`Ano informado tem que ser maior que ${minimo}`);
    return valor as Ano;
}


/**
 * Converte um objeto {@link AnoMes} em um valor numérico inteiro cronológico (formato YYYYMM).
 * Este formato é útil para comparações matemáticas de anterioridade e posteridade.
 * 
 * @param anoMes Objeto contendo as propriedades Ano e Mes.
 * @returns Um número inteiro representando a data (ex: 202305 para Maio de 2023).
 */
export function toValorCronologico(anoMes: AnoMes): number {
    return toAno(anoMes.Ano) * 100 + anoMes.Mes;
}

/**
 * Converte um valor numérico cronológico (formato YYYYMM) de volta para um objeto {@link AnoMes}.
 * Extrai o ano e o mês realizando operações aritméticas sobre o valor base 100.
 * 
 * @param valor Número inteiro representando a data (ex: 202305).
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