import { Phone, Calendar, Stethoscope, Bell } from 'lucide-react';
import type { Patient } from '../../types';
import { StatusBadge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
  onNotify: () => void;
}

const avatarColors = [
  'from-blue-400 to-blue-600',
  'from-violet-400 to-violet-600',
  'from-emerald-400 to-emerald-600',
  'from-amber-400 to-amber-600',
  'from-rose-400 to-rose-600',
  'from-cyan-400 to-cyan-600',
];

export function PatientCard({ patient, onClick, onNotify }: PatientCardProps) {
  const colorIndex = parseInt(patient.id.replace('P', ''), 10) % avatarColors.length;
  const initials = patient.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <Card hover className="p-5 flex flex-col gap-4" onClick={onClick}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarColors[colorIndex]} flex items-center justify-center text-white font-bold text-base shrink-0`}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 truncate">{patient.name}</p>
            <p className="text-xs text-slate-400">{patient.id} · {patient.gender} · {patient.age} yrs</p>
          </div>
        </div>
        <StatusBadge status={patient.status} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Stethoscope size={13} className="text-slate-400 shrink-0" />
          <span className="truncate">{patient.condition}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar size={13} className="text-slate-400 shrink-0" />
          <span>Last visit: {new Date(patient.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Phone size={13} className="text-slate-400 shrink-0" />
          <span className="truncate">{patient.phone}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-xs text-slate-400 truncate">{patient.doctor}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onNotify(); }}
          className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-500 transition-colors"
          title="Send notification"
        >
          <Bell size={14} />
        </button>
      </div>
    </Card>
  );
}
