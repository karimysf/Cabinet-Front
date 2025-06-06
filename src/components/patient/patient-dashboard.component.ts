import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../shared/services/patient.service';
import { DoctorService } from '../../shared/services/doctor.service';
import { AuthService } from '../../shared/services/auth.service';
import { Patient, Doctor, Consultation } from '../../shared/models/user.model';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="margin-top: 24px;">
      <h1 class="mb-6" style="font-size: 32px; color: #1f2937;">Patient Dashboard</h1>
      
      <div class="grid grid-2">
        <!-- Patient Profile -->
        <div class="card">
          <h2 style="font-size: 20px; margin-bottom: 16px; color: #374151;">My Profile</h2>
          <div *ngIf="currentPatient">
            <div style="margin-bottom: 12px;">
              <strong>Name:</strong> {{ currentPatient.prenom }} {{ currentPatient.nom }}
            </div>
            <div style="margin-bottom: 12px;">
              <strong>Email:</strong> {{ currentPatient.email }}
            </div>
            <div style="margin-bottom: 12px;">
              <strong>Date of Birth:</strong> {{ currentPatient.date_naissance }}
            </div>
            <div style="margin-bottom: 12px;">
              <strong>Phone:</strong> {{ currentPatient.tel }}
            </div>
            <div style="margin-bottom: 12px;">
              <strong>Condition:</strong> {{ currentPatient.maladie }}
            </div>
            <div style="margin-bottom: 12px;">
              <strong>Description:</strong> {{ currentPatient.description_maladie }}
            </div>
          </div>
        </div>

        <!-- Assigned Doctor -->
        <div class="card">
          <h2 style="font-size: 20px; margin-bottom: 16px; color: #374151;">My Doctor</h2>
          <div *ngIf="assignedDoctor; else noDoctorAssigned">
            <div style="margin-bottom: 12px;">
              <strong>Dr. {{ assignedDoctor.prenom }} {{ assignedDoctor.nom }}</strong>
            </div>
            <div style="margin-bottom: 12px;">
              <strong>Specialty:</strong> {{ assignedDoctor.specialite }}
            </div>
            <div style="margin-bottom: 12px;">
              <strong>Email:</strong> {{ assignedDoctor.email }}
            </div>
            <div style="margin-bottom: 12px;">
              <strong>Phone:</strong> {{ assignedDoctor.tel }}
            </div>
          </div>
          <ng-template #noDoctorAssigned>
            <p style="color: #6b7280;">No doctor assigned yet.</p>
            <button (click)="showDoctorSelection = true" class="btn btn-primary mt-4">
              Request Doctor Assignment
            </button>
          </ng-template>
        </div>
      </div>

      <!-- Doctor Selection Modal -->
      <div *ngIf="showDoctorSelection" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
        <div class="card" style="max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
          <h3 style="margin-bottom: 16px;">Select a Doctor</h3>
          <div *ngFor="let doctor of availableDoctors" 
               (click)="selectDoctor(doctor)" 
               style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 4px; margin-bottom: 8px; cursor: pointer; transition: background-color 0.2s;"
               onmouseover="this.style.backgroundColor='#f9fafb'" 
               onmouseout="this.style.backgroundColor='white'">
            <div><strong>Dr. {{ doctor.prenom }} {{ doctor.nom }}</strong></div>
            <div style="color: #6b7280; font-size: 14px;">{{ doctor.specialite }}</div>
          </div>
          <div class="mt-4">
            <button (click)="showDoctorSelection = false" class="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Request Consultation -->
      <div class="card">
        <h2 style="font-size: 20px; margin-bottom: 16px; color: #374151;">Request New Consultation</h2>
        <form (ngSubmit)="requestConsultation()" *ngIf="assignedDoctor">
          <div class="form-group">
            <label class="form-label">Consultation Date</label>
            <input type="datetime-local" class="form-input" [(ngModel)]="newConsultation.date" name="date" required>
          </div>
          <div class="form-group">
            <label class="form-label">Description (Optional)</label>
            <textarea class="form-input" [(ngModel)]="newConsultation.description" name="description" rows="3" placeholder="Describe your symptoms or concerns..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="loading">
            {{ loading ? 'Requesting...' : 'Request Consultation' }}
          </button>
        </form>
        <div *ngIf="!assignedDoctor" class="alert alert-info">
          You need to have a doctor assigned before requesting a consultation.
        </div>
      </div>

      <!-- My Consultations -->
      <div class="card">
        <h2 style="font-size: 20px; margin-bottom: 16px; color: #374151;">My Consultations</h2>
        <div *ngIf="consultations.length > 0; else noConsultations">
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Doctor</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let consultation of consultations">
                <td>{{ consultation.date | date: 'medium' }}</td>
                <td>Dr. {{ consultation.doctor?.prenom }} {{ consultation.doctor?.nom }}</td>
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
          <p style="color: #6b7280;">No consultations yet.</p>
        </ng-template>
      </div>

      <div *ngIf="message" class="alert" [ngClass]="messageType === 'success' ? 'alert-success' : 'alert-error'">
        {{ message }}
      </div>
    </div>
  `
})
export class PatientDashboardComponent implements OnInit {
  currentPatient: Patient | null = null;
  assignedDoctor: Doctor | null = null;
  consultations: Consultation[] = [];
  availableDoctors: Doctor[] = [];
  showDoctorSelection = false;
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  newConsultation = {
    date: '',
    description: ''
  };

  constructor(
    private patientService: PatientService,
    private doctorService: DoctorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user._id) {
      this.loadPatientData(user._id);
    }
  }

  loadPatientData(patientId: string): void {
    // Load patient profile
    this.patientService.getPatient(patientId).subscribe({
      next: (patient) => {
        this.currentPatient = patient;
      },
      error: (error) => {
        console.error('Error loading patient data:', error);
      }
    });

    // Load assigned doctor
    this.patientService.getPatientDoctor(patientId).subscribe({
      next: (doctor) => {
        this.assignedDoctor = doctor;
      },
      error: (error) => {
        console.log('No doctor assigned yet');
      }
    });

    // Load consultations
    this.patientService.getPatientConsultations(patientId).subscribe({
      next: (consultations) => {
        this.consultations = consultations;
      },
      error: (error) => {
        console.error('Error loading consultations:', error);
      }
    });

    // Load available doctors
    this.doctorService.getAllDoctors().subscribe({
      next: (doctors) => {
        this.availableDoctors = doctors;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
      }
    });
  }

  selectDoctor(doctor: Doctor): void {
    const user = this.authService.getCurrentUser();
    if (user && user._id && doctor._id) {
      this.patientService.assignDoctorToPatient(user._id, doctor._id).subscribe({
        next: () => {
          this.assignedDoctor = doctor;
          this.showDoctorSelection = false;
          this.showMessage('Doctor assigned successfully!', 'success');
        },
        error: (error) => {
          this.showMessage('Error assigning doctor. Please try again.', 'error');
        }
      });
    }
  }

  requestConsultation(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !user._id || !this.assignedDoctor?._id) return;

    this.loading = true;
    
    const consultationData = {
      doctor_id: this.assignedDoctor._id,
      date: this.newConsultation.date,
      description: this.newConsultation.description
    };

    this.patientService.createConsultation(user._id, consultationData).subscribe({
      next: () => {
        this.loading = false;
        this.showMessage('Consultation requested successfully!', 'success');
        this.newConsultation = { date: '', description: '' };
        this.loadPatientData(user._id!);
      },
      error: (error) => {
        this.loading = false;
        this.showMessage('Error requesting consultation. Please try again.', 'error');
      }
    });
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