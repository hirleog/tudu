import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ExperienceComponent } from 'src/app/components/templates/experience/experience.component';
import { PortfolioItemModel } from 'src/app/interfaces/portfolio-item-model';
import { AuthService } from 'src/app/services/auth.service';
import { ExperienceService } from 'src/app/services/experience.service';
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
  @ViewChild('experienceModal') experienceModal!: ExperienceComponent;

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

  experiencias: any[] = [];
  isImageModalOpen = false;
  currentExperience: any = {};
  currentImageIndex = 0;

  portfolioItems: PortfolioItemModel[] = [];
  prestadorProfileFile: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private profileDetailService: ProfileDetailService,
    private authService: AuthService,
    private experienceService: ExperienceService
  ) {
    this.router.events.subscribe(() => {
      this.isProfessional = this.router.url.includes('professional');
    });

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
    this.loadExperiences();
  }

  isPrestador(): boolean {
    return this.isProfessional === true;
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
    const formData = { ...this.userForm.value };

    // Remove campos específicos do prestador se não for profissional
    if (!this.isProfessional) {
      const camposPrestador = [
        'especializacao',
        'descricao',
        'numero_servicos_feitos',
      ];
      camposPrestador.forEach((campo) => delete formData[campo]);
    }

    this.userData = { ...this.userData, ...formData };

    const updateFn =
      this.isProfessional === true
        ? this.profileDetailService.updatePrestador
        : this.profileDetailService.updateCliente;

    updateFn
      .call(
        this.profileDetailService,
        this.userId,
        formData, // Usa o formData filtrado
        this.prestadorProfileFile
      )
      .subscribe({
        next: (response) => {
          this.prestadorProfileFile = null;
          this.showModal = true;
          this.customModal.configureModal(
            true,
            response.message || 'Dados atualizados com sucesso.'
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

  goBack() {
    if (this.isProfessional) {
      this.router.navigate(['/profile'], {
        queryParams: { param: 'professional' },
      });
    } else {
      this.router.navigate(['/profile']);
    }
  }

  saveExperience(experienceData: any): void {
    console.log('Dados da experiência:', experienceData);

    // Aqui você faria o upload das imagens e salvaria no backend
    // this.uploadImagesAndSave(experienceData);
  }

  onModalClose(): void {
    console.log('Modal fechado');
  }

  loadExperiences(): void {
    this.experienceService
      .getExperiencesByPrestador(this.prestadorId)
      .subscribe({
        next: (experiences) => {
          this.portfolioItems = experiences;
        },
        error: (error) => {
          console.error('Erro ao carregar experiências:', error);
        },
      });
  }

  openImageModal(experiencia: any): void {
    console.log('Abrindo modal para:', experiencia);

    if (experiencia.imagens && experiencia.imagens.length > 0) {
      this.currentExperience = { ...experiencia }; // Cria uma cópia
      this.currentImageIndex = 0;
      this.isImageModalOpen = true;

      // Desabilita scroll
      document.body.style.overflow = 'hidden';
    } else {
      console.log('Esta experiência não tem imagens');
    }
  }

  closeImageModal(): void {
    this.isImageModalOpen = false;
    this.currentExperience = {};
    this.currentImageIndex = 0;

    // Reabilita scroll
    document.body.style.overflow = 'auto';
  }

  nextImage(event?: Event): void {
    if (event) {
      event.stopPropagation(); // Previne que o clique propague para o modal
    }

    if (this.currentExperience.imagens?.length > 1) {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.currentExperience.imagens.length;
    }
  }

  prevImage(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (this.currentExperience.imagens?.length > 1) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.currentExperience.imagens.length) %
        this.currentExperience.imagens.length;
    }
  }

  goToImage(index: number, event: Event): void {
    event.stopPropagation();

    if (
      this.currentExperience.imagens &&
      index >= 0 &&
      index < this.currentExperience.imagens.length
    ) {
      this.currentImageIndex = index;
    }
  }

  getImageUrl(experiencia: any): string {
    // Verifica se existem imagens e se a primeira imagem tem URL
    if (
      experiencia.imagens &&
      experiencia.imagens.length > 0 &&
      experiencia.imagens[0].url
    ) {
      return experiencia.imagens[0].url;
    }

    // Fallback para imagem placeholder
    return 'https://camarablu.sc.gov.br/images/img-indisponivel.jpg';
  }

  // Navegação por teclado
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isImageModalOpen) {
      switch (event.key) {
        case 'ArrowRight':
          this.nextImage();
          break;
        case 'ArrowLeft':
          this.prevImage();
          break;
        case 'Escape':
          this.closeImageModal();
          break;
      }
    }
  }
}
