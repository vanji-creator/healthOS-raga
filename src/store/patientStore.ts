import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Patient, PatientStatus, ViewMode } from '../types';
import { mockPatients } from '../data/mockPatients';

interface PatientState {
  patients: Patient[];
  viewMode: ViewMode;
  searchQuery: string;
  statusFilter: PatientStatus | 'All';
  selectedPatient: Patient | null;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (q: string) => void;
  setStatusFilter: (f: PatientStatus | 'All') => void;
  setSelectedPatient: (p: Patient | null) => void;
  filteredPatients: () => Patient[];
}

export const usePatientStore = create<PatientState>()(
  persist(
    (set, get) => ({
      patients: mockPatients,
      viewMode: 'grid',
      searchQuery: '',
      statusFilter: 'All',
      selectedPatient: null,

      setViewMode: (mode) => set({ viewMode: mode }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setStatusFilter: (f) => set({ statusFilter: f }),
      setSelectedPatient: (p) => set({ selectedPatient: p }),

      filteredPatients: () => {
        const { patients, searchQuery, statusFilter } = get();
        return patients.filter((p) => {
          const matchesSearch =
            searchQuery === '' ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesStatus =
            statusFilter === 'All' || p.status === statusFilter;
          return matchesSearch && matchesStatus;
        });
      },
    }),
    {
      name: 'patient-storage',
      partialize: (state) => ({ viewMode: state.viewMode }),
    }
  )
);
