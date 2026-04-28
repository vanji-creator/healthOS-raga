import type { PatientStatus } from '../../types';

const statusStyles: Record<PatientStatus, string> = {
  Stable: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Critical: 'bg-red-100 text-red-700 border-red-200',
  Recovering: 'bg-blue-100 text-blue-700 border-blue-200',
  Discharged: 'bg-slate-100 text-slate-600 border-slate-200',
};

const statusDot: Record<PatientStatus, string> = {
  Stable: 'bg-emerald-500',
  Critical: 'bg-red-500',
  Recovering: 'bg-blue-500',
  Discharged: 'bg-slate-400',
};

interface StatusBadgeProps {
  status: PatientStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status]}`} />
      {status}
    </span>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const variantStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}
