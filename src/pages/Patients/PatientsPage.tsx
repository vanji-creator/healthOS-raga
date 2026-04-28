import { useMemo } from 'react';
import { Search, Filter, Users } from 'lucide-react';
import { usePatientStore } from '../../store/patientStore';
import { useNotifications } from '../../hooks/useNotifications';
import { ViewToggle } from '../../components/ui/Toggle';
import { Input } from '../../components/ui/Input';
import { PatientCard } from './PatientCard';
import { PatientRow } from './PatientRow';
import { PatientModal } from './PatientModal';
import type { Patient, PatientStatus } from '../../types';

const STATUS_OPTIONS: Array<PatientStatus | 'All'> = ['All', 'Stable', 'Recovering', 'Critical', 'Discharged'];

export default function PatientsPage() {
  const {
    viewMode, setViewMode,
    searchQuery, setSearchQuery,
    statusFilter, setStatusFilter,
    selectedPatient, setSelectedPatient,
    filteredPatients,
  } = usePatientStore();

  const { notifyCritical, notify } = useNotifications();

  const patients = useMemo(() => filteredPatients(), [
    filteredPatients,
    searchQuery,
    statusFilter,
  ]);

  const handleNotify = (patient: Patient) => {
    if (patient.status === 'Critical') {
      notifyCritical(patient.name);
    } else {
      notify(
        'Patient Notification',
        `Alert sent for ${patient.name} (${patient.status}).`,
        'info',
        true
      );
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Patient Directory</h2>
          <p className="text-sm text-slate-500">
            {patients.length} patient{patients.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <ViewToggle value={viewMode} onChange={setViewMode} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by name, condition, doctor, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search size={15} />}
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
          <Filter size={14} className="text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PatientStatus | 'All')}
            className="text-sm text-slate-700 bg-transparent outline-none cursor-pointer pr-2"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty state */}
      {patients.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Users size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No patients found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Grid view */}
      {viewMode === 'grid' && patients.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {patients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onClick={() => setSelectedPatient(patient)}
              onNotify={() => handleNotify(patient)}
            />
          ))}
        </div>
      )}

      {/* List view */}
      {viewMode === 'list' && patients.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-3">Patient</th>
                  <th className="px-6 py-3 hidden sm:table-cell">Age/Sex</th>
                  <th className="px-6 py-3 hidden md:table-cell">Condition</th>
                  <th className="px-6 py-3 hidden lg:table-cell">Blood</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 hidden xl:table-cell">Doctor</th>
                  <th className="px-6 py-3 hidden lg:table-cell">Last Visit</th>
                  <th className="px-6 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {patients.map((patient) => (
                  <PatientRow
                    key={patient.id}
                    patient={patient}
                    onClick={() => setSelectedPatient(patient)}
                    onNotify={() => handleNotify(patient)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Patient detail modal */}
      <PatientModal
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
        onNotify={handleNotify}
      />
    </div>
  );
}
