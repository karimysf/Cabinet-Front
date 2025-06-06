import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav style="background-color: #3b82f6; color: white; padding: 16px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div class="container">
        <div class="flex justify-between items-center">
          <div>
            <h2 style="font-size: 24px; font-weight: bold;">HealthConnect</h2>
          </div>
          
          <div *ngIf="currentUser" class="flex items-center gap-4">
            <div class="flex items-center gap-4">
              <a 
                *ngIf="currentUser.role === 'patient'" 
                routerLink="/patient" 
                style="color: white; text-decoration: none; padding: 8px 16px; border-radius: 4px; transition: background-color 0.2s;"
                routerLinkActive="active-link">
                Dashboard
              </a>
              <a 
                *ngIf="currentUser.role === 'doctor'" 
                routerLink="/doctor" 
                style="color: white; text-decoration: none; padding: 8px 16px; border-radius: 4px; transition: background-color 0.2s;"
                routerLinkActive="active-link">
                Dashboard
              </a>
              <a 
                *ngIf="currentUser.role === 'admin'" 
                routerLink="/admin" 
                style="color: white; text-decoration: none; padding: 8px 16px; border-radius: 4px; transition: background-color 0.2s;"
                routerLinkActive="active-link">
                Dashboard
              </a>
            </div>
            
            <div class="flex items-center gap-4">
              <span style="font-size: 14px; opacity: 0.9;">
                {{ currentUser.prenom }} {{ currentUser.nom }} ({{ currentUser.role }})
              </span>
              <button 
                (click)="logout()" 
                class="btn" 
                style="background-color: rgba(255,255,255,0.2); color: white; padding: 8px 16px; font-size: 14px;">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .active-link {
      background-color: rgba(255,255,255,0.2) !important;
    }
  `]
})
export class NavigationComponent {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}