import { Component, Input, Output, EventEmitter } from '@angular/core';

interface EmptyStateConfig {
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  primaryActionText?: string;
  secondaryActionText?: string;
}

@Component({
  selector: 'app-fallback-message',
  templateUrl: './fallback-message.component.html',
  styleUrls: ['./fallback-message.component.css'],
})
export class FallbackMessageComponent {
  @Input() card: any[] = [];
  @Input() statusPedido: string = '';
  @Input() customTitle?: string;
  @Input() customDescription?: string;
  @Input() primaryActionText?: string;
  @Input() secondaryActionText?: string;

  @Output() primaryAction = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();

  get emptyStateConfig(): EmptyStateConfig {
    // Se não há propostas
    // if (this.card.length === 0) {
    //   return {
    //     title: 'Nenhuma Proposta',
    //     description:
    //       'Você ainda não possui negociações ou propostas recebidas.',
    //     icon: '📄',
    //     iconColor: 'text-gray-500',
    //     bgColor: 'bg-gray-100',
    //     primaryActionText: this.primaryActionText || 'Anúnciar Grátis',
    //     secondaryActionText: this.secondaryActionText,
    //   };
    // }

    // Se há status de pedido
    if (this.statusPedido) {
      switch (this.statusPedido.toLowerCase()) {
        case 'finalizado':
          return {
            title: this.customTitle || 'Serviço Concluído! 🎉',
            description:
              this.customDescription ||
              'O serviço foi finalizado com sucesso. Agradecemos pela confiança!',
            icon: '✅',
            iconColor: 'text-green-500',
            bgColor: 'bg-green-100',
            primaryActionText: this.primaryActionText || 'Ver Detalhes',
            secondaryActionText: this.secondaryActionText || 'Avaliar Serviço',
          };

        // case 'cancelado':
        //   return {
        //     title: this.customTitle || 'Serviço Cancelado',
        //     description:
        //       this.customDescription ||
        //       'O serviço foi cancelado pelo prestador. Você pode buscar outros profissionais disponíveis.',
        //     icon: '❌',
        //     iconColor: 'text-red-500',
        //     bgColor: 'bg-red-100',
        //     primaryActionText: this.primaryActionText || 'Buscar Profissionais',
        //     secondaryActionText: this.secondaryActionText || 'Voltar ao Início',
        //   };

        case 'indisponivel':
          return {
            title: this.customTitle || 'Proposta Indisponível',
            description:
              this.customDescription ||
              'Esta proposta não está mais disponível para visualização.',
            icon: '⚠️',
            iconColor: 'text-yellow-500',
            bgColor: 'bg-yellow-100',
            primaryActionText: this.primaryActionText || 'Ver Outras Propostas',
            // secondaryActionText: this.secondaryActionText || 'Meus Anúncios',
          };

        default:
          return this.getDefaultConfig();
      }
    }

    return this.getDefaultConfig();
  }

  private getDefaultConfig(): EmptyStateConfig {
    return {
      title: this.customTitle || 'Nenhuma Proposta',
      description:
        this.customDescription || 'Você ainda não possui negociações.',
      icon: '📄',
      iconColor: 'text-gray-500',
      bgColor: 'bg-gray-100',
      primaryActionText: this.primaryActionText || 'Anúnciar Grátis',
      secondaryActionText: this.secondaryActionText,
    };
  }

  // Método para determinar se deve mostrar o componente
  shouldShowEmptyState(): boolean {
    return (
      this.card.length === 0 ||
      ['finalizado', 'cancelado', 'indisponível', 'indisponivel'].includes(
        this.statusPedido?.toLowerCase()
      )
    );
  }

  onPrimaryAction() {
    this.primaryAction.emit();
  }

  onSecondaryAction() {
    this.secondaryAction.emit();
  }
}
