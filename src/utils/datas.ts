import { Ano, AnoMes, Meses } from "../tipos/tipos-basicos";
import { MapaVigencia as MapaVigenciaInss } from "../recursos/inss.json";
import { MapaVigencia as MapaVigenciaIrpf } from "../recursos/irpf.json";
import { MapaVigencia as MapaVigenciaIrpfPLR } from "../recursos/irpfPLR.json";
import { MapaVigencia as MapaVigenciaIrpfDescontoSimplificado } from "../recursos/irpf-desconto-simplificado.json";
import { ParametroInvalido } from "../tipos/erros";
import { varName } from "./helper";



/**
 * Calcula a quantidade de ciclos completos de 12 meses contidos em um determinado período.
 * No contexto tributário, representa a quantidade de pagamentos de 13º salário devidos.
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
 * Utiliza operação de aritmética modular para determinar o mês correspondente no intervalo [1, 12].
 * 
 * @param posicaoNaSerie A posição na série temporal (ex: 0 para Janeiro, 12 para Janeiro do ano seguinte).
 * @returns O mês correspondente (1-12) como um valor do tipo {@link Meses}.
 */
export function toMes(posicaoNaSerie: number): Meses {
    let mes = (posicaoNaSerie % 12) + 1;
    return mes as Meses;
}

/**
 * Recupera o ano mínimo de vigência com base nas tabelas de INSS, IRPF e IRPF PLR.
 * O valor é calculado uma única vez e armazenado em cache na variável global `anoMinimo`.
 * 
 * @see {@link globalThis.anoMinimo}
 * @returns O menor ano encontrado nos mapas de vigência disponíveis.
 */
export function getAnoMinimo(): number {
    return globalThis.anoMinimo ??= Math.min(...new Set<number>([
        ...MapaVigenciaInss.map(m => m.Chave.Ano),
        ...MapaVigenciaIrpf.map(m => m.Chave.Ano),
        ...MapaVigenciaIrpfPLR.map(m => m.Chave.Ano),
        ...MapaVigenciaIrpfDescontoSimplificado.map(m => m.Chave.Ano)
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
    if (valor < minimo) throw new ParametroInvalido(varName({ valor }), `O ano informado deve ser maior ou igual a ${minimo}.`);
    return valor as Ano;
}


/**
 * Converte um objeto {@link AnoMes} em um valor numérico inteiro cronológico (formato YYYYMM).
 * Este formato é útil para comparações matemáticas de anterioridade e posteridade.
 * 
 * @param anoMes Objeto contendo as propriedades Ano e Mes.
 * @returns Um número inteiro no formato YYYYMM (ex: 202305 para Maio de 2023).
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


/**
 * Realiza o deslocamento temporal de uma competência, adicionando ou subtraindo meses.
 * 
 * @param anoMes A competência inicial de referência.
 * @param qtdMeses O número de meses a incrementar (ou decrementar se negativo).
 * @returns Um novo objeto {@link AnoMes} representando a data resultante, validado 
 * contra o ano mínimo do sistema.
 */
export function incrementaAnoMes(anoMes: AnoMes, qtdMeses: number): AnoMes {
    const anoMesData = new Date(anoMes.Ano, anoMes.Mes - 1);
    anoMesData.setMonth(anoMesData.getMonth() + qtdMeses);
    return {
        Ano: toAno(anoMesData.getFullYear()),
        Mes: (anoMesData.getMonth() + 1) as Meses
    };
}