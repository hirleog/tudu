import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  loginEmail: string = '';
  loginPassword: string = '';
  registerName: string = '';
  registerEmail: string = '';
  registerPassword: string = '';
  confirmPassword: string = '';

  selectedTab: string = 'login';


  selectTab(tab: string) {


    this.selectedTab = tab;
  }

  onLogin(): void {
    console.log('Login:', { email: this.loginEmail, password: this.loginPassword });
    // Adicione a lógica de autenticação aqui
  }

  onRegister(): void {
    if (this.registerPassword === this.confirmPassword) {
      console.log('Register:', {
        name: this.registerName,
        email: this.registerEmail,
        password: this.registerPassword
      });
      // Adicione a lógica de cadastro aqui
    } else {
      console.error('As senhas não conferem');
    }
  }
}
