import { Phone, Calendar, Droplets, Building2, User, Stethoscope, Bell } from 'lucide-react';
import type { Patient } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

interface PatientModalProps {
  patient: Patient | null;
  onClose: () => void;
  onNotify: (patient: Patient) => void;
}

const avatarColors = [
  'from-blue-400 to-blue-600',
  'from-violet-400 to-violet-600',
  'from-emerald-400 to-emerald-600',
  'from-amber-400 to-amber-600',
  'from-rose-400 to-rose-600',
  'from-cyan-400 to-cyan-600',
];

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-50">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-900 truncate">{value}</p>
      </div>
    </div>
  );
}

export function PatientModal({ patient, onClose, onNotify }: PatientModalProps) {
  if (!patient) return null;
  const colorIndex = parseInt(patient.id.replace('P', ''), 10) % avatarColors.length;
  const initials = patient.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <Modal open={!!patient} onClose={onClose} title="Patient Details" size="lg">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatarColors[colorIndex]} flex items-center justify-center text-white text-xl font-bold shrink-0`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{patient.name}</h3>
                <p className="text-sm text-slate-400">{patient.id} · {patient.age} years old · {patient.gender}</p>
              </div>
              <StatusBadge status={patient.status} />
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid sm:grid-cols-2 gap-x-6">
          <div>
            <InfoRow icon={<Stethoscope size={15} />} label="Condition" value={patient.condition} />
            <InfoRow icon={<User size={15} />} label="Attending Doctor" value={patient.doctor} />
            <InfoRow icon={<Building2 size={15} />} label="Ward" value={patient.ward} />
            <InfoRow icon={<Droplets size={15} />} label="Blood Type" value={patient.bloodType} />
          </div>
          <div>
            <InfoRow icon={<Calendar size={15} />} label="Admitted" value={new Date(patient.admittedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
            <InfoRow icon={<Calendar size={15} />} label="Last Visit" value={new Date(patient.lastVisit).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
            <InfoRow icon={<Phone size={15} />} label="Phone" value={patient.phone} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            className="flex-1"
            onClick={() => { onNotify(patient); onClose(); }}
          >
            <Bell size={14} />
            Send Alert
          </Button>
        </div>
      </div>
    </Modal>
  );
}
