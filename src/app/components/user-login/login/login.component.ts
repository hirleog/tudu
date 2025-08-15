import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  selectedTab: string = 'login';
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  userType: string = '';
  isProfessional: boolean = false;
  loginErrorMessage: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // this.route.queryParams.subscribe((params) => {
    //   this.isProfessionalParam = params['param'] || null;
    //   this.userType =
    //     this.isProfessionalParam === 'professional' ? 'prestador' : 'cliente';
    // });

    this.router.events.subscribe(() => {
      this.isProfessional = this.router.url.includes('professional');
    });
  }

  ngOnInit(): void {
    this.userType =
      this.isProfessional ? 'prestador' : 'cliente';

    // Inicializa o formulário de login
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Inicializa o formulário de registro
    this.registerForm = this.fb.group({
      telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      nome: ['', [Validators.required]],
      sobrenome: ['', [Validators.required]],
      // cpf: [
      //   '',
      //   [
      //     Validators.required,
      //     Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
      //   ],
      // ],
      // data_nascimento: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      // password: ['', [Validators.required, Validators.minLength(6)]],
      // endereco_estado: ['', [Validators.required]],
      // endereco_cidade: ['', [Validators.required]],
      // endereco_bairro: ['', [Validators.required]],
      // endereco_rua: ['', [Validators.required]],
      // endereco_numero: ['', [Validators.required]],
      // Campos adicionais para prestador
      // especializacao: [''],
      // descricao: [''],
      // avaliacao: [''],
    });
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isProfessional === true
        ? (this.userType = 'prestador')
        : (this.userType = 'cliente');

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password, this.userType).subscribe({
        next: (response) => {
          const indicatorFlow = response.role;

          // 🔐 Salvar o token ANTES de redirecionar
          const token = response.access_token; // ajuste aqui conforme o nome real da propriedade
          if (indicatorFlow === 'prestador') {
            localStorage.setItem('access_token_prestador', token);
            this.router.navigate(['/tudu-professional/home']);
          } else {
            localStorage.setItem('access_token_cliente', token);
            this.router.navigate(['/']);
          }
        },
        error: (error: any) => {
          this.loginErrorMessage = true;
          this.errorMessage = error.error.message || 'Erro desconhecido';

          if (this.isProfessional === true) {
            this.router.navigate([], {
              queryParams: { param: 'professional' },
              queryParamsHandling: 'merge',
            });
          } else {
            this.router.navigate(['/login']);
          }
        },
      });
    } else {
      console.error('Formulário de login inválido');
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      // Cria o payload com base no tipo de usuário
      const payload =
        this.userType === 'cliente'
          ? {
              // telefone: formValue.telefone,
              telefone: formValue.telefone,
              nome: formValue.nome,
              sobrenome: formValue.sobrenome,
              cpf: formValue.cpf,
              data_nascimento: formValue.data_nascimento,
              email: formValue.email,
              password: formValue.password,
              endereco_estado: formValue.endereco_estado,
              endereco_cidade: formValue.endereco_cidade,
              endereco_bairro: formValue.endereco_bairro,
              endereco_rua: formValue.endereco_rua,
              endereco_numero: formValue.endereco_numero,
            }
          : {
              // telefone: formValue.telefone,
              telefone: formValue.telefone,
              nome: formValue.nome,
              sobrenome: formValue.sobrenome,
              cpf: formValue.cpf,
              data_nascimento: formValue.data_nascimento,
              email: formValue.email,
              password: formValue.password,
              endereco_estado: formValue.endereco_estado,
              endereco_cidade: formValue.endereco_cidade,
              endereco_bairro: formValue.endereco_bairro,
              endereco_rua: formValue.endereco_rua,
              endereco_numero: formValue.endereco_numero,
              especializacao: formValue.especializacao,
              descricao: formValue.descricao,
              avaliacao: formValue.avaliacao,
            };

      this.authService.register(payload, this.userType).subscribe({
        next: (response) => {
          // Redireciona para a página de login com o parâmetro 'professional' se necessário
          if (this.userType !== 'cliente') {
            this.selectedTab = 'login';

            this.router.navigate(['/login'], {
              queryParams: { param: 'professional' },
            });
          } else {
            this.selectedTab = 'login';
            this.router.navigate(['/login']);
          }
        },
        error: (error) => {
          console.error('Erro no cadastro:', error);
        },
      });
    } else {
      console.error('Formulário de registro inválido');
    }
  }

  passwordMatchValidator(formGroup: FormGroup): void {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  openModal() {
    const modalElement = document.getElementById('alertModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
