import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileDetailService } from 'src/app/services/profile-detail.service';
import { CustomModalComponent } from 'src/app/shared/custom-modal/custom-modal.component';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.css'],
})
export class ProfileDetailComponent implements OnInit {
  @ViewChild('meuModal') customModal!: CustomModalComponent;

  userForm!: FormGroup;
  userData: any = {}; // Dados originais para exibição

  userId!: number;
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isProfessional: boolean = false;
  id_cliente!: string | null;
  prestadorId!: string | null;
  showModal: boolean = false;

  activeTab: string = 'informacoes';

  portfolioItems = [
    {
      titulo: 'Apartamento Moderno',
      descricao: 'Design de interiores completo para apartamento de 80m²',
      data: 'Jan 2023',
      imagem: 'https://via.placeholder.com/400x300?text=Projeto+1',
    },
    {
      titulo: 'Escritório Corporativo',
      descricao: 'Ambiente de trabalho para empresa de tecnologia',
      data: 'Out 2022',
      imagem: 'https://via.placeholder.com/400x300?text=Projeto+2',
    },
    {
      titulo: 'Cozinha Integrada',
      descricao: 'Reforma completa de cozinha em estilo contemporâneo',
      data: 'Ago 2022',
      imagem: 'https://via.placeholder.com/400x300?text=Projeto+3',
    },
  ];
  prestadorProfileFile: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private profileDetailService: ProfileDetailService,
    private authService: AuthService,
    private sharedService: SharedService
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
        this.userData = { ...data }; // Salva os dados originais
        this.userForm.patchValue(data); // Preenche o formulário
        if (data.foto) this.imagePreview = data.foto;
      });
  }

  // onImageSelected(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.imagePreview = reader.result;
  //       this.userForm.patchValue({ foto: reader.result });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }
  triggerFileInput(): void {
    const fileInput = document.getElementById(
      'profile-pic-input'
    ) as HTMLInputElement;
    fileInput?.click();

    if (fileInput?.files) {
      const file = fileInput.files[0];
      if (file) {
        this.prestadorProfileFile = file;

        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
          this.userForm.patchValue({ foto: reader.result });
        };
        reader.readAsDataURL(file);
        console.log('lala', this.userForm);
      }
    }
  }

  onFileSelected(event: any): void {
    // const files = event.target.file;

    const fileInput = document.getElementById(
      'profile-pic-input'
    ) as HTMLInputElement;
    fileInput?.click();

    if (fileInput?.files) {
      const file = fileInput.files[0];
      if (file) {
        this.prestadorProfileFile = file;

        const reader = new FileReader();
        reader.onload = (e: any) => {
          const profileImg = document.querySelector(
            '.profile-pic-upload img'
          ) as HTMLImageElement;
          if (profileImg) {
            profileImg.src = e.target.result;
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  saveProfile(): void {
    const payload = this.userForm.value;
    this.userData = { ...this.userData, ...payload };

    const updateFn =
      this.isProfessional === true
        ? this.profileDetailService.updatePrestador
        : this.profileDetailService.updateCliente;

    updateFn
      .call(
        this.profileDetailService,
        this.userId,
        payload,
        this.prestadorProfileFile
      )
      .subscribe({
        next: (response) => {
          this.prestadorProfileFile = null; // Limpa o arquivo após envio
          this.showModal = true;

          this.customModal.configureModal(
            true,
            response.message || 'Pedido cancelado com sucesso.'
          );
        },
        error: (error) => {
          this.showModal = true;
          this.customModal.configureModal(
            false,
            error.message || 'Erro ao atualizar os dados.'
          );
        },
      });
  }

  cancelEdit(): void {
    // Restaura os valores originais do formulário
    this.userForm.patchValue(this.userData);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo
  }

  selectTab(tab: string): void {
    this.activeTab = tab;
  }

  // onFilesSelected(event: any) {
  //   const files = event.target.files;
  //   this.selectedFiles = [];
  //   this.selectedPreviews = [];

  //   if (files) {
  //     for (let i = 0; i < files.length; i++) {
  //       const file = files[i];
  //       this.selectedFiles.push(file);
  //       this.sharedService.setFiles(this.selectedFiles);

  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         this.selectedPreviews.push(e.target.result);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // }

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
