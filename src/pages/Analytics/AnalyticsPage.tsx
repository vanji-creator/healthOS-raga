import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, StatCard } from '../../components/ui/Card';
import { conditionBreakdown, weeklyTrend } from '../../data/mockPatients';
import { usePatientStore } from '../../store/patientStore';

const STATUS_COLORS = {
  Stable: '#10b981',
  Recovering: '#3b82f6',
  Critical: '#ef4444',
  Discharged: '#94a3b8',
};

const BAR_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e'];

const DATE_RANGES = ['Last 7 days', 'Last 30 days', 'Last 90 days'];

export default function AnalyticsPage() {
  const patients = usePatientStore((s) => s.patients);
  const [dateRange, setDateRange] = useState('Last 7 days');

  const statusData = ['Stable', 'Recovering', 'Critical', 'Discharged'].map((status) => ({
    name: status,
    value: patients.filter((p) => p.status === status).length,
    color: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
  }));

  const avgAge = Math.round(patients.reduce((acc, p) => acc + p.age, 0) / patients.length);
  const criticalRate = ((patients.filter((p) => p.status === 'Critical').length / patients.length) * 100).toFixed(1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header + date filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Analytics Overview</h2>
          <p className="text-sm text-slate-500">Healthcare metrics and performance insights</p>
        </div>
        <div className="flex bg-slate-100 rounded-lg p-1 gap-1 self-start">
          {DATE_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                dateRange === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={patients.length}
          icon={<TrendingUp size={20} />}
          color="blue"
          trend={{ value: 8.2, label: 'vs prev period' }}
        />
        <StatCard
          title="Avg Patient Age"
          value={`${avgAge} yrs`}
          icon={<TrendingUp size={20} />}
          color="violet"
        />
        <StatCard
          title="Critical Rate"
          value={`${criticalRate}%`}
          icon={<TrendingDown size={20} />}
          color="red"
          trend={{ value: -2.1, label: 'vs prev period' }}
        />
        <StatCard
          title="Recovery Rate"
          value="76.3%"
          icon={<TrendingUp size={20} />}
          color="emerald"
          trend={{ value: 3.4, label: 'vs prev period' }}
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conditions bar chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="mb-5">
            <h3 className="font-semibold text-slate-900">Conditions Breakdown</h3>
            <p className="text-sm text-slate-400">Patient distribution by primary condition</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={conditionBreakdown} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="condition" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="count" name="Patients" radius={[4, 4, 0, 0]}>
                {conditionBreakdown.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Status pie chart */}
        <Card className="p-6">
          <div className="mb-5">
            <h3 className="font-semibold text-slate-900">Status Distribution</h3>
            <p className="text-sm text-slate-400">Current patient statuses</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                dataKey="value"
                paddingAngle={3}
              >
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-medium text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Weekly trend chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-slate-900">Weekly Admissions vs Discharges</h3>
            <p className="text-sm text-slate-400">6-week trend comparison</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-500">Admissions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-500">Discharges</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={weeklyTrend}>
            <defs>
              <linearGradient id="admissionsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="dischargesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            <Area type="monotone" dataKey="admissions" name="Admissions" stroke="#3b82f6" strokeWidth={2.5} fill="url(#admissionsGrad)" dot={{ fill: '#3b82f6', r: 4 }} />
            <Area type="monotone" dataKey="discharges" name="Discharges" stroke="#10b981" strokeWidth={2.5} fill="url(#dischargesGrad)" dot={{ fill: '#10b981', r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
