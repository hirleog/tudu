import { Injectable } from '@angular/core';
import { CreateCard } from '../interfaces/create-card.model';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private selectedFiles: File[] = [];
  private proposalData: CreateCard | null = null;
  private priceData: CreateCard | null = null;

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
}
