import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { CardOrders } from 'src/app/interfaces/card-orders';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';
import { ProfileDetailService } from 'src/app/services/profile-detail.service';
import { StateManagementService } from 'src/app/services/state-management.service';
import { CustomModalComponent } from 'src/app/shared/custom-modal/custom-modal.component';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css'],
})
export class BudgetsComponent implements OnInit {
  @ViewChild('meuModal') customModal!: CustomModalComponent;

  cardPrice = '';

  id_pedido: string = '';
  card: any;
  id_prestador: any;
  prestadorInfos: any;
  prestadoresInfos: Array<any>[] = [];
  paymentStep: boolean = false;
  hiredCardInfo!: CardOrders;
  id_cliente: any;
  clientData: any;
  showModal: boolean = false;
  selectedCandidatura: any;

  constructor(
    public cardService: CardService,
    private routeActive: ActivatedRoute,
    private route: Router,
    private authService: AuthService,
    private profileDetailService: ProfileDetailService,
    public stateManagementService: StateManagementService
  ) {
    this.routeActive.queryParams.subscribe((params) => {
      this.id_pedido = params['id'];
    });

    this.authService.idPrestador$.subscribe((id_prestador) => {
      this.id_prestador = id_prestador;
    });
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo
    this.getCardById();
  }

  getCardById(): void {
    this.cardService.getCardById(this.id_pedido).subscribe({
      next: (data: any) => {
        const candidaturas = data.candidaturas || [];

        // Primeiro monta o card com ícone e candidaturas
        this.card = {
          ...data,
          icon: this.cardService.getIconByLabel(data.categoria) || '',
          candidaturas: candidaturas.map((candidatura: any) => ({
            ...candidatura,
            icon: this.cardService.getIconByLabel(data.categoria) || '',
          })),
        };

        // Prepara as chamadas para os prestadores
        const chamadasPrestadores = this.card.candidaturas
          .filter((c: any) => c.prestador_id)
          .map((c: any) =>
            this.profileDetailService.getPrestadorById(c.prestador_id)
          );

        // Aguarda todas as chamadas e insere as infos
        forkJoin(chamadasPrestadores).subscribe((prestadoresInfos: any) => {
          this.card.candidaturas.forEach((candidatura: any, index: any) => {
            candidatura.prestador_info = prestadoresInfos[index];
          });

          console.log('Cards com informações dos prestadores:', this.card);
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  goToPayment(card: any, id_prestador: any): void {
    this.authService.idCliente$.subscribe((id) => {
      const id_cliente = Number(id);

      this.profileDetailService.getClienteById(id_cliente).subscribe({
        next: (data) => {
          this.hiredCardInfo = card;
          this.selectedCandidatura = id_prestador;
          this.paymentStep = true;
          this.clientData = data;
        },
        error: (err) => {
          console.error('Erro ao buscar dados do cliente:', err);
        },
      });
    });
  }

  payHiredCard(paymentIndicator: any): void {
    if (paymentIndicator === 'success') {
      this.updateCard(
        this.hiredCardInfo,
        'contratar',
        this.selectedCandidatura
      );
    } else {
      console.log('pagamento negado');
    }
  }

  updateCard(
    card: CardOrders,
    step: string,
    candidatoEspecifico?: any
  ): Observable<CardOrders> {
    // Obtém a candidatura do prestador atual (se existir)
    const candidaturaAlvo = card.candidaturas?.find(
      (c) => c.prestador_id === candidatoEspecifico
    );

    if (!candidaturaAlvo) {
      console.error('Candidatura não encontrada');
      return of();
    }

    // Determina o valor negociado apenas para a candidatura alvo
    const valorNegociado =
      candidaturaAlvo.valor_negociado === ''
        ? card.valor
        : candidaturaAlvo.valor_negociado ?? card.valor;

    const horario_negociado =
      candidaturaAlvo.horario_negociado === ''
        ? card.horario_preferencial
        : candidaturaAlvo.horario_negociado ?? card.horario_preferencial;

    const payloadCard: any = {
      id_cliente: Number(card.id_pedido),
      id_prestador: step === 'contratar' ? candidaturaAlvo.prestador_id : null,
      categoria: card.categoria,
      status_pedido: step === 'contratar' ? 'pendente' : 'publicado',
      subcategoria: card.subcategoria,
      valor: card.valor,
      horario_preferencial: card.horario_preferencial,

      cep: card.address.cep,
      street: card.address.street,
      neighborhood: card.address.neighborhood,
      city: card.address.city,
      state: card.address.state,
      number: card.address.number,
      complement: card.address.complement,

      // Envia apenas a candidatura específica que está sendo atualizada
      candidaturas: [
        {
          prestador_id: candidaturaAlvo.prestador_id,
          valor_negociado: valorNegociado,
          horario_negociado: horario_negociado,
          status: step === 'contratar' ? 'aceito' : 'recusado',
        },
      ],
    };

    this.cardService.updateCard(card.id_pedido!, payloadCard).subscribe({
      next: () => {
        this.stateManagementService.clearAllState();
        this.closeModal('contratar');
      },
      error: (error) => {
        this.showModal = true;
        this.customModal.configureModal(
          'success',
          error.message || 'Erro ao recusar a proposta, tente novamente'
        );
      },
      complete: () => {
        console.log('Requisição concluída');
      },
    });

    return of();
  }

  closeModal(step: string): void {
    if (step === 'contratar') {
      this.route.navigate(['/home/progress']);
    } else {
      this.getCardById(); // Atualiza a lista de cartões após a atualização
    }
    this.customModal.closeModal();
  }

  backToOffer(indicator: any): void {
    this.paymentStep = indicator;
  }

  backToHome() {
    if (this.paymentStep) {
      this.paymentStep = !this.paymentStep;
    } else {
      this.route.navigate(['/home']);
    }
  }

  goToPrestadorDetail(idPrestador: string, idPedido: string) {
    // Navega para a rota com o parâmetro correto
    this.route.navigate(['/profile/profile-detail'], {
      queryParams: {
        param: 'professional',
        id: idPrestador,
        pedido: idPedido,
      },
    });
  }
}
