import { describe, test, expect } from "@jest/globals";
import { Contar13, contarMesesContabeisEntre, fromValorCronologico, getAnoMinimo, incrementaAnoMes, toAno, toMes, toValorCronologico } from "../../src/utils/datas";
import { AnoMes, Meses } from "../../src/tipos/tipos-basicos";
import { varsName } from "../../src/utils/helper";


describe(varsName({ Contar13 }), () => {

    test.each([
        { informar: 1, esperado: 0 },
        { informar: 11, esperado: 0 },
        { informar: 12, esperado: 1 },
        { informar: 24, esperado: 2 },
        { informar: 48, esperado: 4 }
    ])("Deve retornar $esperado se informar $informar mes", ({ informar, esperado }) => {
        const resultado = Contar13(informar);
        expect(resultado).toBe(esperado);
    });

});

describe(varsName({ toMes }), () => {

    test.each([
        { indice: 0, esperado: Meses[Meses.Janeiro] },
        { indice: 1, esperado: Meses[Meses.Fevereiro] },
        { indice: 11, esperado: Meses[Meses.Dezembro] },
        { indice: 12, esperado: Meses[Meses.Janeiro] },
        { indice: 24, esperado: Meses[Meses.Janeiro] }
    ])("Deve retornar $esperado se informar indice $indice", ({ indice, esperado }) => {
        const mesEnum = Meses[esperado as keyof typeof Meses];
        const resultado = toMes(indice);
        expect(resultado).toBe(mesEnum);
    });

});


describe(varsName({ getAnoMinimo }), () => {

    test("Deve retornar 2010", () => {
        const resultado = getAnoMinimo();
        expect(resultado).toBe(2010);
    });

});

describe(varsName({ toAno }), () => {

    test("Deve estourar um erro se informar menor que o ano minimo", () => {
        expect(() => toAno(getAnoMinimo() - 1)).toThrow();
    });

    test("Deve retornar ano minimo se informar ano minimo", () => {
        const anoMinimo = getAnoMinimo();
        const resultado = toAno(anoMinimo);
        expect(resultado).toBe(anoMinimo);
    });

    test("Deve retornar 10 anos apos ano minimo se informar a0 anos apos ano minimo", () => {
        const ano = getAnoMinimo() + 10;
        const resultado = toAno(ano);
        expect(resultado).toBe(ano);
    });

});

describe(varsName({ toValorCronologico }), () => {

    test("Deve retornar 202301 se informar { Ano: 2023, Mes: 1 }", () => {
        const resultado = toValorCronologico({ Ano: 2023, Mes: 1 });
        expect(resultado).toBe(202301);
    });

    test("Deve retornar 202612 se informar { Ano: 2026, Mes: 12 }", () => {
        const resultado = toValorCronologico({ Ano: 2026, Mes: 12 });
        expect(resultado).toBe(202612);
    });

});

describe(varsName({ fromValorCronologico }), () => {

    test("Deve retornar { Ano: 2023, Mes: 1 } se informar 202301", () => {
        const resultado = fromValorCronologico(202301);
        expect(resultado).toEqual({ Ano: 2023, Mes: 1 });
    });

    test("Deve retornar { Ano: 2026, Mes: 12 } se informar 202612", () => {
        const resultado = fromValorCronologico(202612);
        expect(resultado).toEqual({ Ano: 2026, Mes: 12 });
    });

});


describe(varsName({ incrementaAnoMes }), () => {

    test.each([
        { entradaAno: 2026, entradaMes: Meses.Janeiro, qtdMeses: 1, saidaAno: 2026, saidaMes: Meses.Fevereiro },
        { entradaAno: 2026, entradaMes: Meses.Janeiro, qtdMeses: 49, saidaAno: 2030, saidaMes: Meses.Fevereiro }
    ])("Com entrada $entradaAno/$entradaMes, e incremento de $qtdMeses meses, deve retornar $saidaAno/$saidaMes", ({ entradaAno, entradaMes, qtdMeses, saidaAno, saidaMes }) => {
        expect(incrementaAnoMes({ Ano: entradaAno, Mes: entradaMes }, qtdMeses)).toEqual({ Ano: saidaAno, Mes: saidaMes } as AnoMes);
    });

});


describe(varsName({ contarMesesContabeisEntre }), () => {

    test.each([
        { inicioAno: 2026, inicioMes: Meses.Janeiro, finalAno: 2026, finalMes: Meses.Fevereiro, esperado: 2 },
        { inicioAno: 2026, inicioMes: Meses.Janeiro, finalAno: 2030, finalMes: Meses.Fevereiro, esperado: 50 }
    ])("Com inicio em $inicioAno/$inicioMes e fim em $finalAno/$finalMes, deve retornar $esperado", ({ inicioAno, inicioMes, finalAno, finalMes, esperado }) => {
        expect(contarMesesContabeisEntre({ Ano: inicioAno, Mes: inicioMes }, { Ano: finalAno, Mes: finalMes })).toBe(esperado);
    });

});