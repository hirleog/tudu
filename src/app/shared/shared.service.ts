import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private selectedFiles: File[] = [];

  constructor() {}

  setFiles(files: File[]) {
    this.selectedFiles = files;
  }

  getFiles(): File[] {
    return this.selectedFiles;
  }
}
