import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor, Patient, Consultation } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  submitRegistrationRequest(doctor: Partial<Doctor>): Observable<any> {
    return this.http.post(`${this.apiUrl}/doctor/admin/request`, doctor);
  }

  addDoctor(doctor: Partial<Doctor>): Observable<any> {
  
   const { role, ...doctorWithoutRole } = doctor;

  const payload = {
    ...doctorWithoutRole,
    created_at: new Date().toISOString()  // format ISO standard
  };

  console.log('Doctor sent to backend:', payload);

  return this.http.post(`${this.apiUrl}/doctor`, payload);
  }

  getDoctor(doctorId: string): Observable<Doctor> {
    
    return this.http.get<Doctor>(`${this.apiUrl}/doctor/${doctorId}`);
  }

  updateDoctor(doctorId: string, doctor: Partial<Doctor>): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/doctor/${doctorId}`, doctor);
  }

  deleteDoctor(doctorId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/doctor/${doctorId}`);
  }

  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/admin/doctor`);
  }

  getDoctorPatients(doctorId: string): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/doctor/${doctorId}/patients`);
  }

  getDoctorConsultations(doctorId: string): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.apiUrl}/doctor/${doctorId}/consultations`);
  }

  getPendingConsultations(doctorId: string): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.apiUrl}/doctor/${doctorId}/consultations/pending`);
  }

  acceptConsultation(doctorId: string, consultationId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/doctor/${doctorId}/consultations/${consultationId}/accept`, {});
  }

  rejectConsultation(doctorId: string, consultationId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/doctor/${doctorId}/consultations/${consultationId}/reject`, {});
  }
}