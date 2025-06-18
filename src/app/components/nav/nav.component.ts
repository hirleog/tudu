import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
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
  hasOffer: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.hasOffer = this.router.url.includes('offer');
  }

  public menu() {
    this.openClose = !this.openClose;
  }

  receiveMessage(event: string) {
    this.message = event;
  }
}
