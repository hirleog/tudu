import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCurrencyFormat]',
})
export class CurrencyFormatDirective {
  private locale = 'pt-BR'; // Define o formato local para reais

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    let input = event.target as HTMLInputElement;
    let cursorPosition = input.selectionStart || 0; // Captura a posição do cursor

    // Remove tudo que não for número
    let numericValue = input.value.replace(/\D/g, '');

    if (!numericValue) {
      input.value = '';
      return;
    }

    // Converte para número e aplica formatação
    let formattedValue = new Intl.NumberFormat(this.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseInt(numericValue, 10) / 100);

    // Ajusta o valor para que o cursor se posicione corretamente
    input.value = formattedValue;

    // Corrige a posição do cursor
    setTimeout(() => {
      let newCursorPosition = cursorPosition;
      const formattedValueLength = formattedValue.length;

      // Ajuste para garantir que o cursor não vá além do número
      if (cursorPosition > formattedValueLength) {
        newCursorPosition = formattedValueLength;
      }

      input.setSelectionRange(newCursorPosition, newCursorPosition); // Reposiciona o cursor corretamente
    }, 0);
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value: string) {
    if (!value) {
      this.el.nativeElement.value = '0,00'; // Formato de saída quando o campo perde o foco
    }
  }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value: string) {
    if (value === '0,00') {
      this.el.nativeElement.value = ''; // Limpa o campo quando ele recebe foco
    }
  }
}
