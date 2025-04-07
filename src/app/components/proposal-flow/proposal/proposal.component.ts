import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterCategory } from 'src/app/interfaces/filters-model';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css'],
})
export class ProposalComponent implements OnInit {
  titleCard: string | null = null;
  selectedOptions: any[] = [];
  paramCategory: any;

  filterCategories: FilterCategory[] = [
    {
      title: '1. Local do Serviço',
      isSingleSelect: true, // Marca como seleção única
      options: [
        { label: 'Apartamento', value: 'apartment', selected: false },
        { label: 'Casa', value: 'house', selected: false },
        { label: 'Comercial/Escritório', value: 'commercial', selected: false },
        { label: 'Outro', value: 'other', selected: false },
      ],
    },
    {
      title: '2. Tipo de Pintura',
      options: [
        { label: 'Pintura interna', value: 'internal', selected: false },
        { label: 'Pintura externa', value: 'external', selected: false },
        {
          label: 'Pintura de muros/fachadas',
          value: 'facade',
          selected: false,
        },
        { label: 'Pintura de teto', value: 'ceiling_paint', selected: false }, // Alterado
        {
          label: 'Pintura de portas/portões',
          value: 'doors_paint',
          selected: false,
        }, // Alterado
        { label: 'Pintura de móveis', value: 'furniture', selected: false },
      ],
    },
    {
      title: '3. Área a Ser Pintada',
      options: [
        { label: 'Parede(s)', value: 'walls', selected: false },
        { label: 'Teto', value: 'ceiling_area', selected: false }, // Alterado
        { label: 'Portas/Janelas', value: 'doors_windows', selected: false },
        {
          label: 'Móveis embutidos',
          value: 'built_in_furniture',
          selected: false,
        },
        { label: 'Outros', value: 'other', selected: false },
      ],
    },
    {
      title: '4. Tipo de Superfície',
      options: [
        {
          label: 'Alvenaria (tijolo, concreto)',
          value: 'brick',
          selected: false,
        },
        { label: 'Drywall/Gesso', value: 'drywall', selected: false },
        { label: 'Madeira', value: 'wood', selected: false },
        { label: 'Metal', value: 'metal', selected: false },
        { label: 'Outros', value: 'other', selected: false },
      ],
    },
    {
      title: '5. Condição da Superfície',
      options: [
        { label: 'Nova (primeira pintura)', value: 'new', selected: false },
        {
          label: 'Já pintada (precisa de reparo/lixa)',
          value: 'repair',
          selected: false,
        },
        {
          label: 'Com infiltrações/umidade',
          value: 'humidity',
          selected: false,
        },
        { label: 'Com trincas/rachaduras', value: 'cracks', selected: false },
      ],
    },
    {
      title: '6. Serviços Adicionais',
      options: [
        {
          label: 'Preparação da superfície (lixamento, massa)',
          value: 'preparation',
          selected: false,
        },
        {
          label: 'Proteção de móveis e piso',
          value: 'protection',
          selected: false,
        },
        {
          label: 'Remoção de tinta antiga',
          value: 'paint_removal',
          selected: false,
        },
        {
          label: 'Pintura decorativa (textura, efeitos)',
          value: 'decorative',
          selected: false,
        },
      ],
    },
  ];

  constructor(private routeActive: ActivatedRoute, private route: Router) {
    // parametro para chamar a api de categorias e listar os filtros da categoria
    this.paramCategory = this.routeActive.snapshot.paramMap.get('card');
    console.log(this.paramCategory, 'asdhasdkasbd');
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo

    this.routeActive.paramMap.subscribe((params) => {
      this.titleCard = params.get('title'); // 'id' deve corresponder ao nome do parâmetro na rota
      // Aqui você pode usar o cardId para buscar mais informações ou realizar outras ações
    });
  }


  // Método para tratar o envio do formulário
  onSubmit(): void {
    this.filterCategories.forEach((element) => {
      element.options.forEach((option) => {
        if (option.selected) {
          this.selectedOptions.push(option);
        }
      });
    });
    console.log(this.selectedOptions, 'filterCategories');

    this.route.navigate(['/proposal/address']);
  }
  goBack(): void {
    this.route.navigate(['/']);
  }
}
