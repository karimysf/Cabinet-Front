import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../shared/services/doctor.service';
import { AuthService } from '../../shared/services/auth.service';
import { Doctor, Patient, Consultation } from '../../shared/models/user.model';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="margin-top: 24px;">
      <h1 class="mb-6" style="font-size: 32px; color: #1f2937;">Doctor Dashboard</h1>
      
      <div class="grid grid-3">
        <!-- Profile Card -->
        <div class="card">
          <h3 style="color: #374151; margin-bottom: 16px;">My Profile</h3>
          <div *ngIf="currentDoctor">
            <div style="margin-bottom: 8px;">
              <strong>Dr. {{ currentDoctor.prenom }} {{ currentDoctor.nom }}</strong>
            </div>
            <div style="margin-bottom: 8px; color: #6b7280;">
              {{ currentDoctor.specialite }}
            </div>
            <div style="margin-bottom: 8px; font-size: 14px;">
              {{ currentDoctor.email }}
            </div>
            <div style="font-size: 14px;">
              {{ currentDoctor.tel }}
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div class="card">
          <h3 style="color: #374151; margin-bottom: 16px;">Statistics</h3>
          <div style="margin-bottom: 12px;">
            <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">{{ patients.length }}</div>
            <div style="color: #6b7280; font-size: 14px;">Total Patients</div>
          </div>
          <div style="margin-bottom: 12px;">
            <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">{{ pendingConsultations.length }}</div>
            <div style="color: #6b7280; font-size: 14px;">Pending Requests</div>
          </div>
          <div>
            <div style="font-size: 24px; font-weight: bold; color: #10b981;">{{ consultations.length }}</div>
            <div style="color: #6b7280; font-size: 14px;">Total Consultations</div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <h3 style="color: #374151; margin-bottom: 16px;">Quick Actions</h3>
          <button (click)="refreshData()" class="btn btn-primary" style="width: 100%; margin-bottom: 12px;">
            Refresh Data
          </button>
          <button (click)="showAllConsultations = !showAllConsultations" class="btn btn-secondary" style="width: 100%;">
            {{ showAllConsultations ? 'Hide' : 'View' }} All Consultations
          </button>
        </div>
      </div>

      <!-- Pending Consultation Requests -->
      <div class="card">
        <h2 style="font-size: 20px; margin-bottom: 16px; color: #374151;">
          Pending Consultation Requests 
          <span *ngIf="pendingConsultations.length > 0" style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 12px; font-size: 12px; margin-left: 8px;">
            {{ pendingConsultations.length }}
          </span>
        </h2>
        <div *ngIf="pendingConsultations.length > 0; else noPendingRequests">
          <table class="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Requested Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let consultation of pendingConsultations">
                <td>{{ consultation.patient?.prenom }} {{ consultation.patient?.nom }}</td>
                <td>{{ consultation.date | date: 'medium' }}</td>
                <td>{{ consultation.description || 'No description provided' }}</td>
                <td>
                  <button 
                    (click)="acceptConsultation(consultation)" 
                    class="btn btn-success" 
                    style="margin-right: 8px; font-size: 12px; padding: 6px 12px;">
                    Accept
                  </button>
                  <button 
                    (click)="rejectConsultation(consultation)" 
                    class="btn btn-danger" 
                    style="font-size: 12px; padding: 6px 12px;">
                    Reject
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <ng-template #noPendingRequests>
          <p style="color: #6b7280; text-align: center; padding: 40px;">No pending consultation requests.</p>
        </ng-template>
      </div>

      <!-- My Patients -->
      <div class="card">
        <h2 style="font-size: 20px; margin-bottom: 16px; color: #374151;">My Patients</h2>
        <div *ngIf="patients.length > 0; else noPatients">
          <div class="grid grid-2">
            <div *ngFor="let patient of patients" class="card" style="margin-bottom: 16px;">
              <h4 style="margin-bottom: 12px; color: #374151;">
                {{ patient.prenom }} {{ patient.nom }}
              </h4>
              <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
                <strong>DOB:</strong> {{ patient.date_naissance }}
              </div>
              <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
                <strong>Condition:</strong> {{ patient.maladie }}
              </div>
              <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
                <strong>Contact:</strong> {{ patient.email }}
              </div>
              <div style="font-size: 14px; color: #6b7280;">
                <strong>Phone:</strong> {{ patient.tel }}
              </div>
            </div>
          </div>
        </div>
        <ng-template #noPatients>
          <p style="color: #6b7280; text-align: center; padding: 40px;">No patients assigned yet.</p>
        </ng-template>
      </div>

      <!-- All Consultations (Toggleable) -->
      <div *ngIf="showAllConsultations" class="card">
        <h2 style="font-size: 20px; margin-bottom: 16px; color: #374151;">All Consultations</h2>
        <div *ngIf="consultations.length > 0; else noConsultations">
          <table class="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let consultation of consultations">
                <td>{{ consultation.patient?.prenom }} {{ consultation.patient?.nom }}</td>
                <td>{{ consultation.date | date: 'medium' }}</td>
                <td>
                  <span [style.color]="getStatusColor(consultation.etat)">
                    {{ consultation.etat }}
                  </span>
                </td>
                <td>{{ consultation.description || 'No description' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ng-template #noConsultations>
          <p style="color: #6b7280; text-align: center; padding: 40px;">No consultations yet.</p>
        </ng-template>
      </div>

      <div *ngIf="message" class="alert" [ngClass]="messageType === 'success' ? 'alert-success' : 'alert-error'">
        {{ message }}
      </div>
    </div>
  `
})
export class DoctorDashboardComponent implements OnInit {
  currentDoctor: Doctor | null = null;
  patients: Patient[] = [];
  consultations: Consultation[] = [];
  pendingConsultations: Consultation[] = [];
  showAllConsultations = false;
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user._id) {
      this.loadDoctorData(user._id);
    }
  }

  loadDoctorData(doctorId: string): void {
    // Load doctor profile
    this.doctorService.getDoctor(doctorId).subscribe({
      next: (doctor) => {
        this.currentDoctor = doctor;
      },
      error: (error) => {
        console.error('Error loading doctor data:', error);
      }
    });

    // Load patients
    this.doctorService.getDoctorPatients(doctorId).subscribe({
      next: (patients) => {
        this.patients = patients;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
      }
    });

    // Load all consultations
    this.doctorService.getDoctorConsultations(doctorId).subscribe({
      next: (consultations) => {
        this.consultations = consultations;
      },
      error: (error) => {
        console.error('Error loading consultations:', error);
      }
    });

    // Load pending consultations
    this.doctorService.getPendingConsultations(doctorId).subscribe({
      next: (pendingConsultations) => {
        this.pendingConsultations = pendingConsultations;
      },
      error: (error) => {
        console.error('Error loading pending consultations:', error);
      }
    });
  }

  acceptConsultation(consultation: Consultation): void {
    const user = this.authService.getCurrentUser();
    if (!user || !user._id
 || !consultation._id) return;

    this.doctorService.acceptConsultation(user._id
, consultation._id).subscribe({
      next: () => {
        this.showMessage('Consultation accepted successfully!', 'success');
        this.refreshData();
      },
      error: (error) => {
        this.showMessage('Error accepting consultation. Please try again.', 'error');
      }
    });
  }

  rejectConsultation(consultation: Consultation): void {
    const user = this.authService.getCurrentUser();
    if (!user || !user._id || !consultation._id) return;

    this.doctorService.rejectConsultation(user._id, consultation._id).subscribe({
      next: () => {
        this.showMessage('Consultation rejected.', 'success');
        this.refreshData();
      },
      error: (error) => {
        this.showMessage('Error rejecting consultation. Please try again.', 'error');
      }
    });
  }

  refreshData(): void {
    const user = this.authService.getCurrentUser();
    if (user && user._id) {
      this.loadDoctorData(user._id);
      this.showMessage('Data refreshed successfully!', 'success');
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'acceptée': return '#10b981';
      case 'rejetée': return '#ef4444';
      case 'demandée': return '#f59e0b';
      case 'prévue': return '#3b82f6';
      default: return '#6b7280';
    }
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}