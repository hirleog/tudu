import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardOrders } from 'src/app/interfaces/card-orders';
import { CardService } from 'src/app/services/card.service';
import { PaymentService } from 'src/app/services/payment.service';
import { StateManagementService } from 'src/app/services/state-management.service';
import { CustomModalComponent } from 'src/app/shared/custom-modal/custom-modal.component';

@Component({
  selector: 'app-order-help',
  templateUrl: './order-help.component.html',
  styleUrls: ['./order-help.component.css'],
})
export class OrderHelpComponent implements OnInit {
  @ViewChild('meuModal') customModal!: CustomModalComponent;

  id_pedido: string = '';
  questionTitle: string = '';
  card: CardOrders[] = [];

  message: string = '';
  private whatsappNumber = '5511974109625'; // Seu número com DDD e código do país
  private emailSuporte = 'suporte@empresa.com.br';
  private assuntoEmail = 'Relato de Problema - Sistema TUDU';
  reqStatus: string = '';

  constructor(
    private routeActive: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private cardService: CardService,
    public stateManagementService: StateManagementService
  ) {
    this.routeActive.queryParams.subscribe((params) => {
      this.id_pedido = params['id'] || '';
      this.questionTitle = params['questionTitle'] || '';
      this.card.push(params['card'] ? JSON.parse(params['card']) : null);
    });
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo
  }

  back() {
    this.router.navigate(['home/detail']); // Ajuste para sua rota

    this.routeActive.queryParams.subscribe((params) => {
      this.router.navigate(['home/detail'], {
        queryParams: {
          id_pedido: params['id'], // Reenvia os parâmetros
          flow: params['flow'], // Reenvia o fluxo
          card: JSON.stringify(this.card),
        },
      });
    });
  }

  // ✅ ENVIAR VIA WHATSAPP
  enviarWhatsApp() {
    if (!this.message) return;

    const texto = this.formatarMensagemWhatsApp();
    const url = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(
      texto
    )}`;

    window.open(url, '_blank');
  }

  // ✅ ENVIAR VIA EMAIL
  enviarEmail() {
    if (!this.message) return;

    const assunto = this.assuntoEmail;
    const corpo = this.formatarMensagemEmail();
    const url = `mailto:${this.emailSuporte}?subject=${encodeURIComponent(
      assunto
    )}&body=${encodeURIComponent(corpo)}`;

    window.location.href = url;
  }

  // 📋 Formatar mensagem para WhatsApp
  private formatarMensagemWhatsApp(): string {
    let texto = `*Relato de Problema - TUDU* 🛠️\n\n`;

    if (this.card) {
      texto += `*Pedido:* #${this.card[0].id_pedido || 'N/A'}\n`;
      texto += `*Serviço:* ${this.card[0].categoria || 'N/A'}\n`;
    }

    if (this.questionTitle) {
      texto += `*Tipo de Problema:* ${this.questionTitle}\n`;
    }

    texto += `\n*Descrição do Problema:*\n${this.message}\n\n`;
    texto += `_Enviado via sistema TUDU_`;

    return texto;
  }

  // 📧 Formatar mensagem para Email
  private formatarMensagemEmail(): string {
    let corpo = `Relato de Problema - TUDU\n`;
    corpo += `========================\n\n`;

    if (this.card) {
      corpo += `Pedido: #${this.card[0].id_pedido || 'N/A'}\n`;
      corpo += `Serviço: ${this.card[0].categoria || 'N/A'}\n`;
      corpo += `Data: ${new Date().toLocaleDateString('pt-BR')}\n`;
    }

    if (this.questionTitle) {
      corpo += `Categoria: ${this.questionTitle}\n`;
    }

    corpo += `\nDescrição do Problema:\n`;
    corpo += `${this.message}\n\n`;
    corpo += `Atenciosamente,\n`;
    corpo += `Sistema de Suporte TUDU`;

    return corpo;
  }

  cancelarPagamentoDoPedido() {
    // Aqui você pode chamar o método de cancelamento

    const idPedido: string = this.card[0].id_pedido ?? '';

    this.paymentService.cancelarPagamentoPorIdPagamento(idPedido).subscribe({
      next: (cancelResponse) => {
        console.log('Pedido cancelado com sucesso:', cancelResponse);
      },
      error: (cancelError) => {
        console.error('Erro ao cancelar pedido:', cancelError);
      },
    });
  }

  cancelarPedido() {
    const reason = this.message;
    const idPedido: string = this.card[0].id_pedido ?? '';

    if (reason) {
      this.cardService.cancelCard(idPedido, reason).subscribe({
        next: (response) => {
          this.reqStatus = response.status;

          this.customModal.openModal();
          this.customModal.configureModal(
            true,
            response.message || 'Pedido cancelado com sucesso.'
          );

          this.stateManagementService.clearAllState();
        },
        error: (err) => {
          
          this.customModal.openModal();
          this.customModal.configureModal(
            false,
            err.message ||
              'Erro ao cancelar o pedido. Tente novamente mais tarde.'
          );
        },
      });
    }
  }

  closeModal(): void {
    if (this.reqStatus === 'success') {
      this.customModal.closeModal();
      this.router.navigate(['/home']); // Ajuste para sua rota
    } else {
      this.customModal.closeModal();
    }

    // this.payHiredCard.emit(this.closeModalIndicator);
  }
}
