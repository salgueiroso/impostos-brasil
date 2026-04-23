# impostos-brasil

[![Package](https://github.com/salgueiroso/impostos-brasil/actions/workflows/package.yaml/badge.svg)](https://github.com/salgueiroso/impostos-brasil/actions/workflows/package.yaml)
[![codecov](https://codecov.io/gh/salgueiroso/impostos-brasil/graph/badge.svg?token=LYJEY4ZYUT)](https://codecov.io/gh/salgueiroso/impostos-brasil)

Uma biblioteca TypeScript robusta e fácil de usar para calcular impostos sobre a folha de pagamento (CLT) no Brasil, incluindo INSS, IRPF e PLR.

## 🎯 Propósito

O objetivo desta biblioteca é simplificar o cálculo complexo de impostos brasileiros, que envolvem faixas progressivas, deduções específicas e variações temporais de alíquotas. Ela é ideal para sistemas de RH, calculadoras financeiras ou qualquer aplicação que precise simular o salário líquido e encargos de um trabalhador.

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

console.log(`Valor do INSS: R$ ${resultado.vlImposto}`);
console.log(`Alíquota Efetiva: ${(resultado.aliquotaEfetiva * 100).toFixed(2)}%`);
```

### 2. Cálculo de IRPF

Para o IRPF, é necessário informar a base de cálculo (geralmente o salário bruto menos o INSS e outras deduções).

```typescript
import { calcularIRPF } from 'impostos-brasil';

const salarioBruto = 5000;
const baseCalculo = 4450; // Ex: Salário - INSS

const resultado = calcularIRPF(salarioBruto, baseCalculo, true);

console.log(`Imposto Retido: R$ ${resultado.vlImposto}`);
```

### 3. Simulação de Série Anual (Cenário Completo)

A função `simulacaoSerie` permite projetar o ganho anual completo, incluindo variáveis como férias e 13º salário.

```typescript
import { simulacaoSerie } from 'impostos-brasil';
import { TipoRecorrencia, Meses } from 'impostos-brasil/types';

const resultadoAnual = simulacaoSerie({
    vlBrutoMensal: 10000,
    incluir13: true,
    incluirFerias: true,
    mesDasFerias: Meses.Junho,
    deducaoSaude: 200,
    deducaoSaudeTipo: TipoRecorrencia.Mensal,
    vlPLR: 5000,
    mesPLR: Meses.Abril,
    vigenciaAno: 2026,
    vigenciaMes: 1
});

console.log(`Total Bruto Anual: R$ ${resultadoAnual.vlBrutoTotal}`);
console.log(`Total Líquido Anual: R$ ${resultadoAnual.vlLiquidoTotal}`);
console.log(`Total de Impostos: R$ ${resultadoAnual.vlImpostoTotal}`);
```

## 🛠️ Estrutura de Dados

### Imposto
Tanto o INSS quanto o IRPF retornam uma interface detalhada:
- `vlImposto`: O valor final a ser pago.
- `aliquotaEfetiva`: A porcentagem real paga sobre o bruto.
- `faixas`: Detalhamento de quanto foi cobrado em cada faixa da tabela progressiva.

## 📅 Vigências Suportadas

A biblioteca mantém um registro de tabelas históricas em `src/values.ts`. Você pode consultar ou passar mapas personalizados de alíquotas se necessário.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

---
Desenvolvido por Acacio Salgueiro
