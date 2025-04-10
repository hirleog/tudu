import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  selectedTab: string = 'login';

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inicializa o formulário de login
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Inicializa o formulário de registro
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]], // Nome
      lastName: ['', [Validators.required]], // Sobrenome
      email: ['', [Validators.required, Validators.email]], // Email
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]], // Telefone
      password: ['', [Validators.required, Validators.minLength(6)]], // Senha
      confirmPassword: ['', [Validators.required]], // Confirmar Senha
    });
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Erro no login:', error);
        },
      });
    } else {
      console.error('Formulário de login inválido');
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const { name, lastName, email, phone, password } =
        this.registerForm.value;
      const payload = {
        nome: name,
        sobrenome: lastName,
        email,
        telefone: phone,
        password,
      };

      this.authService.register(payload).subscribe({
        next: (response) => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Erro no cadastro:', error);
        },
      });
    } else {
      console.error('Formulário de registro inválido');
    }
  }
}
