import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {
  @ViewChild('bannerVideo') bannerVideo!: ElementRef;
  isVideoPlaying: boolean = true;  // Flag para controlar se o vídeo está sendo exibido
  loading: boolean = false;
  constructor() { }

  ngOnInit(): void {
    // Adiciona a classe 'fade-in' ao banner quando o componente é inicializado
    const banner = document.getElementById('banner');
    const bannerText = document.getElementById('banner-text');

    // Aplica o efeito de fade-in no banner e no texto após um pequeno atraso
    if (banner && bannerText) {
      setTimeout(() => {
        banner.classList.add('fade-in');
        bannerText.classList.add('fade-in');
      }, 100); // Um pequeno atraso antes de aplicar o fade-in
    }
  }

  ngAfterViewInit() {
    // const video: HTMLVideoElement = this.bannerVideo.nativeElement;

    // // Tenta carregar o vídeo
    // video.load();

    // // Tenta reproduzir o vídeo quando estiver pronto
    // video.addEventListener('canplay', () => {
    //   video.play().catch(error => {
    //     console.error("Erro ao tentar reproduzir o vídeo, substituindo por imagem:", error);
    //     this.isVideoPlaying = false;  // Se der erro, substitui o vídeo pela imagem
    //   });
    // });

    // // Caso o vídeo falhe ao carregar
    // video.addEventListener('error', () => {
    //   console.error("Erro ao carregar o vídeo, substituindo por imagem.");
    //   this.isVideoPlaying = false;
    // });
  }

}
