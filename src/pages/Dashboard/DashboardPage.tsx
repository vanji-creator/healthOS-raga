import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Users, CalendarClock, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { StatCard } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { usePatientStore } from '../../store/patientStore';
import { useNotifications } from '../../hooks/useNotifications';
import { admissionTrend } from '../../data/mockPatients';

export default function DashboardPage() {
  const navigate = useNavigate();
  const patients = usePatientStore((s) => s.patients);
  const { notify } = useNotifications();

  const criticalCount = patients.filter((p) => p.status === 'Critical').length;
  const stableCount = patients.filter((p) => p.status === 'Stable').length;
  const recoveringCount = patients.filter((p) => p.status === 'Recovering').length;

  useEffect(() => {
    const timer = setTimeout(() => {
      notify(
        'Critical Patients Alert',
        `${criticalCount} critical patients require immediate attention.`,
        'critical',
        true
      );
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const recentPatients = patients.slice(0, 6);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Good morning, Dr. Admin</h2>
            <p className="text-blue-200 text-sm mt-1">
              You have {criticalCount} critical patients and 8 appointments scheduled today.
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-blue-200 text-sm">Total patients</p>
            <p className="text-3xl font-bold">{patients.length}</p>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={patients.length}
          subtitle={`${stableCount} stable, ${recoveringCount} recovering`}
          icon={<Users size={20} />}
          color="blue"
          trend={{ value: 8.2, label: 'vs last week' }}
        />
        <StatCard
          title="Today's Appointments"
          value="47"
          subtitle="8 remaining"
          icon={<CalendarClock size={20} />}
          color="violet"
          trend={{ value: 12.5, label: 'vs yesterday' }}
        />
        <StatCard
          title="Critical Cases"
          value={criticalCount}
          subtitle="Requires immediate care"
          icon={<AlertTriangle size={20} />}
          color="red"
          trend={{ value: -2, label: 'vs yesterday' }}
        />
        <StatCard
          title="Avg Wait Time"
          value="18 min"
          subtitle="Emergency dept."
          icon={<Clock size={20} />}
          color="emerald"
          trend={{ value: -5.3, label: 'vs last week' }}
        />
      </div>

      {/* Chart + Recent patients */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Admissions chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-900">Patient Admissions</h3>
              <p className="text-sm text-slate-400">Last 7 days</p>
            </div>
            <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
              Weekly
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={admissionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line
                type="monotone"
                dataKey="admissions"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-1">Patient Status</h3>
          <p className="text-sm text-slate-400 mb-5">Current overview</p>
          <div className="space-y-4">
            {[
              { label: 'Stable', count: stableCount, color: 'bg-emerald-500', pct: Math.round((stableCount / patients.length) * 100) },
              { label: 'Recovering', count: recoveringCount, color: 'bg-blue-500', pct: Math.round((recoveringCount / patients.length) * 100) },
              { label: 'Critical', count: criticalCount, color: 'bg-red-500', pct: Math.round((criticalCount / patients.length) * 100) },
              { label: 'Discharged', count: patients.filter((p) => p.status === 'Discharged').length, color: 'bg-slate-400', pct: Math.round((patients.filter((p) => p.status === 'Discharged').length / patients.length) * 100) },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-600 font-medium">{item.label}</span>
                  <span className="text-slate-900 font-semibold">{item.count}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent patients */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Recent Patients</h3>
          <button
            onClick={() => navigate('/patients')}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all <ArrowRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3">Patient</th>
                <th className="px-6 py-3 hidden sm:table-cell">Condition</th>
                <th className="px-6 py-3 hidden md:table-cell">Doctor</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 hidden lg:table-cell">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentPatients.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => navigate('/patients')}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 hidden sm:table-cell text-sm text-slate-600">{p.condition}</td>
                  <td className="px-6 py-3.5 hidden md:table-cell text-sm text-slate-600">{p.doctor}</td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-6 py-3.5 hidden lg:table-cell text-sm text-slate-500">
                    {new Date(p.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
