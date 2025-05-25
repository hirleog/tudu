import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { CardOrders } from 'src/app/interfaces/card-orders';
import { CardService } from 'src/app/services/card.service';
import { ProfileDetailService } from 'src/app/services/profile-detail.service';
import * as moment from 'moment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardSocketService } from 'src/app/services/card-socket.service';

@Component({
  selector: 'app-progress-detail',
  templateUrl: './progress-detail.component.html',
  styleUrls: ['./progress-detail.component.css'],
})
export class ProgressDetailComponent implements OnInit {
  card: CardOrders[] = [];
  candidatura: any;
  prestadorInfos: any;
  id_pedido: any;
  finalizeCode: string = '';
  mapaUrl: SafeResourceUrl | null = null;
  codigoInvalido: boolean = false;

  constructor(
    private profileDetailService: ProfileDetailService,
    private route: Router,
    private routeActive: ActivatedRoute,
    public cardService: CardService,
    private sanitizer: DomSanitizer,
    public cardSocketService: CardSocketService
  ) {
    this.routeActive.queryParams.subscribe((params) => {
      this.id_pedido = params['id'];
    });
  }

  ngOnInit() {
    this.getCardById();

    this.cardSocketService.ouvirAtualizacaoPedido().subscribe((atualizacao) => {

      console.log('atualizacao', atualizacao);
      
      // if (atualizacao.id === this.pedido.id) {
      //   this.pedido.status = atualizacao.status;
      //   // Pode também chamar o getById novamente se precisar de mais dados atualizados
      // }
    });
  }

  // listCards() {
  //   this.cardService.getCards('pendente').subscribe({
  //     next: (response) => {
  //       // Primeiro, acessa os cards corretamente
  //       this.card = response.cards.map((card) => ({
  //         ...card,
  //         icon: this.cardService.getIconByLabel(card.categoria) || '',
  //         renegotiateActive: !card.valor_negociado,
  //         calendarActive: false,
  //       }));

  //       this.candidatura = response.cards.flatMap((card) =>
  //         card.candidaturas.map((candidatura) => ({
  //           ...candidatura,
  //           icon: this.cardService.getIconByLabel(card.categoria) || '',
  //           renegotiateActive: !candidatura.valor_negociado,
  //           calendarActive: false,
  //         }))
  //       );
  //       this.loadPrestador(this.candidatura[0].prestador_id);
  //     },
  //     error: (error) => console.error('Erro ao obter os cartões:', error),
  //     complete: () => console.log('Requisição concluída'),
  //   });
  // }

  getCardById(): void {
    this.cardService.getCardById(this.id_pedido).subscribe({
      next: (data) => {
        const card = data as CardOrders;
        this.card.push(card);
        this.setMapaUrl(this.card[0].address);

        const candidatura = card.candidaturas?.[0];
        if (candidatura?.prestador_id) {
          this.loadPrestador(candidatura.prestador_id);
        }
      },
      error: (err) => {
        // this.error = 'Erro ao buscar o pedido';
        // this.isLoading = false;
        console.error(err);
      },
    });
  }

  loadPrestador(id_prestador: number): void {
    this.profileDetailService
      .getPrestadorById(id_prestador)
      .subscribe((data: any) => {
        this.prestadorInfos = data;
      });
  }

  formatarHorario(pedido: any): string {
    const candidatura = pedido.candidaturas?.[0];
    let horario = pedido.horario_preferencial;

    if (
      candidatura &&
      candidatura.horario_negociado !== pedido.horario_preferencial
    ) {
      horario = candidatura.horario_negociado;
    }

    const data = moment(horario);
    const hoje = moment();

    if (data.isSame(hoje, 'day')) {
      return `Hoje, ${data.format('HH:mm')}`;
    }

    return data.format('DD/MM/YYYY - HH:mm');
  }

  // getMapaUrl(address: any): SafeResourceUrl {
  //   if (!address) return '';

  //   const fullAddress = `${address.street}, ${address.number}, ${address.city}, ${address.state}`;
  //   const encodedAddress = encodeURIComponent(fullAddress);
  //   const mapsUrl = `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;

  //   return this.sanitizer.bypassSecurityTrustResourceUrl(mapsUrl);
  // }

  setMapaUrl(address: any): void {
    if (!address) return;

    const fullAddress = `${address.street}, ${address.number}, ${address.city}, ${address.state}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    const mapsUrl = `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;

    this.mapaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapsUrl);
  }

  updateCard(card: CardOrders): Observable<CardOrders> {
    const payloadCard: any = {
      status_pedido: 'finalizado',
    };

    if (card.codigo_confirmacao === this.finalizeCode) {
      this.cardService.updateCard(card.id_pedido!, payloadCard).subscribe({
        next: (response) => {
          this.codigoInvalido = false;

          this.route.navigate(['/home/end']);
        },
        error: (error) => {
          console.error('Erro ao atualizar o cartão:', error);
        },
        complete: () => {
          console.log('Requisição concluída');
        },
      });
    } else {
      this.codigoInvalido = true;
    }

    return of();
  }
}
