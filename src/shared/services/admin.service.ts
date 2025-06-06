import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor, Patient } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  reviewDoctorApplication(adminId: number, action: 'approve' | 'reject'): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/review_doctor`, {
      admin_id: adminId,
      action: action
    });
  }

  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/admin/doctor`);
  }

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/patient`);
  }
}