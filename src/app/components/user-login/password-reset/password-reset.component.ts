import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CustomModalComponent } from 'src/app/shared/custom-modal/custom-modal.component';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
})
export class PasswordResetComponent implements OnInit {
  @ViewChild('meuModal') customModal!: CustomModalComponent;

  resetForm: FormGroup;
  currentStep: number = 1;
  userType: string = 'cliente';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  countdown: number = 60;
  countdownInterval: any;
  queryUserType: string = '';
  isProfessional: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events.subscribe(() => {
      this.isProfessional =
        this.router.url.includes('professional') ||
        this.router.url.includes('prestadores');
    });
    this.resetForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        code: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.userType = params['type'] || 'cliente';
    });

    this.queryUserType =
      this.userType === 'clientes' ? 'clientes' : 'prestadores';
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  // Step 1: Solicitar código
  requestResetCode() {
    if (this.resetForm.get('email')?.invalid) {
      this.errorMessage = 'Por favor, informe um email válido';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const email = this.resetForm.get('email')?.value;

    this.authService.requestPasswordReset(email, this.queryUserType).subscribe({
      next: () => {
        this.successMessage = 'Código enviado para seu email!';
        this.currentStep = 2;
        this.startCountdown();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Erro ao enviar código. Tente novamente.';
        this.isLoading = false;
      },
    });
  }

  // Step 2: Verificar código
  verifyCode() {
    if (this.resetForm.get('code')?.invalid) {
      this.errorMessage = 'Por favor, informe o código de 6 dígitos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const email = this.resetForm.get('email')?.value;
    const code = this.resetForm.get('code')?.value;

    this.authService
      .verifyResetCode(email, code, this.queryUserType)
      .subscribe({
        next: (response) => {
          if (response.valid) {
            this.successMessage = 'Código verificado com sucesso!';
            this.currentStep = 3;
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.errorMessage =
            error.error?.message || 'Código inválido ou expirado';
          this.isLoading = false;
        },
      });
  }

  // Step 3: Redefinir senha
  resetPassword() {
    if (this.resetForm.invalid) {
      if (this.resetForm.hasError('mismatch')) {
        this.errorMessage = 'As senhas não coincidem';
      } else {
        this.errorMessage = 'Por favor, preencha todos os campos corretamente';
      }
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const email = this.resetForm.get('email')?.value;
    const code = this.resetForm.get('code')?.value;
    const newPassword = this.resetForm.get('newPassword')?.value;
    const confirmPassword = this.resetForm.get('confirmPassword')?.value;

    this.authService
      .resetPasswordWithCode(
        email,
        code,
        newPassword,
        confirmPassword,
        this.queryUserType
      )
      .subscribe({
        next: () => {
          const flow =
            this.queryUserType === 'prestadores' ? 'professional' : null;
          this.successMessage = 'Senha redefinida com sucesso!';
          setTimeout(() => {
            this.router.navigate(['/login'], {
              queryParams: {
                param: flow,
              },
            });
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;

          this.customModal.openModal();
          this.customModal.configureModal(
            'error',
            error.error?.message || 'Erro ao redefinir senha'
          );
        },
      });
  }

  startCountdown() {
    this.countdown = 60;
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  resendCode() {
    if (this.countdown > 0) return;

    this.requestResetCode();
  }

  goBack() {
    if (this.isProfessional) {
      this.router.navigate(['/login'], {
        queryParams: {
          param: 'professional',
        },
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}
