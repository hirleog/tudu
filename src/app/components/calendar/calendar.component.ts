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
  // currentDate = moment();
  days: moment.Moment[] = [];
  weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  selectedDate: moment.Moment | null = null;
  selectedTime: string = '';

  // timeSelected: string = '';
  dateSelected: string = '';

  @Input() openCalendar: boolean = false; // Array de datas no formato 'YYYY-MM-DD'
  @Input() showChangeDateBtn: boolean = true; // Array de datas no formato 'YYYY-MM-DD'
  @Input() hasTime: boolean = false; // Array de datas no formato 'YYYY-MM-DD'
  @Input() markedDates: string[] = []; // Array de datas no formato 'YYYY-MM-DD'

  @Input() initialDate: string = ''; // Nova entrada para definir a data inicial
  @Input() initialTime: string = ''; // Adicione isso junto com os outros @Input()
  @Input() initialDateTime: any; // Adicione isso junto com os outros @Input()

  // @Output() dateSelected = new EventEmitter<string>();
  // @Output() timeSelected = new EventEmitter<string>();
  @Output() closeCalendar = new EventEmitter<void>();
  @Output() dateSelectedChange = new EventEmitter<string>(); // Emite a data no formato 'DD/MM/YYYY'
  @Output() timeSelectedChange = new EventEmitter<string>(); // Emite o horário no formato 'HH:mm'
  @Output() dateTimeSelectedChange = new EventEmitter<string>(); // Emite a data e hora no formato 'DD/MM/YYYY - HH:mm'

  @Input() showWeekView: boolean = false;
  weekDays: { date: moment.Moment; isFirst: boolean }[] = [];
  calendarActive: boolean = false;
  hideCalendarDays: boolean = false;

  private today = moment();
  private maxSelectableDate = moment().add(15, 'days');

  dateTimeSelected: string = '';
  currentDate: moment.Moment = moment();
  daysOfWeek: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  daysInMonth: number[] = [];
  emptyDays: number[] = [];
  currentMonth: string = '';
  currentYear: string = '';
  timeSelected: string = '';
  availableTimes: string[] = [
    '08:00',
    '10:00',
    '12:00',
    '14:00',
    '16:00',
    '18:00',
    '20:00',
    '21:00',
  ];
  constructor(private elementRef: ElementRef) {
    this.generateCalendar();
  }

  ngOnInit() {
    this.generateCalendar();
    this.timeSelected = this.dateTimeSelected.split(' - ')[1] || '12:00';
  }

  generateCalendar(): void {
    // Limpa os arrays
    this.daysInMonth = [];
    this.emptyDays = [];

    // Obtém o primeiro dia do mês
    const firstDay = moment(this.currentDate).startOf('month');
    // Obtém o número de dias no mês
    const daysInMonth = this.currentDate.daysInMonth();

    // Preenche os dias vazios no início (dias do mês anterior)
    const startDay = firstDay.day();
    for (let i = 0; i < startDay; i++) {
      const prevMonth = moment(this.currentDate).subtract(1, 'month');
      const daysInPrevMonth = prevMonth.daysInMonth();
      this.emptyDays.push(daysInPrevMonth - (startDay - i - 1));
    }

    // Preenche os dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      this.daysInMonth.push(i);
    }

    // Atualiza o mês e ano exibidos
    this.currentMonth = this.currentDate.format('MMMM');
    this.currentYear = this.currentDate.format('YYYY');
  }

  isDayDisabled(day: number): boolean {
    const currentDate = moment(this.currentDate).date(day);

    // Verifica se a data é anterior ao dia atual
    const isBeforeToday = currentDate.isBefore(this.today, 'day');

    // Verifica se a data é mais de 15 dias no futuro
    const isAfterMaxDate = currentDate.isAfter(this.maxSelectableDate, 'day');

    return isBeforeToday || isAfterMaxDate;
  }

  previousMonth(): void {
    const prevMonth = moment(this.currentDate).subtract(1, 'month');

    // Verifica se o mês anterior contém dias selecionáveis
    const lastDayOfPrevMonth = prevMonth.endOf('month');
    if (lastDayOfPrevMonth.isAfter(this.today)) {
      this.currentDate = prevMonth;
      this.generateCalendar();
    } else {
      // Se o mês anterior estiver parcialmente no passado, verifique se há dias válidos
      const firstDayOfPrevMonth = prevMonth.startOf('month');
      if (firstDayOfPrevMonth.isBefore(this.today)) {
        this.currentDate = prevMonth;
        this.generateCalendar();
      }
    }
  }

  // Atualize o método nextMonth para não permitir navegar para meses com datas inválidas
  nextMonth(): void {
    const nextMonth = moment(this.currentDate).add(1, 'month');

    // Verifica se o próximo mês contém dias selecionáveis
    const lastDayOfNextMonth = nextMonth.endOf('month');
    if (lastDayOfNextMonth.isBefore(this.maxSelectableDate)) {
      this.currentDate = nextMonth;
      this.generateCalendar();
    } else {
      // Se o próximo mês estiver totalmente no futuro, não navegue
      const firstDayOfNextMonth = nextMonth.startOf('month');
      if (firstDayOfNextMonth.isBefore(this.maxSelectableDate)) {
        this.currentDate = nextMonth;
        this.generateCalendar();
      }
    }
  }

  selectDate(day: number): void {
    if (this.isDayDisabled(day)) return;

    const selectedDate = moment(this.currentDate).date(day);
    this.dateSelected = selectedDate.format('DD/MM/YYYY');
    this.dateSelectedChange.emit(this.dateSelected);

    this.hideCalendarDays = true;
    this.updateDateTime();
  }
  selectTime(time: string): void {
    this.timeSelected = time;
    this.timeSelectedChange.emit(this.timeSelected); // Emite o horário selecionado

    this.calendarActive = false;
    this.updateDateTime();
  }

  updateDateTime(): void {
    if (this.dateSelected && this.timeSelected) {
      this.dateTimeSelected = `${this.dateSelected} - ${this.timeSelected}`;
      this.dateTimeSelectedChange.emit(this.dateTimeSelected); // Emite data e hora juntos
    }
  }

  isSelected(day: number): boolean {
    if (!this.dateSelected) return false;
    const selectedDay = moment(this.dateSelected, 'DD/MM/YYYY').date();
    const selectedMonth = moment(this.dateSelected, 'DD/MM/YYYY').month();
    const selectedYear = moment(this.dateSelected, 'DD/MM/YYYY').year();

    return (
      day === selectedDay &&
      this.currentDate.month() === selectedMonth &&
      this.currentDate.year() === selectedYear
    );
  }

  onCalenderButtonInput() {
    this.calendarActive = !this.calendarActive;
    this.hideCalendarDays = false;
  }

  // @HostListener('document:click', ['$event'])
  // onClickOutside(event: MouseEvent) {
  //   if (!this.elementRef.nativeElement.contains(event.target)) {
  //     window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo
  //     this.calendarActive = false;
  //   }
  // }
}
