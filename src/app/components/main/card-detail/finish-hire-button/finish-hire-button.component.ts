import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-finish-hire-button',
  templateUrl: './finish-hire-button.component.html',
  styleUrls: ['./finish-hire-button.component.css'],
})
export class FinishHireButtonComponent implements OnInit {
  @Input() serviceName: string = '';
  @Input() serviceDescription: string = '';
  @Input() servicePrice: string = '';
  @Input() startDate: string = '';
  @Input() serviceDuration: string = '';

  @Output() onNegotiate = new EventEmitter<void>();
  @Output() onAdvance = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}
}
