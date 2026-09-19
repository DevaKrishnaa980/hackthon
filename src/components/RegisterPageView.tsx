import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  Compass, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Lock,
  Mail,
  User,
  School,
  Briefcase
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { dbService } from '../services/firebaseConfig';

interface RegisterPageViewProps {
  onSuccess: (user: UserProfile) => void;
  onNavigate: (tab: string) => void;
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

type ParticipantRole = 'student' | 'mentor' | 'industry';

export const RegisterPageView: React.FC<RegisterPageViewProps> = ({
  onSuccess,
  onNavigate,
  onShowToast
}) => {
  const [selectedRole, setSelectedRole] = useState<ParticipantRole>('student');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Student specific fields
  const [studentFullName, setStudentFullName] = useState('');
  const [studentCollege, setStudentCollege] = useState('');
  const [studentDepartment, setStudentDepartment] = useState('');
  const [studentYear, setStudentYear] = useState('3rd Year');
  const [studentSkills, setStudentSkills] = useState('');
  const [studentAreasOfInterest, setStudentAreasOfInterest] = useState('');

  // Mentor specific fields
  const [mentorFullName, setMentorFullName] = useState('');
  const [mentorOrganization, setMentorOrganization] = useState('');
  const [mentorJobRole, setMentorJobRole] = useState('');
  const [mentorExperience, setMentorExperience] = useState('');
  const [mentorExpertise, setMentorExpertise] = useState('');
  const [mentorIndustry, setMentorIndustry] = useState('');
  const [mentorMentoringAreas, setMentorMentoringAreas] = useState('');

  // Industry specific fields
  const [industryOrgName, setIndustryOrgName] = useState('');
  const [industryField, setIndustryField] = useState('');
  const [industryOrgType, setIndustryOrgType] = useState('Corporate Innovation');
  const [industryAreasOfInterest, setIndustryAreasOfInterest] = useState('');
  const [industryCollaborationAreas, setIndustryCollaborationAreas] = useState('');

  const parseList = (str: string): string[] => {
    return str
      .split(/[,;]+/)
      .map(s => s.trim())
      .filter(Boolean);
  };

  const handleRoleSelect = (role: ParticipantRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic common validations
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (selectedRole !== 'industry' && (!password || password.length < 6)) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        let newUser: UserProfile;
        const now = new Date().toISOString();

        if (selectedRole === 'student') {
          if (!studentFullName.trim()) {
            setErrorMessage('Please enter your full name.');
            setLoading(false);
            return;
          }
          if (!studentCollege.trim()) {
            setErrorMessage('Please enter your college name.');
            setLoading(false);
            return;
          }

          const skillsArray = parseList(studentSkills);
          const interestsArray = parseList(studentAreasOfInterest);

          newUser = {
            id: `usr_stu_${Date.now()}`,
            fullName: studentFullName.trim(),
            email: email.trim(),
            role: 'student',
            college: studentCollege.trim(),
            skills: skillsArray.length > 0 ? skillsArray : ['AI', 'Engineering'],
            skillsOrOfferings: skillsArray.length > 0 ? skillsArray : ['AI', 'Engineering'],
            areasOfInterest: interestsArray.length > 0 ? interestsArray : ['Innovation', 'Prototypes'],
            createdAt: now
          };
        } else if (selectedRole === 'mentor') {
          if (!mentorFullName.trim()) {
            setErrorMessage('Please enter your full name.');
            setLoading(false);
            return;
          }
          if (!mentorOrganization.trim()) {
            setErrorMessage('Please enter your organization or institution.');
            setLoading(false);
            return;
          }

          const expertiseArray = parseList(mentorExpertise);
          const mentoringAreasArray = parseList(mentorMentoringAreas);

          newUser = {
            id: `usr_men_${Date.now()}`,
            fullName: mentorFullName.trim(),
            email: email.trim(),
            role: 'mentor',
            college: mentorOrganization.trim(),
            skills: expertiseArray.length > 0 ? expertiseArray : ['Technical Mentorship'],
            skillsOrOfferings: mentoringAreasArray.length > 0 ? mentoringAreasArray : ['Milestone Guidance', 'Code Review'],
            areasOfInterest: [mentorIndustry || 'DeepTech'],
            createdAt: now
          };
        } else {
          // Industry
          if (!industryOrgName.trim()) {
            setErrorMessage('Please enter your organization name.');
            setLoading(false);
            return;
          }

          const collabArray = parseList(industryCollaborationAreas);
          const interestArray = parseList(industryAreasOfInterest);

          newUser = {
            id: `usr_ind_${Date.now()}`,
            fullName: industryOrgName.trim(),
            email: email.trim(),
            role: 'industry',
            college: `${industryOrgName.trim()} (${industryOrgType})`,
            skills: collabArray.length > 0 ? collabArray : ['Pilot Testing', 'Sandboxes'],
            skillsOrOfferings: collabArray.length > 0 ? collabArray : ['Field Sandboxes', 'Industry Pilots'],
            areasOfInterest: interestArray.length > 0 ? interestArray : [industryField || 'Technology'],
            createdAt: now
          };
        }

        dbService.saveUser(newUser);
        dbService.setActiveUser(newUser);

        setLoading(false);
        onShowToast('success', `Welcome to Project IdeaTec, ${newUser.fullName}!`);
        onSuccess(newUser);
        onNavigate('projects');
      } catch {
        setLoading(false);
        setErrorMessage('Failed to create account. Please try again.');
      }
    }, 450);
  };

  return (
    <div className="min-h-screen relative bg-[#FAF8FF] text-slate-800 py-12 px-4 sm:px-6 lg:px-8 selection:bg-purple-200 selection:text-purple-900 overflow-hidden pb-24">
      
      {/* SUBTLE BACKGROUND PATTERN: Connected Dots and Lines */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-35 overflow-hidden">
        <svg 
          className="w-full h-full" 
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 800" 
          preserveAspectRatio="xMidYMid slice"
        >
          <g stroke="#9333ea" strokeWidth="1" strokeOpacity="0.18" strokeDasharray="3 3">
            <line x1="100" y1="120" x2="260" y2="200" />
            <line x1="260" y1="200" x2="400" y2="110" />
            <line x1="400" y1="110" x2="600" y2="160" />
            <line x1="600" y1="160" x2="800" y2="90" />
            <line x1="800" y1="90" x2="1000" y2="180" />
            <line x1="260" y1="200" x2="200" y2="400" />
            <line x1="400" y1="110" x2="500" y2="320" />
            <line x1="600" y1="160" x2="700" y2="340" />
            <line x1="800" y1="90" x2="900" y2="330" />
            <line x1="200" y1="400" x2="340" y2="580" />
            <line x1="340" y1="580" x2="500" y2="640" />
            <line x1="500" y1="640" x2="700" y2="560" />
            <line x1="700" y1="560" x2="860" y2="620" />
            <line x1="860" y1="620" x2="1050" y2="500" />
            <line x1="1050" y1="500" x2="900" y2="330" />
            <line x1="900" y1="330" x2="700" y2="340" />
            <line x1="700" y1="340" x2="500" y2="320" />
            <line x1="500" y1="320" x2="200" y2="400" />
          </g>
          <g fill="#7c3aed">
            <circle cx="100" cy="120" r="3.5" opacity="0.35" />
            <circle cx="260" cy="200" r="4.5" opacity="0.45" />
            <circle cx="400" cy="110" r="3.5" opacity="0.4" />
            <circle cx="600" cy="160" r="5" opacity="0.5" />
            <circle cx="800" cy="90" r="3.5" opacity="0.4" />
            <circle cx="1000" cy="180" r="4.5" opacity="0.45" />
            <circle cx="200" cy="400" r="4.5" opacity="0.4" />
            <circle cx="500" cy="320" r="4" opacity="0.4" />
            <circle cx="700" cy="340" r="4" opacity="0.4" />
            <circle cx="900" cy="330" r="4.5" opacity="0.45" />
            <circle cx="340" cy="580" r="4" opacity="0.35" />
            <circle cx="500" cy="640" r="4.5" opacity="0.45" />
            <circle cx="700" cy="560" r="4.5" opacity="0.45" />
            <circle cx="860" cy="620" r="4" opacity="0.35" />
            <circle cx="1050" cy="500" r="3.5" opacity="0.3" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        
        {/* LOGO & HEADING */}
        <div className="text-center mb-10">
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

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How do you want to participate?
          </h1>

          <p className="text-sm text-slate-500 mt-2 font-normal">
            Select your role in the innovation ecosystem to set up your personalized workspace.
          </p>
        </div>

        {/* THREE LARGE SELECTABLE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          {/* 1. STUDENT */}
          <div
            id="role-card-student"
            onClick={() => handleRoleSelect('student')}
            className={`cursor-pointer rounded-3xl p-6 transition-all relative border flex flex-col justify-between ${
              selectedRole === 'student'
                ? 'bg-white border-2 border-purple-600 shadow-lg shadow-purple-500/10'
                : 'bg-white/80 border-purple-100/90 hover:border-purple-200 hover:bg-white shadow-2xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                  selectedRole === 'student'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                    : 'bg-purple-50 text-purple-600 border border-purple-100'
                }`}>
                  <GraduationCap className="w-5 h-5" />
                </div>
                {selectedRole === 'student' && (
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                )}
              </div>

              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                STUDENT
              </h2>

              <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">
                Upload and develop your projects.
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-purple-50 text-[11px] font-bold text-purple-700">
              {selectedRole === 'student' ? '● Selected' : 'Click to select'}
            </div>
          </div>

          {/* 2. MENTOR */}
          <div
            id="role-card-mentor"
            onClick={() => handleRoleSelect('mentor')}
            className={`cursor-pointer rounded-3xl p-6 transition-all relative border flex flex-col justify-between ${
              selectedRole === 'mentor'
                ? 'bg-white border-2 border-purple-600 shadow-lg shadow-purple-500/10'
                : 'bg-white/80 border-purple-100/90 hover:border-purple-200 hover:bg-white shadow-2xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                  selectedRole === 'mentor'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                    : 'bg-purple-50 text-purple-600 border border-purple-100'
                }`}>
                  <Compass className="w-5 h-5" />
                </div>
                {selectedRole === 'mentor' && (
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                )}
              </div>

              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                MENTOR
              </h2>

              <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">
                Guide promising student innovations.
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-purple-50 text-[11px] font-bold text-purple-700">
              {selectedRole === 'mentor' ? '● Selected' : 'Click to select'}
            </div>
          </div>

          {/* 3. INDUSTRY */}
          <div
            id="role-card-industry"
            onClick={() => handleRoleSelect('industry')}
            className={`cursor-pointer rounded-3xl p-6 transition-all relative border flex flex-col justify-between ${
              selectedRole === 'industry'
                ? 'bg-white border-2 border-purple-600 shadow-lg shadow-purple-500/10'
                : 'bg-white/80 border-purple-100/90 hover:border-purple-200 hover:bg-white shadow-2xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                  selectedRole === 'industry'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                    : 'bg-purple-50 text-purple-600 border border-purple-100'
                }`}>
                  <Building2 className="w-5 h-5" />
                </div>
                {selectedRole === 'industry' && (
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                )}
              </div>

              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                INDUSTRY
              </h2>

              <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">
                Discover and collaborate with emerging innovations.
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-purple-50 text-[11px] font-bold text-purple-700">
              {selectedRole === 'industry' ? '● Selected' : 'Click to select'}
            </div>
          </div>

        </div>

        {/* REGISTRATION FORM CONTAINER */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-7 sm:p-10 border border-purple-100/90 shadow-[0_12px_40px_-15px_rgba(124,77,255,0.1)]">
          
          <div className="mb-6 pb-4 border-b border-purple-50 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                Step 2: Profile Details
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1.5">
                {selectedRole === 'student' && 'Student Profile'}
                {selectedRole === 'mentor' && 'Mentor & Advisor Profile'}
                {selectedRole === 'industry' && 'Industry Partner Profile'}
              </h3>
            </div>
          </div>

          {/* ERROR NOTIFICATION */}
          {errorMessage && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 1. STUDENT FIELDS */}
            {selectedRole === 'student' && (
              <div className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="reg-student-name"
                      type="text"
                      required
                      value={studentFullName}
                      onChange={(e) => setStudentFullName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-student-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="aarav@college.edu"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-student-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* College */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    College
                  </label>
                  <div className="relative">
                    <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="reg-student-college"
                      type="text"
                      required
                      value={studentCollege}
                      onChange={(e) => setStudentCollege(e.target.value)}
                      placeholder="e.g. MIT School of Engineering"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Department */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Department
                    </label>
                    <input
                      id="reg-student-dept"
                      type="text"
                      required
                      value={studentDepartment}
                      onChange={(e) => setStudentDepartment(e.target.value)}
                      placeholder="e.g. Electronics & Communication Engineering"
                      className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                    />
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Year
                    </label>
                    <select
                      id="reg-student-year"
                      value={studentYear}
                      onChange={(e) => setStudentYear(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Postgraduate / Masters">Postgraduate</option>
                      <option value="PhD Candidate">PhD Candidate</option>
                    </select>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Skills
                  </label>
                  <input
                    id="reg-student-skills"
                    type="text"
                    value={studentSkills}
                    onChange={(e) => setStudentSkills(e.target.value)}
                    placeholder="e.g. AI, IoT, C++, LoRaWAN, Python, React (comma separated)"
                    className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                </div>

                {/* Areas of Interest */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Areas of Interest
                  </label>
                  <input
                    id="reg-student-interests"
                    type="text"
                    value={studentAreasOfInterest}
                    onChange={(e) => setStudentAreasOfInterest(e.target.value)}
                    placeholder="e.g. Disaster Management, CleanTech, Autonomous Vehicles, Healthcare"
                    className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                </div>

              </div>
            )}

            {/* 2. MENTOR FIELDS */}
            {selectedRole === 'mentor' && (
              <div className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="reg-mentor-name"
                      type="text"
                      required
                      value={mentorFullName}
                      onChange={(e) => setMentorFullName(e.target.value)}
                      placeholder="e.g. Dr. Vikramaditya Sen"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-mentor-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="v.sen@iisc.ac.in"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-mentor-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Organization */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Organization
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-mentor-org"
                        type="text"
                        required
                        value={mentorOrganization}
                        onChange={(e) => setMentorOrganization(e.target.value)}
                        placeholder="e.g. IISc Bangalore / National Sensor Lab"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                      />
                    </div>
                  </div>

                  {/* Job Role */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Job Role
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-mentor-job"
                        type="text"
                        required
                        value={mentorJobRole}
                        onChange={(e) => setMentorJobRole(e.target.value)}
                        placeholder="e.g. Principal Scientist & Professor"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Experience
                  </label>
                  <input
                    id="reg-mentor-exp"
                    type="text"
                    value={mentorExperience}
                    onChange={(e) => setMentorExperience(e.target.value)}
                    placeholder="e.g. 10+ years in Embedded Sensors & Edge AI"
                    className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                </div>

                {/* Expertise */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Expertise
                  </label>
                  <input
                    id="reg-mentor-expertise"
                    type="text"
                    value={mentorExpertise}
                    onChange={(e) => setMentorExpertise(e.target.value)}
                    placeholder="e.g. LoRaWAN, TinyML, Hardware Validation, PCB Design (comma separated)"
                    className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Industry
                  </label>
                  <input
                    id="reg-mentor-industry"
                    type="text"
                    value={mentorIndustry}
                    onChange={(e) => setMentorIndustry(e.target.value)}
                    placeholder="e.g. Environmental Sensing, Robotics, DeepTech"
                    className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                </div>

                {/* Mentoring Areas */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mentoring Areas
                  </label>
                  <input
                    id="reg-mentor-areas"
                    type="text"
                    value={mentorMentoringAreas}
                    onChange={(e) => setMentorMentoringAreas(e.target.value)}
                    placeholder="e.g. Prototype Auditing, Field Trial Scaffolding, Grant Advisory"
                    className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                </div>

              </div>
            )}

            {/* 3. INDUSTRY FIELDS */}
            {selectedRole === 'industry' && (
              <div className="space-y-4">
                
                {/* Organization Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Organization Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="reg-ind-org"
                      type="text"
                      required
                      value={industryOrgName}
                      onChange={(e) => setIndustryOrgName(e.target.value)}
                      placeholder="e.g. Bosch Mobility & Sensor Labs"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="reg-ind-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="scout@bosch-mobility.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Industry */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Industry
                    </label>
                    <input
                      id="reg-ind-industry"
                      type="text"
                      value={industryField}
                      onChange={(e) => setIndustryField(e.target.value)}
                      placeholder="e.g. Smart Mobility, CleanTech, Healthcare, Industrial IoT"
                      className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                    />
                  </div>

                  {/* Organization Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Organization Type
                    </label>
                    <select
                      id="reg-ind-orgtype"
                      value={industryOrgType}
                      onChange={(e) => setIndustryOrgType(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                    >
                      <option value="Corporate R&D">Corporate R&D</option>
                      <option value="Incubator / Accelerator">Incubator / Accelerator</option>
                      <option value="Municipal / Government Body">Municipal / Government</option>
                      <option value="Venture / Angel Syndicate">Venture / Grant Funder</option>
                      <option value="University Research Lab">University Research Lab</option>
                    </select>
                  </div>
                </div>

                {/* Areas of Interest */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Areas of Interest
                  </label>
                  <input
                    id="reg-ind-interests"
                    type="text"
                    value={industryAreasOfInterest}
                    onChange={(e) => setIndustryAreasOfInterest(e.target.value)}
                    placeholder="e.g. Battery Management, Flood Telemetry, Edge Computer Vision"
                    className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                </div>

                {/* Collaboration Areas */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Collaboration Areas
                  </label>
                  <input
                    id="reg-ind-collab"
                    type="text"
                    value={industryCollaborationAreas}
                    onChange={(e) => setIndustryCollaborationAreas(e.target.value)}
                    placeholder="e.g. Pilot Sandboxes, Hardware Testing Facilities, Seed Grants"
                    className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 focus:border-purple-400 focus:bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                </div>

              </div>
            )}

            {/* BUTTON: [ Create Account ] */}
            <button
              id="reg-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-4 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 transition-all text-xs flex items-center justify-center space-x-2 shadow-md shadow-purple-500/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* BOTTOM TOGGLE TO LOGIN */}
          <div className="mt-8 pt-5 border-t border-purple-50 text-center text-xs text-slate-500">
            <div className="flex items-center justify-center space-x-1.5">
              <span>Already have an account?</span>
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="font-bold text-purple-700 hover:text-purple-900 hover:underline"
              >
                Login
              </button>
            </div>
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
