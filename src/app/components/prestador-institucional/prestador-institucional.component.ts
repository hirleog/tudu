import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prestador-institucional',
  templateUrl: './prestador-institucional.component.html',
  styleUrls: ['./prestador-institucional.component.css'],
})
export class PrestadorInstitucionalComponent implements OnInit {
  constructor(private route: Router) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToProfessionalLogin() {
    this.route.navigate(['/login'], {
      queryParams: { param: 'professional' },
    });
  }

  scrollTo(section: string) {
    // Navega para a mesma rota com fragmento
    this.route.navigate([], { fragment: section }).then(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
}
