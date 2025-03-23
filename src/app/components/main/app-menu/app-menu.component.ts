import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.css'],
})
export class AppMenuComponent implements OnInit {
  isProfessional: boolean = false;

  constructor(private router: Router) {
    // Verifica a rota atual e atualiza a variável showMenu
    this.router.events.subscribe(() => {
      this.isProfessional = !this.router.url.includes('tudu-professional');
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
