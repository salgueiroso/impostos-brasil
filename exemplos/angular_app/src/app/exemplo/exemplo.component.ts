import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, computed, effect, ElementRef, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { calcularSerie, Ferias, getAnoMinimo, ImpostoAcumulado, Meses, TipoRecorrencia, toMes } from 'impostos-brasil';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { map } from 'rxjs';

@Component({
  selector: 'exemplo-component',
  imports: [ReactiveFormsModule, NgxMaskDirective, CurrencyPipe, PercentPipe],
  providers: [provideNgxMask()],
  templateUrl: './exemplo.component.html',
  styleUrl: './exemplo.component.scss',
})
export class ExemploComponent {

  readonly tiposFerias = signal(
    Object.entries(Ferias).map(([label, value]) => ({ label, value }))
  );

  readonly tiposRecorrencia = signal(
    Object.entries(TipoRecorrencia).map(([label, value]) => ({ label, value }))
  );

  readonly meses = signal(
    Object.entries(Meses)
      .filter(([key]) => isNaN(Number(key)))
      .map(([label, value]) => ({ label, value: value as number }))
  );

  // Signal da data atual — base para valores iniciais do formulário
  private readonly dataAtual = signal(new Date());



  // Valores computados a partir da data
  private readonly anoAtual = computed(() => this.dataAtual().getFullYear());
  private readonly mesAtual = computed(() => toMes(this.dataAtual().getMonth()));


  readonly formulario = new FormGroup({
    salarioBrutoMensal: new FormControl(1621, [Validators.required, Validators.min(1)]),
    quantidadeMeses: new FormControl(12, [Validators.required, Validators.min(1)]),
    incluir13: new FormControl(true),
    incluirFerias: new FormControl(Ferias.Sim, [Validators.required]),
    percentualFerias: new FormControl(33.33, [Validators.min(0), Validators.max(100)]),
    mesFerias: new FormControl(Meses.Setembro, [Validators.required]),
    deducaoSaude: new FormControl('', [Validators.min(0)]),
    deducaoSaudeRecorrencia: new FormControl(TipoRecorrencia.Anual, [Validators.required]),
    deducaoInstrucao: new FormControl('', [Validators.min(0)]),
    deducaoInstrucaoRecorrencia: new FormControl(TipoRecorrencia.Anual, [Validators.required]),
    mesPLR: new FormControl(Meses.Abril, [Validators.required]),
    vlPLR: new FormControl('', [Validators.min(0)]),
    vigenciaAno: new FormControl(this.anoAtual(), [Validators.required, Validators.min(getAnoMinimo())]),
    vigenciaMes: new FormControl(this.mesAtual(), [Validators.required]),
    usarDescontoSimplificadoIRPF: new FormControl(false)
  });

  readonly formularioValido = toSignal(
    this.formulario.statusChanges.pipe(map(status => status === 'VALID')),
    { initialValue: this.formulario.valid }
  );

  readonly anoMinimo = signal(getAnoMinimo());


  readonly resultado = signal<ImpostoAcumulado | null>(null);

  resultadoRef = viewChild<ElementRef>('resultadoRef');

  constructor() {
    effect(() => {
      if (this.resultado()) {

        // console.log(this.resultado()?.meses);
        setTimeout(() => {
          this.resultadoRef()?.nativeElement.scrollIntoView({ behavior: 'smooth' });
        });
      }
    });
  }

  calcular() {

    const v = this.formulario.value;

    const vlBruto = Number(v.salarioBrutoMensal ?? 0);
    const qtdSeries = Number(v.quantidadeMeses ?? 0);
    const incluir13 = v.incluir13 ?? false;
    const incluirFerias = (v.incluirFerias ?? Ferias.Sim) as Ferias;
    const percentualFerias = Number(v.percentualFerias ?? 0) / 100;
    const mesFerias = Number(v.mesFerias ?? 0) as Meses;
    const deducaoSaude = Number(v.deducaoSaude ?? 0);
    const deducaoSaudeRecorrencia = v.deducaoSaudeRecorrencia ?? TipoRecorrencia.Anual;
    const deducaoInstrucao = Number(v.deducaoInstrucao ?? 0);
    const deducaoInstrucaoRecorrencia = v.deducaoInstrucaoRecorrencia ?? TipoRecorrencia.Anual;
    const mesPLR = Number(v.mesPLR ?? 0) as Meses;
    const vlPLR = Number(v.vlPLR ?? 0);
    const vigenciaAno = Number(v.vigenciaAno ?? this.anoAtual());
    const vigenciaMes = Number(v.vigenciaMes ?? this.mesAtual()) as Meses;
    const usarDescontoSimplificadoIRPF = v.usarDescontoSimplificadoIRPF ?? true;


    try {
      this.resultado.set(calcularSerie({
        vlBruto,
        qtdSeries,
        incluir13,
        incluirFerias,
        percentualFerias,
        mesFerias,
        deducaoSaude,
        deducaoSaudeRecorrencia,
        deducaoInstrucao,
        deducaoInstrucaoRecorrencia,
        mesPLR,
        vlPLR,
        vigenciaAno,
        vigenciaMes,
        usarDescontoSimplificadoIRPF
      }));
    } catch (e) {
      alert(e);
    }
  }

  scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
