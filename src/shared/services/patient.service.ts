import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient, Consultation, Doctor } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  createPatient(patient: Partial<Patient>): Observable<any> {
    const { role, ...patientsansrole } = patient;
    console.log(patientsansrole)

    return this.http.post(`${this.apiUrl}/patient`, patientsansrole);
  }

  getPatient(patientId: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/patient/${patientId}`);
  }

  updatePatient(patientId: string, patient: Partial<Patient>): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/patient/${patientId}`, patient);
  }

  deletePatient(patientId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/patient/${patientId}`);
  }

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/admin/patient`);
  }

  getPatientConsultations(patientId: string): Observable< {consultations: Consultation[]; count: number}> {
    return this.http.get<{consultations: Consultation[]; count: number}>(`${this.apiUrl}/patient/${patientId}/consultations`);
  }

  getPatientDoctor(patientId: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/patient/${patientId}/doctor`);
  }

  assignDoctorToPatient(patientId: string, doctorId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/patient/${patientId}/assign-doctor/${doctorId}`, {});
  }

  createConsultation(patientId: string, consultation: Partial<Consultation>): Observable<any> {
    console.log(patientId,consultation)
    return this.http.post(`${this.apiUrl}/patient/${patientId}/consultations`, consultation);
  }
}