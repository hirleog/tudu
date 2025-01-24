import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public openClose: boolean = false;
  public scrolled = false;
  public previousScrollPosition = window.pageYOffset;
  public navbarVisible = true;
  public lastScrollTop = 0;

  public itemCount: number = 0;
  private subscription: Subscription = new Subscription();
  private cardItemsSubscription: Subscription = new Subscription();

  constructor() { }

  ngOnInit(): void {
    // Inscreve-se no Observable para escutar mudanças
    // this.subscription = this.cartService.itemCount$.subscribe(
    //   (count) => (this.itemCount = count)
    // );

   
  }

  public menu() {
    this.openClose = !this.openClose;
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






