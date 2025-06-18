import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html'
})
export class CustomModalComponent {
  @Input() modalId = 'customModal';
  @Input() title = 'Aviso';
  @Input() message = '';
  @Input() closeButtonText = 'Fechar';
}
