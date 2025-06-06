export interface User {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe?: string;
  role: 'patient' | 'doctor' | 'admin';
}

export interface Patient extends User {
  date_naissance: string;
  maladie: string;
  description_maladie: string;
  tel: string;
  role: 'patient';
}

export interface Doctor extends User {
  specialite: string;
  tel: string;
  role: 'doctor';
}

export interface Admin extends User {
  role: 'admin';
}

export interface Consultation {
  id?: number;
  patient_id: number;
  doctor_id: number;
  date: string;
  etat: 'prévue' | 'demandée' | 'acceptée' | 'rejetée';
  description?: string;
  patient?: Patient;
  doctor?: Doctor;
}

export interface LoginRequest {
  email: string;
  mot_de_passe: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  message: string;
}