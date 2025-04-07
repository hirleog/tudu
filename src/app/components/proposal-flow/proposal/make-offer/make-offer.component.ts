import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-make-offer',
  templateUrl: './make-offer.component.html',
  styleUrls: ['./make-offer.component.css'],
})
export class MakeOfferComponent implements OnInit {
  dateSelected: string = '';
  dateTimeSelected: string = '';
  timeSelected: string = '';
  constructor() {
    this.initialDateTime = moment()
      .add(1, 'day')
      .set({ hour: 12, minute: 0, second: 0 })
      .format('DD/MM/YYYY - HH:mm');
  }

  price: string = '';
  renegotiateActive: boolean = false;
  calendarActive: boolean = false;
  initialDateTime: string = '';

  ngOnInit(): void {
    this.dateTimeSelected = this.initialDateTime;
  }

  // Adicione este handler para quando o calendário emitir o evento de fechar
  onPriceClose() {
    // this.clickOutside = true
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
}
