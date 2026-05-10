import { describe, test, expect } from '@jest/globals';
import { ItemMapaJson } from "../../src/tipos/item-mapa-json";
import { carregarDoJson } from "../../src/utils/json";
import { varsName } from '../../src/utils/helper';

describe(varsName({ carregarDoJson }), () => {

    test("Conteudo vazio deve gerar um mapa vazio", () => {
        const conteudo: ItemMapaJson[] = [];
        const mapa = carregarDoJson(conteudo);
        expect(mapa.size).toBe(0);
    });

    test("1 item informado com ValorTeto preehchido deve gerar um mapa com o mesmo ValorTeto na aliquota do item", () => {
        const conteudo: ItemMapaJson[] = [{ Fonte: "http://www.google.com", Chave: { Ano: 2023, Mes: 1 }, Valor: [{ Aliquota: 0.075, ValorTeto: 1000 }] }];
        const mapa = carregarDoJson(conteudo);
        expect(mapa.get({ Ano: 2023, Mes: 1 })?.get(0.075)).toBe(1000);
    });

    test("1 item informado com 667 no Valor preehchido deve gerar um mapa com o mesmo Valor do item", () => {
        const conteudo: ItemMapaJson[] = [{ Fonte: "http://www.google.com", Chave: { Ano: 2023, Mes: 1 }, Valor: 667 }];
        const mapa = carregarDoJson<number>(conteudo);
        expect(mapa.get({ Ano: 2023, Mes: 1 })).toBe(667);
    });

    test("Deve gerar um erro se o tipo do Valor nao for number ou array", () => {
        const conteudo: ItemMapaJson[] = [{ Fonte: "http://www.google.com", Chave: { Ano: 2023, Mes: 1 }, Valor: "akihsd983" as unknown as number }];
        expect(() => carregarDoJson<number>(conteudo)).toThrow();
    });

});