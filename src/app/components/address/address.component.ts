import { Location } from '@angular/common';
import { AddressService } from './../../services/address.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
})
export class AddressComponent implements OnInit {
  @Input() showBtns: boolean = true;

  titleFlow: string = 'Onde o serviço vai ser realizado?';

  options: string[] = ['Cadastrar novo endereço', 'Usar endereço do cadastro'];
  optionSelected!: number;

  addressForm: FormGroup;
  filters: any;
  cardTitle: any;
  serviceDescription: any;

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private route: Router,
    private routeActive: ActivatedRoute,
    private location: Location
  ) {
    this.addressForm = this.fb.group({
      cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      street: [''],
      neighborhood: [''],
      city: [''],
      state: [''],
      number: ['', Validators.required],
      complement: [''],
    });

    this.routeActive.queryParams.subscribe((params) => {
      const addressContent = params['addressContent']
        ? JSON.parse(params['addressContent'])
        : null;
      if (addressContent && addressContent.length > 0) {
        this.optionSelected = 0;
        this.addressForm.patchValue(addressContent[0]);
      }

      this.cardTitle = params['cardTitle'];
      this.filters = params['filters'];
      this.serviceDescription = params['serviceDescription'] || '';
    });
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selectItem(index: number): void {
    this.optionSelected = index;
  }

  onCepChange(event: any): void {
    const input = event.target as HTMLInputElement;
    let cep = input.value;

    // Formata o CEP com máscara
    cep = cep.replace(/\D/g, '');
    if (cep.length > 5) {
      cep = cep.substring(0, 5) + '-' + cep.substring(5, 8);
    }
    input.value = cep;

    // Remove o caractere '-' para validação
    const cleanCep = cep.replace(/-/g, '');
    this.addressForm.get('cep')?.setValue(cleanCep, { emitEvent: false });

    if (cleanCep && cleanCep.length === 8) {
      this.addressService.getAddressByCep(cleanCep).subscribe(
        (data) => {
          if (data && !data.erro) {
            this.addressForm.patchValue({
              street: data.logradouro,
              neighborhood: data.bairro,
              city: data.localidade,
              state: data.uf,
            });
          } else {
            console.log('CEP não encontrado!');
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
      this.routeActive.queryParams.subscribe((params) => {
        this.route.navigate(['/proposal/offer'], {
          queryParams: {
            addressContent: JSON.stringify([this.addressForm.value]),
            cardTitle: params['cardTitle'],
            filters: params['filters'],
            serviceDescription: params['serviceDescription'] || '',
          },
        });
      });
    }
  }

  goBack() {
    this.routeActive.queryParams.subscribe((params) => {
      this.route.navigate(['/proposal'], {
        queryParams: {
          cardTitle: this.cardTitle,
          filters: this.filters,
          serviceDescription: this.serviceDescription,
        },
      });
    });
  }
}
