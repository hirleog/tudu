import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly viaCepUrl = 'https://viacep.com.br/ws';
  private readonly baseUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) {}

  getAddressByCep(cep: string): Observable<any> {
    return this.http.get(`${this.viaCepUrl}/${cep}/json/`);
  }

  // getCoordsByCep(cep: string): Observable<{ lat: number; lon: number }> {
  //   const params = new HttpParams()
  //     .set('q', cep)
  //     .set('countrycodes', 'br')
  //     .set('format', 'json')
  //     .set('limit', '1');

  //   return this.http.get<any[]>(this.baseUrl, { params }).pipe(
  //     map((results) => {
  //       if (!results.length) throw new Error('CEP não encontrado');
  //       return {
  //         lat: parseFloat(results[0].lat),
  //         lon: parseFloat(results[0].lon),
  //       };
  //     })
  //   );
  // }

   getCoordsByCep(cep: string): Observable<{ lat: number, lon: number }> {
    return this.http.get<any[]>(
      `https://nominatim.openstreetmap.org/search?postalcode=${cep}&country=Brazil&format=json`
    ).pipe(
      map(results => {
        if (results.length > 0) {
          return { lat: parseFloat(results[0].lat), lon: parseFloat(results[0].lon) };
        }
        throw new Error('Coordenadas não encontradas');
      })
    );
  }
}
