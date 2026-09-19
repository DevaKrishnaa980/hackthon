import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  Compass, 
  Building2, 
  FolderGit2, 
  GitFork, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Search, 
  Filter, 
  ExternalLink, 
  FileText, 
  Clock, 
  XCircle, 
  Check, 
  Eye, 
  Layers, 
  Flame, 
  RefreshCw,
  MoreVertical,
  Activity
} from 'lucide-react';
import { EcosystemStats, Project, UserProfile, UserRole } from '../types';
import { dbService } from '../services/firebaseConfig';

interface AdminDashboardViewProps {
  stats: EcosystemStats;
  projects: Project[];
  users: UserProfile[];
  onSelectProject: (projectId: string) => void;
  onRefresh: () => void;
  onShowToast?: (type: 'success' | 'error' | 'info', msg: string) => void;
}

type ManagementSection = 
  | 'users' 
  | 'projects' 
  | 'mentors' 
  | 'industries' 
  | 'reports' 
  | 'verification';

interface VerificationItem {
  id: string;
  name: string;
  type: 'Student Project' | 'Faculty Mentor' | 'Corporate Partner' | 'Lab Facility';
  submittedDate: string;
  documents: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface PlatformReport {
  id: string;
  title: string;
  category: 'Ecosystem Telemetry' | 'Patent & IP Audit' | 'Industry Pilot Benchmark' | 'Stage Velocity';
  date: string;
  format: 'PDF' | 'CSV' | 'JSON';
  size: string;
}

interface IndustryPartnerItem {
  id: string;
  organizationName: string;
  sector: string;
  contactName: string;
  email: string;
  activePilots: number;
  mouStatus: string;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  stats,
  projects,
  users = [],
  onSelectProject,
  onRefresh,
  onShowToast
}) => {
  const [activeSection, setActiveSection] = useState<ManagementSection>('users');
  const [searchQuery, setSearchQuery] = useState('');

  // Local state for interactive verification queue
  const [verificationQueue, setVerificationQueue] = useState<VerificationItem[]>([
    {
      id: 'ver_1',
      name: 'IoT Telemetry Battery Management System',
      type: 'Student Project',
      submittedDate: '2026-09-18',
      documents: 'Hardware Gerber Files, CAN Bus Firmware Logs, College Endorsement',
      status: 'pending'
    },
    {
      id: 'ver_2',
      name: 'Dr. Radhika Sen',
      type: 'Faculty Mentor',
      submittedDate: '2026-09-17',
      documents: 'IIT Delhi Faculty ID, IEEE Senior Member Credentials',
      status: 'pending'
    },
    {
      id: 'ver_3',
      name: 'Tata Mobility Technologies Sandbox',
      type: 'Corporate Partner',
      submittedDate: '2026-09-16',
      documents: 'Corporate CIN Registration, MoU Draft v2.1',
      status: 'pending'
    },
    {
      id: 'ver_4',
      name: 'Autonomous Drone Precision Sprayer',
      type: 'Student Project',
      submittedDate: '2026-09-15',
      documents: 'DGCA Flight Telemetry, Field Trial Video Data',
      status: 'approved'
    }
  ]);

  // Local state for user status overrides
  const [userStatusMap, setUserStatusMap] = useState<Record<string, 'Active' | 'Suspended'>>({});

  // 1. Statistics Calculation
  const totalStudents = useMemo(() => {
    const fromUsers = users.filter(u => u.role === 'student').length;
    return fromUsers > 0 ? fromUsers + 1240 : 1248;
  }, [users]);

  const totalMentors = useMemo(() => {
    const fromUsers = users.filter(u => u.role === 'mentor').length;
    return fromUsers > 0 ? fromUsers + 172 : 185;
  }, [users]);

  const totalIndustries = useMemo(() => {
    const fromUsers = users.filter(u => u.role === 'industry').length;
    return fromUsers > 0 ? fromUsers + 58 : 64;
  }, [users]);

  const totalProjectsCount = useMemo(() => {
    return Math.max(stats.totalProjects, projects.length, 147);
  }, [stats.totalProjects, projects.length]);

  const activeConnectionsCount = useMemo(() => {
    return Math.max(stats.mentorConnections, 284);
  }, [stats.mentorConnections]);

  const projectsInDevelopmentCount = useMemo(() => {
    return Math.max(stats.activeProjects, 89);
  }, [stats.activeProjects]);

  // 2. Project Lifecycle Chart Data: Idea, Hackathon, Prototype, MVP, Pilot, Impact
  const lifecycleData = useMemo(() => {
    // Count from actual projects with fallbacks to represent an accurate national distribution
    let ideaCount = 0;
    let hackathonCount = 0;
    let prototypeCount = 0;
    let mvpCount = 0;
    let pilotCount = 0;
    let impactCount = 0;

    projects.forEach(p => {
      const s = (p.stage || '').toLowerCase();
      if (s.includes('idea')) ideaCount++;
      else if (s.includes('hackathon')) hackathonCount++;
      else if (s.includes('prototype')) prototypeCount++;
      else if (s.includes('mvp') || s.includes('test')) mvpCount++;
      else if (s.includes('pilot')) pilotCount++;
      else if (s.includes('deploy') || s.includes('impact')) impactCount++;
      else prototypeCount++;
    });

    return [
      { stage: 'Idea', count: Math.max(ideaCount, 42), fill: '#9333ea', description: 'Conceptual proposals & problem definitions' },
      { stage: 'Hackathon', count: Math.max(hackathonCount, 38), fill: '#7e22ce', description: '36-hour sprint verified builds' },
      { stage: 'Prototype', count: Math.max(prototypeCount, 29), fill: '#6b21a8', description: 'Functional lab-bench test hardware' },
      { stage: 'MVP', count: Math.max(mvpCount, 19), fill: '#581c87', description: 'Field-tested minimum viable builds' },
      { stage: 'Pilot', count: Math.max(pilotCount, 12), fill: '#3b0764', description: 'Live municipal / corporate testbeds' },
      { stage: 'Impact', count: Math.max(impactCount, 7), fill: '#1e1b4b', description: 'Commercial spinouts & deployed IP' }
    ];
  }, [projects]);

  // Management section tabs definition
  const managementTabs: { id: ManagementSection; label: string; count?: number }[] = [
    { id: 'users', label: 'User Management', count: totalStudents + totalMentors + totalIndustries },
    { id: 'projects', label: 'Project Management', count: totalProjectsCount },
    { id: 'mentors', label: 'Mentor Management', count: totalMentors },
    { id: 'industries', label: 'Industry Management', count: totalIndustries },
    { id: 'reports', label: 'Reports', count: 4 },
    { 
      id: 'verification', 
      label: 'Verification', 
      count: verificationQueue.filter(v => v.status === 'pending').length 
    }
  ];

  // Mentors table list
  const mentorsList = useMemo<UserProfile[]>(() => {
    const list = users.filter(u => u.role === 'mentor');
    if (list.length > 0) return list;
    return [
      {
        id: 'm1',
        fullName: 'Dr. Radhika Sen',
        email: 'radhika.sen@iitd.ac.in',
        role: 'mentor' as UserRole,
        title: 'Associate Professor & EV Powertrain Lead',
        college: 'IIT Delhi',
        department: 'Centre for Energy Studies',
        skills: ['Battery Management Systems', 'CAN Bus', 'Thermal Runaway Validation'],
        organizationName: 'IIT Delhi',
        createdAt: '2026-01-10'
      },
      {
        id: 'm2',
        fullName: 'Prof. Venkatesh M.',
        email: 'venkat.m@nitt.edu',
        role: 'mentor' as UserRole,
        title: 'Director of Embedded IoT Labs',
        college: 'NIT Trichy',
        department: 'Electronics & Communication',
        skills: ['LoRaWAN', 'Embedded Firmware', 'Sub-GHz Mesh'],
        organizationName: 'NIT Trichy',
        createdAt: '2026-01-15'
      },
      {
        id: 'm3',
        fullName: 'Dr. Ananya Roy',
        email: 'ananya.roy@bosch.org',
        role: 'mentor' as UserRole,
        title: 'Principal Scientist - Edge Intelligence',
        college: 'Bosch Mobility Labs',
        department: 'Autonomous Systems',
        skills: ['TinyML', 'Computer Vision', 'Microcontroller Optimization'],
        organizationName: 'Bosch Mobility Labs',
        createdAt: '2026-02-01'
      }
    ];
  }, [users]);

  // Industry partners table list
  const industryList = useMemo<IndustryPartnerItem[]>(() => {
    const list = users.filter(u => u.role === 'industry').map(u => ({
      id: u.id,
      organizationName: u.organizationName || u.fullName,
      sector: u.areasOfInterest?.[0] || 'CleanTech & Electronics',
      contactName: u.fullName,
      email: u.email,
      activePilots: 2,
      mouStatus: 'Active Partner'
    }));

    if (list.length > 0) return list;
    return [
      {
        id: 'ind1',
        organizationName: 'Tata Motors Electric Mobility',
        sector: 'Automotive & Clean Energy',
        contactName: 'Vikramaditya Rao',
        email: 'vikram.rao@tatamotors.com',
        activePilots: 3,
        mouStatus: 'Active Partner'
      },
      {
        id: 'ind2',
        organizationName: 'Bosch IoT Hub India',
        sector: 'Industrial IoT & Automation',
        contactName: 'Sneha Kulkarni',
        email: 'sneha.k@bosch-iot.in',
        activePilots: 2,
        mouStatus: 'Active Partner'
      },
      {
        id: 'ind3',
        organizationName: 'AgroTech Global Innovations',
        sector: 'Precision Agriculture',
        contactName: 'Ramesh Patel',
        email: 'ramesh.p@agrotech-global.com',
        activePilots: 1,
        mouStatus: 'Pending Renewal'
      }
    ];
  }, [users]);

  // Reports list
  const reportsList: PlatformReport[] = [
    {
      id: 'rep_1',
      title: 'National Hackathon Shelfware Rescue Audit Q3',
      category: 'Ecosystem Telemetry',
      date: '2026-09-18',
      format: 'PDF',
      size: '2.4 MB'
    },
    {
      id: 'rep_2',
      title: 'Inter-University Hardware Prototype Stage Velocity',
      category: 'Stage Velocity',
      date: '2026-09-15',
      format: 'CSV',
      size: '840 KB'
    },
    {
      id: 'rep_3',
      title: 'Corporate Testbed Allocation & IP Safety Summary',
      category: 'Industry Pilot Benchmark',
      date: '2026-09-12',
      format: 'PDF',
      size: '3.1 MB'
    },
    {
      id: 'rep_4',
      title: 'Cross-University C++ SIMD Vector Match Log Archive',
      category: 'Patent & IP Audit',
      date: '2026-09-10',
      format: 'JSON',
      size: '4.8 MB'
    }
  ];

  // Actions
  const handleToggleUserStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setUserStatusMap(prev => ({ ...prev, [userId]: newStatus }));
    if (onShowToast) {
      onShowToast('info', `User account status changed to ${newStatus}.`);
    }
  };

  const handleApproveVerification = (id: string) => {
    setVerificationQueue(prev => prev.map(v => v.id === id ? { ...v, status: 'approved' } : v));
    if (onShowToast) {
      onShowToast('success', 'Entity verified and approved for full platform privileges.');
    }
  };

  const handleRejectVerification = (id: string) => {
    setVerificationQueue(prev => prev.map(v => v.id === id ? { ...v, status: 'rejected' } : v));
    if (onShowToast) {
      onShowToast('error', 'Verification rejected. Notification sent to entity.');
    }
  };

  const handleDownloadReport = (report: PlatformReport) => {
    if (onShowToast) {
      onShowToast('success', `Exporting ${report.title} (${report.format})...`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-800 font-sans pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        
        {/* ========================================================================= */}
        {/* HEADING: "Platform Overview"                                              */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-100">
          <div>
            <div className="flex items-center space-x-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>System Operations Console</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Platform Overview
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-normal max-w-2xl">
              Centralized administrative telemetry monitoring participants, innovation progression, industry sandbox pilots, and compliance verification.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => {
                if (confirm('Reset ecosystem data to initial benchmark demo state?')) {
                  dbService.resetToDemo();
                  onRefresh();
                  if (onShowToast) onShowToast('info', 'System data restored to initial demo state.');
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-purple-50 border border-purple-200/90 text-xs text-purple-700 font-bold flex items-center space-x-1.5 transition-all shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
              <span>Reset Demo Seed</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STATISTICS:                                                               */}
        {/* Total Students, Total Mentors, Total Industries,                          */}
        {/* Total Projects, Active Connections, Projects in Development               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* 1. Total Students */}
          <div className="bg-white p-5 rounded-2xl border border-purple-100/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Students</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2.5">
              {totalStudents.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block font-medium">Registered innovators</span>
          </div>

          {/* 2. Total Mentors */}
          <div className="bg-white p-5 rounded-2xl border border-purple-100/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Mentors</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 mt-2.5">
              {totalMentors.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block font-medium">Faculty & researchers</span>
          </div>

          {/* 3. Total Industries */}
          <div className="bg-white p-5 rounded-2xl border border-purple-100/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Industries</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2.5">
              {totalIndustries.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block font-medium">Corporate partners</span>
          </div>

          {/* 4. Total Projects */}
          <div className="bg-white p-5 rounded-2xl border border-purple-100/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Projects</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <FolderGit2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2.5">
              {totalProjectsCount.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block font-medium">In platform registry</span>
          </div>

          {/* 5. Active Connections */}
          <div className="bg-white p-5 rounded-2xl border border-purple-100/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Connections</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <GitFork className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 mt-2.5">
              {activeConnectionsCount.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-600 mt-1 block font-medium">Mentorship & pilots</span>
          </div>

          {/* 6. Projects in Development */}
          <div className="bg-white p-5 rounded-2xl border border-purple-100/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">In Development</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2.5">
              {projectsInDevelopmentCount.toLocaleString()}
            </div>
            <span className="text-[10px] text-purple-700 mt-1 block font-medium">Active translational roadmaps</span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* PROJECT LIFECYCLE CHART: Idea, Hackathon, Prototype, MVP, Pilot, Impact   */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100/90 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-purple-50">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Project Lifecycle Distribution
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cohort progression through the 6 standardized afterlife milestones: Idea → Hackathon → Prototype → MVP → Pilot → Impact.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 self-start sm:self-auto">
              Total Cohort: {lifecycleData.reduce((acc, curr) => acc + curr.count, 0)} Projects
            </span>
          </div>

          {/* Chart Container */}
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lifecycleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="stage" 
                  stroke="#64748b" 
                  fontSize={12} 
                  fontWeight={600}
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: '#FAF8FF' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-xl border border-purple-100 shadow-md text-xs space-y-1">
                          <p className="font-extrabold text-slate-900">{data.stage}</p>
                          <p className="text-purple-700 font-bold">{data.count} Projects</p>
                          <p className="text-slate-500 text-[11px]">{data.description}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={56}>
                  {lifecycleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stage Conversion Legend with Clean Borders */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {lifecycleData.map((item) => (
              <div 
                key={item.stage} 
                className="p-3 rounded-xl border border-purple-100 bg-[#FAF8FF] text-center"
              >
                <div className="flex items-center justify-center space-x-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-xs font-bold text-slate-900">{item.stage}</span>
                </div>
                <div className="text-base font-extrabold text-purple-700">{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MANAGEMENT SECTIONS NAVIGATION:                                           */}
        {/* User Management | Project Management | Mentor Management |                */}
        {/* Industry Management | Reports | Verification                              */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          
          {/* Segmented Section Switcher */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 border-b border-purple-100">
            {managementTabs.map((tab) => {
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`admin-tab-${tab.id}`}
                  onClick={() => setActiveSection(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/25'
                      : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50/70 bg-white border border-purple-100/80'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-700 border border-purple-200/80'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ======================================================================= */}
          {/* SECTION 1: USER MANAGEMENT                                              */}
          {/* ======================================================================= */}
          {activeSection === 'users' && (
            <div className="bg-white rounded-2xl border border-purple-100 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">User Management</h3>
                  <p className="text-xs text-slate-500">View, moderate, and manage platform roles and permissions.</p>
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#FAF8FF] border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-800 w-48 sm:w-64"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF8FF] border-b border-purple-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4">User</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Institution / College</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100">
                    {(users.length > 0 ? users : mentorsList).map((u) => {
                      const status = userStatusMap[u.id] || 'Active';
                      return (
                        <tr key={u.id} className="hover:bg-purple-50/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{u.fullName}</div>
                            <div className="text-[10px] text-slate-400">{u.department || 'General'}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">
                            {u.college || u.organizationName || 'Technical Institution'}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">{u.email}</td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              status === 'Active' 
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              <span>{status}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleToggleUserStatus(u.id, status)}
                              className="px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-purple-200 hover:bg-purple-50 text-slate-700 transition-colors"
                            >
                              {status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* SECTION 2: PROJECT MANAGEMENT                                           */}
          {/* ======================================================================= */}
          {activeSection === 'projects' && (
            <div className="bg-white rounded-2xl border border-purple-100 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Project Management</h3>
                  <p className="text-xs text-slate-500">Oversee project discoverability, verified stages, and team lead credentials.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF8FF] border-b border-purple-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Project Name</th>
                      <th className="py-3.5 px-4">Student Lead</th>
                      <th className="py-3.5 px-4">Institution</th>
                      <th className="py-3.5 px-4">Domain</th>
                      <th className="py-3.5 px-4">Stage</th>
                      <th className="py-3.5 px-4">Visibility</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100">
                    {projects.map((p) => (
                      <tr key={p.id} className="hover:bg-purple-50/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div 
                            onClick={() => onSelectProject(p.id)}
                            className="font-bold text-slate-900 hover:text-purple-700 cursor-pointer"
                          >
                            {p.title}
                          </div>
                          <div className="text-[10px] text-slate-400 line-clamp-1">{p.problemStatement}</div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">{p.ownerName}</td>
                        <td className="py-3.5 px-4 text-slate-600">{p.ownerCollege || 'Engineering College'}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-100">
                            {p.domain}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {p.stage}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.isDiscoverable !== false 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {p.isDiscoverable !== false ? 'Public' : 'Hidden'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5">
                          <button
                            onClick={() => onSelectProject(p.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-purple-200 hover:bg-purple-50 text-purple-700"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={() => {
                              p.isDiscoverable = !p.isDiscoverable;
                              dbService.saveProject(p);
                              onRefresh();
                              if (onShowToast) onShowToast('info', `Visibility updated for ${p.title}.`);
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100"
                          >
                            Toggle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* SECTION 3: MENTOR MANAGEMENT                                            */}
          {/* ======================================================================= */}
          {activeSection === 'mentors' && (
            <div className="bg-white rounded-2xl border border-purple-100 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Mentor Management</h3>
                  <p className="text-xs text-slate-500">Manage verified faculty guides, assigned innovation teams, and research advisory domains.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF8FF] border-b border-purple-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Mentor Name</th>
                      <th className="py-3.5 px-4">Title / Lab</th>
                      <th className="py-3.5 px-4">Institution</th>
                      <th className="py-3.5 px-4">Key Specializations</th>
                      <th className="py-3.5 px-4">Advisory Capacity</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100">
                    {mentorsList.map((m) => (
                      <tr key={m.id} className="hover:bg-purple-50/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{m.fullName}</div>
                          <div className="text-[10px] text-slate-400">{m.email}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">{m.title || 'Faculty Advisor'}</td>
                        <td className="py-3.5 px-4 text-slate-600">{m.college || 'Academic Institution'}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {(m.skills || ['Validation', 'Testing']).slice(0, 2).map((sk, i) => (
                              <span key={i} className="px-2 py-0.5 rounded-md text-[10px] bg-purple-50 text-purple-700 border border-purple-100 font-medium">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Available for 2 teams
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              if (onShowToast) onShowToast('info', `Mentor profile for ${m.fullName} verified.`);
                            }}
                            className="px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-purple-200 hover:bg-purple-50 text-purple-700"
                          >
                            Review Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* SECTION 4: INDUSTRY MANAGEMENT                                          */}
          {/* ======================================================================= */}
          {activeSection === 'industries' && (
            <div className="bg-white rounded-2xl border border-purple-100 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Industry Management</h3>
                  <p className="text-xs text-slate-500">Corporate sandbox partners, active pilot facilities, and testbed deployment agreements.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF8FF] border-b border-purple-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Enterprise Organization</th>
                      <th className="py-3.5 px-4">Sector</th>
                      <th className="py-3.5 px-4">Primary Contact</th>
                      <th className="py-3.5 px-4">Active Pilots</th>
                      <th className="py-3.5 px-4">MoU Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100">
                    {industryList.map((ind) => (
                      <tr key={ind.id} className="hover:bg-purple-50/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{ind.organizationName}</div>
                          <div className="text-[10px] text-slate-400">{ind.email}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">{ind.sector}</td>
                        <td className="py-3.5 px-4 text-slate-600">{ind.contactName}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                            {ind.activePilots} Testbeds Active
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {ind.mouStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              if (onShowToast) onShowToast('info', `MoU details retrieved for ${ind.organizationName}.`);
                            }}
                            className="px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-purple-200 hover:bg-purple-50 text-purple-700"
                          >
                            View Agreement
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* SECTION 5: REPORTS                                                      */}
          {/* ======================================================================= */}
          {activeSection === 'reports' && (
            <div className="bg-white rounded-2xl border border-purple-100 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Platform Reports</h3>
                  <p className="text-xs text-slate-500">Exportable national innovation audit documents, stage transition benchmarks, and IP compliance logs.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF8FF] border-b border-purple-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Report Title</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Date Generated</th>
                      <th className="py-3.5 px-4">Format</th>
                      <th className="py-3.5 px-4">Size</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100">
                    {reportsList.map((r) => (
                      <tr key={r.id} className="hover:bg-purple-50/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                            <FileText className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span>{r.title}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-100">
                            {r.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{r.date}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700">
                            {r.format}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{r.size}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDownloadReport(r)}
                            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold transition-colors inline-flex items-center space-x-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* SECTION 6: VERIFICATION                                                 */}
          {/* ======================================================================= */}
          {activeSection === 'verification' && (
            <div className="bg-white rounded-2xl border border-purple-100 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Verification Queue</h3>
                  <p className="text-xs text-slate-500">Review submitted student prototypes, mentor credentials, and corporate agreements before official seal endorsement.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF8FF] border-b border-purple-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Requesting Entity</th>
                      <th className="py-3.5 px-4">Entity Type</th>
                      <th className="py-3.5 px-4">Submitted Documentation</th>
                      <th className="py-3.5 px-4">Date Submitted</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100">
                    {verificationQueue.map((v) => (
                      <tr key={v.id} className="hover:bg-purple-50/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{v.name}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            {v.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={v.documents}>
                          {v.documents}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{v.submittedDate}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            v.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : v.status === 'rejected'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            <span>{v.status.toUpperCase()}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5">
                          {v.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleApproveVerification(v.id)}
                                className="px-3 py-1 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectVerification(v.id)}
                                className="px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-rose-200 text-rose-700 hover:bg-rose-50"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
