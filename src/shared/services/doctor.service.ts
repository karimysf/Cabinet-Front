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
    return this.http.post(`${this.apiUrl}/doctor`, doctor);
  }

  getDoctor(doctorId: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/doctor/${doctorId}`);
  }

  updateDoctor(doctorId: number, doctor: Partial<Doctor>): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/doctor/${doctorId}`, doctor);
  }

  deleteDoctor(doctorId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/doctor/${doctorId}`);
  }

  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/admin/doctor`);
  }

  getDoctorPatients(doctorId: number): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/doctor/${doctorId}/patients`);
  }

  getDoctorConsultations(doctorId: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.apiUrl}/doctor/${doctorId}/consultations`);
  }

  getPendingConsultations(doctorId: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.apiUrl}/doctor/${doctorId}/consultations/pending`);
  }

  acceptConsultation(doctorId: number, consultationId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/doctor/${doctorId}/consultations/${consultationId}/accept`, {});
  }

  rejectConsultation(doctorId: number, consultationId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/doctor/${doctorId}/consultations/${consultationId}/reject`, {});
  }
}