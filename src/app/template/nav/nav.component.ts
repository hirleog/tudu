import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public openClose: boolean = false;
  scrolled = false;
  previousScrollPosition = window.pageYOffset;
  navbarVisible = true;
  lastScrollTop = 0;

  constructor() { }

  ngOnInit(): void {

  }

  public menu() {
    this.openClose = !this.openClose;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > this.lastScrollTop) {
      // Rolando para baixo: esconde o navbar
      this.scrolled = true;
    } else {
      // Rolando para cima: mostra o navbar
      this.scrolled = false;
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }
}




