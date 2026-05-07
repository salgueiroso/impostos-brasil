# impostos-brasil

[![Package](https://github.com/salgueiroso/impostos-brasil/actions/workflows/package.yaml/badge.svg)](https://github.com/salgueiroso/impostos-brasil/actions/workflows/package.yaml)
[![codecov](https://codecov.io/gh/salgueiroso/impostos-brasil/graph/badge.svg?token=LYJEY4ZYUT)](https://codecov.io/gh/salgueiroso/impostos-brasil)
[![License](https://badgen.net/github/license/salgueiroso/impostos-brasil)](https://github.com/salgueiroso/impostos-brasil/blob/main/LICENSE)

Uma biblioteca TypeScript robusta e fácil de usar para calcular impostos sobre a folha de pagamento (CLT) no Brasil, incluindo INSS, IRPF e PLR.

## 🎯 Propósito

O objetivo desta biblioteca é simplificar o cálculo complexo dos principais impostos brasileiros no contexto do pagador de impostos, que envolvem faixas progressivas, deduções específicas e variações temporais de alíquotas. Ela é ideal para sistemas de RH, calculadoras financeiras ou qualquer aplicação que precise simular o salário líquido e encargos de um trabalhador.

### ✨ Diferenciais

- **Cálculo Progressivo:** Implementação precisa do cálculo "fatiado" por faixas, conforme a legislação vigente.
- **Série Temporal Inteligente:** Projeção de múltiplos meses considerando 13º salário, regras de férias (período aquisitivo) e PLR.
- **Gestão de Vigências Cronológicas:** Utiliza um mapa especializado (`MapaChaveAnoMes`) para lidar com tabelas históricas de forma precisa, resolvendo problemas de comparação de objetos por referência.
- **Regras Modernas:** Suporte à nova lógica de isenção progressiva (isenção total até R$ 5.000 e desconto progressivo até R$ 7.350) e ao desconto simplificado do IRPF.
- **Extensões de Utilitários:** Métodos integrados ao tipo `Number` para formatação (`toBRL`, `toPercent`) e normalização de precisão financeira (`normalizarPrecisao`).
- **Deduções Flexíveis:** Suporte a deduções de saúde e instrução com recorrência mensal ou anual (com aplicação automática de limites legais).
- **Injeção de Tabelas:** Permite sobrepor as tabelas oficiais com mapas de alíquotas customizados para simulações específicas.
- **Suporte a Browser:** Disponível como bundle IIFE para uso direto no navegador.

## 🚀 Instalação

```bash
npm install impostos-brasil
```

> **Requisitos:** Node.js `>=22` e npm `>=10`.

## Links úteis
| Descrição | Link |
|---|---|
| **Repositório:** | https://github.com/salgueiroso/impostos-brasil |
| **Exemplo Angular:** | https://salgueiroso.github.io/impostos-brasil/angular_app |
| **Documentação da API:** | https://salgueiroso.github.io/impostos-brasil/ |
| **Pacote NPM:** | https://www.npmjs.com/package/impostos-brasil |


## 💻 Exemplos de Uso

### 1. Cálculo Simples de INSS

```typescript
import 'impostos-brasil'; // Importa as extensões de protótipo (toBRL, toPercent, normalizarPrecisao)
import { calcularINSS } from 'impostos-brasil';

const resultado = calcularINSS(5000);

console.log(`Valor do INSS: ${resultado.vlImposto.toBRL()}`);
console.log(`Alíquota Efetiva: ${resultado.aliquotaEfetiva.toPercent()}`);
console.log(`Líquido: ${resultado.vlLiquido.toBRL()}`);
```

Também é possível informar uma vigência específica ou uma base de cálculo diferente do bruto:

```typescript
import { calcularINSS, Meses, toAno } from 'impostos-brasil';

const resultado = calcularINSS(5000, {
    vlBaseDeCalculo: 4800,   // opcional: base diferente do bruto
    vigenciaAno: toAno(2025),
    vigenciaMes: Meses.Janeiro
});
```

### 2. Cálculo de IRPF

O segundo parâmetro é um objeto de opções. Todos os campos são opcionais.

```typescript
import { calcularIRPF, Meses, toAno } from 'impostos-brasil';

const salarioBruto = 5000;
const baseCalculo = 4450; // Ex: Salário - INSS

const resultado = calcularIRPF(salarioBruto, {
    vlBaseDeCalculo: baseCalculo,
    usarIsencao5k7k: true,        // padrão: true
    vigenciaAno: toAno(2025),
    vigenciaMes: Meses.Janeiro
});

console.log(`Imposto Retido: ${resultado.vlImposto.toBRL()}`);
console.log(`Salário Líquido: ${resultado.vlLiquido.toBRL()}`);
```

> **Atenção:** `vlBaseDeCalculo` não pode ser maior que `vlBruto` — a função lançará `ParametroInvalido` nesse caso.

### 3. Simulação de Série Anual (Cenário Completo)

A função `calcularSerie` projeta o ganho de um período completo, incluindo variáveis como férias, 13º salário e PLR.

```typescript
import {
    calcularSerie,
    Ferias,
    Meses,
    TipoRecorrencia,
    toAno
} from 'impostos-brasil';

const salarioBruto = 8000;

const resultadoAnual = calcularSerie({
    qtdSeries: 12,
    vlBruto: salarioBruto,
    incluir13: true,
    incluirFerias: Ferias.IgnorarPrimeiroAno,
    mesFerias: Meses.Setembro,
    percentualFerias: 1 / 3,                          // padrão: 1/3 constitucional
    deducaoSaude: 0,
    deducaoSaudeRecorrencia: TipoRecorrencia.Mensal,
    deducaoInstrucao: 0,
    deducaoInstrucaoRecorrencia: TipoRecorrencia.Anual,
    mesPLR: Meses.Abril,
    vlPLR: 5000,
    vigenciaAno: toAno(2025),
    vigenciaMes: Meses.Novembro,
    usarDescontoSimplificadoIRPF: false               // padrão: false
});

console.log(`Bruto Mensal: ${salarioBruto.toBRL()}`);
console.log(`Bruto Período: ${resultadoAnual.vlBrutoTotal.toBRL()}`);
console.log(`INSS Período: ${resultadoAnual.vlImpostoInssTotal.toBRL()}`);
console.log(`IRPF Período: ${resultadoAnual.vlImpostoIrpfTotal.toBRL()}`);
console.log(`Líquido Período: ${resultadoAnual.vlLiquidoTotal.toBRL()}`);
console.log(`Alíquota Efetiva: ${resultadoAnual.pAliquotaEfetivaTotal.toPercent()}`);
console.log(`Imposto Período: ${resultadoAnual.vlImpostoTotal.toBRL()}`);

for (const mes of resultadoAnual.meses) {
    console.log(`Mês ${Meses[mes.anoMes.Mes]} (${mes.indice}):`);
    console.log(`  Informações: ${mes.informacoesAdicionais.join(', ')}`);
    console.log(`  Salário Bruto: ${mes.vlBruto.toBRL()}`);
    console.log(`  INSS: ${mes.inss.vlImposto.toBRL()}`);
    console.log(`  Base de cálculo IRPF: ${mes.irpf.vlBaseDeCalculo.toBRL()}`);
    console.log(`  IRPF: ${mes.irpf.vlImposto.toBRL()}`);
    if (mes.irpfPLR) {
        console.log(`  Base de cálculo IRPF PLR: ${(mes.irpfPLR?.vlBaseDeCalculo ?? 0).toBRL()}`);
        console.log(`  IRPF PLR: ${(mes.irpfPLR?.vlImposto ?? 0).toBRL()}`);
    }
    console.log(`  Salário Líquido: ${mes.vlLiquido.toBRL()}`);
}
```

## 🛠️ Estrutura de Dados

### `Imposto`

Retornado por `calcularINSS` e `calcularIRPF`:

| Propriedade | Tipo | Descrição |
|---|---|---|
| `vlImposto` | `number` | Valor final a ser retido. |
| `vlLiquido` | `number` | Valor líquido após o desconto do imposto. |
| `vlBruto` | `number` | Valor bruto de referência utilizado no cálculo. |
| `vlBaseDeCalculo` | `number` | Montante que efetivamente sofreu a tributação. |
| `aliquotaEfetiva` | `number` | Percentual real pago sobre o bruto (`vlImposto / vlBruto`). |
| `faixas` | `DeducaoFaixa[]` | Detalhamento de quanto foi cobrado em cada faixa progressiva. |

> Para todas as propriedades, consulte a interface `Imposto` na [documentação da API](https://salgueiroso.github.io/impostos-brasil/interfaces/Imposto.html).

### `ImpostoAcumulado`

Retornado por `calcularSerie`:

| Propriedade | Tipo | Descrição |
|---|---|---|
| `meses` | `DadosDoMes[]` | Detalhamento individual de cada mês processado. |
| `vlBrutoTotal` | `number` | Somatório de todos os rendimentos brutos do período. |
| `vlLiquidoTotal` | `number` | Somatório dos rendimentos líquidos do período. |
| `vlImpostoTotal` | `number` | Total retido (INSS + IRPF + IRPF PLR). |
| `vlImpostoInssTotal` | `number` | Total retido de INSS. |
| `vlImpostoIrpfTotal` | `number` | Total retido de IRPF mensal. |
| `vlImpostoIrpfPLRTotal` | `number` | Total retido de imposto sobre PLR. |
| `vlDeducoesTotal` | `number` | Somatório de todas as deduções no período. |
| `pAliquotaInssEfetiva` | `number` | Alíquota efetiva média do INSS. |
| `pAliquotaIrpfEfetiva` | `number` | Alíquota efetiva média do IRPF mensal. |
| `pAliquotaIrpfPLREfetiva` | `number` | Alíquota efetiva média do imposto sobre PLR. |
| `pAliquotaEfetivaTotal` | `number` | Carga tributária real total do período. |

### `OpcoesSerie`

Parâmetro de `calcularSerie`:

| Propriedade | Tipo | Padrão | Descrição |
|---|---|---|---|
| `vlBruto` | `number` | — | **(obrigatório)** Salário bruto mensal base. |
| `qtdSeries` | `number` | `12` | Quantidade de meses a simular. |
| `incluir13` | `boolean` | `false` | Inclui o cálculo do 13º salário em dezembro. |
| `incluirFerias` | `Ferias` | `Ferias.Nao` | Modo de aplicação das férias. |
| `percentualFerias` | `number` | `1/3` | Adicional de férias (1/3 constitucional por padrão). |
| `mesFerias` | `Meses` | mês atual | Mês em que as férias são aplicadas. |
| `deducaoSaude` | `number` | `0` | Valor das despesas de saúde a deduzir. |
| `deducaoSaudeRecorrencia` | `TipoRecorrencia` | `Anual` | Se o valor de saúde é mensal ou anual. |
| `deducaoInstrucao` | `number` | `0` | Valor das despesas com instrução (limitado ao teto legal). |
| `deducaoInstrucaoRecorrencia` | `TipoRecorrencia` | `Anual` | Se o valor de instrução é mensal ou anual. |
| `vlPLR` | `number` | `0` | Valor bruto da PLR. |
| `mesPLR` | `Meses` | mês atual | Mês em que a PLR é provisionada. |
| `vigenciaAno` | `Ano` | ano atual | Ano inicial para seleção das tabelas tributárias. |
| `vigenciaMes` | `Meses` | mês atual | Mês inicial para seleção das tabelas tributárias. |
| `usarDescontoSimplificadoIRPF` | `boolean` | `false` | Aplica o desconto simplificado do IRPF como dedução. |
| `mapasDeFaixas` | `OpcoesMapasFaixas \| null` | `null` | Tabelas customizadas de faixas (alternativa à vigência). |

## 📅 Vigências Suportadas

A biblioteca utiliza tabelas de alíquotas oficiais persistidas em arquivos JSON, permitindo que o motor de cálculo selecione a regra tributária exata de acordo com o ano e mês da simulação.

As constantes com os mapas de vigência exportados são:

| Constante | Tipo | Descrição |
|---|---|---|
| `vigenciaFaixasInss` | `MapaChaveAnoMes<AliquotasTetoFaixas>` | Tabelas progressivas do INSS por competência. |
| `vigenciaFaixasIrpf` | `MapaChaveAnoMes<AliquotasTetoFaixas>` | Tabelas progressivas do IRPF mensal por competência. |
| `vigenciaFaixasIrpfPLR` | `MapaChaveAnoMes<AliquotasTetoFaixas>` | Tabelas progressivas do IRPF sobre PLR por competência. |
| `vigenciaIrpfDescontoSimplificado` | `MapaChaveAnoMes<number>` | Valores vigentes do desconto simplificado do IRPF. |

Você pode consultar os anos cobertos programaticamente:

```typescript
import { vigenciaFaixasIrpf } from 'impostos-brasil';

const anosCobertos = Array.from(vigenciaFaixasIrpf.anos());
```

## 🔧 Enumerações e Utilitários

### Enumerações exportadas

```typescript
import { Meses, Ferias, TipoRecorrencia } from 'impostos-brasil';

// Meses: Janeiro = 1, Fevereiro = 2, ..., Dezembro = 12
// Ferias: Nao | Sim | IgnorarPrimeiroAno
// TipoRecorrencia: Mensal | Anual
```

### Funções utilitárias

```typescript
import { toAno, toMes, getAnoMinimo } from 'impostos-brasil';

toAno(2025);          // Converte number para o tipo Ano
toMes(0);             // Converte índice base-0 (getMonth()) para Meses (Janeiro)
getAnoMinimo();       // Retorna o ano mínimo suportado pelas tabelas carregadas
```

### Extensões de `Number`

Ao importar a biblioteca, os seguintes métodos são adicionados ao protótipo de `Number`:

```typescript
import 'impostos-brasil';

(1250.5).toBRL();              // → "R$ 1.250,50"
(0.075).toPercent();           // → "7,5%"
(1.0050000000001).normalizarPrecisao(); // elimina erros de ponto flutuante
```

As funções equivalentes também são exportadas como standalone: `toBRL(value)`, `toPercent(value)`.

## 📦 Formatos de Distribuição

| Formato | Arquivo | Uso |
|---|---|---|
| ESM | `dist/index.mjs` | Bundlers modernos (Vite, Webpack, etc.) |
| CJS | `dist/index.cjs` | Node.js (`require`) |
| IIFE | `dist/index.iife.js` | Browser via `<script>` |
| Types (ESM) | `dist/index.d.mts` | TypeScript com ESM |
| Types (CJS) | `dist/index.d.cts` | TypeScript com CJS |

## 🖥️ Exemplo com Angular

O diretório `exemplos/angular_app` contém uma aplicação Angular 21 que demonstra o uso completo da biblioteca em um formulário reativo com:

- Cálculo de série temporal configurável.
- Suporte a férias, 13º salário e PLR.
- Deduções de saúde e instrução com seleção de recorrência.
- Opção de desconto simplificado no IRPF.
- Exibição de resultados consolidados e detalhamento mês a mês.

Para rodar o exemplo:

```bash
cd exemplos/angular_app
npm install
npm start
```

## 🧪 Testes

```bash
cd pacote
npm test
```

Os testes cobrem `calcularINSS`, `calcularIRPF`, `calcularSerie` e todos os utilitários de alíquotas, datas, formatações e JSON.

## 🚀 Roadmap
- [x] Calculo do 13 proporcional ao periodo trabalhado
- [x] Calculo do IRPF considerando o deconto simplificado
- [ ] Inclusão de novos exemplos


## ⚖️ Aviso Legal e Isenção de Responsabilidade

Esta ferramenta é fornecida apenas para fins informativos e de simulação. Os cálculos gerados por esta biblioteca **não devem ser utilizados para fins legais, contábeis ou oficiais**.

Os resultados podem variar dependendo de interpretações específicas da legislação, benefícios variáveis ou convenções coletivas de trabalho. Para cálculos legalmente válidos, emissão de guias ou conformidade com a Receita Federal e eSocial, você deve sempre utilizar sistemas oficiais ou consultar um **profissional contador habilitado**.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para detalhes.

---
Desenvolvido por Acacio Salgueiro
