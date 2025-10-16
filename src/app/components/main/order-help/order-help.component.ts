import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardOrders } from 'src/app/interfaces/card-orders';
import { MalgaService } from 'src/app/malga/service/malga.service';
import { AuthService } from 'src/app/services/auth.service';
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
  isProfessional: boolean = false;
  id_prestador!: string | null;
  loadingBtn: boolean = false;

  constructor(
    private routeActive: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private cardService: CardService,
    public stateManagementService: StateManagementService,
    private authService: AuthService,
    private malgaService: MalgaService
  ) {
    this.routeActive.queryParams.subscribe((params) => {
      this.id_pedido = params['id'] || '';
      this.questionTitle = params['questionTitle'] || '';
      this.card.push(params['card'] ? JSON.parse(params['card']) : null);
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
      this.cancelarCardPagamento();
    }
  }

  cancelarCardPagamento() {
    this.loadingBtn = true;

    const reason = this.message;
    const idPedido: string = this.card[0].id_pedido ?? '';

    if (reason) {
      this.cardService.cancelCard(idPedido, reason).subscribe({
        next: (response) => {
          this.reqStatus = response.status;

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
    // const idCandidatura = candidaturaDoPrestador ? candidaturaDoPrestador.id_candidatura : undefined;

    // if (reason) {
    this.cardService
      .cancelarCandidatura(idPedido, candidaturaDoPrestador.id_candidatura)
      .subscribe({
        next: (response: any) => {
          this.reqStatus = response.status;

          this.customModal.openModal();
          this.customModal.configureModal(
            'success',
            'Candidatura cancelada com sucesso.'
          );
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

  cancelPayment() {
    // let valorFinal;

    // // if (this.card[0].candidaturas && this.card[0].candidaturas.length > 0) {
    // //   const candidatura = this.card[0].candidaturas[0]; // Pega a primeira candidatura

    // //   if (candidatura.valor_negociado) {
    // //     const valorNegociado = Number(candidatura.valor_negociado) || 0;
    // //     const valorOriginal = Number(this.card[0].valor) || 0;
    // //     valorFinal =
    // //       valorNegociado !== valorOriginal
    // //         ? valorNegociado.toString()
    // //         : valorOriginal.toString();
    // //   }
    // // }

    const payload = {
      amount: Number(this.card[0].chargeInfos?.total_amount),
    };

    this.malgaService
      .cancelPayment(payload, this.card[0].chargeInfos?.charge_id ?? '')
      .subscribe({
        next: (response: any) => {
          this.reqStatus = response.status;

          this.customModal.openModal();
          this.customModal.configureModal(
            'success',
            response.message || 'Pagamento cancelado com sucesso.'
          );
          this.stateManagementService.clearAllState();
        },
        error: (err) => {
          this.customModal.openModal();
          this.customModal.configureModal(
            'error',
            err.message ||
              'Erro ao cancelar o pagamento. Tente novamente mais tarde.'
          );
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
    }

    // this.payHiredCard.emit(this.closeModalIndicator);
  }
}
