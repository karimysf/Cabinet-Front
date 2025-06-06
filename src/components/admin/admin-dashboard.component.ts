import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../shared/services/admin.service';
import { DoctorService } from '../../shared/services/doctor.service';
import { AuthService } from '../../shared/services/auth.service';
import { Doctor, Patient } from '../../shared/models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="margin-top: 24px;">
      <h1 class="mb-6" style="font-size: 32px; color: #1f2937;">Admin Dashboard</h1>
      
      <!-- System Overview -->
      <div class="grid grid-3 mb-6">
        <div class="card text-center">
          <div style="font-size: 36px; font-weight: bold; color: #3b82f6; margin-bottom: 8px;">
            {{ doctors.length }}
          </div>
          <div style="color: #6b7280;">Total Doctors</div>
        </div>
        
        <div class="card text-center">
          <div style="font-size: 36px; font-weight: bold; color: #10b981; margin-bottom: 8px;">
            {{ patients.length }}
          </div>
          <div style="color: #6b7280;">Total Patients</div>
        </div>
        
        <div class="card text-center">
          <div style="font-size: 36px; font-weight: bold; color: #f59e0b; margin-bottom: 8px;">
            {{ pendingDoctorRequests.length }}
          </div>
          <div style="color: #6b7280;">Pending Doctor Requests</div>
        </div>
      </div>

      <!-- Add New Doctor -->
      <div class="card">
        <h2 style="font-size: 20px; margin-bottom: 16px; color: #374151;">Add New Doctor</h2>
        <form (ngSubmit)="addDoctor()" class="grid grid-2">
          <div class="form-group">
            <label class="form-label">First Name</label>
            <input type="text" class="form-input" [(ngModel)]="newDoctor.prenom" name="prenom" required>
          </div>
          <div class="form-group">
            <label class="form-label">Last Name</label>
            <input type="text" class="form-input" [(ngModel)]="newDoctor.nom" name="nom" required>
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" [(ngModel)]="newDoctor.email" name="email" required>
          </div>
          <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="tel" class="form-input" [(ngModel)]="newDoctor.tel" name="tel" required>
          </div>
          <div class="form-group">
            <label class="form-label">Specialty</label>
            <select class="form-select" [(ngModel)]="newDoctor.specialite" name="specialite" required>
              <option value="">Select Specialty</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General Practice">General Practice</option>
              <option value="Internal Medicine">Internal Medicine</option>
              <option value="Surgery">Surgery</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-input" [(ngModel)]="newDoctor.mot_de_passe" name="password" required>
          </div>
          <div class="form-group" style="grid-column: span 2;">
            <button type="submit" class="btn btn-primary" [disabled]="loading">
              {{ loading ? 'Adding...' : 'Add Doctor' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Pending Doctor Applications -->
      <div class="card" *ngIf="pendingDoctorRequests.length > 0">
        <h2 style="font-size: 20px; margin-bottom: 16px; color: #374151;">
          Pending Doctor Applications
          <span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 12px; font-size: 12px; margin-left: 8px;">
            {{ pendingDoctorRequests.length }}
          </span>
        </h2>
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Specialty</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let doctor of pendingDoctorRequests">
              <td>Dr. {{ doctor.prenom }} {{ doctor.nom }}</td>
              <td>{{ doctor.email }}</td>
              <td>{{ doctor.specialite }}</td>
              <td>{{ doctor.tel }}</td>
              <td>
                <button 
                  (click)="reviewDoctorApplication(doctor, 'approve')" 
                  class="btn btn-success" 
                  style="margin-right: 8px; font-size: 12px; padding: 6px 12px;">
                  Approve
                </button>
                <button 
                  (click)="reviewDoctorApplication(doctor, 'reject')" 
                  class="btn btn-danger" 
                  style="font-size: 12px; padding: 6px 12px;">
                  Reject
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- All Doctors -->
      <div class="card">
        <div class="flex justify-between items-center mb-4">
          <h2 style="font-size: 20px; color: #374151;">All Doctors</h2>
          <button (click)="refreshData()" class="btn btn-secondary">Refresh</button>
        </div>
        <div *ngIf="doctors.length > 0; else noDoctors">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialty</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let doctor of doctors">
                <td>Dr. {{ doctor.prenom }} {{ doctor.nom }}</td>
                <td>{{ doctor.specialite }}</td>
                <td>{{ doctor.email }}</td>
                <td>{{ doctor.tel }}</td>
                <td>
                  <button 
                    (click)="deleteDoctor(doctor)" 
                    class="btn btn-danger" 
                    style="font-size: 12px; padding: 6px 12px;">
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <ng-template #noDoctors>
          <p style="color: #6b7280; text-align: center; padding: 40px;">No doctors in the system yet.</p>
        </ng-template>
      </div>

      <!-- All Patients -->
      <div class="card">
        <h2 style="font-size: 20px; margin-bottom: 16px; color: #374151;">All Patients</h2>
        <div *ngIf="patients.length > 0; else noPatients">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date of Birth</th>
                <th>Condition</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let patient of patients">
                <td>{{ patient.prenom }} {{ patient.nom }}</td>
                <td>{{ patient.email }}</td>
                <td>{{ patient.date_naissance }}</td>
                <td>{{ patient.maladie }}</td>
                <td>{{ patient.tel }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ng-template #noPatients>
          <p style="color: #6b7280; text-align: center; padding: 40px;">No patients in the system yet.</p>
        </ng-template>
      </div>

      <div *ngIf="message" class="alert" [ngClass]="messageType === 'success' ? 'alert-success' : 'alert-error'">
        {{ message }}
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  pendingDoctorRequests: Doctor[] = [];
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  newDoctor: Partial<Doctor> = {
    nom: '',
    prenom: '',
    email: '',
    specialite: '',
    tel: '',
    mot_de_passe: '',
    role: 'doctor'
  };

  constructor(
    private adminService: AdminService,
    private doctorService: DoctorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Load all doctors
    this.adminService.getAllDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
      }
    });

    // Load all patients
    this.adminService.getAllPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
      }
    });

    // For demonstration purposes, we'll simulate pending doctor requests
    // In a real app, this would come from a dedicated endpoint
    this.pendingDoctorRequests = [
      {
        id: 999,
        nom: 'Johnson',
        prenom: 'Emily',
        email: 'emily.johnson@example.com',
        specialite: 'Cardiology',
        tel: '+1234567890',
        role: 'doctor'
      }
    ];
  }

  addDoctor(): void {
    this.loading = true;
    
    this.doctorService.addDoctor(this.newDoctor).subscribe({
      next: () => {
        this.loading = false;
        this.showMessage('Doctor added successfully!', 'success');
        this.resetForm();
        this.loadData();
      },
      error: (error) => {
        this.loading = false;
        this.showMessage('Error adding doctor. Please try again.', 'error');
      }
    });
  }

  reviewDoctorApplication(doctor: Doctor, action: 'approve' | 'reject'): void {
    const user = this.authService.getCurrentUser();
    if (!user || !user.id) return;

    this.adminService.reviewDoctorApplication(user.id, action).subscribe({
      next: () => {
        const actionText = action === 'approve' ? 'approved' : 'rejected';
        this.showMessage(`Doctor application ${actionText} successfully!`, 'success');
        
        if (action === 'approve') {
          // Add to approved doctors list
          this.doctors.push(doctor);
        }
        
        // Remove from pending requests
        this.pendingDoctorRequests = this.pendingDoctorRequests.filter(d => d.id !== doctor.id);
      },
      error: (error) => {
        this.showMessage('Error processing application. Please try again.', 'error');
      }
    });
  }

  deleteDoctor(doctor: Doctor): void {
    if (!doctor.id) return;
    
    if (confirm(`Are you sure you want to remove Dr. ${doctor.prenom} ${doctor.nom}?`)) {
      this.doctorService.deleteDoctor(doctor.id).subscribe({
        next: () => {
          this.showMessage('Doctor removed successfully!', 'success');
          this.doctors = this.doctors.filter(d => d.id !== doctor.id);
        },
        error: (error) => {
          this.showMessage('Error removing doctor. Please try again.', 'error');
        }
      });
    }
  }

  refreshData(): void {
    this.loadData();
    this.showMessage('Data refreshed successfully!', 'success');
  }

  resetForm(): void {
    this.newDoctor = {
      nom: '',
      prenom: '',
      email: '',
      specialite: '',
      tel: '',
      mot_de_passe: '',
      role: 'doctor'
    };
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}