import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileDetailService } from 'src/app/services/profile-detail.service';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.css'],
})
export class ProfileDetailComponent implements OnInit {
  userForm!: FormGroup;
  userId!: number;
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isProfessional: boolean = false;
  id_cliente!: string | null;
  prestadorId!: string | null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private profileDetailService: ProfileDetailService,
    private authService: AuthService
  ) {
    this.router.events.subscribe(() => {
      this.isProfessional = this.router.url.includes('professional');
    });

    console.log('User Type:', this.isProfessional);

    // this.id_prestador = localStorage.getItem('prestador_id');
    // this.id_cliente = localStorage.getItem('cliente_id');
    this.authService.idCliente$.subscribe((id) => {
      this.id_cliente = id;
    });

    this.authService.idPrestador$.subscribe((id) => {
      this.prestadorId = id;
    });
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      telefone: [''],
      nome: [''],
      sobrenome: [''],
      cpf: [''],
      data_nascimento: [''],
      email: [''],
      password: [''], // Se necessário
      endereco_estado: [''],
      endereco_cidade: [''],
      endereco_bairro: [''],
      endereco_rua: [''],
      endereco_numero: [''],
      foto: [null],
      // Campos específicos do prestador:
      especializacao: [''],
      descricao: [''],
      avaliacao: [''],
      numero_servicos_feitos: [''],
    });

    this.loadUser();
  }

  loadUser(): void {
    let getFn: any;

    if (this.isProfessional === true) {
      this.userId = Number(this.prestadorId);
      getFn = this.profileDetailService.getPrestadorById;
    } else {
      this.userId = Number(this.id_cliente);
      getFn = this.profileDetailService.getClienteById;
    }

    getFn
      .call(this.profileDetailService, this.userId)
      .subscribe((data: any) => {
        this.userForm.patchValue(data);
        if (data.foto) this.imagePreview = data.foto;
      });
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.userForm.patchValue({ foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    const payload = this.userForm.value;

    const updateFn =
      this.isProfessional === true
        ? this.profileDetailService.updatePrestador
        : this.profileDetailService.updateCliente;

    updateFn.call(this.profileDetailService, this.userId, payload).subscribe({
      next: () => alert('Dados atualizados com sucesso.'),
      error: () => alert('Erro ao atualizar.'),
    });
  }

  goBack() {
    if (this.isProfessional) {
      this.router.navigate(['/profile'], {
        queryParams: { param: 'professional' },
      });
    } else {
      this.router.navigate(['/profile']);
    }
  }

  isPrestador(): boolean {
    return this.isProfessional === true;
  }
}
