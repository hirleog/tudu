import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  SimpleChanges,
  HostListener,
  ElementRef,
} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  currentDate = moment();
  days: moment.Moment[] = [];
  weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  selectedDate: moment.Moment | null = null;
  selectedTime: string = '';

  @Input() openCalendar: boolean = false; // Array de datas no formato 'YYYY-MM-DD'
  @Input() showChangeDateBtn: boolean = true; // Array de datas no formato 'YYYY-MM-DD'
  @Input() hasTime: boolean = false; // Array de datas no formato 'YYYY-MM-DD'
  @Input() markedDates: string[] = []; // Array de datas no formato 'YYYY-MM-DD'

  @Input() initialDate: string = ''; // Nova entrada para definir a data inicial
  @Input() initialTime: string = ''; // Adicione isso junto com os outros @Input()
  @Input() initialDateTime: any; // Adicione isso junto com os outros @Input()

  @Output() dateSelected = new EventEmitter<string>();
  @Output() timeSelected = new EventEmitter<string>();
  @Output() closeCalendar = new EventEmitter<void>();

  @Input() showWeekView: boolean = false;
  weekDays: { date: moment.Moment; isFirst: boolean }[] = [];

  constructor(private elementRef: ElementRef) {
    this.generateCalendar();
  }

  ngOnInit() {
    this.processInitialDateTime();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialDateTime']) {
      this.processInitialDateTime();
    }

    if (changes['markedDates'] || changes['showWeekView']) {
      if (this.showWeekView && this.markedDates?.length > 0) {
        this.generateWeekDays();
      }
    }
  }

  private processInitialDateTime() {
    if (!this.initialDateTime) return;

    // Separa a data e hora (formato "DD/MM/YYYY - HH:mm")
    const [datePart, timePart] = this.initialDateTime.split(' - ');

    // Processa a data
    if (datePart) {
      const parsedDate = moment(datePart, 'DD/MM/YYYY');
      if (parsedDate.isValid()) {
        this.selectedDate = parsedDate;
        this.currentDate = parsedDate.clone();
        this.generateCalendar();
      }
    }

    // Processa a hora
    if (timePart) {
      // Garante que o formato é HH:mm (24 horas)
      this.selectedTime = timePart.length === 5 ? timePart : '';
    }
  }

  toggleCalendar(param?: string): void {
    this.openCalendar = !this.openCalendar;
  }

  generateWeekDays() {
    const firstDate = moment(this.markedDates[0]);
    this.weekDays = [];

    // Gerar os 7 dias a partir da primeira data marcada
    for (let i = 0; i < 7; i++) {
      const currentDate = firstDate.clone().add(i, 'days');
      this.weekDays.push({
        date: currentDate,
        isFirst: i === 0,
      });
    }
  }

  getDisplayedDays() {
    const screenWidth = window.innerWidth;
    // Se a tela for menor que 380px, mostra 6 dias, senão mostra todos os 7
    return screenWidth < 380 ? this.weekDays.slice(0, 6) : this.weekDays;
  }

  getDayName(date: moment.Moment): string {
    return date.format('ddd');
  }

  generateCalendar() {
    this.days = [];

    // Primeiro dia do mês
    const startOfMonth = this.currentDate.clone().startOf('month');
    // Último dia do mês
    const endOfMonth = this.currentDate.clone().endOf('month');

    // Dia da semana do primeiro dia (0-6)
    const startDay = startOfMonth.day();

    // Dia da semana do último dia (0-6)
    const endDay = endOfMonth.day();

    // Data inicial (pode ser do mês anterior)
    const startDate = startOfMonth.clone().subtract(startDay, 'days');

    // Data final (pode ser do próximo mês)
    const endDate = endOfMonth.clone().add(6 - endDay, 'days');

    // Gerar todos os dias do calendário
    let date = startDate.clone();
    while (date.isBefore(endDate)) {
      this.days.push(date.clone());
      date.add(1, 'day');
    }
  }

  prevMonth() {
    this.currentDate.subtract(1, 'month');
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate.add(1, 'month');
    this.generateCalendar();
  }

  isMarked(date: moment.Moment): boolean {
    const dateStr = date.format('YYYY-MM-DD');
    return this.markedDates.includes(dateStr);
  }
  isSelected(date: moment.Moment): boolean {
    return !!this.selectedDate && date.isSame(this.selectedDate, 'day');
  }

  selectDate(date: moment.Moment, event: MouseEvent) {
    event.stopPropagation(); // Impede que o clique propague para o document
    this.selectedDate = date;
    this.dateSelected.emit(date.format('YYYY-MM-DD'));

    // Mantém o calendário aberto se tiver campo de hora
    if (this.hasTime) {
      this.openCalendar = true;
    }
  }
  onTimeChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.timeSelected.emit(inputElement.value); // Emite o valor para o pai
  }
  isCurrentMonth(date: moment.Moment): boolean {
    return date.month() === this.currentDate.month();
  }

  getMonthYear(): string {
    return this.currentDate.format('MMMM YYYY');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.openCalendar) {
      const calendarContainer = this.elementRef.nativeElement.querySelector(
        '.calendar-container'
      );
      const clickedInside =
        this.elementRef.nativeElement.contains(event.target) ||
        (calendarContainer && calendarContainer.contains(event.target));

      if (!clickedInside) {
        this.openCalendar = false;
        this.closeCalendar.emit();
      }
    }
  }
}
