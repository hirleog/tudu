import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-mobile-negotiation-bar',
  templateUrl: './mobile-negotiation-bar.component.html',
  styleUrls: ['./mobile-negotiation-bar.component.scss'],
})
export class MobileNegotiationBarComponent implements OnInit, OnDestroy {
  @Input() startDateTime!: Date | string;
  @Input() value!: string;
  @Input() negotiateButtonText: string = 'Negociar';
  @Input() advanceButtonText: string = 'Avançar';
  @Input() negotiateDisabled: boolean = false;
  @Input() advanceDisabled: boolean = false;
  // @Input() isVisible: boolean = true;
  @Input() hideAdvanceBtn: boolean = false;

  @Output() onNegotiate = new EventEmitter<void>();
  @Output() onAdvance = new EventEmitter<void>();

  isMobile = false;
  private resizeListener!: () => void;

  ngOnInit() {
    this.checkMobile();
    this.resizeListener = () => this.checkMobile();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy() {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private checkMobile() {
    this.isMobile = window.innerWidth < 768;
  }

  handleNegotiate() {
    if (!this.negotiateDisabled) {
      this.onNegotiate.emit();
    }
  }

  handleAdvance() {
    if (!this.advanceDisabled) {
      this.onAdvance.emit();
    }
  }
}
