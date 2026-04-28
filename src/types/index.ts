export type PatientStatus = 'Stable' | 'Critical' | 'Recovering' | 'Discharged';
export type ViewMode = 'grid' | 'list';
export type Gender = 'Male' | 'Female';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  condition: string;
  status: PatientStatus;
  doctor: string;
  lastVisit: string;
  phone: string;
  bloodType: string;
  ward: string;
  admittedDate: string;
}

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  timestamp: Date;
  read: boolean;
}
