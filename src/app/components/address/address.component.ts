import { AddressService } from './../../services/address.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  options: string[] = ['Cadastrar novo endereço'];
  optionSelected: string = '';
  titleFlow: string = 'Onde o serviço vai ser realizado?';

  addressForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private route: Router
  ) {
    this.addressForm = this.fb.group({
      cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      street: [''],
      neighborhood: [''],
      city: [''],
      state: [''],
      number: ['', Validators.required],
      complement: ['']
    });

  }

  ngOnInit(): void {
  }


  onCepChange(event: any): void {
    const input = event.target as HTMLInputElement;
    let cep = input.value;

    // Remove o caractere '-' do CEP
    cep = cep.replace(/-/g, '');

    // Atualiza o valor do campo de entrada e do formulário
    this.addressForm.get('cep')?.setValue(cep, { emitEvent: false });

    if (cep && cep.length === 8) {
      this.addressService.getAddressByCep(cep).subscribe(
        (data) => {
          if (data && !data.erro) {
            this.addressForm.patchValue({
              street: data.logradouro,
              neighborhood: data.bairro,
              city: data.localidade,
              state: data.uf
            });
          } else {
            alert('CEP não encontrado!');
          }
        },
        (error) => {
          console.error('Erro ao buscar o CEP:', error);
        }
      );
    }
  }


  onSubmit() {
    if (this.addressForm.valid) {

      this.route.navigate(['/proposal/offer']);
    }
  }
}
