import { describe, test, expect } from '@jest/globals';
import { ItemMapaJson } from "../../src/tipos/item-mapa-json";
import { carregarDoJson } from "../../src/utils/json";

describe("carregarDoJson", () => {

    test("Conteudo vazio deve gerar um mapa vazio", () => {
        const conteudo: ItemMapaJson[] = [];
        const mapa = carregarDoJson(conteudo);
        expect(mapa.size).toBe(0);
    });

    test("1 item informado com ValorTeto preehchido deve gerar um mapa com o mesmo ValorTeto na aliquota do item", () => {
        const conteudo: ItemMapaJson[] = [{ Chave: { Ano: 2023, Mes: 1 }, Valor: [{ Aliquota: 0.075, ValorTeto: 1000 }] }];
        const mapa = carregarDoJson(conteudo);
        expect(mapa.get({ Ano: 2023, Mes: 1 })?.get(0.075)).toBe(1000);
    });

    test("1 item informado com 6667 no Valor preehchido deve gerar um mapa com o mesmo Valor do item", () => {
        const conteudo: ItemMapaJson[] = [{ Chave: { Ano: 2023, Mes: 1 }, Valor: 667 }];
        const mapa = carregarDoJson<number>(conteudo);
        expect(mapa.get({ Ano: 2023, Mes: 1 })).toBe(667);
    });

});