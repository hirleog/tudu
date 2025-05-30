import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, of, Subscription } from 'rxjs';
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
  selectedFiles: File[] = [];

  // mudar para o proposalcomponente
  selectedPreviews: string[] = [];

  private subscriptionCliente: Subscription = new Subscription();
  clienteIsLogged: boolean = false;

  constructor(
    private routeActive: ActivatedRoute,
    private route: Router,
    public cardService: CardService,
    public authService: AuthService
  ) {
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
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo

    this.dateTimeSelected = this.initialDateTime;

    this.authService.isClienteLoggedIn$.subscribe((loggedIn) => {
      this.clienteIsLogged = loggedIn;
    });
  }

  createCard(): Observable<void> {
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
      1000 + Math.random() * 9000
    ).toString();

    const payloadCard: CreateCard = {
      id_cliente: this.id_cliente.toString(),
      id_prestador: '0',
      categoria: this.cardTitle,
      status_pedido: 'publicado',
      subcategoria: filtersConcat,
      valor: this.price,
      horario_preferencial: dateTimeFormat,
      codigo_confirmacao: codigoConfirmacao,
      cep: this.addressContent[0].cep,
      street: this.addressContent[0].street,
      neighborhood: this.addressContent[0].neighborhood,
      city: this.addressContent[0].city,
      state: this.addressContent[0].state,
      number: this.addressContent[0].number,
      complement: this.addressContent[0].complement || '',
    };

    // Verifica se há arquivos selecionados
    if (this.selectedFiles.length > 0) {
      this.cardService
        .postCardWithImages(payloadCard, this.selectedFiles)
        .subscribe({
          next: (response) => {
            this.route.navigate(['/home']);
          },
          error: (error) => {
            console.error('Erro ao criar card:', error);
          },
        });
    } else {
      this.cardService.postCardWithImages(payloadCard, []).subscribe({
        next: (response) => {
          this.route.navigate(['/home']);
        },
        error: (error) => {
          console.error('Erro ao criar card:', error);
        },
      });
    }

    return of();
  }
  // mudar para o proposal
  onFilesSelected(event: any) {
    const files = event.target.files;
    this.selectedFiles = [];
    this.selectedPreviews = [];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Guarda o arquivo
        this.selectedFiles.push(file);

        // Cria preview (data URL)
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedPreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  // onFileSelected(event: any) {
  //   this.selectedFile = event.target.files[0];
  // }

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

  ngOnDestroy(): void {
    // Cancela as inscrições para evitar vazamentos de memória
    this.subscriptionCliente.unsubscribe();
    // this.subscriptionPrestador.unsubscribe();
  }
}
