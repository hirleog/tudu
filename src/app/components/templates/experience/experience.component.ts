import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExperienceService } from 'src/app/services/experience.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css'],
})
export class ExperienceComponent {
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();

  @Input() isOpen = false;
  @Input() prestadorId!: any; // Receber o ID do prestador

  experienceForm: FormGroup;
  imagePreviews: string[] = [];
  selectedFiles: File[] = [];

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
      const formData = {
        ...this.experienceForm.value,
        prestador_id: this.prestadorId, // Adiciona o ID do prestador
      };

      // Envia para o backend
      this.experienceService
        .createExperience(formData, this.selectedFiles)
        .subscribe({
          next: (response) => {
            console.log('Experiência criada com sucesso:', response);
            this.onSave.emit(response); // Emite o resultado
            this.closeModal();
          },
          error: (error) => {
            console.error('Erro ao criar experiência:', error);
            alert('Erro ao salvar experiência. Tente novamente.');
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
