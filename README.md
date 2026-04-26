# impostos-brasil

[![Package](https://github.com/salgueiroso/impostos-brasil/actions/workflows/package.yaml/badge.svg)](https://github.com/salgueiroso/impostos-brasil/actions/workflows/package.yaml)
[![codecov](https://codecov.io/gh/salgueiroso/impostos-brasil/graph/badge.svg?token=LYJEY4ZYUT)](https://codecov.io/gh/salgueiroso/impostos-brasil)
[![License](https://badgen.net/github/license/salgueiroso/impostos-brasil)](https://github.com/salgueiroso/impostos-brasil/blob/main/LICENSE)

Uma biblioteca TypeScript robusta e fácil de usar para calcular impostos sobre a folha de pagamento (CLT) no Brasil, incluindo INSS, IRPF e PLR.

## 🎯 Propósito

O objetivo desta biblioteca é simplificar o cálculo complexo dos principais impostos brasileiros no contexto do pagador de impostos, que envolvem faixas progressivas, deduções específicas e variações temporais de alíquotas. Ela é ideal para sistemas de RH, calculadoras financeiras ou qualquer aplicação que precise simular o salário líquido e encargos de um trabalhador.

### ✨ Diferenciais
*   **Cálculo Progressivo:** Implementação precisa do cálculo "fatiado" por faixas, conforme a legislação vigente.
*   **Série Temporal:** Simulação completa de 12 meses (ou mais) considerando 13º salário, terço de férias e PLR.
*   **Gestão de Vigências:** Base de dados histórica (JSON) que permite calcular impostos retroativos ou futuros de acordo com a tabela da época.
*   **Regras Modernas:** Suporte à nova lógica de isenção progressiva (Isenção de R$ 5k e desconto progressivo até R$ 7.350).

## 🚀 Instalação

```bash
npm install impostos-brasil
```

## 📚 Documentação da API
- https://salgueiroso.github.io/impostos-brasil/

## 💻 Exemplos de Uso

### 1. Cálculo Simples de INSS

```typescript
import { calcularINSS, toBRL, toPercent } from 'impostos-brasil';

const resultado = calcularINSS(5000);

console.log(`Valor do INSS: ${toBRL(resultado.vlImposto)}`);
console.log(`Alíquota Efetiva: ${toPercent(resultado.aliquotaEfetiva)}`);
console.log(`Líquido: ${toBRL(resultado.vlLiquido)}`);
```

### 2. Cálculo de IRPF

Para o IRPF, é necessário informar a base de cálculo (geralmente o salário bruto menos o INSS e outras deduções).

```typescript
import { calcularIRPF, toBRL, toPercent } from 'impostos-brasil';

const salarioBruto = 5000;
const baseCalculo = 4450; // Ex: Salário - INSS

const resultado = calcularIRPF(salarioBruto, baseCalculo, true);

console.log(`Imposto Retido: ${toBRL(resultado.vlImposto)}`);
console.log(`Salário Líquido: ${toBRL(resultado.vlLiquido)}`);
```

### 3. Simulação de Série Anual (Cenário Completo)

A função `calcularSerie` permite projetar o ganho anual completo, incluindo variáveis como férias e 13º salário.

```typescript
import { calcularSerie, Ferias, Meses, TipoRecorrencia,toAno, toBRL, toPercent } from 'impostos-brasil';
const salarioBruto = 10000;
const incluir13 = true;

const resultadoAnual = calcularSerie({
    qtdSeries: 12,
    vlBrutoMensal: salarioBruto,
    incluir13: incluir13,
    incluirFerias: Ferias.IgnorarPrimeiroAno,
    mesFerias: Meses.Setembro,
    deducaoSaude: 0,
    deducaoSaudeRecorrencia: TipoRecorrencia.Mensal,
    deducaoInstrucao: 0,
    deducaoInstrucaoRecorrencia: TipoRecorrencia.Anual,
    mesPLR: Meses.Abril,
    vlPLR: 5000,
    vigenciaAno: toAno(2025),
    vigenciaMes: Meses.Novembro
});


console.log(`Bruto Mensal: ${toBRL(salarioBruto)}`);
console.log(`Bruto Periodo: ${toBRL(resultadoAnual.vlBrutoTotal)}`);
console.log(`INSS Periodo: ${toBRL(resultadoAnual.vlImpostoInssTotal)}`);
console.log(`IRPF Periodo: ${toBRL(resultadoAnual.vlImpostoIrpfTotal)}`);
console.log(`Líquido Periodo: ${toBRL(resultadoAnual.vlLiquidoTotal)}`);
console.log(`Aliquota Efetiva: ${toPercent(resultadoAnual.pAliquotaEfetivaTotal)}`);
console.log(`Imposto Periodo: ${toBRL(resultadoAnual.vlImpostoTotal)}`);

for (let mes of resultadoAnual.meses) {
    console.log(`Mês ${Meses[mes.mes]} (${mes.indice}):`);
    console.log(`  Informacoes: ${mes.informacoesAdicionais}`);
    console.log(`  Salário Bruto: ${toBRL(mes.vlSalarioBruto)}`);
    console.log(`  INSS: ${toBRL(mes.inss.vlImposto)}`);
    console.log(`  Base de calculo IRPF: ${toBRL(mes.irpf.vlBaseDeCalculo)}`);
    console.log(`  IRPF: ${toBRL(mes.irpf.vlImposto)}`);
    if (!!mes.irpfPLR) {
        console.log(`  Base de calculo IRPF PLR: ${toBRL(mes.irpfPLR?.vlBaseDeCalculo ?? 0)}`);
        console.log(`  IRPF PLR: ${toBRL(mes.irpfPLR?.vlImposto ?? 0)}`);
    }
    console.log(`  Salário Líquido: ${toBRL(mes.vlSalarioLiquido)}`);
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
