import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import * as bootstrap from 'bootstrap';
import { CustomModalComponent } from 'src/app/shared/custom-modal/custom-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('meuModal') customModal!: CustomModalComponent;

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
    this.userType = this.isProfessional ? 'prestador' : 'cliente';

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
          this.router.navigate(['/tudu-professional/home']);
          const token = response.access_token; // ajuste aqui conforme o nome real da propriedade
          if (indicatorFlow === 'prestador') {
            localStorage.setItem('access_token_prestador', token);
          } else {
            localStorage.setItem('access_token_cliente', token);
            this.router.navigate(['/']);
          }
        },
        error: (error: any) => {
          this.loginErrorMessage = true;

          if (this.isProfessional === true) {
            this.router.navigate([], {
              queryParams: { param: 'professional' },
              queryParamsHandling: 'merge',
            });
          } else {
            this.router.navigate(['/login']);
          }

          this.customModal.openModal();
          this.customModal.configureModal(
            false,
            error.error.message || 'Erro ao realizar login, tente novamente'
          );
        },
      });
    } else {
      console.error('Formulário de login inválido');
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      // Função para converter valores para minúsculas
      const convertToLowerCase = (obj: any): any => {
        const result: any = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            result[key] =
              typeof obj[key] === 'string' ? obj[key].toLowerCase() : obj[key];
          }
        }
        return result;
      };

      // Converte todos os valores string para minúsculas
      const lowerCaseFormValue = convertToLowerCase(formValue);

      // Cria o payload com base no tipo de usuário
      const payload =
        this.userType === 'cliente'
          ? {
              telefone: lowerCaseFormValue.telefone,
              nome: lowerCaseFormValue.nome,
              sobrenome: lowerCaseFormValue.sobrenome,
              cpf: lowerCaseFormValue.cpf,
              data_nascimento: lowerCaseFormValue.data_nascimento,
              email: lowerCaseFormValue.email,
              password: formValue.password,
              endereco_estado: lowerCaseFormValue.endereco_estado,
              endereco_cidade: lowerCaseFormValue.endereco_cidade,
              endereco_bairro: lowerCaseFormValue.endereco_bairro,
              endereco_rua: lowerCaseFormValue.endereco_rua,
              endereco_numero: lowerCaseFormValue.endereco_numero,
            }
          : {
              telefone: lowerCaseFormValue.telefone,
              nome: lowerCaseFormValue.nome,
              sobrenome: lowerCaseFormValue.sobrenome,
              cpf: lowerCaseFormValue.cpf,
              data_nascimento: lowerCaseFormValue.data_nascimento,
              email: lowerCaseFormValue.email,
              password: formValue.password,
              endereco_estado: lowerCaseFormValue.endereco_estado,
              endereco_cidade: lowerCaseFormValue.endereco_cidade,
              endereco_bairro: lowerCaseFormValue.endereco_bairro,
              endereco_rua: lowerCaseFormValue.endereco_rua,
              endereco_numero: lowerCaseFormValue.endereco_numero,
              especializacao: lowerCaseFormValue.especializacao,
              descricao: lowerCaseFormValue.descricao,
              avaliacao: lowerCaseFormValue.avaliacao,
            };

      this.authService.register(payload, this.userType).subscribe({
        next: (response) => {
          this.customModal.openModal();
          this.customModal.configureModal(
            true,
            response.message || 'Cadastro realizado com sucesso.'
          );
        },
        error: (error) => {
          this.customModal.openModal();
          this.customModal.configureModal(
            false,
            error.error.message || 'Erro ao se cadastrar, tente novamente'
          );
        },
      });
    } else {
      console.error('Formulário de registro inválido');
    }
  }

  goToLogin() {
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
    this.customModal.closeModal();
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
