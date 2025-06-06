import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AuthService } from './shared/services/auth.service';
import { Routes } from '@angular/router';


// Import all components
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PatientDashboardComponent } from './components/patient/patient-dashboard.component';
import { DoctorDashboardComponent } from './components/doctor/doctor-dashboard.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard.component';
import { AuthGuard } from './shared/guards/auth.guard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavigationComponent],
  template: `
    <div style="min-height: 100vh; background-color: #f8fafc;">
      <app-navigation *ngIf="showNavigation"></app-navigation>
      <router-outlet></router-outlet>
    </div>
  `
})
export class App {
  showNavigation = false;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.showNavigation = !!user;
    });
  }
}

// Routes configuration
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'patient', 
    component: PatientDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'patient' }
  },
  { 
    path: 'doctor', 
    component: DoctorDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'doctor' }
  },
  { 
    path: 'admin', 
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'admin' }
  },
  { 
    path: 'unauthorized', 
    component: LoginComponent // In a real app, create an unauthorized component
  },
  { path: '**', redirectTo: '/login' }
];

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    AuthGuard,DatePipe
  ]
});