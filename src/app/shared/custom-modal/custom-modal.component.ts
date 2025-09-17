import { Component, EventEmitter, Input, Output } from '@angular/core';

type ModalType = 'success' | 'error' | 'warning';

@Component({
  selector: 'app-custom-modal',
  standalone: false,
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.css'],
})
export class CustomModalComponent {
  @Input() modalId = 'customModal';
  @Input() title = 'Aviso';
  @Input() message = '';
  @Input() closeButtonText = 'Fechar';
  @Input() paymentMethod: 'pix' | 'credit' | null = null;
  @Input() errorDetails: any = null;

  @Output() modalClosed = new EventEmitter<void>();
  @Input() showModal = false;

  // Configuração dinâmica
  modalIcon: string = 'fa-check';
  modalIconColor: string = 'text-green-600';
  modalBgColor: string = 'bg-green-100';
  messageTitle: string = 'Pagamento Aprovado!';
  messageBody: string = 'Seu pagamento foi processado com sucesso.';

  openModal(): void {
    this.showModal = true;
  }

  configureModal(type: ModalType, message: string = ''): void {
    switch (type) {
      case 'success':
        this.setSuccessStyles(message);
        break;
      case 'error':
        this.setErrorStyles(message);
        break;
      case 'warning':
        this.setWarningStyles(message);
        break;
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

  private setWarningStyles(message: string): void {
    this.modalIcon = 'fa-exclamation-circle';
    this.modalIconColor = 'text-yellow-600';
    this.modalBgColor = 'bg-yellow-100';
    this.messageTitle = 'Atenção';
    this.messageBody =
      message || 'Verifique as informações antes de prosseguir.';
  }

  closeModal(): void {
    this.showModal = false;
    // this.modalClosed.emit();
  }

  // Controle externo
  open(
    type: ModalType,
    message: string = '',
    paymentMethod?: 'pix' | 'credit'
  ): void {
    this.configureModal(type, message);
    if (paymentMethod) {
      this.paymentMethod = paymentMethod;
    }
    this.showModal = true;
  }
}
