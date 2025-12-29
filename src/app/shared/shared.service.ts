import { Injectable } from '@angular/core';
import { CreateCard } from '../interfaces/create-card.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private cardUpdatedSource = new BehaviorSubject<boolean>(false);
  cardUpdated$ = this.cardUpdatedSource.asObservable();

  private updatedCardSource = new BehaviorSubject<{
    id_pedido: string;
    payloadCard: any;
  } | null>(null);
  // Esse é o cara que o AppComponent vai assinar (subscribe)
  updatedCard$ = this.updatedCardSource.asObservable();
  
  private selectedFiles: File[] = [];
  private proposalData: CreateCard | null = null;
  private priceData: CreateCard | null = null;
  private pixStatus: boolean = false;
  updatedCardPayload: any;

  constructor() {}

  setFiles(files: File[]) {
    this.selectedFiles = files;
  }

  getFiles(): File[] {
    return this.selectedFiles;
  }

  setProposalData(data: CreateCard) {
    this.proposalData = data;
  }

  getProposalData(): CreateCard | null {
    return this.proposalData;
  }
  clearProposalData() {
    this.proposalData = null;
  }
  setPriceEstimation(data: CreateCard) {
    this.priceData = data;
  }

  getPriceEstimation(): CreateCard | null {
    return this.priceData;
  }
  clearPriceEstimation() {
    this.priceData = null;
  }

  setSuccessPixStatus(status: boolean) {
    this.cardUpdatedSource.next(status);
  }

  getSuccessPixStatus(): boolean {
    return this.cardUpdatedSource.value;
  }

  clearSuccessPixStatus() {
    this.cardUpdatedSource.next(false);
  }

  setUpdatedCardPayload(id_pedido: string, payloadCard: any) {
    console.log('Enviando payload para o AppComponent...');
    this.updatedCardSource.next({
      id_pedido: id_pedido,
      payloadCard: payloadCard,
    });
  }

  getUpdatedCardPayload() {
    return this.updatedCardSource.value;
  }

  clearUpdatedCardPayload() {
    this.updatedCardSource.next(null);
  }
}
