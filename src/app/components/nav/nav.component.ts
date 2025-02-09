import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  openClose: boolean = false;
  scrolled = false;
  previousScrollPosition = window.pageYOffset;
  navbarVisible = true;
  lastScrollTop = 0;
  message: string = '';

  itemCount: number = 0;
  private subscription: Subscription = new Subscription();
  private cardItemsSubscription: Subscription = new Subscription();

  constructor(private router: Router) {
 
  }

  ngOnInit(): void {
    // Inscreve-se no Observable para escutar mudanças
    // this.subscription = this.cartService.itemCount$.subscribe(
    //   (count) => (this.itemCount = count)
    // );


  }

  public menu() {
    this.openClose = !this.openClose;
  }

  receiveMessage(event: string) {
    this.message = event;
  }

  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  //   if (currentScroll > this.lastScrollTop) {
  //     // Rolando para baixo: esconde o navbar
  //     this.scrolled = true;
  //   } else {
  //     // Rolando para cima: mostra o navbar
  //     this.scrolled = false;
  //   }

  //   this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  // }
  // ngOnDestroy(): void {
  //   // Cancela a inscrição ao destruir o componente
  //   this.subscription.unsubscribe();
  // }
}






