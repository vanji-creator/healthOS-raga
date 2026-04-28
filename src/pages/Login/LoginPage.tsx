import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartPulse, Eye, EyeOff, Mail, Lock, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { requestNotificationPermission } from '../../utils/notifications';

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login, loginWithMock, loginWithGoogle, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    return errors;
  };

  const validationErrors = validate();
  const isValid = Object.keys(validationErrors).length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isValid) return;
    clearError();
    await login(email, password);
    await requestNotificationPermission();
  };

  const handleGoogle = async () => {
    clearError();
    await loginWithGoogle();
    await requestNotificationPermission();
  };

  const handleDemoLogin = async () => {
    clearError();
    await loginWithMock();
    await requestNotificationPermission();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-violet-600/20" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <HeartPulse size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              Health<span className="text-blue-400">OS</span>
            </span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Healthcare Management<br />
            <span className="text-blue-400">Simplified.</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
            A unified platform for patient management, analytics, and care coordination.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: '1,284', label: 'Active Patients' },
            { value: '47', label: "Today's Appts" },
            { value: '99.2%', label: 'Uptime SLA' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
              <HeartPulse size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Health<span className="text-blue-400">OS</span>
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
              <p className="text-sm text-slate-500 mt-1">Sign in to your account to continue</p>
            </div>

            {/* Google sign in */}
            <Button
              variant="secondary"
              className="w-full mb-4"
              size="lg"
              onClick={handleGoogle}
              loading={isLoading}
              disabled={isLoading}
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-slate-400">or sign in with email</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Email address"
                type="email"
                placeholder="you@hospital.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (error) clearError(); }}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                error={touched.email ? validationErrors.email : undefined}
                leftIcon={<Mail size={15} />}
                autoComplete="email"
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (error) clearError(); }}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                error={touched.password ? validationErrors.password : undefined}
                leftIcon={<Lock size={15} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
                autoComplete="current-password"
              />

              <Button type="submit" className="w-full" size="lg" loading={isLoading} disabled={isLoading}>
                Sign in
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-slate-400">or</span>
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full border border-slate-200"
              size="lg"
              onClick={handleDemoLogin}
              loading={isLoading}
              disabled={isLoading}
            >
              <Zap size={15} className="text-amber-500" />
              Try Demo Account
            </Button>

            <p className="text-center text-xs text-slate-400 mt-4">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
