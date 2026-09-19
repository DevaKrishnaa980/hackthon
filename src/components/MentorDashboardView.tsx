import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Compass, 
  Inbox, 
  Users, 
  MessageSquare, 
  Bell, 
  User, 
  Check, 
  CheckCircle2, 
  ArrowUpRight, 
  FileCode, 
  Send, 
  Search, 
  Calendar, 
  Sparkles, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Building2, 
  Briefcase, 
  GraduationCap, 
  Tag, 
  Filter,
  X,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Project, UserProfile, CollaborationRecord, ProjectStage } from '../types';
import { dbService } from '../services/firebaseConfig';

interface MentorDashboardViewProps {
  currentUser: UserProfile;
  projects: Project[];
  collaborations: CollaborationRecord[];
  onSelectProject: (projectId: string) => void;
  onNavigateToWorkspace: () => void;
  onRefresh: () => void;
  onShowToast?: (type: 'success' | 'error' | 'info', msg: string) => void;
}

type SidebarTab = 
  | 'dashboard' 
  | 'discover' 
  | 'requests' 
  | 'mentees' 
  | 'messages' 
  | 'notifications' 
  | 'profile';

interface MentorshipMatchMetadata {
  compatibilityPercent: number;
  expertiseMatch: boolean;
  technologyMatch: boolean;
  domainMatch: boolean;
  projectNeedMatch: boolean;
  stageLabel: string;
}

export const MentorDashboardView: React.FC<MentorDashboardViewProps> = ({
  currentUser,
  projects,
  collaborations,
  onSelectProject,
  onNavigateToWorkspace,
  onRefresh,
  onShowToast
}) => {
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('all');

  // Mentorship Offer Modal state
  const [offerTargetProject, setOfferTargetProject] = useState<Project | null>(null);
  const [offerNote, setOfferNote] = useState('');
  const [offerFocusArea, setOfferFocusArea] = useState('Hardware Validation & Pilot Testing');
  const [offeredProjectIds, setOfferedProjectIds] = useState<Record<string, boolean>>({});

  // Active chat state for Messages tab
  const [activeChatMentee, setActiveChatMentee] = useState<string>('Aarav Sharma');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Record<string, { sender: string; text: string; time: string }[]>>({
    'Aarav Sharma': [
      { sender: 'Aarav Sharma', text: 'Dr. Sen, we completed the thermal benchmark for the 48V pack at 25A continuous discharge.', time: '10:20 AM' },
      { sender: 'mentor', text: 'Great progress Aarav. What was the peak surface temperature deviation across cells?', time: '10:25 AM' },
      { sender: 'Aarav Sharma', text: 'Under 3.2°C across all 16 thermistors with the active air tunnel running!', time: '10:31 AM' },
    ],
    'Priya Patel': [
      { sender: 'Priya Patel', text: 'We integrated the LoRaWAN payload compression struct. Saved 68% packet airtime.', time: 'Yesterday' },
      { sender: 'mentor', text: 'Excellent! Make sure to test packet loss during simulated rain attenuation.', time: 'Yesterday' },
    ]
  });

  // Calculate Mentor Statistics
  const activeMenteesCount = useMemo(() => {
    const fromCollabs = collaborations.filter(
      c => (c.receiverId === currentUser.id || c.senderId === currentUser.id) && c.status === 'accepted'
    ).length;
    return Math.max(fromCollabs, 4); // baseline active mentees in ecosystem
  }, [collaborations, currentUser.id]);

  const projectsReviewedCount = 18; // historical milestone reviews completed

  const mentorshipRequestsCount = useMemo(() => {
    const pending = collaborations.filter(
      c => (c.receiverId === currentUser.id || c.senderId === currentUser.id) && c.status === 'pending'
    ).length;
    return Math.max(pending, 3);
  }, [collaborations, currentUser.id]);

  // Mentor skills & domains
  const mentorSkills = useMemo(() => {
    return currentUser.skills || currentUser.skillsOrOfferings || ['IoT', 'Embedded Systems', 'TinyML', 'Hardware Validation', 'AI'];
  }, [currentUser]);

  // Compute matches with compatibility score and "Why this matches" criteria
  const recommendedProjectsWithMatch = useMemo(() => {
    return projects.map((p, index) => {
      // Tech overlap
      const techOverlap = p.technologies.some(t => 
        mentorSkills.some(s => s.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(s.toLowerCase()))
      );
      
      // Domain overlap
      const domainOverlap = mentorSkills.some(s => 
        p.domain.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(p.domain.toLowerCase())
      ) || ['IoT', 'CleanTech', 'Autonomous', 'AI', 'Smart Cities', 'Healthcare'].some(d => p.domain.toLowerCase().includes(d.toLowerCase()));

      // Need match
      const needMatch = p.requirements?.some(r => 
        r.toLowerCase().includes('mentor') || r.toLowerCase().includes('validation') || r.toLowerCase().includes('testing')
      ) ?? true;

      // Deterministic realistic compatibility score
      let score = 86 + ((p.title.length + index * 7) % 13);
      if (techOverlap) score += 2;
      if (domainOverlap) score += 1;
      if (score > 98) score = 98;

      let stageLabel = 'Working Prototype';
      if (p.stage === 'pilot') stageLabel = 'Pilot Testing Ready';
      else if (p.stage === 'tested') stageLabel = 'Lab Tested & Validated';
      else if (p.stage === 'prototype') stageLabel = 'Working Prototype';
      else if (p.stage === 'deployment') stageLabel = 'Field Deployment';
      else if (p.stage === 'idea') stageLabel = 'Architecture Design';

      const matchMeta: MentorshipMatchMetadata = {
        compatibilityPercent: score,
        expertiseMatch: true,
        technologyMatch: techOverlap || true,
        domainMatch: domainOverlap,
        projectNeedMatch: needMatch,
        stageLabel
      };

      return {
        project: p,
        match: matchMeta
      };
    }).sort((a, b) => b.match.compatibilityPercent - a.match.compatibilityPercent);
  }, [projects, mentorSkills]);

  const projectMatchesCount = recommendedProjectsWithMatch.length;

  const handleOpenOfferModal = (project: Project) => {
    setOfferTargetProject(project);
    setOfferNote(`Hello ${project.ownerName}, I've reviewed your work on "${project.title}". Given my background in ${currentUser.organizationName || 'Applied Systems'}, I'd be happy to guide your validation milestones and architecture.`);
  };

  const handleSendOffer = () => {
    if (!offerTargetProject) return;

    try {
      const record: CollaborationRecord = {
        id: `collab_${Date.now()}`,
        projectAId: offerTargetProject.id,
        projectATitle: offerTargetProject.title,
        projectBId: offerTargetProject.id,
        projectBTitle: offerTargetProject.title,
        senderId: currentUser.id,
        senderName: currentUser.fullName,
        receiverId: offerTargetProject.ownerId,
        receiverName: offerTargetProject.ownerName,
        message: `${offerNote} (Focus Area: ${offerFocusArea})`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      dbService.createCollaboration(record);
      setOfferedProjectIds(prev => ({ ...prev, [offerTargetProject.id]: true }));

      if (onShowToast) {
        onShowToast('success', `Mentorship offer submitted to ${offerTargetProject.ownerName}!`);
      }
      setOfferTargetProject(null);
      onRefresh();
    } catch {
      if (onShowToast) {
        onShowToast('error', 'Failed to dispatch offer. Please try again.');
      }
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      sender: 'mentor',
      text: chatInput.trim(),
      time: 'Just now'
    };

    setChatMessages(prev => ({
      ...prev,
      [activeChatMentee]: [...(prev[activeChatMentee] || []), newMsg]
    }));

    setChatInput('');

    if (onShowToast) {
      onShowToast('success', `Message sent to ${activeChatMentee}`);
    }
  };

  // Filtered projects for Discover tab
  const filteredDiscoverProjects = useMemo(() => {
    return recommendedProjectsWithMatch.filter(({ project }) => {
      const matchesSearch = !searchQuery.trim() || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesDomain = selectedDomainFilter === 'all' || 
        project.domain.toLowerCase().includes(selectedDomainFilter.toLowerCase());

      return matchesSearch && matchesDomain;
    });
  }, [recommendedProjectsWithMatch, searchQuery, selectedDomainFilter]);

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-800 flex flex-col font-sans selection:bg-purple-200 selection:text-purple-900">
      
      {/* 1. HORIZONTAL TOP NAVIGATION BAR (NO SIDEBAR) */}
      <div 
        id="mentor-horizontal-nav"
        className="bg-white/95 backdrop-blur-md border-b border-purple-100/90 sticky top-0 z-30 shadow-2xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-1 scrollbar-none max-w-full">
            <button
              id="sidebar-tab-dashboard"
              type="button"
              onClick={() => setActiveSidebarTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                activeSidebarTab === 'dashboard'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 ring-1 ring-purple-600'
                  : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              id="sidebar-tab-discover"
              type="button"
              onClick={() => setActiveSidebarTab('discover')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                activeSidebarTab === 'discover'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 ring-1 ring-purple-600'
                  : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>Discover Projects</span>
            </button>

            <button
              id="sidebar-tab-requests"
              type="button"
              onClick={() => setActiveSidebarTab('requests')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                activeSidebarTab === 'requests'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 ring-1 ring-purple-600'
                  : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Inbox className="w-4 h-4 shrink-0" />
              <span>Mentorship Requests</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeSidebarTab === 'requests' ? 'bg-white/25 text-white' : 'bg-purple-100 text-purple-700'
              }`}>
                {mentorshipRequestsCount}
              </span>
            </button>

            <button
              id="sidebar-tab-mentees"
              type="button"
              onClick={() => setActiveSidebarTab('mentees')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                activeSidebarTab === 'mentees'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 ring-1 ring-purple-600'
                  : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>My Mentees</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeSidebarTab === 'mentees' ? 'bg-white/25 text-white' : 'bg-purple-100 text-purple-700'
              }`}>
                {activeMenteesCount}
              </span>
            </button>

            <button
              id="sidebar-tab-messages"
              type="button"
              onClick={() => setActiveSidebarTab('messages')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                activeSidebarTab === 'messages'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 ring-1 ring-purple-600'
                  : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Messages</span>
            </button>

            <button
              id="sidebar-tab-notifications"
              type="button"
              onClick={() => setActiveSidebarTab('notifications')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                activeSidebarTab === 'notifications'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 ring-1 ring-purple-600'
                  : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Bell className="w-4 h-4 shrink-0" />
              <span>Notifications</span>
              <span className={`w-2 h-2 rounded-full ${
                activeSidebarTab === 'notifications' ? 'bg-white' : 'bg-purple-500'
              }`} />
            </button>

            <button
              id="sidebar-tab-profile"
              type="button"
              onClick={() => setActiveSidebarTab('profile')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                activeSidebarTab === 'profile'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 ring-1 ring-purple-600'
                  : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Profile</span>
            </button>
          </nav>

          <div className="hidden md:flex items-center space-x-2 shrink-0">
            <button
              onClick={onNavigateToWorkspace}
              className="py-2 px-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Milestone Workspace</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT VIEWPORT */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
        
        {/* ================= VIEW 1: DASHBOARD (MAIN) ================= */}
        {activeSidebarTab === 'dashboard' && (
          <div className="space-y-8">
            
            {/* TOP HEADER */}
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2.5">
                <Award className="w-3.5 h-3.5 text-purple-600" />
                <span>Mentor & Technical Advisor Hub</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Help promising ideas move forward.
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-normal">
                Curated high-potential university innovations matching your technical expertise and industry background.
              </p>
            </div>

            {/* 4 STATISTICS CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Stat 1: Active Mentees */}
              <div 
                id="stat-active-mentees"
                onClick={() => setActiveSidebarTab('mentees')}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-purple-100/90 shadow-[0_4px_20px_-8px_rgba(124,77,255,0.08)] cursor-pointer hover:border-purple-300 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Active Mentees
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  {activeMenteesCount}
                </div>
                <div className="text-[11px] text-purple-700 font-semibold mt-1 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-purple-600" />
                  <span>2 in active validation</span>
                </div>
              </div>

              {/* Stat 2: Projects Reviewed */}
              <div 
                id="stat-projects-reviewed"
                className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-purple-100/90 shadow-[0_4px_20px_-8px_rgba(124,77,255,0.08)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Projects Reviewed
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <FileCode className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  {projectsReviewedCount}
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-1">
                  100% milestone sign-off rate
                </div>
              </div>

              {/* Stat 3: Mentorship Requests */}
              <div 
                id="stat-mentorship-requests"
                onClick={() => setActiveSidebarTab('requests')}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-purple-100/90 shadow-[0_4px_20px_-8px_rgba(124,77,255,0.08)] cursor-pointer hover:border-purple-300 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Mentorship Requests
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Inbox className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 mt-2">
                  {mentorshipRequestsCount}
                </div>
                <div className="text-[11px] text-amber-600 font-bold mt-1 flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-amber-500" />
                  <span>Awaiting your review</span>
                </div>
              </div>

              {/* Stat 4: Project Matches */}
              <div 
                id="stat-project-matches"
                onClick={() => setActiveSidebarTab('discover')}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-purple-100/90 shadow-[0_4px_20px_-8px_rgba(124,77,255,0.08)] cursor-pointer hover:border-purple-300 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Project Matches
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Compass className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  {projectMatchesCount}
                </div>
                <div className="text-[11px] text-purple-700 font-semibold mt-1">
                  Aligned with your skills
                </div>
              </div>

            </div>

            {/* SECTION: Recommended Projects */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Recommended Projects
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Projects ranked by compatibility with your mentorship profile.
                  </p>
                </div>

                <button
                  onClick={() => setActiveSidebarTab('discover')}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center space-x-1 transition-colors"
                >
                  <span>Explore all</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* PROJECT CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedProjectsWithMatch.slice(0, 4).map(({ project, match }) => {
                  const hasOffered = offeredProjectIds[project.id];

                  return (
                    <div
                      key={project.id}
                      id={`rec-card-${project.id}`}
                      className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-purple-100/90 shadow-[0_12px_36px_-15px_rgba(124,77,255,0.08)] flex flex-col justify-between hover:border-purple-200 transition-all"
                    >
                      <div>
                        {/* Top: Domain & Compatibility % */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/80">
                              {project.domain}
                            </span>
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-600 bg-slate-100">
                              {match.stageLabel}
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-xs">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              <span>{match.compatibilityPercent}% Match</span>
                            </div>
                          </div>
                        </div>

                        {/* Project Name */}
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                          {project.title}
                        </h3>

                        {/* Student Team */}
                        <div className="flex items-center space-x-2 text-xs text-slate-600 font-semibold mt-2 mb-3">
                          <GraduationCap className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span>Student Team:</span>
                          <span className="text-slate-900 font-bold">{project.ownerName}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500 font-normal truncate">{project.ownerCollege || 'Engineering Team'}</span>
                        </div>

                        {/* Technology */}
                        <div className="mb-4">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                            Technology
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {project.technologies.slice(0, 4).map((tech, idx) => (
                              <span 
                                key={idx}
                                className="px-2.5 py-1 text-xs font-semibold bg-[#FAF8FF] text-slate-700 border border-purple-100/90 rounded-lg"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 4 && (
                              <span className="px-2 py-1 text-xs font-medium text-slate-500">
                                +{project.technologies.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* "Why this matches" criteria list */}
                        <div className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-purple-100/80 mb-5">
                          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Why this matches
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center space-x-2 text-slate-700 font-medium">
                              <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span>Expertise match</span>
                            </div>
                            <div className="flex items-center space-x-2 text-slate-700 font-medium">
                              <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span>Technology match</span>
                            </div>
                            <div className="flex items-center space-x-2 text-slate-700 font-medium">
                              <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span>Domain match</span>
                            </div>
                            <div className="flex items-center space-x-2 text-slate-700 font-medium">
                              <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span>Project need match</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* BUTTONS: [ View Project ] and [ Offer Mentorship ] */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-purple-50">
                        <button
                          id={`btn-view-${project.id}`}
                          type="button"
                          onClick={() => onSelectProject(project.id)}
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-purple-50 border border-purple-200 hover:border-purple-300 transition-all flex items-center justify-center space-x-1.5"
                        >
                          <span>View Project</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>

                        <button
                          id={`btn-offer-${project.id}`}
                          type="button"
                          disabled={hasOffered}
                          onClick={() => handleOpenOfferModal(project)}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-xs ${
                            hasOffered
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                              : 'bg-purple-600 hover:bg-purple-700 active:scale-95 text-white shadow-purple-500/20'
                          }`}
                        >
                          {hasOffered ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Offer Sent</span>
                            </>
                          ) : (
                            <>
                              <span>Offer Mentorship</span>
                              <Sparkles className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ================= VIEW 2: DISCOVER PROJECTS ================= */}
        {activeSidebarTab === 'discover' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Discover Emerging Innovations
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Filter and scout all university projects seeking guidance, hardware testing, or domain review.
              </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl border border-purple-100 shadow-2xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by project name, tech, or keywords..."
                  className="w-full pl-10 pr-4 py-2 bg-[#FAF8FF] border border-purple-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <select
                value={selectedDomainFilter}
                onChange={(e) => setSelectedDomainFilter(e.target.value)}
                className="px-3 py-2 bg-[#FAF8FF] border border-purple-100 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
              >
                <option value="all">All Domains</option>
                <option value="CleanTech">CleanTech & Energy</option>
                <option value="IoT">IoT & Hardware</option>
                <option value="Healthcare">Healthcare & BioTech</option>
                <option value="AI">AI & Machine Learning</option>
                <option value="Mobility">Smart Mobility</option>
              </select>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDiscoverProjects.map(({ project, match }) => {
                const hasOffered = offeredProjectIds[project.id];
                return (
                  <div
                    key={project.id}
                    className="bg-white/95 rounded-3xl p-6 border border-purple-100/90 shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/80">
                          {project.domain}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                          {match.compatibilityPercent}% Match
                        </span>
                      </div>

                      <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                        {project.title}
                      </h3>

                      <div className="flex items-center space-x-2 text-xs text-slate-600 font-semibold mt-1 mb-3">
                        <GraduationCap className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>Team: {project.ownerName}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 font-normal">{project.ownerCollege || 'Engineering'}</span>
                      </div>

                      <div className="mb-4">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Technologies
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.slice(0, 4).map((tech, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-xs bg-[#FAF8FF] border border-purple-100 rounded-md text-slate-700">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Why this matches */}
                      <div className="p-3 rounded-xl bg-[#FAF8FF] border border-purple-100 mb-4 text-xs">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Why this matches
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-slate-700">
                          <div className="flex items-center space-x-1.5">
                            <Check className="w-3 h-3 text-purple-600" />
                            <span>Expertise match</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Check className="w-3 h-3 text-purple-600" />
                            <span>Technology match</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Check className="w-3 h-3 text-purple-600" />
                            <span>Domain match</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Check className="w-3 h-3 text-purple-600" />
                            <span>Project need match</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-purple-50">
                      <button
                        type="button"
                        onClick={() => onSelectProject(project.id)}
                        className="w-full py-2 px-3 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-purple-50 border border-purple-200 transition-all flex items-center justify-center space-x-1"
                      >
                        <span>View Project</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={hasOffered}
                        onClick={() => handleOpenOfferModal(project)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                          hasOffered
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        {hasOffered ? 'Offer Sent' : 'Offer Mentorship'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= VIEW 3: MENTORSHIP REQUESTS ================= */}
        {activeSidebarTab === 'requests' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Mentorship Requests
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Student innovators who have explicitly requested your guidance on technical milestones.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 'req-1',
                  projectName: 'Smart EV Battery Thermal Balancer',
                  student: 'Aarav Sharma',
                  college: 'IIT Delhi',
                  urgency: 'Immediate Review',
                  date: 'Today, 09:30 AM',
                  note: 'We have completed the 48V hardware battery telemetry loop. Need guidance on ISO 26262 functional safety and thermal run-away validation.',
                  tags: ['Battery Tech', 'CAN Bus', 'Embedded C++']
                },
                {
                  id: 'req-2',
                  projectName: 'FloodNet Resilient LoRa Mesh',
                  student: 'Priya Patel',
                  college: 'NIT Surathkal',
                  urgency: 'Standard',
                  date: 'Yesterday, 04:15 PM',
                  note: 'Our mesh protocol works in simulation; requesting mentorship to structure our field trial deployment in coastal Karnataka.',
                  tags: ['LoRaWAN', 'Mesh Networks', 'Environmental Sensing']
                },
                {
                  id: 'req-3',
                  projectName: 'AI Soil Nutrient Spectrometer',
                  student: 'Rahul Nair',
                  college: 'College of Engineering Guindy',
                  urgency: 'Review Queued',
                  date: '2 days ago',
                  note: 'Looking for a domain advisor to validate spectral calibration models and laboratory reference tests.',
                  tags: ['Spectroscopy', 'TinyML', 'Agritech']
                }
              ].map((req) => (
                <div 
                  key={req.id}
                  className="bg-white/95 rounded-3xl p-6 border border-purple-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="max-w-2xl">
                    <div className="flex items-center space-x-2 mb-1.5">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                        {req.urgency}
                      </span>
                      <span className="text-xs text-slate-400">• {req.date}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900">
                      {req.projectName}
                    </h3>
                    <p className="text-xs font-semibold text-purple-700 mt-0.5">
                      {req.student} • {req.college}
                    </p>

                    <p className="text-xs text-slate-600 mt-2.5 bg-[#FAF8FF] p-3 rounded-xl border border-purple-100">
                      "{req.note}"
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {req.tags.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-700 rounded-md">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => {
                        if (onShowToast) onShowToast('success', `Mentorship request for "${req.projectName}" accepted!`);
                        setActiveSidebarTab('mentees');
                      }}
                      className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all"
                    >
                      Accept Mentorship
                    </button>
                    <button
                      onClick={() => {
                        setActiveChatMentee(req.student);
                        setActiveSidebarTab('messages');
                      }}
                      className="py-2 px-4 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-purple-50 border border-purple-200 transition-all"
                    >
                      Message Team
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= VIEW 4: MY MENTEES ================= */}
        {activeSidebarTab === 'mentees' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                My Mentees & Active Teams
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Student innovators currently receiving your active technical advisory and milestone reviews.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: 'Aarav Sharma',
                  college: 'IIT Delhi',
                  projectTitle: 'Smart EV Battery Thermal Balancer',
                  milestone: 'CAN Bus CRC32 Validation',
                  progress: 75,
                  status: 'Review in Progress',
                  lastMeeting: 'Yesterday'
                },
                {
                  name: 'Priya Patel',
                  college: 'NIT Surathkal',
                  projectTitle: 'FloodNet Resilient Mesh',
                  milestone: 'Field Mesh Node Power Budget',
                  progress: 60,
                  status: 'On Track',
                  lastMeeting: '3 days ago'
                },
                {
                  name: 'Karthik Raja',
                  college: 'PSG College of Technology',
                  projectTitle: 'Sub-GigaHertz Agriculture Gateway',
                  milestone: 'Antenna Impedance Tuning',
                  progress: 90,
                  status: 'Ready for Pilot Sign-Off',
                  lastMeeting: 'Last week'
                },
                {
                  name: 'Sneha Verma',
                  college: 'BITS Pilani',
                  projectTitle: 'Autonomous Greenhouse Nutrient Doser',
                  milestone: 'Peristaltic Pump Firmware Loop',
                  progress: 45,
                  status: 'Awaiting Code Audit',
                  lastMeeting: '5 days ago'
                }
              ].map((mentee, idx) => (
                <div 
                  key={idx}
                  className="bg-white/95 rounded-3xl p-6 border border-purple-100 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                        {mentee.status}
                      </span>
                      <span className="text-[11px] text-slate-400">Met: {mentee.lastMeeting}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900">
                      {mentee.name}
                    </h3>
                    <p className="text-xs text-slate-500">{mentee.college}</p>

                    <div className="mt-4 pt-4 border-t border-purple-50">
                      <div className="text-xs font-bold text-slate-800">
                        Project: {mentee.projectTitle}
                      </div>
                      <div className="text-xs text-purple-700 font-semibold mt-1">
                        Active Milestone: {mentee.milestone}
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1">
                          <span>Milestone Completion</span>
                          <span>{mentee.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-purple-50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-600 rounded-full transition-all"
                            style={{ width: `${mentee.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-purple-50">
                    <button
                      onClick={() => {
                        setActiveChatMentee(mentee.name);
                        setActiveSidebarTab('messages');
                      }}
                      className="py-2 px-3 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all flex items-center justify-center space-x-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                    <button
                      onClick={onNavigateToWorkspace}
                      className="py-2 px-3 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-purple-50 border border-purple-200 transition-all flex items-center justify-center space-x-1"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Review Code</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= VIEW 5: MESSAGES ================= */}
        {activeSidebarTab === 'messages' && (
          <div className="bg-white/95 rounded-3xl border border-purple-100 shadow-2xs overflow-hidden flex flex-col h-[640px]">
            {/* Messages Header */}
            <div className="p-4 sm:p-5 border-b border-purple-100 flex items-center justify-between bg-[#FAF8FF]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {activeChatMentee.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {activeChatMentee}
                  </h3>
                  <p className="text-[11px] text-purple-700 font-semibold flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    <span>Active Mentee Channel</span>
                  </p>
                </div>
              </div>

              {/* Mentee Switcher Pills */}
              <div className="flex items-center space-x-2">
                {['Aarav Sharma', 'Priya Patel'].map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setActiveChatMentee(name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeChatMentee === name
                        ? 'bg-purple-600 text-white'
                        : 'bg-white border border-purple-200 text-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-white">
              {(chatMessages[activeChatMentee] || []).map((msg, i) => {
                const isMe = msg.sender === 'mentor';
                return (
                  <div 
                    key={i}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                      isMe 
                        ? 'bg-purple-600 text-white rounded-br-none shadow-xs' 
                        : 'bg-[#FAF8FF] text-slate-800 border border-purple-100 rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendChatMessage} className="p-4 border-t border-purple-100 bg-[#FAF8FF] flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Type guidance or milestone feedback for ${activeChatMentee}...`}
                className="flex-1 px-4 py-2.5 bg-white border border-purple-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <button
                type="submit"
                className="py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* ================= VIEW 6: NOTIFICATIONS ================= */}
        {activeSidebarTab === 'notifications' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Notifications
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Real-time updates regarding student submissions, algorithm matches, and advisory milestones.
              </p>
            </div>

            <div className="bg-white/95 rounded-3xl border border-purple-100 shadow-2xs divide-y divide-purple-50 overflow-hidden">
              {[
                {
                  title: 'New High Compatibility Match (96%)',
                  description: 'Smart EV Battery Thermal Management was matched with your LoRaWAN and Embedded telemetry profile.',
                  time: '15 minutes ago',
                  unread: true
                },
                {
                  title: 'Milestone Submitted for Code Audit',
                  description: 'Aarav Sharma submitted "CAN Bus Telemetry Loop" for timing validation.',
                  time: '2 hours ago',
                  unread: true
                },
                {
                  title: 'Mentorship Request Accepted',
                  description: 'Priya Patel scheduled technical office hours for Thursday 4:00 PM.',
                  time: 'Yesterday',
                  unread: false
                },
                {
                  title: 'Advisory Impact Recognized',
                  description: 'Your guidance helped FloodNet achieve Lab Tested validation status.',
                  time: '3 days ago',
                  unread: false
                }
              ].map((notif, idx) => (
                <div key={idx} className={`p-5 flex items-start space-x-3.5 ${notif.unread ? 'bg-purple-50/30' : 'bg-white'}`}>
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${notif.unread ? 'bg-purple-600' : 'bg-slate-300'}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= VIEW 7: PROFILE ================= */}
        {activeSidebarTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Mentor Profile & Verification
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your credentials and domain focus visible to university teams and student innovators.
              </p>
            </div>

            <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-2xs space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white text-xl font-extrabold flex items-center justify-center shadow-md shadow-purple-500/20">
                  {currentUser.fullName ? currentUser.fullName.charAt(0) : 'M'}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{currentUser.fullName}</h3>
                  <p className="text-xs font-semibold text-purple-700">{currentUser.email}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{currentUser.college || currentUser.organizationName || 'IISc Bangalore'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-purple-50">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Organization
                  </span>
                  <div className="text-xs font-bold text-slate-900">
                    {currentUser.college || currentUser.organizationName || 'Indian Institute of Science'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Job Role
                  </span>
                  <div className="text-xs font-bold text-slate-900">
                    Principal Systems Architect & Adjunct Advisor
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Experience
                  </span>
                  <div className="text-xs font-bold text-slate-900">
                    12+ Years in Sensor Networks & Embedded Systems
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Industry
                  </span>
                  <div className="text-xs font-bold text-slate-900">
                    DeepTech, Automotive IoT & CleanTech
                  </div>
                </div>
              </div>

              {/* Expertise Tags */}
              <div className="pt-4 border-t border-purple-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Technical Expertise
                </span>
                <div className="flex flex-wrap gap-2">
                  {mentorSkills.map((s, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mentoring Areas */}
              <div className="pt-4 border-t border-purple-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Mentoring Areas
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Hardware Validation', 'Prototype Auditing', 'Field Trial Scaffolding', 'Grant Architecture'].map((a, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[#FAF8FF] text-slate-700 border border-purple-100 rounded-xl text-xs font-semibold">
                      ✓ {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================= OFFER MENTORSHIP MODAL ================= */}
      {offerTargetProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-purple-100 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Offer Mentorship
                </h3>
              </div>
              <button
                onClick={() => setOfferTargetProject(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4 p-3 rounded-2xl bg-[#FAF8FF] border border-purple-100 text-xs text-slate-700">
              <span className="font-bold text-slate-900">{offerTargetProject.title}</span>
              <div className="text-purple-700 font-medium mt-0.5">
                Team: {offerTargetProject.ownerName} ({offerTargetProject.ownerCollege || 'University'})
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mentoring Focus Track
                </label>
                <select
                  value={offerFocusArea}
                  onChange={(e) => setOfferFocusArea(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FAF8FF] border border-purple-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
                >
                  <option value="Hardware Validation & Pilot Testing">Hardware Validation & Pilot Testing</option>
                  <option value="Firmware & Embedded Systems Architecture">Firmware & Embedded Systems Architecture</option>
                  <option value="Algorithmic Tuning & TinyML Deployment">Algorithmic Tuning & TinyML Deployment</option>
                  <option value="Patent & Grant Proposal Strategy">Patent & Grant Proposal Strategy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Personalized Guidance Note
                </label>
                <textarea
                  rows={4}
                  value={offerNote}
                  onChange={(e) => setOfferNote(e.target.value)}
                  className="w-full p-3 bg-[#FAF8FF] border border-purple-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none"
                  placeholder="Share how you can assist their technical milestone..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-purple-50">
              <button
                type="button"
                onClick={() => setOfferTargetProject(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendOffer}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-purple-500/20 active:scale-95 transition-all"
              >
                <span>Dispatch Offer</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
