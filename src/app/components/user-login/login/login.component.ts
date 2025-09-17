import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import * as bootstrap from 'bootstrap';
import { CustomModalComponent } from 'src/app/shared/custom-modal/custom-modal.component';
import { SharedService } from 'src/app/shared/shared.service';

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
  token: string = '';
  successRegisterIndicator: boolean = false;
  isLoadingBtn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private sharedService: SharedService
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

    if (this.authService.isClienteLoggedIn()) {
      this.router.navigate(['/home']);
    } else if (this.authService.isPrestadorLoggedIn()) {
      this.router.navigate(['/tudu-professional/home']);
    }

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
    this.isLoadingBtn = true;

    if (this.loginForm.valid) {
      this.isProfessional === true
        ? (this.userType = 'prestador')
        : (this.userType = 'cliente');

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password, this.userType).subscribe({
        next: (response) => {
          const indicatorFlow = response.role;

          // 🔐 Salvar o token ANTES de redirecionar
          this.token = response.access_token; // ajuste aqui conforme o nome real da propriedade
          if (indicatorFlow === 'prestador') {
            localStorage.setItem('access_token_prestador', this.token);
            this.router.navigate(['/tudu-professional/home']);
            this.isLoadingBtn = false;
          } else {
            localStorage.setItem('access_token_cliente', this.token);

            const isFirstProposal = this.sharedService.getProposalData();
            if (isFirstProposal) {
              this.router.navigate(['/proposal/offer']);
              this.isLoadingBtn = false;
            } else {
              this.router.navigate(['/']);
              this.isLoadingBtn = false;
            }
          }
        },
        error: (error: any) => {
          // this.loginErrorMessage = true;
          // this.errorMessage = error.error.message || 'Erro desconhecido';

          if (this.isProfessional === true) {
            this.router.navigate(['/login'], {
              queryParams: { param: 'professional' },
              queryParamsHandling: 'merge',
            });
            this.isLoadingBtn = false;
          } else {
            this.router.navigate(['/login']);
            this.isLoadingBtn = false;
          }

          this.customModal.openModal();
          this.customModal.configureModal(
            'error',
            error.error.message || 'Erro ao realizar login, tente novamente'
          );
        },
      });
    } else {
      console.error('Formulário de login inválido');
    }
  }

  onRegister(): void {
    this.isLoadingBtn = true;

    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      if (formValue.confirmPassword !== formValue.password) {
        this.customModal.openModal();
        this.customModal.configureModal('error', 'As senhas não coincidem');
        return;
      }

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
          this.successRegisterIndicator = true;

          this.customModal.openModal();
          this.customModal.configureModal(
            'success',
            response.message || 'Cadastro realizado com sucesso.'
          );
          this.isLoadingBtn = false;
        },
        error: (error) => {
          this.customModal.openModal();
          this.customModal.configureModal(
            'error',
            error.error.message || 'Erro ao se cadastrar, tente novamente'
          );
          this.isLoadingBtn = false;
        },
      });
    } else {
      this.customModal.openModal();
      this.customModal.configureModal(
        'error',
        'Formulário de registro inválido, revise os dados'
      );
      this.isLoadingBtn = false;
    }
  }
  goToLogin() {
    // Redireciona para a página de login com o parâmetro 'professional' se necessário
    if (this.token === '' && this.successRegisterIndicator === false) {
      return;
    } else if (this.successRegisterIndicator === true) {
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
