import { Injectable } from '@angular/core';
import { CreateCard } from '../interfaces/create-card.model';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private cardUpdatedSource = new BehaviorSubject<boolean>(false);
  cardUpdated$ = this.cardUpdatedSource.asObservable();

  private updatedCardPayloadSource = new BehaviorSubject<any>(null);

  private triggerUpdateSource = new Subject<void>();
  triggerUpdate$ = this.triggerUpdateSource.asObservable();

  private updateFinalizadoSource = new Subject<boolean>();
  updateFinalizado$ = this.updateFinalizadoSource.asObservable();

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

  setUpdatedCardPayload(id_pedido: string, payload: any) {
    this.updatedCardPayloadSource.next({ id_pedido, payload });
  }

  getPayload() {
    return this.updatedCardPayloadSource.value;
  }

  requestUpdate() {
    this.triggerUpdateSource.next();
  }
  notifyUpdateComplete(sucesso: boolean) {
    this.updateFinalizadoSource.next(sucesso);
  }

  clearAll() {
    this.updatedCardPayloadSource.next(null);
  }
}
