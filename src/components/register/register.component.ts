import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { PatientService } from '../../shared/services/patient.service';
import { DoctorService } from '../../shared/services/doctor.service';
import { Patient, Doctor } from '../../shared/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="max-width: 600px; margin-top: 40px;">
      <div class="card">
        <div class="text-center mb-6">
          <h1 style="color: #3b82f6; font-size: 28px; margin-bottom: 8px;">Join HealthConnect</h1>
          <p style="color: #6b7280;">Create your account to get started</p>
        </div>

        <!-- Role Selection -->
        <div class="form-group">
          <label class="form-label">I am registering as:</label>
          <div style="display: flex; gap: 16px; margin-top: 8px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input 
                type="radio" 
                name="userType" 
                value="patient" 
                [(ngModel)]="userType" 
                style="margin-right: 8px;">
              <span>Patient</span>
            </label>
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input 
                type="radio" 
                name="userType" 
                value="doctor" 
                [(ngModel)]="userType" 
                style="margin-right: 8px;">
              <span>Doctor</span>
            </label>
          </div>
        </div>

        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <!-- Common Fields -->
          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label">First Name *</label>
              <input 
                type="text" 
                class="form-input" 
                [(ngModel)]="formData.prenom" 
                name="prenom" 
                required
                placeholder="Enter your first name">
            </div>
            <div class="form-group">
              <label class="form-label">Last Name *</label>
              <input 
                type="text" 
                class="form-input" 
                [(ngModel)]="formData.nom" 
                name="nom" 
                required
                placeholder="Enter your last name">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email *</label>
            <input 
              type="email" 
              class="form-input" 
              [(ngModel)]="formData.email" 
              name="email" 
              required
              placeholder="Enter your email address">
          </div>

          <div class="form-group">
            <label class="form-label">Phone Number *</label>
            <input 
              type="tel" 
              class="form-input" 
              [(ngModel)]="formData.tel" 
              name="tel" 
              required
              placeholder="Enter your phone number">
          </div>

          <div class="form-group">
            <label class="form-label">Password *</label>
            <input 
              type="password" 
              class="form-input" 
              [(ngModel)]="formData.mot_de_passe" 
              name="password" 
              required
              placeholder="Create a strong password">
          </div>

          <div class="form-group">
            <label class="form-label">Confirm Password *</label>
            <input 
              type="password" 
              class="form-input" 
              [(ngModel)]="confirmPassword" 
              name="confirmPassword" 
              required
              placeholder="Confirm your password">
          </div>

          <!-- Patient-specific fields -->
          <div *ngIf="userType === 'patient'">
            <h3 style="color: #374151; margin: 24px 0 16px 0; font-size: 18px;">Patient Information</h3>
            
            <div class="form-group">
              <label class="form-label">Date of Birth *</label>
              <input 
                type="date" 
                class="form-input" 
                [(ngModel)]="patientData.date_naissance" 
                name="dateOfBirth" 
                required>
            </div>

            <div class="form-group">
              <label class="form-label">Medical Condition *</label>
              <input 
                type="text" 
                class="form-input" 
                [(ngModel)]="patientData.maladie" 
                name="condition" 
                required
                placeholder="e.g., Diabetes, Hypertension, etc.">
            </div>

            <div class="form-group">
              <label class="form-label">Condition Description</label>
              <textarea 
                class="form-input" 
                [(ngModel)]="patientData.description_maladie" 
                name="conditionDescription" 
                rows="3"
                placeholder="Provide additional details about your condition..."></textarea>
            </div>
          </div>

          <!-- Doctor-specific fields -->
          <div *ngIf="userType === 'doctor'">
            <h3 style="color: #374151; margin: 24px 0 16px 0; font-size: 18px;">Doctor Information</h3>
            
            <div class="form-group">
              <label class="form-label">Medical Specialty *</label>
              <select 
                class="form-select" 
                [(ngModel)]="doctorData.specialite" 
                name="specialty" 
                required>
                <option value="">Select your specialty</option>
               <option value="Généraliste">Généraliste</option>
<option value="Cardiologue">Cardiologue</option>
<option value="Pneumologue">Pneumologue</option>
<option value="Dermatologue">Dermatologue</option>
<option value="Pédiatre">Pédiatre</option>
<option value="Neurologue">Neurologue</option>
<option value="Gastro-entérologue">Gastro-entérologue</option>
<option value="Endocrinologue">Endocrinologue</option>
<option value="Rhumatologue">Rhumatologue</option>
<option value="Ophtalmologue">Ophtalmologue</option>
<option value="ORL">ORL</option>
<option value="Gynécologue">Gynécologue</option>
<option value="Urologue">Urologue</option>
<option value="Néphrologue">Néphrologue</option>
<option value="Oncologue">Oncologue</option>
<option value="Hématologue">Hématologue</option>
<option value="Chirurgien général">Chirurgien général</option>
<option value="Chirurgien orthopédiste">Chirurgien orthopédiste</option>
<option value="Chirurgien cardiaque">Chirurgien cardiaque</option>
<option value="Chirurgien plastique">Chirurgien plastique</option>
<option value="Radiologue">Radiologue</option>
<option value="Anesthésiste">Anesthésiste</option>
<option value="Médecin du sport">Médecin du sport</option>
<option value="Médecin du travail">Médecin du travail</option>
<option value="Psychiatre">Psychiatre</option>
<option value="Psychologue">Psychologue</option>
<option value="Médecin urgentiste">Médecin urgentiste</option>
<option value="Allergologue">Allergologue</option>
<option value="Infectiologue">Infectiologue</option>
<option value="Médecin interne">Médecin interne</option>
<option value="Gériatre">Gériatre</option>
<option value="Médecin rééducateur">Médecin rééducateur</option>
              </select>
            </div>

            <div class="alert alert-info">
              <strong>Note:</strong> Doctor registrations require admin approval. You will be notified once your application is reviewed.
            </div>
          </div>

          <div *ngIf="error" class="alert alert-error">
            {{ error }}
          </div>

          <div *ngIf="success" class="alert alert-success">
            {{ success }}
          </div>

          <button 
            type="submit" 
            class="btn btn-primary" 
            style="width: 100%; margin-top: 16px;"
            [disabled]="!registerForm.form.valid || loading || !userType">
            <span *ngIf="loading">
              {{ userType === 'doctor' ? 'Submitting Application...' : 'Creating Account...' }}
            </span>
            <span *ngIf="!loading">
              {{ userType === 'doctor' ? 'Submit Doctor Application' : 'Create Patient Account' }}
            </span>
          </button>
        </form>

        <div class="text-center mt-4">
          <p style="color: #6b7280; font-size: 14px;">
            Already have an account? 
            <a href="/login" style="color: #3b82f6; text-decoration: none;">Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  userType: 'patient' | 'doctor' = 'patient';
  loading = false;
  error = '';
  success = '';
  confirmPassword = '';

  formData = {
    nom: '',
    prenom: '',
    email: '',
    tel: '',
    mot_de_passe: ''
  };

  patientData = {
    date_naissance: '',
    maladie: '',
    description_maladie: ''
  };

  doctorData = {
    specialite: ''
  };

  constructor(
    private patientService: PatientService,
    private doctorService: DoctorService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.loading) return;

    // Validate passwords match
    if (this.formData.mot_de_passe !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    // Validate password strength
    if (this.formData.mot_de_passe.length < 6) {
      this.error = 'Password must be at least 6 characters long';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    if (this.userType === 'patient') {
      this.registerPatient();

    } else {
      this.registerDoctor();
    }
  }

  private registerPatient(): void {
    const patientData: Partial<Patient> = {
      ...this.formData,
      ...this.patientData,
      role: 'patient'
    };

    this.patientService.createPatient(patientData).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = 'Patient account created successfully! You can now log in.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  private registerDoctor(): void {
    const doctorData: Partial<Doctor> = {
      ...this.formData,
      ...this.doctorData,
 
    };


    this.doctorService.submitRegistrationRequest(doctorData).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = 'Doctor application submitted successfully! Please wait for admin approval. You will be contacted via email.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Application submission failed. Please try again.';
      }
    });
  }
}