# impostos-brasil

[![Package](https://github.com/salgueiroso/impostos-brasil/actions/workflows/package.yaml/badge.svg)](https://github.com/salgueiroso/impostos-brasil/actions/workflows/package.yaml)
[![codecov](https://codecov.io/gh/salgueiroso/impostos-brasil/graph/badge.svg?token=LYJEY4ZYUT)](https://codecov.io/gh/salgueiroso/impostos-brasil)
[![License](https://badgen.net/github/license/salgueiroso/impostos-brasil)](https://github.com/salgueiroso/impostos-brasil/blob/main/LICENSE)

Uma biblioteca TypeScript robusta e fácil de usar para calcular impostos sobre a folha de pagamento (CLT) no Brasil, incluindo INSS, IRPF e PLR.

## 🎯 Propósito

O objetivo desta biblioteca é simplificar o cálculo complexo dos principais impostos brasileiros no contexto do pagador de impostos, que envolvem faixas progressivas, deduções específicas e variações temporais de alíquotas. Ela é ideal para sistemas de RH, calculadoras financeiras ou qualquer aplicação que precise simular o salário líquido e encargos de um trabalhador.

### ✨ Diferenciais
*   **Cálculo Progressivo:** Implementação precisa do cálculo "fatiado" por faixas, conforme a legislação vigente.
*   **Série Temporal Inteligente:** Projeção de múltiplos meses considerando 13º salário, regras de férias (período aquisitivo) e PLR.
*   **Gestão de Vigências Cronológicas:** Utiliza um mapa especializado (`MapaChaveAnoMes`) para lidar com tabelas históricas de forma precisa, resolvendo problemas de comparação de objetos por referência.
*   **Regras Modernas:** Suporte à nova lógica de isenção progressiva (Isenção de R$ 5k e desconto progressivo até R$ 7.350).
*   **Extensões de Utilitários:** Métodos integrados ao tipo `Number` para formatação (`toBRL`, `toPercent`) e normalização de precisão financeira.
*   **Deduções Flexíveis:** Suporte a deduções de saúde e instrução com recorrência mensal ou anual (com aplicação automática de limites legais).
*   **Injeção de Tabelas:** Permite sobrepor as tabelas oficiais com mapas de alíquotas customizados para simulações específicas.

## 🚀 Instalação

```bash
npm install impostos-brasil
```

## 📚 Documentação da API
- https://salgueiroso.github.io/impostos-brasil/

## 💻 Exemplos de Uso

### 1. Cálculo Simples de INSS

```typescript
import 'impostos-brasil'; // Importa as extensões de protótipo
import { calcularINSS } from 'impostos-brasil';

const resultado = calcularINSS(5000);

console.log(`Valor do INSS: ${resultado.vlImposto.toBRL()}`);
console.log(`Alíquota Efetiva: ${resultado.aliquotaEfetiva.toPercent()}`);
console.log(`Líquido: ${resultado.vlLiquido.toBRL()}`);
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
/** Valor base do salário bruto para a simulação */
const salarioBruto = 8000;
/** Define se o cálculo deve considerar o pagamento do 13º salário */
const incluir13 = true;

/** 
 * Objeto contendo o consolidado do período (totais) e o 
 * detalhamento individual de cada mês processado.
 */
const resultadoAnual = calcularSerie({
    qtdSeries: 12,
    vlBruto: salarioBruto,
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


console.log(`Bruto Mensal: ${salarioBruto.toBRL()}`);
console.log(`Bruto Periodo: ${resultadoAnual.vlBrutoTotal.toBRL()}`);
console.log(`INSS Periodo: ${resultadoAnual.vlImpostoInssTotal.toBRL()}`);
console.log(`IRPF Periodo: ${resultadoAnual.vlImpostoIrpfTotal.toBRL()}`);
console.log(`Líquido Periodo: ${resultadoAnual.vlLiquidoTotal.toBRL()}`);
console.log(`Aliquota Efetiva: ${resultadoAnual.pAliquotaEfetivaTotal.toPercent()}`);
console.log(`Imposto Periodo: ${resultadoAnual.vlImpostoTotal.toBRL()}`);

for (let mes of resultadoAnual.meses) {
    console.log(`Mês ${Meses[mes.mes]} (${mes.indice}):`);
    console.log(`  Informacoes: ${mes.informacoesAdicionais.join(', ')}`);
    console.log(`  Salário Bruto: ${mes.vlBruto.toBRL()}`);
    console.log(`  INSS: ${mes.inss.vlImposto.toBRL()}`);
    console.log(`  Base de calculo IRPF: ${mes.irpf.vlBaseDeCalculo.toBRL()}`);
    console.log(`  IRPF: ${mes.irpf.vlImposto.toBRL()}`);
    if (!!mes.irpfPLR) {
        console.log(`  Base de calculo IRPF PLR: ${(mes.irpfPLR?.vlBaseDeCalculo ?? 0).toBRL()}`);
        console.log(`  IRPF PLR: ${(mes.irpfPLR?.vlImposto ?? 0).toBRL()}`);
    }
    console.log(`  Salário Líquido: ${mes.vlLiquido.toBRL()}`);
}
```

## 🛠️ Estrutura de Dados

### Imposto
Tanto o INSS quanto o IRPF retornam uma interface detalhada:
- `vlImposto`: O valor final a ser pago.
- `vlLiquido`: O valor líquido após o desconto do imposto sobre o valor bruto.
- `aliquotaEfetiva`: A porcentagem real paga sobre o bruto.
- `faixas`: Detalhamento de quanto foi cobrado em cada faixa da tabela progressiva.
> Para demais propriedades, consultar a interface Imposto na documentação de api em https://salgueiroso.github.io/impostos-brasil/interfaces/Imposto.html

## 📅 Vigências Suportadas

A biblioteca utiliza tabelas de alíquotas oficiais persistidas em arquivos JSON, permitindo que o motor de cálculo selecione a regra tributária exata de acordo com o ano e mês da simulação.

### As constantes com os mapas de vigência são as seguintes:
- `vigenciaFaixasInss`
- `vigenciaFaixasIrpf`
- `vigenciaFaixasIrpfPLR`
- `vigenciaIrpfDescontoSimplificado`

### Constantes de Vigência:
Você pode consultar os mapas carregados ou verificar os anos disponíveis programaticamente:
```typescript
import { vigenciaFaixasIrpf } from 'impostos-brasil';

// Lista todos os anos civis que possuem tabelas cadastradas
const anosCobertos = Array.from(vigenciaFaixasIrpf.anos());
```

As constantes exportadas são: `vigenciaFaixasInss`, `vigenciaFaixasIrpf` e `vigenciaFaixasIrpfPLR`.

## ⚖️ Aviso Legal e Isenção de Responsabilidade

Esta ferramenta é fornecida apenas para fins informativos e de simulação. Os cálculos gerados por esta biblioteca **não devem ser utilizados para fins legais, contábeis ou oficiais**. 

Os resultados podem variar dependendo de interpretações específicas da legislação, benefícios variáveis ou convenções coletivas de trabalho. Para cálculos legalmente válidos, emissão de guias ou conformidade com a Receita Federal e eSocial, você deve sempre utilizar sistemas oficiais ou consultar um **profissional contador habilitado**.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

---
Desenvolvido por Acacio Salgueiro
