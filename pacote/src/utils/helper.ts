/**
 * Utilitário para obtenção do nome de uma propriedade de um tipo de forma tipada.
 * 
 * Permite que o desenvolvedor referencie o nome de um campo garantindo que ele exista 
 * no tipo informado, evitando erros de digitação em strings manuais.
 * 
 * @template T - O tipo ou interface que contém a propriedade.
 * @param name - O nome da propriedade (chave de T).
 * @returns O próprio nome da propriedade como string.
 * 
 * @example
 * ```typescript
 * const campo = nameOf<Imposto>("vlImposto"); // "vlImposto"
 * ```
 */
export const nameOf = <T>(name: keyof T) => name;

/**
 * Extrai o nome da chave de um objeto. 
 * 
 * Geralmente utilizado em conjunto com a sintaxe shorthand de objetos para capturar 
 * o nome de uma variável em tempo de execução para fins de log ou mensagens de erro.
 * 
 * @param objeto - Um objeto contendo a propriedade cujo nome deseja-se extrair.
 * @returns O nome da primeira chave encontrada no objeto.
 * @throws {Error} Caso o objeto fornecido não possua nenhuma chave definida.
 * 
 * @example
 * ```typescript
 * let vlBruto = 1000;
 * varsName({ vlBruto }); // "vlBruto"
 * ```
 */
export function varsName(objeto: Record<string, unknown>): string {
    const nome = Object
        .keys(objeto)
        .join(", ")
        .trim();

    if (eVazio(nome))
        throw new Error("Objeto sem nome");

    return nome;
}


export function eVazio(valor: any): boolean {

    if (valor === null)
        return true;

    if (valor === undefined)
        return true;

    if (Array.isArray(valor) && valor.length === 0)
        return true;

    if (`${valor}`.trim() === "")
        return true;

    return false;
}