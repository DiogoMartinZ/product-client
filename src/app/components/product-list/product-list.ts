import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  
  // Variáveis de filtro
  searchTerm = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  // Subject para controlar o atraso (debounce) da pesquisa
  private searchSubject = new Subject<void>();
  private subscription = new Subscription();

  showModal = false;
  isEditMode = false;
  editingProductId: number | null = null;
  productForm!: FormGroup;
  successMessage: string | null = null;

  constructor(
    private productService: ProductService,
    private authService: AuthService, 
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.initForm();

    // Configura o debounce: espera 400ms após o utilizador parar de escrever/mudar preços
    this.subscription.add(
      this.searchSubject.pipe(
        //debounceTime(400),
        distinctUntilChanged()
      ).subscribe(() => {
        this.loadProducts();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  // <--- ESTE É O MÉTODO QUE O HTML ESTÁ A TENTAR CHAMAR --->
  onFilterChange(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts(this.searchTerm, this.minPrice, this.maxPrice).subscribe({
      next: (data) => {
        this.products = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar produtos', err)
    });
  }

 openCreateModal(): void {
    this.isEditMode = false;
    this.editingProductId = null;
    this.productForm.reset({ name: '', description: '', price: 0, stock: 0 });
    this.showModal = true;
    
    // Força o Angular a desenhar o modal imediatamente
    this.cdr.detectChanges();
  }

  openEditModal(product: Product): void {
    this.isEditMode = true;
    this.editingProductId = product.id;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock
    });
    this.showModal = true;
    
    // Força o Angular a desenhar o modal imediatamente
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    
    // Força o Angular a esconder o modal imediatamente
    this.cdr.detectChanges();
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValues = this.productForm.value;

    if (this.isEditMode && this.editingProductId !== null) {
      const updatedProduct: Product = {
        id: this.editingProductId,
        ...formValues
      };

      this.productService.updateProduct(updatedProduct).subscribe({
        next: () => {
          this.loadProducts(); // Recarrega a lista da BD e fecha o modal
          this.closeModal();
          this.showSuccess('Produto atualizado com sucesso!');
        },
        error: (err) => console.error('Erro ao atualizar produto', err)
      });

    } else {
      this.productService.createProduct(formValues).subscribe({
        next: () => {
          this.loadProducts(); // Recarrega a lista da BD e fecha o modal
          this.closeModal();
        },
        error: (err) => console.error('Erro ao criar produto', err)
      });
    }
  }

 deleteProduct(id: number): void {
    if (confirm('Tens a certeza que pretendes apagar este produto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts(); // Recarrega a lista da BD e força a atualização visual
          this.showSuccess('Produto apagado com sucesso!');
        },
        error: (err) => console.error('Erro ao apagar produto', err)
      });
    }
  }

adjustStock(product: Product, delta: number): void {
    const newStock = product.stock + delta;
    
    // Evita stock negativo
    if (newStock < 0) return;

    const updatedProduct: Product = {
      ...product,
      stock: newStock
    };

    this.productService.updateProduct(updatedProduct).subscribe({
      next: () => {
        product.stock = newStock;
        this.showSuccess('Stock atualizado!');
        // <-- ADICIONA ISTO: Força o Angular a atualizar a vista imediatamente
        this.cdr.detectChanges(); 

      },
      error: (err) => console.error('Erro ao atualizar stock', err)
    });
  }

logout(): void {
    this.authService.logout(); // Remove do localStorage
    this.router.navigate(['/login']); // Redireciona para o login
  }
  
  showSuccess(message: string): void {
  this.successMessage = message;
  this.cdr.detectChanges();

  // Esconde a mensagem automaticamente após 3.5 segundos
  setTimeout(() => {
    this.successMessage = null;
    this.cdr.detectChanges();
  }, 3500);
}
}