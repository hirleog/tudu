import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  isProfessional: boolean = false;

  constructor(public authService: AuthService, private router: Router) {
    this.router.events.subscribe(() => {
      this.isProfessional = this.router.url.includes('professional');
    });
  }

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
