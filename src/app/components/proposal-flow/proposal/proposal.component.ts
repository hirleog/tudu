import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {

  titleCard: string | null = null;
  selectedOptions: string[] = [];
  isFirstSlide: boolean = true;
  isLastSlide: boolean = true;

  constructor(
    private routeActive: ActivatedRoute,
    private route: Router,

  ) { }

  ngOnInit(): void {
    this.routeActive.paramMap.subscribe(params => {
      this.titleCard = params.get('title'); // 'id' deve corresponder ao nome do parâmetro na rota
      // Aqui você pode usar o cardId para buscar mais informações ou realizar outras ações
    });
  }

  // onSlide(event: any): void {
  //   // Verifica se estamos no terceiro slide (índice 2, pois começa em 0)
  //   const activeIndex = event.to;  // `event.to` é o índice do slide para o qual estamos indo

  //   const totalSlides = event.relatedTarget.closest('.carousel').querySelectorAll('.carousel-item').length;

  //   if (activeIndex === totalSlides - 1) {
  //     this.isLastSlide = false;  // A lógica para o terceiro slide
  //   } else {
  //     this.isLastSlide = true;  // Não está no último slide
  //   }
  // }


  onSlide(event: any): void {
    // Verifica se estamos no terceiro slide (índice 2, pois começa em 0)
    const activeIndex = event.to;  // `event.to` é o índice do slide para o qual estamos indo
  
    const totalSlides = event.relatedTarget.closest('.carousel').querySelectorAll('.carousel-item').length;
  
    if (activeIndex === totalSlides - 1) {
      this.isLastSlide = false;  // A lógica para o terceiro slide
    } else {
      this.isLastSlide = true;  // Não está no último slide
    }
  
    // Verifica se estamos no primeiro slide
    if (activeIndex === 0) {
      this.isFirstSlide = true;  // Está no primeiro slide
    } else {
      this.isFirstSlide = false;  // Não está no primeiro slide
    }
  }

  // Método para tratar o envio do formulário
  onSubmit(): void {
    this.route.navigate(['/proposal/address']);

  }
  goBack(): void {
    this.route.navigate(['/']);
  }

}
