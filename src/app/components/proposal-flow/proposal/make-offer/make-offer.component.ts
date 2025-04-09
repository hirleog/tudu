import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { CreateCard } from 'src/app/interfaces/create-card.model';
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

  constructor(
    private routeActive: ActivatedRoute,
    private route: Router,
    public cardService: CardService
  ) {
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

    const payload: CreateCard = {
      filters: this.filters,
      address: this.addressContent,
      cardTitle: this.cardTitle,
      dateTimeSelected: dateTimeFormat,
      price: this.price,
    };

    this.cardService.postCard(payload).subscribe((response) => {
      console.log('Card created successfully:', response);
    });

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
