import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExperienceComponent } from 'src/app/components/templates/experience/experience.component';
import { PortfolioItemModel } from 'src/app/interfaces/portfolio-item-model';
import { AuthService } from 'src/app/services/auth.service';
import { ExperienceService } from 'src/app/services/experience.service';
import { ProfileDetailService } from 'src/app/services/profile-detail.service';
import { CustomModalComponent } from 'src/app/shared/custom-modal/custom-modal.component';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.css'],
})
export class ProfileDetailComponent implements OnInit {
  @ViewChild('meuModal') customModal!: CustomModalComponent;
  @ViewChild('experienceModal') experienceModal!: ExperienceComponent;
  @ViewChild('textareaDescricao') textareaDescricao!: ElementRef;

  editandoDescricao = false;
  descricaoOriginal = '';
  descricaoLength = 0;
  isEditMode = true;
  descricaoTemporaria = ''; // Variável temporária para edição

  userForm!: FormGroup;
  userData: any = {}; // Dados originais para exibição

  userId!: number;
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  isProfessional: boolean = false;

  id_cliente!: string | null;
  prestadorId!: string | null;

  activeTab: string = 'informacoes';

  experiencias: any[] = [];
  isImageModalOpen = false;
  currentExperience: any = {};
  currentImageIndex = 0;

  portfolioItems: PortfolioItemModel[] = [];
  prestadorProfileFile: any;
  budgetId: any;
  isBudgetConsult: boolean = false;
  budgetPedido: string = '';
  isLoading: boolean = false;
  modelActive: boolean = true;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private profileDetailService: ProfileDetailService,
    private authService: AuthService,
    private experienceService: ExperienceService,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events.subscribe(() => {
      this.isProfessional = this.router.url.includes('professional');
      this.isBudgetConsult = this.router.url.includes('id');
    });

    // id da url, só acontece na hora de consultar o prestador no fluxo de budgets
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['id']) {
        this.budgetId = params['id'];
        this.budgetPedido = params['pedido'];
      }
    });

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

    // Ouvir o evento de popstate (voltar do navegador)
    window.addEventListener('popstate', this.handlePopState.bind(this));

    if (this.isProfessional && this.isBudgetConsult === false) {
      this.loadUser();
      this.loadExperiences(this.prestadorId);
    } else if (this.budgetId) {
      this.selectTab('portfolio');
      this.loadUser();
      this.loadExperiences(this.budgetId);
    } else {
      this.loadUser();
    }
  }

  isPrestador(): boolean {
    return this.isProfessional === true;
  }

  loadUser(): void {
    let getFn: any;

    if (
      this.budgetId !== '' &&
      this.budgetId !== null &&
      this.budgetId !== undefined &&
      this.isBudgetConsult
    ) {
      this.userId = Number(this.budgetId);
      getFn = this.profileDetailService.getPrestadorById;
    } else if (this.isProfessional === true) {
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

  onFileSelected(event: any): void {
    if (this.isBudgetConsult) return;
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
    this.isLoading = true;

    const formData = { ...this.userForm.value };

    // Converter todos os valores string para minúsculas
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === 'string') {
        formData[key] = formData[key].toLowerCase();
      }
    });

    // Remove campos específicos do prestador se não for profissional
    if (!this.isProfessional) {
      const camposPrestador = [
        'especializacao',
        'descricao',
        'numero_servicos_feitos',
      ];
      camposPrestador.forEach((campo) => delete formData[campo]);
    }

    formData.descricao =
      this.descricaoTemporaria !== ''
        ? this.descricaoTemporaria
        : this.userData.descricao;
    this.userData = { ...this.userData, ...formData };

    const updateFn =
      this.isProfessional === true
        ? this.profileDetailService.updatePrestador
        : this.profileDetailService.updateCliente;

    updateFn
      .call(
        this.profileDetailService,
        this.userId,
        formData, // Usa o formData filtrado e convertido para minúsculas
        this.prestadorProfileFile
      )
      .subscribe({
        next: (response) => {
          window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo

          this.prestadorProfileFile = null;

          this.customModal.openModal();
          this.customModal.configureModal(
            true,
            response.message || 'Dados atualizados com sucesso.'
          );

          this.isLoading = false;
        },
        error: (error) => {
          this.customModal.openModal();
          this.customModal.configureModal(
            false,
            error.error.message || 'Erro ao atualizar os dados.'
          );
          this.isLoading = false;
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

  saveExperience(experienceData: any): void {
    console.log('Dados da experiência:', experienceData);

    // Aqui você faria o upload das imagens e salvaria no backend
    // this.uploadImagesAndSave(experienceData);
  }

  onModalClose(): void {
    console.log('Modal fechado');
  }

  loadExperiences(prestadorId: any): void {
    this.experienceService.getExperiencesByPrestador(prestadorId).subscribe({
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

  // Método para iniciar edição - CORRIGIDO
  iniciarEdicaoDescricao(): void {
    this.descricaoTemporaria = this.userData.descricao || '';
    this.editandoDescricao = true;
    this.descricaoLength = this.descricaoTemporaria.length;

    // Foca no textarea após a renderização
    setTimeout(() => {
      if (this.textareaDescricao && this.textareaDescricao.nativeElement) {
        this.textareaDescricao.nativeElement.focus();
      }
    }, 100);
  }

  // Método para cancelar edição - CORRIGIDO
  cancelarEdicaoDescricao(): void {
    this.modelActive = true;
    this.editandoDescricao = false;
    this.descricaoTemporaria = '';
  }

  // Método para salvar descrição - CORRIGIDO
  salvarDescricao(): void {
    this.modelActive = true;
    this.userData.descricao = this.descricaoTemporaria;
    this.editandoDescricao = false;

    // Aqui você chama o método para salvar no backend
    this.saveProfile();
    // }
  }

  // Atualiza contador de caracteres - CORRIGIDO
  atualizarContadorDescricao(event: any): void {
    this.descricaoLength = event.target.value.length;
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

  goBack() {
    if (this.router.url.includes('progress')) {
      this.router.navigate(['/home/progress']);
    } else if (this.isProfessional && !this.isBudgetConsult) {
      this.router.navigate(['/profile'], {
        queryParams: { param: 'professional' },
      });
    } else if (this.isBudgetConsult && this.budgetPedido !== '') {
      this.router.navigate(['/home/budgets'], {
        queryParams: { id: this.budgetPedido },
      });
    } else {
      this.router.navigate(['/profile']);
    }
  }

  handlePopState(event: PopStateEvent) {
    // Prevenir o comportamento padrão de voltar
    event.preventDefault();

    // Acionar seu método goBack personalizado
    this.goBack();
  }

  insertPortfolioTemplate(): void {
    this.modelActive = false;
    this.descricaoTemporaria = `💼 Profissional de [sua área de atuação]
apaixonado por [o que te motiva ou inspira na sua profissão].
com experiência em [principais áreas de atuação / serviços que você oferece],
busco [seu diferencial ou objetivo ao atender clientes].

🚀 Habilidades principais:
• [habilidade 1]
• [habilidade 2]
• [habilidade 3]
• [habilidade 4]

✨ Sempre em busca de [objetivo profissional, exemplo: aprender novas tecnologias / entregar experiências incríveis / inovar em cada projeto].`;
  }

  ngOnDestroy() {
    // Remover o listener para evitar memory leaks
    window.removeEventListener('popstate', this.handlePopState.bind(this));
  }
}
