import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductListComponent } from './components/product-list/product-list';
import { authGuard } from './components/login/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductListComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];