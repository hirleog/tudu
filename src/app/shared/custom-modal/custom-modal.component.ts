// shared/components/custom-modal/custom-modal.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-modal',
  standalone: false, // ← Importante: não standalone para funcionar com modules
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.css'], // opcional
})
export class CustomModalComponent {
  @Input() modalId = 'customModal';
  @Input() title = 'Aviso';
  @Input() message = '';
  @Input() closeButtonText = 'Fechar';
  @Input() paymentMethod: 'pix' | 'credit' | null = null;
  @Input() errorDetails: any = null;

  @Output() modalClosed = new EventEmitter<void>();
  showModal = false;

  // Propriedades para configuração dinâmica
  modalIcon: string = 'fa-check';
  modalIconColor: string = 'text-green-600';
  modalBgColor: string = 'bg-green-100';
  messageTitle: string = 'Pagamento Aprovado!';
  messageBody: string = 'Seu pagamento foi processado com sucesso.';

  openModal(): void {
    this.showModal = true;
    // this.resetForm();
  }

  configureModal(success: boolean, message: string = ''): void {
    if (success) {
      this.setSuccessStyles(message);
    } else {
      this.setErrorStyles(message);
    }
  }

  private setSuccessStyles(message: string): void {
    this.modalIcon = 'fa-check';
    this.modalIconColor = 'text-green-600';
    this.modalBgColor = 'bg-green-100';
    this.messageTitle = 'Sucesso!';
    this.messageBody = message || 'Operação realizada com sucesso.';
  }

  private setErrorStyles(message: string): void {
    this.modalIcon = 'fa-exclamation-triangle';
    this.modalIconColor = 'text-red-600';
    this.modalBgColor = 'bg-red-100';
    this.messageTitle = 'Erro';
    this.messageBody = message || 'Ocorreu um erro na operação.';
  }

  closeModal(): void {
    this.showModal = false;
    this.modalClosed.emit();
  }

  // Métodos públicos para controle externo
  open(
    success: boolean,
    message: string = '',
    paymentMethod?: 'pix' | 'credit'
  ): void {
    this.configureModal(success, message);
    if (paymentMethod) {
      this.paymentMethod = paymentMethod;
    }
    this.showModal = true;
  }
}
