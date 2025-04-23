import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { AuthHelper } from 'src/app/components/helpers/auth-helper';
import { CreateCard } from 'src/app/interfaces/create-card.model';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-make-offer',
  templateUrl: './make-offer.component.html',
  styleUrls: ['./make-offer.component.css'],
})
export class MakeOfferComponent implements OnInit {
  dateSelected: string = '';
  dateTimeSelected: string = '';
  timeSelected: string = '';

  cardTitle: string = '';
  addressContent: any;
  filters: any;

  price: string = '';
  renegotiateActive: boolean = false;
  calendarActive: boolean = false;
  initialDateTime: string = '';
  isLogged: boolean = false;
  id_cliente: any = '';

  constructor(
    private routeActive: ActivatedRoute,
    private route: Router,
    public cardService: CardService,
    public authService: AuthService
  ) {
    this.isLogged = AuthHelper.isLoggedIn(); // Usa o helper diretamente

    this.authService.idCliente$.subscribe((id) => {
      this.id_cliente = id;
      console.log('ID do Cliente:', this.id_cliente);
    });

    this.initialDateTime = moment()
      .add(1, 'day')
      .set({ hour: 12, minute: 0, second: 0 })
      .format('DD/MM/YYYY - HH:mm');

    this.routeActive.queryParams.subscribe((params) => {
      this.filters = params['filters'] ? JSON.parse(params['filters']) : [];
      this.cardTitle = params['cardTitle'];

      this.addressContent = params['addressContent']
        ? JSON.parse(params['addressContent'])
        : [];
    });
  }

  ngOnInit(): void {
    this.dateTimeSelected = this.initialDateTime;
  }

  createCard(): Observable<CreateCard> {
    const dateTimeFormat = moment(
      this.dateTimeSelected,
      'DD/MM/YYYY - HH:mm'
    ).format('YYYY-MM-DD HH:mm');

    const filtersConcat = this.filters
      .map((category: any) =>
        category.filters.map((filter: any) => filter.label).join(', ')
      )
      .join(', ');

    const codigoConfirmacao = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const payloadCard: CreateCard = {
      id_cliente: this.id_cliente.toString(), 
      id_prestador: '0', // precisa criar tabela de cliente para pegar o ID auto incrementavel
      categoria: this.cardTitle,
      status_pedido: 'publicado',
      subcategoria: filtersConcat,
      valor: this.price,
      horario_preferencial: dateTimeFormat,

      codigo_confirmacao: codigoConfirmacao,

      cep: this.addressContent[0].cep, // CEP do endereço
      street: this.addressContent[0].street,
      neighborhood: this.addressContent[0].neighborhood,
      city: this.addressContent[0].city,
      state: this.addressContent[0].state,
      number: this.addressContent[0].number,
      complement: this.addressContent[0].complement,
    };

    if (this.isLogged) {
      this.cardService.postCard(payloadCard).subscribe((response) => {
        this.route.navigate(['/home']);
      });
    } else {
      this.route.navigate(['/']);
    }
    return of();
  }

  onPriceClose() {
    this.renegotiateActive = !this.renegotiateActive;
    console.log('Calendar closed', this.renegotiateActive);
  }
  onCalendarClose() {
    // this.clickOutside = true
    this.calendarActive = !this.calendarActive;
    console.log('Calendar closed', this.calendarActive);
  }

  onDateSelected(date: string) {
    const time = this.dateTimeSelected.split(' - ')[1]; // Mantém a hora se já existir

    this.dateSelected = moment(date).format('DD/MM/YYYY'); // Formata a data selecionada
    this.dateTimeSelected = `${this.dateSelected} - ${time}`;
  }

  onTimeSelected(time: string) {
    this.timeSelected = time;
    this.dateTimeSelected = `${this.dateSelected} - ${this.timeSelected}`;
  }

  goBack(): void {
    this.routeActive.queryParams.subscribe((params) => {
      this.route.navigate(['/proposal/address'], {
        queryParams: {
          addressContent: params['addressContent'], // Reenvia os parâmetros
          cardTitle: params['cardTitle'], // Reenvia os parâmetros
          filters: params['filters'],
        },
      });
    });
  }
}
