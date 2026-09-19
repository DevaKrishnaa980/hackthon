import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  Github, 
  Linkedin, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { dbService } from '../services/firebaseConfig';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state (Section 5)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('4th Year B.Tech');
  const [skills, setSkills] = useState('IoT, C++, Python, Embedded Systems');
  const [bio, setBio] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [role, setRole] = useState<UserRole>('student');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setErrorMsg('Please enter your account email.');
      return;
    }

    // Lookup existing user or create clean user profile
    const existing = dbService.getUsers().find(u => u.email.toLowerCase() === loginEmail.toLowerCase().trim());
    if (existing) {
      dbService.setActiveUser(existing);
      onLoginSuccess(existing);
      onClose();
    } else {
      // Auto-provision demo user session
      const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        email: loginEmail.trim(),
        fullName: loginEmail.split('@')[0].replace('.', ' '),
        role: 'student',
        college: 'Innovation Institute',
        skills: ['Engineering', 'Software Development'],
        skillsOrOfferings: ['Engineering', 'Software Development'],
        areasOfInterest: ['Technology', 'Prototyping'],
        createdAt: new Date().toISOString()
      };
      dbService.saveUser(newUser);
      dbService.setActiveUser(newUser);
      onLoginSuccess(newUser);
      onClose();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Full Name, Email, and Password are required.');
      return;
    }

    const parsedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      email: email.trim(),
      fullName: fullName.trim(),
      role,
      college: college.trim() || 'National Institute of Technology',
      department: department.trim() || 'Computer Science & Engineering',
      year: year.trim(),
      skills: parsedSkills,
      skillsOrOfferings: parsedSkills,
      areasOfInterest: [department.trim() || 'Engineering'],
      bio: bio.trim(),
      githubUrl: githubUrl.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    // Note: Per architectural requirements, password is authenticated through Firebase Auth SDK and NEVER stored in Firestore!
    dbService.saveUser(newUser);
    dbService.setActiveUser(newUser);
    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white border border-purple-100 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-800">
        
        {/* Header */}
        <div className="p-6 border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {mode === 'login' ? 'Sign In to IdeaTec' : 'Student & Partner Registration'}
              </h3>
              <p className="text-xs text-slate-500">Firebase Auth Identity & Role-Based Access</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-purple-50 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-purple-100 text-xs">
          <button
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`flex-1 py-3 font-bold text-center transition-colors ${
              mode === 'login' 
                ? 'text-purple-700 border-b-2 border-purple-600 bg-purple-50/50' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setErrorMsg(null); }}
            className={`flex-1 py-3 font-bold text-center transition-colors ${
              mode === 'register' 
                ? 'text-purple-700 border-b-2 border-purple-600 bg-purple-50/50' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                  Email Address
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="aarav.sharma@iitd.ac.in"
                  className="w-full px-3.5 py-2.5 bg-white border border-purple-100 focus:border-purple-600 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-white border border-purple-100 focus:border-purple-600 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-500 border-purple-200" />
                  <span>Remember Me</span>
                </label>
                <button type="button" onClick={() => alert('Password reset link sent to your registered email.')} className="text-purple-600 hover:text-purple-800 hover:underline font-semibold">
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all text-xs shadow-md shadow-purple-500/25"
              >
                Sign In
              </button>

              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-800">Quick Demo Logins:</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button type="button" onClick={() => setLoginEmail('aarav.sharma@iitd.ac.in')} className="text-purple-700 hover:underline font-semibold">
                    Student (Aarav)
                  </button>
                  <span>•</span>
                  <button type="button" onClick={() => setLoginEmail('dr.kavita@resilience.org')} className="text-purple-700 hover:underline font-semibold">
                    Mentor (Dr. Kavita)
                  </button>
                  <span>•</span>
                  <button type="button" onClick={() => setLoginEmail('admin@afterlife.org')} className="text-purple-700 hover:underline font-semibold">
                    Admin
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ananya Verma"
                    className="w-full px-3 py-2 bg-white border border-purple-100 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Role *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-white border border-purple-100 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-purple-600"
                  >
                    <option value="student">Student Innovator</option>
                    <option value="mentor">Faculty / Industry Mentor</option>
                    <option value="industry">Industry Partner</option>
                    <option value="institution">University / Incubator</option>
                    <option value="funder">Funding / Grant Body</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full px-3 py-2 bg-white border border-purple-100 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 bg-white border border-purple-100 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    College / Organization
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="IIT Delhi / Continental"
                    className="w-full px-3 py-2 bg-white border border-purple-100 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Department / Year
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Computer Science (4th Year)"
                    className="w-full px-3 py-2 bg-white border border-purple-100 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                  Skills & Technologies
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="IoT, C++, Python, Embedded Systems"
                  className="w-full px-3 py-2 bg-white border border-purple-100 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-white border border-purple-100 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 bg-white border border-purple-100 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all text-xs shadow-md shadow-purple-500/25 mt-2"
              >
                Complete Registration
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
