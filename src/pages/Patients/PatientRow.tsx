import { Bell } from 'lucide-react';
import type { Patient } from '../../types';
import { StatusBadge } from '../../components/ui/Badge';

interface PatientRowProps {
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

export function PatientRow({ patient, onClick, onNotify }: PatientRowProps) {
  const colorIndex = parseInt(patient.id.replace('P', ''), 10) % avatarColors.length;
  const initials = patient.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <tr
      onClick={onClick}
      className="hover:bg-slate-50 cursor-pointer transition-colors"
    >
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColors[colorIndex]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{patient.name}</p>
            <p className="text-xs text-slate-400">{patient.id}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-3.5 text-sm text-slate-500 hidden sm:table-cell">{patient.age} / {patient.gender[0]}</td>
      <td className="px-6 py-3.5 text-sm text-slate-600 hidden md:table-cell">{patient.condition}</td>
      <td className="px-6 py-3.5 hidden lg:table-cell">
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{patient.bloodType}</span>
      </td>
      <td className="px-6 py-3.5">
        <StatusBadge status={patient.status} />
      </td>
      <td className="px-6 py-3.5 text-sm text-slate-500 hidden xl:table-cell">{patient.doctor}</td>
      <td className="px-6 py-3.5 text-sm text-slate-500 hidden lg:table-cell">
        {new Date(patient.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </td>
      <td className="px-6 py-3.5">
        <button
          onClick={(e) => { e.stopPropagation(); onNotify(); }}
          className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-300 hover:text-amber-500 transition-colors"
          title="Send notification"
        >
          <Bell size={14} />
        </button>
      </td>
    </tr>
  );
}
