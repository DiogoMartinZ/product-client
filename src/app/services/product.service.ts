import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Ajusta o URL conforme o porto HTTPS correto do teu backend .NET
  private apiUrl = 'https://localhost:7143/api/products';

  constructor(private http: HttpClient) {}

  getProducts(search?: string, minPrice?: number | null, maxPrice?: number | null): Observable<Product[]> {
    let params = new HttpParams();

    if (search) {
      params = params.set('search', search);
    }
    if (minPrice !== null && minPrice !== undefined && minPrice > 0) {
      params = params.set('minPrice', minPrice.toString());
    }
    if (maxPrice !== null && maxPrice !== undefined && maxPrice > 0) {
      params = params.set('maxPrice', maxPrice.toString());
    }

    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // UPDATE (Editar)
  updateProduct(product: Product): Observable<any> {
    return this.http.put(`${this.apiUrl}/${product.id}`, product);
  }

  // DELETE (Apagar)
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}