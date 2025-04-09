import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  url: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  postCard(card: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'access-control-allow-origin': '*',
    });

    return this.http.post(`${this.url}/cards`, card, { headers });
  }
}
