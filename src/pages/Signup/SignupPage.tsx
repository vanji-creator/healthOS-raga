import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartPulse, Eye, EyeOff, Mail, Lock, User, Zap } from 'lucide-react';
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

export default function SignupPage() {
  const navigate = useNavigate();
  const { user, signUp, loginWithGoogle, loginWithMock, isLoading, error, clearError } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false });

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Full name is required';
    else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
    if (!email) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const validationErrors = validate();
  const isValid = Object.keys(validationErrors).length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    if (!isValid) return;
    clearError();
    await signUp(name.trim(), email, password);
    await requestNotificationPermission();
  };

  const handleGoogle = async () => {
    clearError();
    await loginWithGoogle();
    await requestNotificationPermission();
  };

  const handleDemo = async () => {
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
            Join the future of<br />
            <span className="text-blue-400">Healthcare.</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
            Create your account and get instant access to patient management, analytics, and real-time alerts.
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          {[
            { icon: '🔒', text: 'HIPAA-compliant data handling' },
            { icon: '⚡', text: 'Real-time critical patient alerts' },
            { icon: '📊', text: 'Actionable analytics dashboard' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 text-slate-300">
              <span>{item.icon}</span>
              <span className="text-sm">{item.text}</span>
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
              <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
              <p className="text-sm text-slate-500 mt-1">Get started with HealthOS today</p>
            </div>

            {/* Google sign up */}
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
                <span className="bg-white px-3 text-xs text-slate-400">or sign up with email</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Full name"
                type="text"
                placeholder="Dr. Jane Smith"
                value={name}
                onChange={(e) => { setName(e.target.value); if (error) clearError(); }}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                error={touched.name ? validationErrors.name : undefined}
                leftIcon={<User size={15} />}
                autoComplete="name"
              />

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
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (error) clearError(); }}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                error={touched.password ? validationErrors.password : undefined}
                leftIcon={<Lock size={15} />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-slate-600">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
                autoComplete="new-password"
              />

              <Input
                label="Confirm password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); if (error) clearError(); }}
                onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                error={touched.confirmPassword ? validationErrors.confirmPassword : undefined}
                leftIcon={<Lock size={15} />}
                rightIcon={
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="hover:text-slate-600">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
                autoComplete="new-password"
              />

              <Button type="submit" className="w-full" size="lg" loading={isLoading} disabled={isLoading}>
                Create account
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
              onClick={handleDemo}
              loading={isLoading}
              disabled={isLoading}
            >
              <Zap size={15} className="text-amber-500" />
              Try Demo Account
            </Button>

            <p className="text-center text-xs text-slate-400 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
