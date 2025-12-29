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
  @Input() actionButtonText = '';
  @Input() paymentMethod: 'pix' | 'credit' | null = null;
  @Input() errorDetails: any = null;

  @Output() modalClosed = new EventEmitter<void>();
  @Output() modalAction = new EventEmitter<void>();
  @Input() showModal = false;
  @Input() messageTitle: string = 'Pagamento Aprovado!';
  @Input() showBtn = true;

  // Configuração dinâmica
  modalIcon: string = 'fa-check';
  modalIconColor: string = 'text-green-600';
  modalBgColor: string = 'bg-green-100';
  messageBody: string = 'Seu pagamento foi processado com sucesso.';
  @Input() isLoadingBtn: boolean | undefined;

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
    this.modalIcon = 'fa-check-circle'; // Ícone mais moderno
    this.modalIconColor = 'text-green-500';
    this.modalBgColor = 'bg-green-100'; // Background suave
    this.messageTitle = 'Sucesso!';
    this.messageBody = message || 'Operação realizada com sucesso.';
  }

  private setErrorStyles(message: string): void {
    this.modalIcon = 'fa-times-circle'; // Ícone de erro circular
    this.modalIconColor = 'text-red-500';
    this.modalBgColor = 'bg-red-100';
    this.messageTitle = 'Ops! Algo deu errado';
    this.messageBody = message || 'Não conseguimos processar sua solicitação.';
  }

  private setWarningStyles(message: string): void {
    this.modalIcon = 'fa-exclamation-circle';
    this.modalIconColor = 'text-amber-500';
    this.modalBgColor = 'bg-amber-100';
    this.messageTitle = 'Atenção';
    this.messageBody = message || 'Verifique os dados antes de continuar.';
  }

  actionModal(): void {
    if (this.isLoadingBtn !== undefined) {
      this.isLoadingBtn = true;
      this.modalAction.emit();
    } else {
      this.modalAction.emit();
      this.isLoadingBtn = false;
      this.showModal = false;
    }
  }
  closeModal(): void {
    this.showModal = false;
    this.modalClosed.emit();
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
