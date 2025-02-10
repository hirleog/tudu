import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCurrencyFormat]',
})
export class CurrencyFormatDirective {
  private locale = 'pt-BR'; // Define o formato local para reais
  private currency = 'BRL';

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    let input = event.target as HTMLInputElement;
    let cursorPosition = input.selectionStart || 0; // Captura posição do cursor

    // Remove tudo que não for número
    let numericValue = input.value.replace(/\D/g, '');

    if (!numericValue) {
      input.value = '';
      return;
    }

    // Converte para número e aplica formatação
    let formattedValue = new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency: this.currency,
    }).format(parseInt(numericValue, 10) / 100);

    formattedValue = formattedValue.replace(/\s/g, ''); // Remove espaço entre "R$" e valor

    input.value = formattedValue;

    // Reposiciona o cursor corretamente
    setTimeout(() => {
      input.setSelectionRange(cursorPosition, cursorPosition);
    });
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value: string) {
    if (!value) {
      this.el.nativeElement.value = 'R$0,00';
    }
  }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value: string) {
    if (value === 'R$0,00') {
      this.el.nativeElement.value = '';
    }
  }
}
