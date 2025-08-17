import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  openClose: boolean = false;
  message: string = '';

  lastScrollPosition = 0;
  isHeaderVisible = true;
  headerHeight = 0;
  isMobile = false;

  hasOffer: boolean = false;

  constructor(private router: Router, private el: ElementRef) {}

  ngAfterViewInit() {
    this.checkMobile();

    // Obtém a altura do header-menu após a view ser inicializada
    const headerMenu = this.el.nativeElement.querySelector('[header-menu]');
    if (headerMenu) {
      this.headerHeight = headerMenu.offsetHeight;
    }
  }

  ngOnInit(): void {
    this.hasOffer = this.router.url.includes('offer');
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
  }

  private checkMobile() {
    this.isMobile = window.innerWidth < 768; // 768px é o breakpoint padrão do Tailwind para md
    if (!this.isMobile) {
      this.isHeaderVisible = true; // Garante que fique visível em desktop
    }
  }
  public menu() {
    this.openClose = !this.openClose;
  }

  receiveMessage(event: string) {
    this.message = event;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.isMobile) return;

    const currentScrollPosition =
      window.pageYOffset || document.documentElement.scrollTop;

    // Scroll DOWN - esconde o header
    if (
      currentScrollPosition > this.lastScrollPosition &&
      currentScrollPosition > 50
    ) {
      this.isHeaderVisible = false;
    }
    // Scroll UP - mostra o header
    else if (currentScrollPosition < this.lastScrollPosition) {
      this.isHeaderVisible = true;
    }

    this.lastScrollPosition = currentScrollPosition;
  }
}
