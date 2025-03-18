import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.css'],
})
export class AppMenuComponent implements OnInit {
  showMenu: boolean = true;

  constructor(private router: Router) {
    // Verifica a rota atual e atualiza a variável showMenu
    this.router.events.subscribe(() => {
      this.showMenu = !this.router.url.includes('tudu-professional');
    });
  }

  ngOnInit(): void {}
}
