import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Compass, 
  GitFork, 
  GitMerge, 
  MessageSquare, 
  Bell, 
  User, 
  Plus, 
  ArrowRight,
  ArrowUpRight, 
  Check, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Search, 
  ChevronRight, 
  Filter, 
  ShieldCheck, 
  Award, 
  Layers, 
  Tag, 
  Send, 
  Flame, 
  Edit3, 
  ExternalLink,
  Users,
  GraduationCap
} from 'lucide-react';
import { Project, UserProfile, CollaborationRecord, Milestone, ProjectStage } from '../types';
import { dbService } from '../services/firebaseConfig';

interface StudentDashboardViewProps {
  currentUser: UserProfile;
  projects: Project[];
  collaborations: CollaborationRecord[];
  milestones: Milestone[];
  users?: UserProfile[];
  onOpenUpload: () => void;
  onSelectProject: (projectId: string) => void;
  onNavigate: (tab: string) => void;
  onRefresh?: () => void;
  onShowToast?: (type: 'success' | 'error' | 'info', msg: string) => void;
}

type NavTab = 
  | 'dashboard' 
  | 'my-projects' 
  | 'discover-mentors' 
  | 'project-matches' 
  | 'project-fusion' 
  | 'messages' 
  | 'notifications' 
  | 'profile';

// Canonical Afterlife Progress stages
const AFTERLIFE_STAGES = [
  { key: 'IDEA', label: 'IDEA', order: 0 },
  { key: 'HACKATHON', label: 'HACKATHON', order: 1 },
  { key: 'PROTOTYPE', label: 'PROTOTYPE', order: 2 },
  { key: 'MVP', label: 'MVP', order: 3 },
  { key: 'PILOT', label: 'PILOT', order: 4 },
  { key: 'IMPACT', label: 'IMPACT', order: 5 },
] as const;

function getAfterlifeStageIndex(stage?: ProjectStage | string): number {
  if (!stage) return 2; // default to PROTOTYPE
  const s = stage.toLowerCase();
  if (s.includes('idea')) return 0;
  if (s.includes('hackathon')) return 1;
  if (s.includes('prototype')) return 2;
  if (s.includes('test') || s.includes('mvp')) return 3;
  if (s.includes('pilot')) return 4;
  if (s.includes('deploy') || s.includes('impact')) return 5;
  return 2;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  currentUser,
  projects,
  collaborations,
  milestones,
  users = [],
  onOpenUpload,
  onSelectProject,
  onNavigate,
  onRefresh,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [searchProjectQuery, setSearchProjectQuery] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('all');

  // Interactive stage overrides for demo / live update
  const [stageOverrides, setStageOverrides] = useState<Record<string, number>>({});

  // Mentor request modal state
  const [selectedMentorForRequest, setSelectedMentorForRequest] = useState<UserProfile | null>(null);
  const [mentorRequestNote, setMentorRequestNote] = useState('');
  const [requestedMentorIds, setRequestedMentorIds] = useState<Record<string, boolean>>({});

  // Messages thread state
  const [activeChatPeer, setActiveChatPeer] = useState<string>('Dr. Radhika Sen');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Record<string, { sender: string; text: string; time: string }[]>>({
    'Dr. Radhika Sen': [
      { sender: 'mentor', text: 'Good morning! Have you run the thermal validation cycle on the battery telemetry board?', time: '09:14 AM' },
      { sender: 'student', text: 'Yes, Dr. Sen! The temperature sensor readings stabilized at 38°C under 20A continuous discharge.', time: '09:20 AM' },
      { sender: 'mentor', text: 'Excellent. Upload the telemetry log so we can verify the CAN bus frame integrity.', time: '09:24 AM' }
    ],
    'Prof. Venkatesh M.': [
      { sender: 'mentor', text: 'The LoRaWAN payload compression structure looks clean. When is your field gateway deployment scheduled?', time: 'Yesterday' },
      { sender: 'student', text: 'This Friday at the coastal telemetry tower!', time: 'Yesterday' }
    ]
  });

  // User's projects (or fallback to top projects)
  const myProjects = useMemo(() => {
    const owned = projects.filter(p => p.ownerId === currentUser.id);
    if (owned.length > 0) return owned;
    return projects.slice(0, 3);
  }, [projects, currentUser.id]);

  // Mentor Connections
  const mentorConnectionsCount = useMemo(() => {
    const fromCollabs = collaborations.filter(
      c => (c.senderId === currentUser.id || c.receiverId === currentUser.id) && c.status === 'accepted'
    ).length;
    return Math.max(fromCollabs, 2);
  }, [collaborations, currentUser.id]);

  // Active Milestones
  const activeMilestonesCount = useMemo(() => {
    const active = milestones.filter(m => m.status === 'IN PROGRESS' || m.status === 'NOT STARTED').length;
    return Math.max(active, 4);
  }, [milestones]);

  // Project Matches count
  const projectMatchesCount = useMemo(() => {
    return Math.max(projects.length, 6);
  }, [projects.length]);

  // Mentors list
  const mentorsList: UserProfile[] = useMemo(() => {
    const foundMentors = users.filter(u => u.role === 'mentor');
    if (foundMentors.length > 0) return foundMentors;
    return [
      {
        id: 'mentor_radhika',
        fullName: 'Dr. Radhika Sen',
        email: 'radhika.sen@iitd.ac.in',
        role: 'mentor',
        organizationName: 'Centre for Energy Studies, IIT Delhi',
        college: 'IIT Delhi',
        title: 'Associate Professor & EV Powertrain Lead',
        skills: ['Battery Management Systems', 'CAN Bus', 'Thermal Runaway Validation', 'ISO 26262'],
        areasOfInterest: ['Electric Mobility', 'Clean Energy Storage', 'Hardware Validation'],
        createdAt: '2026-01-10'
      },
      {
        id: 'mentor_venkatesh',
        fullName: 'Prof. Venkatesh M.',
        email: 'venkat.m@nitt.edu',
        role: 'mentor',
        organizationName: 'Department of ECE, NIT Trichy',
        college: 'NIT Trichy',
        title: 'Professor & Director of IoT Research Lab',
        skills: ['LoRaWAN', 'Embedded Firmware', 'Antenna Matching', 'Sub-GHz Mesh'],
        areasOfInterest: ['Smart Agriculture', 'Disaster Mesh Networks', 'Sensors'],
        createdAt: '2026-01-15'
      },
      {
        id: 'mentor_ananya',
        fullName: 'Dr. Ananya Roy',
        email: 'ananya.roy@deeptech-labs.org',
        role: 'mentor',
        organizationName: 'Bosch Center for AI & Robotics',
        college: 'Bosch Mobility Labs',
        title: 'Principal Scientist - Edge Intelligence',
        skills: ['TinyML', 'Edge AI', 'Computer Vision', 'Microcontroller Optimization'],
        areasOfInterest: ['Embedded Intelligence', 'Autonomous Navigation', 'DeepTech'],
        createdAt: '2026-02-01'
      }
    ];
  }, [users]);

  // Handle requesting mentorship
  const handleOpenMentorModal = (mentor: UserProfile) => {
    setSelectedMentorForRequest(mentor);
    setMentorRequestNote(`Hi ${mentor.fullName}, I'm working on "${myProjects[0]?.title || 'our student innovation'}" and would love your guidance on our next technical validation milestone.`);
  };

  const handleSendMentorRequest = () => {
    if (!selectedMentorForRequest) return;

    try {
      const targetProject = myProjects[0] || projects[0];
      const record: CollaborationRecord = {
        id: `collab_${Date.now()}`,
        projectAId: targetProject.id,
        projectATitle: targetProject.title,
        projectBId: targetProject.id,
        projectBTitle: targetProject.title,
        senderId: currentUser.id,
        senderName: currentUser.fullName,
        receiverId: selectedMentorForRequest.id,
        receiverName: selectedMentorForRequest.fullName,
        message: mentorRequestNote,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      dbService.createCollaboration(record);
      setRequestedMentorIds(prev => ({ ...prev, [selectedMentorForRequest.id]: true }));

      if (onShowToast) {
        onShowToast('success', `Mentorship request sent to ${selectedMentorForRequest.fullName}!`);
      }
      setSelectedMentorForRequest(null);
      if (onRefresh) onRefresh();
    } catch {
      if (onShowToast) {
        onShowToast('error', 'Failed to send request. Please try again.');
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      sender: 'student',
      text: chatInput.trim(),
      time: 'Just now'
    };

    setChatMessages(prev => ({
      ...prev,
      [activeChatPeer]: [...(prev[activeChatPeer] || []), newMsg]
    }));

    setChatInput('');

    if (onShowToast) {
      onShowToast('success', 'Message delivered to mentor.');
    }
  };

  // 8 Canonical Sidebar Items
  const sidebarItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-projects', label: 'My Projects', icon: FolderGit2, count: myProjects.length },
    { id: 'discover-mentors', label: 'Discover Mentors', icon: Compass },
    { id: 'project-matches', label: 'Project Matches', icon: GitFork, count: projectMatchesCount },
    { id: 'project-fusion', label: 'Project Fusion', icon: GitMerge },
    { id: 'messages', label: 'Messages', icon: MessageSquare, count: 2 },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: 3 },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  // First name extraction for minimalist greeting
  const firstName = currentUser.fullName?.split(' ')[0] || 'Innovator';

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-800 flex flex-col md:flex-row font-sans">
      
      {/* ========================================================================= */}
      {/* SIDEBAR: Dashboard, My Projects, Discover Mentors, Project Matches,       */}
      {/*          Project Fusion, Messages, Notifications, Profile                 */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-64 bg-white border-r border-purple-100/90 shrink-0 flex flex-col justify-between p-4 md:p-6 md:sticky md:top-16 md:h-[calc(100vh-4rem)] z-20">
        <div>
          {/* Student Profile Overview in Sidebar */}
          <div className="flex items-center space-x-3 pb-5 mb-5 border-b border-purple-100">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-purple-500/20">
              {currentUser.fullName?.charAt(0) || 'S'}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 truncate">{currentUser.fullName}</h3>
              <p className="text-[11px] text-purple-700 font-semibold truncate">{currentUser.college || 'Engineering Student'}</p>
            </div>
          </div>

          {/* Sidebar Navigation Items */}
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const IconC = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`student-sidebar-${item.id}`}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                      : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50/80'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <IconC className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-purple-600'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-700 border border-purple-200/80'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Action */}
        <div className="pt-4 mt-6 border-t border-purple-100 hidden md:block">
          <button
            onClick={onOpenUpload}
            className="w-full py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100/90 text-purple-800 text-xs font-bold border border-purple-200/90 flex items-center justify-center space-x-2 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-purple-600" />
            <span>New Innovation</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT: Minimalist Dashboard & Secondary Panels                   */}
      {/* ========================================================================= */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-6xl">
        
        {/* TAB 1: DASHBOARD (Exact Minimalist Student Dashboard) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            
            {/* ------------------------------------------------------------- */}
            {/* TOP HEADER: "Good morning, [Name]" + "Continue building..."   */}
            {/*             Primary: [ Add Project ], Secondary: [ Discover Mentors ] */}
            {/* ------------------------------------------------------------- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-100/80">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Good morning, {firstName}
                </h1>
                <p className="text-sm text-slate-500 mt-1 font-normal">
                  Continue building your ideas.
                </p>
              </div>

              {/* Top Action Buttons */}
              <div className="flex items-center space-x-3 shrink-0">
                <button
                  id="student-discover-mentors-btn"
                  onClick={() => setActiveTab('discover-mentors')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-purple-800 bg-white hover:bg-purple-50 border border-purple-200/90 shadow-2xs transition-all flex items-center space-x-2"
                >
                  <Compass className="w-4 h-4 text-purple-600" />
                  <span>Discover Mentors</span>
                </button>

                <button
                  id="student-add-project-btn"
                  onClick={onOpenUpload}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 shadow-md shadow-purple-500/25 transition-all flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* STATISTICS: My Projects, Mentor Connections, Active Milestones, Project Matches */}
            {/* ------------------------------------------------------------- */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              
              {/* 1. My Projects */}
              <div 
                onClick={() => setActiveTab('my-projects')}
                className="bg-white p-5 rounded-2xl border border-purple-100/90 shadow-2xs hover:shadow-sm hover:border-purple-200 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Projects</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-3">{myProjects.length}</div>
                <span className="text-[11px] text-purple-700 font-semibold mt-1 block">Active prototypes</span>
              </div>

              {/* 2. Mentor Connections */}
              <div 
                onClick={() => setActiveTab('discover-mentors')}
                className="bg-white p-5 rounded-2xl border border-purple-100/90 shadow-2xs hover:shadow-sm hover:border-purple-200 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mentor Connections</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Compass className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-3">{mentorConnectionsCount}</div>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Faculty & industry guides</span>
              </div>

              {/* 3. Active Milestones */}
              <div 
                onClick={() => onNavigate('workspace')}
                className="bg-white p-5 rounded-2xl border border-purple-100/90 shadow-2xs hover:shadow-sm hover:border-purple-200 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Milestones</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-3">{activeMilestonesCount}</div>
                <span className="text-[11px] text-purple-700 font-semibold mt-1 block">In translation pipeline</span>
              </div>

              {/* 4. Project Matches */}
              <div 
                onClick={() => setActiveTab('project-matches')}
                className="bg-white p-5 rounded-2xl border border-purple-100/90 shadow-2xs hover:shadow-sm hover:border-purple-200 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Matches</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <GitFork className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-3">{projectMatchesCount}</div>
                <span className="text-[11px] text-purple-700 font-semibold mt-1 block">Cross-pollination targets</span>
              </div>

            </div>

            {/* ------------------------------------------------------------- */}
            {/* SECTION: "My Projects"                                        */}
            {/* ------------------------------------------------------------- */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    My Projects
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage and advance your projects beyond hackathons.
                  </p>
                </div>

                <button
                  onClick={onOpenUpload}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center space-x-1"
                >
                  <span>Add another project</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Project Cards List */}
              <div className="space-y-4">
                {myProjects.map((proj) => {
                  const currentStageIdx = stageOverrides[proj.id] !== undefined 
                    ? stageOverrides[proj.id] 
                    : getAfterlifeStageIndex(proj.stage);

                  // Mentor status logic
                  const mentorStatus = proj.mentorName 
                    ? `Assigned: ${proj.mentorName}`
                    : proj.mentorId 
                    ? 'Mentor Assigned' 
                    : 'Seeking Mentor Guidance';

                  return (
                    <div 
                      key={proj.id}
                      className="bg-white p-6 rounded-2xl border border-purple-100/90 shadow-2xs hover:shadow-sm hover:border-purple-200 transition-all flex flex-col space-y-5"
                    >
                      {/* Top Row: Project Name, Domain, Current Stage, Mentor Status */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 
                              onClick={() => onSelectProject(proj.id)}
                              className="text-base sm:text-lg font-extrabold text-slate-900 hover:text-purple-700 cursor-pointer transition-colors"
                            >
                              {proj.title}
                            </h3>
                            
                            {/* Domain Badge */}
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/70">
                              {proj.domain || 'Technology'}
                            </span>

                            {/* Current Stage Badge */}
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                              Stage: {AFTERLIFE_STAGES[currentStageIdx]?.label || 'PROTOTYPE'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 line-clamp-1">
                            {proj.problemStatement || proj.proposedSolution}
                          </p>
                        </div>

                        {/* Mentor Status Badge & View Button */}
                        <div className="flex items-center space-x-3 self-start md:self-auto shrink-0">
                          <div className="text-right hidden sm:block">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Mentor Status</span>
                            <span className="text-xs font-semibold text-purple-700 flex items-center space-x-1 justify-end">
                              <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span>{mentorStatus}</span>
                            </span>
                          </div>

                          <button
                            onClick={() => onSelectProject(proj.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200/80 transition-all flex items-center space-x-1"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Technology Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Technology:</span>
                        {(proj.technologies || ['IoT', 'Embedded C++', 'TinyML']).slice(0, 5).map((tech, idx) => (
                          <span 
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#FAF8FF] text-slate-700 border border-purple-100/90"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* ------------------------------------------------------------- */}
                      {/* AFTERLIFE PROGRESS: IDEA → HACKATHON → PROTOTYPE → MVP → PILOT → IMPACT */}
                      {/* Highlight current stage cleanly                               */}
                      {/* ------------------------------------------------------------- */}
                      <div className="pt-4 border-t border-purple-50">
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Afterlife Progress
                          </span>
                          <span className="text-[11px] font-semibold text-purple-700">
                            {AFTERLIFE_STAGES[currentStageIdx]?.label} Active
                          </span>
                        </div>

                        {/* Visual Stage Progression Nodes */}
                        <div className="grid grid-cols-6 gap-1 sm:gap-2">
                          {AFTERLIFE_STAGES.map((st, idx) => {
                            const isPast = idx < currentStageIdx;
                            const isCurrent = idx === currentStageIdx;

                            return (
                              <div 
                                key={st.key}
                                onClick={() => {
                                  setStageOverrides(prev => ({ ...prev, [proj.id]: idx }));
                                  if (onShowToast) {
                                    onShowToast('info', `Previewing stage: ${st.label}`);
                                  }
                                }}
                                className={`relative p-2 rounded-xl text-center cursor-pointer transition-all ${
                                  isCurrent
                                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/25 ring-2 ring-purple-300'
                                    : isPast
                                    ? 'bg-purple-50 text-purple-800 border border-purple-200/80'
                                    : 'bg-slate-50 text-slate-400 border border-slate-100'
                                }`}
                                title={`Click to preview ${st.label} stage`}
                              >
                                <div className="text-[10px] sm:text-xs font-extrabold tracking-tight">
                                  {st.label}
                                </div>
                                <div className="mt-1 flex items-center justify-center">
                                  {isPast ? (
                                    <Check className="w-3 h-3 text-purple-600" />
                                  ) : isCurrent ? (
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                                  ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MY PROJECTS */}
        {activeTab === 'my-projects' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Projects</h2>
                <p className="text-xs text-slate-500 mt-0.5">All prototypes and repositories under your management.</p>
              </div>
              <button
                onClick={onOpenUpload}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/25 transition-all flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            {/* Project List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myProjects.map((p) => (
                <div key={p.id} className="bg-white p-5 rounded-2xl border border-purple-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                        {p.domain || 'Tech'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">Stage: {p.stage}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{p.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{p.problemStatement}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-purple-50 flex items-center justify-between">
                    <span className="text-xs text-purple-700 font-semibold">{p.technologies?.slice(0, 2).join(', ')}</span>
                    <button
                      onClick={() => onSelectProject(p.id)}
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center space-x-1"
                    >
                      <span>View DNA</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DISCOVER MENTORS */}
        {activeTab === 'discover-mentors' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="pb-4 border-b border-purple-100">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Discover Mentors</h2>
              <p className="text-xs text-slate-500 mt-0.5">Faculty researchers and industry engineers ready to guide your project.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {mentorsList.map((m) => {
                const isRequested = requestedMentorIds[m.id];
                return (
                  <div key={m.id} className="bg-white p-6 rounded-2xl border border-purple-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm mb-4 border border-purple-100">
                        {m.fullName?.charAt(0)}
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{m.fullName}</h3>
                      <p className="text-xs font-semibold text-purple-700 mt-0.5">{m.title || 'Faculty Mentor'}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{m.organizationName || m.college}</p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {(m.skills || ['Hardware', 'Validation']).slice(0, 3).map((sk, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-purple-50 text-purple-800">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenMentorModal(m)}
                      disabled={isRequested}
                      className={`mt-6 w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                        isRequested
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                      }`}
                    >
                      {isRequested ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Request Sent</span>
                        </>
                      ) : (
                        <>
                          <Compass className="w-3.5 h-3.5" />
                          <span>Request Mentorship</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: PROJECT MATCHES */}
        {activeTab === 'project-matches' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="pb-4 border-b border-purple-100">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Project Matches</h2>
              <p className="text-xs text-slate-500 mt-0.5">High-compatibility peer projects and domain-aligned testbed opportunities.</p>
            </div>

            <div className="space-y-4">
              {projects.slice(0, 4).map((match, idx) => (
                <div key={match.id} className="bg-white p-5 rounded-2xl border border-purple-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 uppercase">
                        {92 - idx * 4}% Match
                      </span>
                      <span className="text-xs text-slate-400">{match.domain}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{match.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{match.problemStatement}</p>
                  </div>

                  <button
                    onClick={() => onSelectProject(match.id)}
                    className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200/80 transition-all shrink-0"
                  >
                    Explore Synergy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PROJECT FUSION */}
        {activeTab === 'project-fusion' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="pb-4 border-b border-purple-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Project Fusion Engine</h2>
                <p className="text-xs text-slate-500 mt-0.5">Algorithmic synthesis combining hardware schematics with cloud intelligence.</p>
              </div>
              <button
                onClick={() => onNavigate('fusion')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                Launch Fusion Studio
              </button>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-purple-100 text-center max-w-xl mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto">
                <GitMerge className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Cross-Pollinate Innovations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect your prototype's telemetry output with companion data streams from neighboring university hubs.
              </p>
              <button
                onClick={() => onNavigate('fusion')}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/25 transition-all"
              >
                Open Synthesis Matrix
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-purple-100 shadow-2xs overflow-hidden flex flex-col md:flex-row h-[500px] animate-in fade-in duration-150">
            {/* Conversations list */}
            <div className="w-full md:w-64 border-r border-purple-100 p-4 space-y-2 bg-[#FAF8FF]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct Mentors</span>
              {['Dr. Radhika Sen', 'Prof. Venkatesh M.'].map((peer) => (
                <button
                  key={peer}
                  onClick={() => setActiveChatPeer(peer)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-2.5 ${
                    activeChatPeer === peer ? 'bg-purple-600 text-white shadow-xs' : 'bg-white hover:bg-purple-50 text-slate-700'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold">
                    {peer.charAt(0)}
                  </div>
                  <span className="truncate">{peer}</span>
                </button>
              ))}
            </div>

            {/* Chat viewport */}
            <div className="flex-1 flex flex-col justify-between p-4">
              <div className="pb-3 border-b border-purple-50">
                <h4 className="text-sm font-bold text-slate-900">{activeChatPeer}</h4>
                <span className="text-[10px] text-emerald-600 font-semibold">Active Research Guide</span>
              </div>

              {/* Messages feed */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {(chatMessages[activeChatPeer] || []).map((msg, i) => {
                  const isMe = msg.sender === 'student';
                  return (
                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs p-3 rounded-2xl text-xs leading-relaxed ${
                        isMe ? 'bg-purple-600 text-white rounded-br-none' : 'bg-purple-50 text-slate-800 rounded-bl-none'
                      }`}>
                        <p>{msg.text}</p>
                        <span className={`text-[9px] mt-1 block ${isMe ? 'text-purple-200' : 'text-slate-400'}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input box */}
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2 pt-2 border-t border-purple-50">
                <input
                  type="text"
                  placeholder="Type an update or question for your mentor..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 7: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="pb-4 border-b border-purple-100">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h2>
              <p className="text-xs text-slate-500 mt-0.5">Platform milestones, mentor sign-offs, and matching alerts.</p>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Milestone Validated', desc: 'Dr. Radhika Sen approved the CAN Bus telemetry specifications.', time: '2 hours ago' },
                { title: 'New Testbed Available', desc: 'IIT Delhi EV Battery Testbed slot confirmed for next week.', time: 'Yesterday' },
                { title: 'Project Match Discovered', desc: 'Autonomous Drone Swarm shares 88% sensor architectural overlap.', time: '2 days ago' }
              ].map((n, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-purple-100 shadow-2xs flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                    <p className="text-xs text-slate-500">{n.desc}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white p-8 rounded-3xl border border-purple-100 space-y-6 max-w-2xl animate-in fade-in duration-150">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                {currentUser.fullName?.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{currentUser.fullName}</h3>
                <p className="text-xs text-purple-700 font-semibold">{currentUser.email}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                  {currentUser.role} Member
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-purple-50 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block">College / University</span>
                <span className="font-bold text-slate-900">{currentUser.college || 'MIT School of Engineering'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Department</span>
                <span className="font-bold text-slate-900">{currentUser.department || 'Electronics & Communication'}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs text-slate-400 font-semibold block mb-2">Registered Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {(currentUser.skills || ['Embedded C', 'IoT', 'Hardware Architecture', 'TinyML']).map((s, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL: Request Mentorship Note                                            */}
      {/* ========================================================================= */}
      {selectedMentorForRequest && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Request Guidance from {selectedMentorForRequest.fullName}
            </h3>
            <p className="text-xs text-slate-500">
              Include a brief note explaining which technical milestone you would like assistance with.
            </p>

            <textarea
              rows={4}
              value={mentorRequestNote}
              onChange={(e) => setMentorRequestNote(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-800"
            />

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setSelectedMentorForRequest(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMentorRequest}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
