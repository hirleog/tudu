import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  public cards: Array<any> = []
  constructor() {
    this.cards = [
      {
        image: '../../../assets/card1.svg',
        title: 'Vitrificação de Pintura',
        description: 'Aplicação de uma camada protetora de cerâmica líquida, que aumenta a resistência da pintura contra riscos, sujeira e agentes climáticos.',
        // link: '#'
      },
      {
        image: '../../../assets/card2.svg',
        title: 'Polimento Automotivo',
        description: 'Restauração do brilho da pintura, removendo pequenos riscos e imperfeições para um acabamento liso e reluzente.',
        // link: '#'
      },
      {
        image: '../../../assets/card3.svg',
        title: 'Impermeabilização de Estofados',
        description: 'Aplicação de um produto que protege os tecidos e couro contra manchas e sujeiras, facilitando a limpeza e prolongando a vida útil dos materiais.',
        // link: '#'
      }
    ];

  }

  ngOnInit(): void {
  }

  public wppMessageOptions(option: any) {

    const phoneNumber: string = '5511973752898'

    switch (option) {
      case 'Vitrificação de Pintura':
        window.open(
          `https://wa.me/${phoneNumber}?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20servi%C3%A7o%20de%20Vitrifica%C3%A7%C3%A3o%20de%20Pintura!`, "_blank"
        );
        break;
      case 'Polimento Automotivo':
        window.open(
          `https://wa.me/${phoneNumber}?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20servi%C3%A7o%20de%20Polimento%20Automotivo!`, "_blank"
        );
        break;
      case 'Impermeabilização de Estofados':
        window.open(
          `https://wa.me/${phoneNumber}?text=Ol%C3%A1!%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20a%20Impermeabiliza%C3%A7%C3%A3o%20de%20Estofados!`, "_blank"
        );
        break;
      default:
        break;
    }
  }

}
