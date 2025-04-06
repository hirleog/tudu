import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.css'],
})
export class AppMenuComponent implements OnInit {
  hiddenRoutes = ['/proposal', '/proposal/address', '/proposal/offer'];
  showDiv = true;
  isProfessional: boolean = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(
          (event: RouterEvent): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.showDiv = !this.hiddenRoutes.includes(event.url);
      });

    // Verifica a rota atual e atualiza a variável showMenu
    this.router.events.subscribe(() => {
      this.isProfessional = this.router.url.includes('tudu-professional');
    });
  }

  ngOnInit(): void {
    // const array:any = [1];
    // for (let index = 0; index < array.length; index++) {
    //   const element = array[index];
    //   console.log(this.isProfessional);
    // }
  }
}
