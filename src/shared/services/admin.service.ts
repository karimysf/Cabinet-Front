import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor, Patient } from '../models/user.model';
import { AuthService } from './auth.service'; // Import AuthService

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5000';

  constructor(
    private http: HttpClient,
    private authService: AuthService // Inject AuthService
  ) {}

  // Updated method to include doctorId in URL and get adminId from auth
  reviewDoctorApplication(doctorId: string, action: 'approve' | 'reject'): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('No user is currently logged in');
    }

    if (!this.authService.hasRole('admin')) {
      throw new Error('Only admins can review doctor applications');
    }
    console.log(currentUser)
    console.log(action)
    console.log(doctorId )
    return this.http.post(`${this.apiUrl}/admin/review-doctor/${doctorId}`, {
      admin_id: currentUser._id, // Get from authenticated user
      action: action
    });
  }

  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/admin/doctors`);
  }

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/admin/patients`);
  }
   getPendingDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/admin/pending-doctors`);
  }
}