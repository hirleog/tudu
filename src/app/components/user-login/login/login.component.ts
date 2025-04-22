import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  isWorker: boolean = false; // Define se a rota é para "tudu-professional"
  isProfessionalParam: string = '';
  userType: string = '';
  isProfessional: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      this.isProfessionalParam = params['param'] || null;
      this.userType =
        this.isProfessionalParam === 'professional' ? 'prestador' : 'cliente';
    });
  }

  ngOnInit(): void {
    this.isWorker = this.router.url.includes('professional');

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
      this.isWorker === true
        ? (this.userType = 'prestador')
        : (this.userType = 'cliente');

      const { email, password } = this.loginForm.value;
      this.authService.login(email, password, this.userType).subscribe({
        next: (response) => {
          const indicatorFlow = response.role;
          console.log('faddssfdsf', indicatorFlow);

          if (indicatorFlow === 'prestador') {
            this.router.navigate(['/tudu-professional/home']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: () => {
          // Preserva a URL atual com os parâmetros de consulta
          if (this.isWorker) {
            this.router.navigate([], {
              queryParams: { param: 'professional' },
              queryParamsHandling: 'merge', // Garante que os parâmetros sejam mantidos
            });
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

  passwordMatchValidator(formGroup: FormGroup): void {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }
}
