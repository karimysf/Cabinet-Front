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
    return this.http.post(`${this.apiUrl}/patient`, patient);
  }

  getPatient(patientId: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/patient/${patientId}`);
  }

  updatePatient(patientId: number, patient: Partial<Patient>): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/patient/${patientId}`, patient);
  }

  deletePatient(patientId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/patient/${patientId}`);
  }

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/patient`);
  }

  getPatientConsultations(patientId: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.apiUrl}/patient/${patientId}/consultations`);
  }

  getPatientDoctor(patientId: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/patient/${patientId}/doctor`);
  }

  assignDoctorToPatient(patientId: number, doctorId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/patient/${patientId}/assign-doctor/${doctorId}`, {});
  }

  createConsultation(patientId: number, consultation: Partial<Consultation>): Observable<any> {
    return this.http.post(`${this.apiUrl}/patient/${patientId}/consultations`, consultation);
  }
}