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

    // Fallback: Recupera os dados dos query parameters
    this.routeActive.queryParams.subscribe((params) => {
      const addressContent = params['addressContent']
        ? JSON.parse(params['addressContent'])
        : null;
      if (addressContent && addressContent.length > 0) {
        this.optionSelected = 0;
        this.addressForm.patchValue(addressContent[0]);
      }

      // const cardTitle = params['cardTitle']
      // const filters = params['filters'];
      //   // ? JSON.parse(params['filters'])
      //   // : null;

      // if (cardTitle && filters) {
      //   // this.titleFlow = proposalContent.cardTitle;

      //   //   addressContent: JSON.stringify([this.addressForm.value]),
      //   //   cardTitle: params['cardTitle'],
      //   //   filters: JSON.stringify(params['filters']),
      // }
    });

    // this.routeActive.queryParams.subscribe((params) => {
    //   this.route.navigate(['/proposal/address'], {
    //     queryParams: {
    //       addressContent: params['addressContent'], // Reenvia os parâmetros
    //       proposalContent: params['proposalContent'],
    //     },
    //   });
    // });
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo

    // Recupera os dados do estado da navegação
    // const navigation = this.route.getCurrentNavigation();
    // const state = navigation?.extras.state as { addressData: any };

    // if (state?.addressData) {
    //   // Preenche o formulário com os dados recuperados do estado
    //   this.addressForm.patchValue(state.addressData);
    // } else {
    //   // Fallback: Recupera os dados dos query parameters
    //   this.routeActive.queryParams.subscribe((params) => {
    //     const addressContent = params['addressContent']
    //       ? JSON.parse(params['addressContent'])
    //       : null;

    //     if (addressContent && addressContent.length > 0) {
    //       this.addressForm.patchValue(addressContent[0]);
    //     }
    //   });
    // }
  }

  selectItem(index: number): void {
    this.optionSelected = index;
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
              state: data.uf,
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
      this.routeActive.queryParams.subscribe((params) => {
        this.route.navigate(['/proposal/offer'], {
          queryParams: {
            addressContent: JSON.stringify([this.addressForm.value]),
            cardTitle: params['cardTitle'],
            filters: params['filters'],
          },
        });
      });
    }
  }

  goBack() {
    this.routeActive.queryParams.subscribe((params) => {
      this.route.navigate(['/proposal'], {
        queryParams: {
          cardTitle: params['cardTitle'], // Reenvia os parâmetros
          filters: params['filters'],
        },
      });
    });
  }
}
