import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { dbService } from '../services/firebaseConfig';

interface AuthPageViewProps {
  initialMode?: 'login' | 'register';
  onSuccess: (user: UserProfile) => void;
  onNavigate: (tab: string) => void;
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const AuthPageView: React.FC<AuthPageViewProps> = ({
  initialMode = 'login',
  onSuccess,
  onNavigate,
  onShowToast
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<'student' | 'mentor' | 'industry'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

  // Role details mapping for default demo auto-fill if user wants fast fill
  const roleDefaults = {
    student: {
      email: 'aarav.sharma@iitd.ac.in',
      name: 'Aarav Sharma',
      college: 'IIT Delhi',
      skills: ['AI', 'IoT', 'C++', 'TinyML']
    },
    mentor: {
      email: 'vikram.sen@iisc.ac.in',
      name: 'Dr. Vikramaditya Sen',
      college: 'IISc Bangalore',
      skills: ['Embedded Systems', 'Hardware Validation', 'Sensor Networks']
    },
    industry: {
      email: 'scout@bosch-mobility.com',
      name: 'Ananya Deshmukh',
      college: 'Bosch Mobility Labs',
      skills: ['Automotive IoT', 'Field Testing Sandboxes', 'Pilot Deployments']
    }
  };

  const handleRoleChange = (role: 'student' | 'mentor' | 'industry') => {
    setSelectedRole(role);
    // If email is currently empty or was set to one of the previous role defaults, prefill role default
    if (!email || Object.values(roleDefaults).some(d => d.email === email)) {
      setEmail(roleDefaults[role].email);
      setPassword('password123');
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter your email address first.');
      return;
    }
    setErrorMessage(null);
    setForgotSent(true);
    onShowToast('info', `Password reset instructions sent to ${email}`);
    setTimeout(() => setForgotSent(false), 5000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (mode === 'login') {
        const users = dbService.getUsers();
        let found = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!found) {
          // Find by role or create clean profile
          found = users.find(u => u.role === selectedRole);
        }

        if (!found) {
          // Provision clean active profile
          const config = roleDefaults[selectedRole];
          found = {
            id: `usr_${Date.now()}`,
            fullName: config.name,
            email: email.trim(),
            role: selectedRole as UserRole,
            college: config.college,
            skills: config.skills,
            skillsOrOfferings: config.skills,
            areasOfInterest: ['Technology', 'Engineering'],
            createdAt: new Date().toISOString()
          };
          dbService.saveUser(found);
        }

        dbService.setActiveUser(found);
        setLoading(false);
        onShowToast('success', `Welcome back, ${found.fullName}!`);
        onSuccess(found);
        onNavigate('projects');
      } else {
        // Register Mode
        if (!fullName.trim()) {
          setLoading(false);
          setErrorMessage('Please enter your full name.');
          return;
        }

        const config = roleDefaults[selectedRole];
        const newUser: UserProfile = {
          id: `usr_${Date.now()}`,
          fullName: fullName.trim(),
          email: email.trim(),
          role: selectedRole as UserRole,
          college: config.college,
          skills: config.skills,
          skillsOrOfferings: config.skills,
          areasOfInterest: ['Innovation', 'Ecosystem'],
          createdAt: new Date().toISOString()
        };

        dbService.saveUser(newUser);
        dbService.setActiveUser(newUser);
        setLoading(false);
        onShowToast('success', `Account created! Welcome to Project IdeaTec, ${newUser.fullName}.`);
        onSuccess(newUser);
        onNavigate('projects');
      }
    }, 450);
  };

  return (
    <div className="min-h-screen relative bg-[#FAF8FF] text-slate-800 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      
      {/* SUBTLE BACKGROUND PATTERN: Connected Dots and Lines */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-40 overflow-hidden">
        <svg 
          className="w-full h-full" 
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 800" 
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="meshGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9333ea" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Soft background ambient gradient circle */}
          <circle cx="600" cy="400" r="380" fill="url(#meshGlow)" />

          {/* Network Lines */}
          <g stroke="#9333ea" strokeWidth="1" strokeOpacity="0.18" strokeDasharray="3 3">
            {/* Top network connections */}
            <line x1="120" y1="140" x2="280" y2="220" />
            <line x1="280" y1="220" x2="420" y2="130" />
            <line x1="420" y1="130" x2="620" y2="180" />
            <line x1="620" y1="180" x2="800" y2="110" />
            <line x1="800" y1="110" x2="980" y2="200" />
            <line x1="980" y1="200" x2="1120" y2="150" />

            {/* Cross diagonal connections */}
            <line x1="280" y1="220" x2="220" y2="420" />
            <line x1="420" y1="130" x2="520" y2="340" />
            <line x1="620" y1="180" x2="700" y2="360" />
            <line x1="800" y1="110" x2="920" y2="350" />

            {/* Middle and lower network connections */}
            <line x1="100" y1="520" x2="220" y2="420" />
            <line x1="220" y1="420" x2="360" y2="600" />
            <line x1="360" y1="600" x2="520" y2="660" />
            <line x1="520" y1="660" x2="720" y2="580" />
            <line x1="720" y1="580" x2="880" y2="640" />
            <line x1="880" y1="640" x2="1050" y2="520" />

            <line x1="1050" y1="520" x2="920" y2="350" />
            <line x1="920" y1="350" x2="700" y2="360" />
            <line x1="700" y1="360" x2="520" y2="340" />
            <line x1="520" y1="340" x2="220" y2="420" />

            <line x1="720" y1="580" x2="700" y2="360" />
            <line x1="520" y1="660" x2="520" y2="340" />
          </g>

          {/* Network Nodes (Dots) */}
          <g fill="#7c3aed">
            <circle cx="120" cy="140" r="3.5" opacity="0.35" />
            <circle cx="280" cy="220" r="4.5" opacity="0.45" />
            <circle cx="420" cy="130" r="3.5" opacity="0.4" />
            <circle cx="620" cy="180" r="5" opacity="0.5" />
            <circle cx="800" cy="110" r="3.5" opacity="0.4" />
            <circle cx="980" cy="200" r="4.5" opacity="0.45" />
            <circle cx="1120" cy="150" r="3" opacity="0.3" />

            <circle cx="220" cy="420" r="4.5" opacity="0.4" />
            <circle cx="520" cy="340" r="4" opacity="0.4" />
            <circle cx="700" cy="360" r="4" opacity="0.4" />
            <circle cx="920" cy="350" r="4.5" opacity="0.45" />

            <circle cx="100" cy="520" r="3" opacity="0.3" />
            <circle cx="360" cy="600" r="4" opacity="0.35" />
            <circle cx="520" cy="660" r="4.5" opacity="0.45" />
            <circle cx="720" cy="580" r="4.5" opacity="0.45" />
            <circle cx="880" cy="640" r="4" opacity="0.35" />
            <circle cx="1050" cy="520" r="3.5" opacity="0.3" />
          </g>
        </svg>
      </div>

      {/* CENTERED CLEAN AUTHENTICATION CARD */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        
        {/* LOGO */}
        <div className="text-center mb-8">
          <div 
            onClick={() => onNavigate('home')} 
            className="inline-flex items-center space-x-2.5 cursor-pointer group mb-4"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/25 transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              Project IdeaTec
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-normal">
            {mode === 'login' 
              ? 'Continue giving your projects a second life.' 
              : 'Join the innovation ecosystem today.'}
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-7 sm:p-9 border border-purple-100/90 shadow-[0_12px_40px_-15px_rgba(124,77,255,0.12)]">
          
          {/* ROLE SELECTION */}
          <div className="mb-6">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Select Role
            </span>
            
            <div className="grid grid-cols-3 gap-2">
              {(['student', 'mentor', 'industry'] as const).map((r) => {
                const isSelected = selectedRole === r;
                const label = r === 'student' ? 'Student' : r === 'mentor' ? 'Mentor' : 'Industry';
                
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleChange(r)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                      isSelected
                        ? 'bg-purple-50 border-2 border-purple-600 text-purple-900 font-bold'
                        : 'bg-white border border-purple-100 text-slate-600 hover:border-purple-200 hover:text-slate-900'
                    }`}
                  >
                    <span className={`text-sm leading-none ${isSelected ? 'text-purple-600 font-bold' : 'text-slate-400'}`}>
                      {isSelected ? '●' : '○'}
                    </span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ERROR NOTIFICATION */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2 text-xs text-rose-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* FORGOT PASSWORD CONFIRMATION */}
          {forgotSent && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-2 text-xs text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Password reset instructions sent to your email.</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name if Register mode */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </div>
            </div>

            {/* Submit Button [ Login ] */}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 transition-all text-xs flex items-center justify-center space-x-2 shadow-md shadow-purple-500/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Login' : 'Create Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* BOTTOM TOGGLE */}
          <div className="mt-6 pt-5 border-t border-purple-50 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <div className="flex items-center justify-center space-x-1.5">
                <span>Don't have an account?</span>
                <button
                  id="auth-toggle-register-btn"
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="font-bold text-purple-700 hover:text-purple-900 hover:underline"
                >
                  Create Account
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-1.5">
                <span>Already have an account?</span>
                <button
                  id="auth-toggle-login-btn"
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className="font-bold text-purple-700 hover:text-purple-900 hover:underline"
                >
                  Login
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Back to Home link */}
        <div className="text-center mt-6">
          <button
            onClick={() => onNavigate('home')}
            className="text-xs font-semibold text-slate-500 hover:text-purple-700 transition-colors"
          >
            ← Back to Home
          </button>
        </div>

      </div>

    </div>
  );
};
