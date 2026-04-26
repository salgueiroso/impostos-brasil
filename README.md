# impostos-brasil

[![Package](https://github.com/salgueiroso/impostos-brasil/actions/workflows/package.yaml/badge.svg)](https://github.com/salgueiroso/impostos-brasil/actions/workflows/package.yaml)
[![codecov](https://codecov.io/gh/salgueiroso/impostos-brasil/graph/badge.svg?token=LYJEY4ZYUT)](https://codecov.io/gh/salgueiroso/impostos-brasil)
[![License](https://badgen.net/github/license/salgueiroso/impostos-brasil)](https://github.com/salgueiroso/impostos-brasil/blob/main/LICENSE)

Uma biblioteca TypeScript robusta e fácil de usar para calcular impostos sobre a folha de pagamento (CLT) no Brasil, incluindo INSS, IRPF e PLR.

## 🎯 Propósito

O objetivo desta biblioteca é simplificar o cálculo complexo dos principais impostos brasileiros no contexto do pagador de impostos, que envolvem faixas progressivas, deduções específicas e variações temporais de alíquotas. Ela é ideal para sistemas de RH, calculadoras financeiras ou qualquer aplicação que precise simular o salário líquido e encargos de um trabalhador.

### Diferenciais:
- **Cálculo por Faixas:** Implementação precisa do cálculo progressivo (fatiado por faixas).
- **Série Temporal:** Capacidade de simular um ano inteiro, considerando 13º, férias e PLR.
- **Histórico de Vigência:** Suporte para diferentes tabelas de impostos baseadas no ano e mês.
- **Novas Regras de Isenção:** Já preparado para as lógicas de isenção progressiva (ex: isenção de R$ 5k).

## 🚀 Instalação

```bash
npm install impostos-brasil
```

## 📚 Documentação da API
- https://salgueiroso.github.io/impostos-brasil/

## 💻 Exemplos de Uso

### 1. Cálculo Simples de INSS

```typescript
import { calcularINSS } from 'impostos-brasil';

const resultado = calcularINSS(5000);

console.log(`Valor do INSS: ${resultado.vlImposto.toBRL()}`);
console.log(`Alíquota Efetiva: ${resultado.aliquotaEfetiva.toPercent()}`);
console.log(`Líquido: ${resultado.vlLiquido.toBRL()}`);
```

### 2. Cálculo de IRPF

Para o IRPF, é necessário informar a base de cálculo (geralmente o salário bruto menos o INSS e outras deduções).

```typescript
import { calcularIRPF } from 'impostos-brasil';

const salarioBruto = 5000;
const baseCalculo = 4450; // Ex: Salário - INSS

const resultado = calcularIRPF(salarioBruto, baseCalculo, true);

console.log(`Imposto Retido: ${resultado.vlImposto.toBRL()}`);
console.log(`Salário Líquido: ${resultado.vlLiquido.toBRL()}`);
```

### 3. Simulação de Série Anual (Cenário Completo)

A função `calcularSerie` permite projetar o ganho anual completo, incluindo variáveis como férias e 13º salário.

```typescript
import { Meses, TipoRecorrencia, toAno, calcularSerie } from 'impostos-brasil';

const salarioBruto = 10000;
const incluir13 = true;
const incluirFerias = true;

const resultadoAnual = calcularSerie({
    qtdSeries: 12,
    vlBrutoMensal: salarioBruto,
    incluir13: incluir13,
    incluirFerias: incluirFerias,
    mesFerias: Meses.Setembro,
    deducaoSaude: 0,
    deducaoSaudeRecorrencia: TipoRecorrencia.Mensal,
    deducaoInstrucao: 0,
    deducaoInstrucaoRecorrencia: TipoRecorrencia.Anual,
    mesPLR: Meses.Abril,
    vlPLR: 5000,
    vigenciaAno: toAno(2026),
    vigenciaMes: Meses.Janeiro
});


console.log(`Bruto Mensal: ${salarioBruto.toBRL()}`);
console.log(`Bruto Anual: ${resultadoAnual.vlBrutoTotal.toBRL()}`);
console.log(`INSS Anual: ${resultadoAnual.vlImpostoInssTotal.toBRL()}`);
console.log(`IRPF Anual: ${resultadoAnual.vlImpostoIrpfTotal.toBRL()}`);
console.log(`Líquido Anual: ${resultadoAnual.vlLiquidoTotal.toBRL()}`);
console.log(`Aliquota Efetiva: ${resultadoAnual.pAliquotaEfetivaTotal.toPercent()}`);
console.log(`Imposto Anual: ${resultadoAnual.vlImpostoTotal.toBRL()}`);

for (let mes of resultadoAnual.meses) {
    console.log(`Mês ${toMes(mes.numeroMes)} (${mes.numeroMes}):`);
    console.log(`  Salário Bruto: ${mes.vlSalarioBruto.toBRL()}`);
    console.log(`  INSS: ${mes.inss.vlImposto.toBRL()}`);
    console.log(`  Base de calculo IRPF: ${mes.irpf.vlBaseDeCalculo.toBRL()}`);
    console.log(`  IRPF: ${mes.irpf.vlImposto.toBRL()}`);
    if (!!mes.irpfPLR) {
        console.log(`  Base de calculo IRPF PLR: ${(mes.irpfPLR?.vlBaseDeCalculo ?? 0).toBRL()}`);
        console.log(`  IRPF PLR: ${(mes.irpfPLR?.vlImposto ?? 0).toBRL()}`);
    }
    console.log(`  Salário Líquido: ${mes.vlSalarioLiquido.toBRL()}`);
}
```

## 🛠️ Estrutura de Dados

### Imposto
Tanto o INSS quanto o IRPF retornam uma interface detalhada:
- `vlImposto`: O valor final a ser pago.
- `vlLiquido`: O valor liquido apos o desconto do imposto sebre o valor bruto.
- `aliquotaEfetiva`: A porcentagem real paga sobre o bruto.
- `faixas`: Detalhamento de quanto foi cobrado em cada faixa da tabela progressiva.
> Para demais propriedades, consultar a interface Imposto na documentação de api em https://salgueiroso.github.io/impostos-brasil/interfaces/Imposto.html

## 📅 Vigências Suportadas

A biblioteca mantém um registro de tabelas históricas em `src/values.ts`. Você pode consultar ou passar mapas personalizados de alíquotas se necessário.

### As constantes com os mapas de faixas são as seguintes:
- `vigenciaFaixasInss`
- `vigenciaFaixasIrpf`
- `vigenciaFaixasIrpfPLR`

## ⚖️ Aviso Legal e Isenção de Responsabilidade

Esta ferramenta é fornecida apenas para fins informativos e de simulação. Os cálculos gerados por esta biblioteca **não devem ser utilizados para fins legais, contábeis ou oficiais**. 

Os resultados podem variar dependendo de interpretações específicas da legislação, benefícios variáveis ou convenções coletivas de trabalho. Para cálculos legalmente válidos, emissão de guias ou conformidade com a Receita Federal e eSocial, você deve sempre utilizar sistemas oficiais ou consultar um **profissional contador habilitado**.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

---
Desenvolvido por Acacio Salgueiro
