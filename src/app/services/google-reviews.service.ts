import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GoogleReviewsService {
  private apiKey = 'YOUR_API_KEY'; // Substitua pela sua chave de API
  private placeId = 'PLACE_ID';   // Substitua pelo Place ID do local
  private apiUrl = `https://maps.googleapis.com/maps/api/place/details/json`;

  constructor(private http: HttpClient) { }

    // Método para buscar avaliações
    getReviews(): Observable<any> {
      const url = `${this.apiUrl}?place_id=${this.placeId}&fields=name,rating,reviews&key=${this.apiKey}`;
      return this.http.get(url);
    }
}
