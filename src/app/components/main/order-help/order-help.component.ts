import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardOrders } from 'src/app/interfaces/card-orders';
import { MalgaService } from 'src/app/malga/service/malga.service';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';
import { PagbankService } from 'src/app/services/pagbank.service';
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
  isProfessional: boolean = false;
  id_prestador!: string | null;
  loadingBtn: boolean = false;
  flow: string = '';
  paymentType: string = '';

  constructor(
    private routeActive: ActivatedRoute,
    private router: Router,
    private cardService: CardService,
    public stateManagementService: StateManagementService,
    private authService: AuthService,
    private malgaService: MalgaService,
    private pagbankService: PagbankService
  ) {
    this.routeActive.queryParams.subscribe((params) => {
      this.id_pedido = params['id'] || '';
      this.questionTitle = params['questionTitle'] || '';
      this.card.push(params['card'] ? JSON.parse(params['card']) : null);
      this.flow = params['flow'] || '';
      this.paymentType = params['paymentType'] || '';
    });

    this.authService.idPrestador$.subscribe((id_prestador) => {
      this.id_prestador = id_prestador;
    });

    this.isProfessional = this.authService.isPrestadorLoggedIn();
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo
  }

  back() {
    if (this.authService.isPrestadorLoggedIn()) {
      this.router.navigate(['/home/detail']); // Ajuste para sua rota

      this.routeActive.queryParams.subscribe((params) => {
        this.router.navigate(['/home/detail'], {
          queryParams: {
            param: 'professional',
            id_pedido: params['id'], // Reenvia os parâmetros
            flow: params['flow'], // Reenvia o fluxo
            card: JSON.stringify(this.card),
          },
        });
      });
    } else {
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
  }

  // ✅ ENVIAR VIA WHATSAPP
  enviarWhatsApp() {
    if (!this.message) return;

    const texto = this.formatarMensagemWhatsApp();
    const url = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(
      texto
    )}`;

    window.open(url, '_blank');

    this.reqStatus = 'whatsapp';
    this.customModal.openModal();
    this.customModal.configureModal(
      'success',
      'Obrigado, continuaremos pelo Whatsapp!'
    );
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

  cancelar() {
    if (this.isProfessional) {
      this.cancelarCandidatura();
    } else {
      this.cancelCard();
    }
  }

  cancelCard() {
    this.loadingBtn = true;

    const reason = this.message;
    const idPedido: string = this.card[0].id_pedido ?? '';

    if (reason) {
      this.cardService.cancelCard(idPedido, reason).subscribe({
        next: (response) => {
          this.reqStatus = response.status === 'success' ? 'success' : 'error';

          if (this.flow === 'progress') {
            if (this.paymentType === 'pix') {
              this.cancelPixPayment();
            } else {
              this.cancelCreditPayment();
            }
          } else {
            this.customModal.openModal();
            this.customModal.configureModal(
              'success',
              response.message || 'Pedido cancelado com sucesso.'
            );
            this.loadingBtn = false;
          }

          this.stateManagementService.clearAllState();
        },
        error: (err) => {
          this.customModal.openModal();
          this.customModal.configureModal(
            'error',
            err.message ||
              'Erro ao cancelar o pedido. Tente novamente mais tarde.'
          );
          this.loadingBtn = false;
        },
      });
    }
  }

  cancelarCandidatura() {
    this.loadingBtn = true;
    // const reason = this.message;
    const idPedido: string = this.card[0].id_pedido ?? '';
    const candidaturaDoPrestador: any = this.card[0].candidaturas.find(
      (candidatura: any) => candidatura.prestador_id === this.id_prestador
    );

    this.cardService
      .cancelarCandidatura(idPedido, candidaturaDoPrestador.id_candidatura)
      .subscribe({
        next: (response: any) => {
          this.reqStatus = response.status;

          if (this.flow === 'progress') {
            if (this.paymentType === 'pix') {
              this.cancelPixPayment();
            } else {
              this.cancelCreditPayment();
            }
          } else {
            this.customModal.openModal();
            this.customModal.configureModal(
              'success',
              response.message || 'Candidatura cancelada com sucesso.'
            );
          }

          this.stateManagementService.clearAllState();
          this.loadingBtn = false;
        },
        error: (err) => {
          this.customModal.openModal();
          this.customModal.configureModal(
            'error',
            err.message ||
              'Erro ao cancelar a candidatura. Tente novamente mais tarde.'
          );
          this.loadingBtn = false;
        },
      });
  }

  cancelCreditPayment() {
    const payload = {
      amount: Number(this.card[0].chargeInfos?.total_amount),
    };

    this.malgaService
      .cancelPayment(payload, this.card[0].chargeInfos?.charge_id ?? '')
      .subscribe({
        next: (response: any) => {
          this.reqStatus = response.success === true ? 'success' : 'error';

          this.customModal.openModal();
          this.customModal.configureModal(
            'success',
            response.message || 'Pedido cancelado com sucesso.'
          );
          this.stateManagementService.clearAllState();
          this.loadingBtn = false;
        },
        error: (err) => {
          this.customModal.openModal();
          this.customModal.configureModal(
            'error',
            err.message ||
              'Erro ao cancelar o pagamento. Tente novamente mais tarde.'
          );
          this.loadingBtn = false;
        },
      });
  }

  cancelPixPayment() {
    // 1. Obter o identificador PagBank
    const chargeId = this.card[0].chargeInfos?.charge_id || '';
    const payload = {
      amount: Number(this.card[0].chargeInfos?.total_amount),
    };

    if (!chargeId) {
      // Lógica de erro para ID ausente
      // ...
      return;
    }

    this.loadingBtn = true;

    // 2. Chamada do serviço (sem payload de amount)
    this.pagbankService // ⚠️ Use o nome correto do seu serviço injetado
      .cancelPixPayment(chargeId, payload)
      .subscribe({
        next: (response: any) => {
          this.reqStatus = response.success === true ? 'success' : 'error';

          this.customModal.openModal();
          this.customModal.configureModal(
            'success',
            response.message ||
              'Estorno PIX solicitado. O backend enviou o amount total ao PagBank.'
          );
          this.stateManagementService.clearAllState();
          this.loadingBtn = false;
        },
        error: (err) => {
          this.loadingBtn = false;
          const errorMessage =
            err.error?.message ||
            err.message ||
            'Erro na solicitação de estorno PIX.';

          this.customModal.openModal();
          this.customModal.configureModal('error', errorMessage);
        },
      });
  }

  closeCancelationModal(): void {
    if (
      this.reqStatus === 'success' &&
      this.authService.isPrestadorLoggedIn()
    ) {
      this.customModal.closeModal();
      this.router.navigate(['/tudu-professional/home']); // Ajuste para sua rota
    } else if (
      this.reqStatus === 'success' &&
      !this.authService.isPrestadorLoggedIn()
    ) {
      this.customModal.closeModal();
      this.router.navigate(['/home']); // Ajuste para sua rota
    } else if (this.reqStatus === 'whatsapp') {
      this.back();
    } else {
      this.customModal.closeModal();
      this.router.navigate(['/home']); // Ajuste para sua rota
    }

    // this.payHiredCard.emit(this.closeModalIndicator);
  }
}
