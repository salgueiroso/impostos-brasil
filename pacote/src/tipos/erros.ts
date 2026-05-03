/**
 * Erro lançado quando um parâmetro fornecido a uma função ou método é considerado inválido
 * de acordo com as regras de negócio da biblioteca.
 * 
 * Esta classe estende o `Error` nativo para fornecer uma mensagem padronizada
 * que identifica claramente qual parâmetro causou a exceção.
 */
export class ParametroInvalido extends Error {
    /**
     * Cria uma nova instância de erro para parâmetros inválidos.
     * 
     * @param nomeParametro - O nome do argumento ou propriedade que falhou na validação.
     * @param mensagem - Descrição adicional opcional explicando o motivo específico da invalidade.
     */
    constructor(nomeParametro: string, mensagem?: string) {
        super(`O parâmetro "${nomeParametro}" é inválido. ${mensagem ?? ''}`);
        this.name = ParametroInvalido.name;
    }
}