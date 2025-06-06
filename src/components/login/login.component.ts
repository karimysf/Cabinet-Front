import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { LoginRequest } from '../../shared/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="max-width: 400px; margin-top: 80px;">
      <div class="card">
        <div class="text-center mb-6">
          <h1 style="color: #3b82f6; font-size: 28px; margin-bottom: 8px;">HealthConnect</h1>
          <p style="color: #6b7280;">Medical Management System</p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input 
              type="email" 
              class="form-input" 
              [(ngModel)]="credentials.email" 
              name="email" 
              required
              placeholder="Enter your email">
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              type="password" 
              class="form-input" 
              [(ngModel)]="credentials.mot_de_passe" 
              name="password" 
              required
              placeholder="Enter your password">
          </div>

          <div *ngIf="error" class="alert alert-error">
            {{ error }}
          </div>

          <button 
            type="submit" 
            class="btn btn-primary" 
            style="width: 100%;"
            [disabled]="!loginForm.form.valid || loading">
            <span *ngIf="loading">Signing in...</span>
            <span *ngIf="!loading">Sign In</span>
          </button>
        </form>

        <div class="text-center mt-4">
          <p style="color: #6b7280; font-size: 14px;">
            Don't have an account? 
            <a href="/register" style="color: #3b82f6; text-decoration: none;">Register here</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  credentials: LoginRequest = {
    email: '',
    mot_de_passe: ''
  };
  
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.loading) return;
    
    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        const user = response;
        
        // Redirect based on user role
        switch (user.role) {
          case 'patient':
            this.router.navigate(['/patient']);
            break;
          case 'doctor':
            this.router.navigate(['/doctor']);
            break;
          case 'admin':
            this.router.navigate(['/admin']);
            break;
          default:
            this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}