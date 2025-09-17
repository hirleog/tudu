import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExperienceService } from 'src/app/services/experience.service';
import { CustomModalComponent } from 'src/app/shared/custom-modal/custom-modal.component';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css'],
})
export class ExperienceComponent {
  @ViewChild('meuModal') customModal!: CustomModalComponent;

  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();

  @Input() isOpen = false;
  @Input() prestadorId!: any; // Receber o ID do prestador

  experienceForm: FormGroup;
  imagePreviews: string[] = [];
  selectedFiles: File[] = [];
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private experienceService: ExperienceService
  ) {
    this.experienceForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.maxLength(500)]],
      empresa: [''],
      data_inicio: [''],
      data_fim: [''],
      tipo: ['projeto'],
    });
  }

  openModal(): void {
    this.isOpen = true;
    this.resetForm();
  }

  closeModal(): void {
    this.isOpen = false;
    this.onClose.emit();
  }

  resetForm(): void {
    this.experienceForm.reset({
      tipo: 'projeto',
    });
    this.imagePreviews = [];
    this.selectedFiles = [];
  }

  onFileSelected(event: any): void {
    const files = event.target.files;

    if (files && files.length > 0) {
      const newFiles = Array.from(files).slice(
        0,
        3 - this.selectedFiles.length
      ) as File[];

      newFiles.forEach((file) => {
        if (this.selectedFiles.length < 3 && file.type.startsWith('image/')) {
          this.selectedFiles.push(file);

          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imagePreviews.push(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  onSubmit(): void {
    if (this.experienceForm.valid && this.prestadorId) {
      this.isLoading = true;

      const formData = {
        ...this.experienceForm.value,
        prestador_id: this.prestadorId, // Adiciona o ID do prestador
      };

      // Envia para o backend
      this.experienceService
        .createExperience(formData, this.selectedFiles)
        .subscribe({
          next: (response) => {
            this.onSave.emit(response); // Emite o resultado
            this.closeModal();
            this.isLoading = false;
          },
          error: (error) => {
            this.customModal.openModal();
            this.customModal.configureModal(
              'error',
              error.message || 'Erro ao atualizar os dados.'
            );

            this.isLoading = false;
          },
        });
    }
  }

  get titulo() {
    return this.experienceForm.get('titulo');
  }
  get descricao() {
    return this.experienceForm.get('descricao');
  }
}
