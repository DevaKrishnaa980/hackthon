import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Rocket, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Briefcase, 
  TrendingUp, 
  Layers, 
  ChevronRight, 
  Clock, 
  Cpu,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { Project, UserProfile } from '../types';

interface IndustryDashboardViewProps {
  currentUser: UserProfile;
  projects: Project[];
  users: UserProfile[];
  onSelectProject: (projectId: string) => void;
  onNavigateToOpportunities?: () => void;
  onShowToast?: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const IndustryDashboardView: React.FC<IndustryDashboardViewProps> = ({
  currentUser,
  projects,
  users,
  onSelectProject,
  onNavigateToOpportunities,
  onShowToast
}) => {
  // Filters & search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [savedProjectIds, setSavedProjectIds] = useState<Set<string>>(
    new Set(['p1_iot_ev', 'p3_crop_vision'])
  );
  const [collaborationCount, setCollaborationCount] = useState(8);

  // Express Interest Modal State
  const [interestModalProject, setInterestModalProject] = useState<Project | null>(null);
  const [collaborationType, setCollaborationType] = useState<'pilot' | 'dataset' | 'mentorship' | 'investment'>('pilot');
  const [customInterestNote, setCustomInterestNote] = useState('');
  const [expressedInterestIds, setExpressedInterestIds] = useState<Record<string, boolean>>({});

  // Helper to map project stage to human readable badge & normalize
  const getStageLabel = (stage?: string): { label: string; isPilotOrMvp: boolean; color: string } => {
    const s = (stage || 'prototype').toLowerCase();
    if (s.includes('pilot')) return { label: 'PILOT', isPilotOrMvp: true, color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (s.includes('deploy')) return { label: 'DEPLOYMENT', isPilotOrMvp: true, color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (s.includes('tested') || s.includes('mvp')) return { label: 'MVP', isPilotOrMvp: true, color: 'bg-purple-50 text-purple-800 border-purple-200' };
    if (s.includes('proto')) return { label: 'PROTOTYPE', isPilotOrMvp: false, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    return { label: 'HACKATHON', isPilotOrMvp: false, color: 'bg-slate-50 text-slate-700 border-slate-200' };
  };

  // Helper to extract or generate Potential Industry Use
  const getPotentialIndustryUse = (p: Project): string => {
    const dnaUsers = p.projectDNA?.potentialUsers?.join(', ');
    if (dnaUsers) {
      return `Enterprise application: ${dnaUsers}. Ideal for corporate testbed integration.`;
    }
    const domain = (p.domain || '').toLowerCase();
    const title = (p.title || '').toLowerCase();

    if (domain.includes('clean') || domain.includes('energy') || title.includes('battery') || title.includes('ev')) {
      return 'Commercial fleet telematics, EV battery warranty analytics, distributed microgrid storage validation.';
    }
    if (domain.includes('iot') || domain.includes('mesh') || title.includes('disaster') || title.includes('lora')) {
      return 'Municipal disaster resilient telemetry, port & rail cargo tracking, off-grid utilities monitoring.';
    }
    if (domain.includes('agri') || title.includes('crop') || domain.includes('rural')) {
      return 'Precision agriculture testbeds, crop yield insurance estimation, automated sprayer kit integration.';
    }
    if (domain.includes('health') || title.includes('medi')) {
      return 'Clinical decision support pilot, rural triage screening device, portable biometric edge analytics.';
    }
    return 'Enterprise automation, edge sensor telemetry integration, and AI-accelerated manufacturing workflows.';
  };

  // Helper to compute a realistic compatibility score
  const getCompatibilityScore = (p: Project, index: number): { score: number; text: string } => {
    const scores = [96, 94, 91, 88, 85, 82];
    const score = scores[index % scores.length];
    const text = score >= 90 ? 'High Strategic Match' : 'Strong Domain Synergy';
    return { score, text };
  };

  // Potential Pilots: projects currently at MVP or Pilot stage
  const pilotOpportunities = useMemo(() => {
    return projects.filter(p => {
      const { isPilotOrMvp } = getStageLabel(p.stage);
      return isPilotOrMvp;
    });
  }, [projects]);

  // Filtered Recommended Innovations
  const recommendedProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesDomain = selectedDomain === 'all' || (p.domain && p.domain.toLowerCase() === selectedDomain.toLowerCase());
      const matchesSearch = !searchQuery || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDomain && matchesSearch;
    });
  }, [projects, selectedDomain, searchQuery]);

  // Unique domains for filtering
  const domainsList = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => { if (p.domain) set.add(p.domain); });
    return Array.from(set);
  }, [projects]);

  // Toggle save project
  const handleToggleSave = (projectId: string) => {
    setSavedProjectIds(prev => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
        if (onShowToast) onShowToast('info', 'Project removed from saved watchlist.');
      } else {
        next.add(projectId);
        if (onShowToast) onShowToast('success', 'Project saved to company watchlist.');
      }
      return next;
    });
  };

  // Open Express Interest Modal
  const handleOpenInterestModal = (p: Project) => {
    setInterestModalProject(p);
    setCustomInterestNote(
      `We at ${currentUser.organizationName || 'our engineering division'} are interested in evaluating "${p.title}" for testbed trial and technical pilot integration.`
    );
  };

  // Submit Express Interest
  const handleSubmitInterest = () => {
    if (!interestModalProject) return;

    setExpressedInterestIds(prev => ({ ...prev, [interestModalProject.id]: true }));
    setCollaborationCount(prev => prev + 1);

    if (onShowToast) {
      onShowToast(
        'success', 
        `Collaboration interest in "${interestModalProject.title}" registered! The student team has been notified.`
      );
    }

    setInterestModalProject(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-800 selection:bg-purple-200 selection:text-purple-900 font-sans pb-24">
      
      {/* ========================================================================= */}
      {/* CORPORATE HERO & HEADING                                                  */}
      {/* ========================================================================= */}
      <section className="bg-white border-b border-purple-100/90 pt-10 pb-12 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-extrabold uppercase tracking-wider mb-3 border border-purple-200/80">
                <Building2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Industry & Enterprise Portal</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Discover Innovation Ready for Collaboration.
              </h1>
              
              <p className="text-sm sm:text-base text-slate-600 mt-2 font-normal leading-relaxed">
                Connect directly with validated student engineering teams, deploy corporate sandbox testbeds, and de-risk early-stage deep-tech pilots before commercial rollout.
              </p>
            </div>

            {/* Corporate Profile Card / Active Entity */}
            <div className="bg-[#FAF8FF] border border-purple-100/90 rounded-2xl p-4 sm:p-5 flex items-center space-x-4 shrink-0 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-purple-500/20">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Active Enterprise Partner</span>
                <h3 className="text-sm font-bold text-slate-900">{currentUser.organizationName || 'Enterprise Innovation Partner'}</h3>
                <p className="text-xs text-purple-700 font-semibold">{currentUser.fullName} • Technology Scouting</p>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* STATISTICS GRID:                                                      */}
          {/* Projects Discovered, Collaboration Requests, Potential Pilots, Saved Projects */}
          {/* ===================================================================== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-10">
            
            {/* 1. Projects Discovered */}
            <div className="bg-white p-5 rounded-2xl border border-purple-100/90 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Projects Discovered</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Search className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-3">{projects.length || 24}</div>
              <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">Indexed across academic hubs</span>
            </div>

            {/* 2. Collaboration Requests */}
            <div className="bg-white p-5 rounded-2xl border border-purple-100/90 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Collaboration Requests</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-purple-700 mt-3">{collaborationCount}</div>
              <span className="text-[11px] font-semibold text-purple-700 mt-1 block">In negotiation / review</span>
            </div>

            {/* 3. Potential Pilots */}
            <div className="bg-white p-5 rounded-2xl border border-purple-100/90 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Potential Pilots</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Rocket className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-3">{pilotOpportunities.length || 5}</div>
              <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">At MVP or Field Pilot stage</span>
            </div>

            {/* 4. Saved Projects */}
            <div className="bg-white p-5 rounded-2xl border border-purple-100/90 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saved Projects</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Bookmark className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-purple-700 mt-3">{savedProjectIds.size}</div>
              <span className="text-[11px] font-semibold text-slate-500 mt-1 block">In corporate evaluation list</span>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* MAIN CONTENT CONTAINER                                                    */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-14">
        
        {/* ======================================================================= */}
        {/* SECTION 1: POTENTIAL PILOT OPPORTUNITIES (MVP & PILOT STAGE)             */}
        {/* ======================================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100/80">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Potential Pilot Opportunities
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                High-maturity innovations currently at <span className="font-bold text-slate-700">MVP</span> or <span className="font-bold text-slate-700">Pilot</span> stage ready for immediate sandbox deployment.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                {pilotOpportunities.length} Deployment-Ready Teams
              </span>
            </div>
          </div>

          {/* Pilot Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pilotOpportunities.map((p, idx) => {
              const stageInfo = getStageLabel(p.stage);
              const isSaved = savedProjectIds.has(p.id);
              const hasExpressedInterest = expressedInterestIds[p.id];
              const { score } = getCompatibilityScore(p, idx);

              return (
                <div 
                  key={p.id}
                  className="bg-white rounded-2xl border border-purple-100/90 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    
                    {/* Header: Stage Badge & Bookmark */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${stageInfo.color}`}>
                          {stageInfo.label}
                        </span>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/80">
                          {score}% Readiness
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleSave(p.id)}
                        className="text-slate-400 hover:text-purple-600 transition-colors p-1"
                        title={isSaved ? 'Remove from Saved' : 'Save to Watchlist'}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 text-purple-600 fill-purple-600" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Project Title & College */}
                    <div>
                      <h3 
                        onClick={() => onSelectProject(p.id)}
                        className="text-base font-extrabold text-slate-900 hover:text-purple-700 cursor-pointer transition-colors"
                      >
                        {p.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        By {p.ownerName} • {p.ownerCollege || 'Technical University'}
                      </p>
                    </div>

                    {/* Technology Stack */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Technology</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(p.technologies || ['IoT', 'Embedded C++']).slice(0, 4).map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF8FF] text-slate-700 border border-purple-100">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Potential Industry Use */}
                    <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block mb-0.5">
                        Potential Pilot Trial:
                      </span>
                      <p className="text-slate-700 text-xs leading-relaxed font-normal">
                        {getPotentialIndustryUse(p)}
                      </p>
                    </div>

                  </div>

                  {/* Footer Action Buttons */}
                  <div className="p-4 bg-[#FAF8FF] border-t border-purple-100/90 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectProject(p.id)}
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-purple-50 border border-purple-200/90 transition-all flex items-center justify-center space-x-1"
                    >
                      <span>View Project</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleOpenInterestModal(p)}
                      disabled={hasExpressedInterest}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                        hasExpressedInterest
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/25'
                      }`}
                    >
                      {hasExpressedInterest ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Interest Sent</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Express Interest</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 2: RECOMMENDED INNOVATIONS                                      */}
        {/* ======================================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-purple-100/80">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Recommended Innovations
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                Curated innovations matched against enterprise requirements, technical architecture, and validation roadmap.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by keyword or tech..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-800 w-48 sm:w-56"
                />
              </div>

              {/* Domain Filter Pills */}
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="py-1.5 px-3 rounded-xl bg-white border border-purple-100 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="all">All Domains</option>
                {domainsList.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Project Cards: Showing Project, Domain, Technology, Stage, Potential Industry Use, Compatibility */}
          <div className="space-y-4">
            {recommendedProjects.map((p, idx) => {
              const stageInfo = getStageLabel(p.stage);
              const isSaved = savedProjectIds.has(p.id);
              const hasExpressedInterest = expressedInterestIds[p.id];
              const { score, text: compText } = getCompatibilityScore(p, idx);

              return (
                <div 
                  key={p.id}
                  className="bg-white rounded-2xl border border-purple-100/90 shadow-2xs hover:shadow-sm hover:border-purple-300 transition-all p-5 sm:p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                    
                    {/* Main Card Content */}
                    <div className="flex-1 space-y-3">
                      
                      {/* Top Row: Domain, Stage, Compatibility Badge, Bookmark */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {/* Domain Badge */}
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/80">
                          {p.domain || 'Technology'}
                        </span>

                        {/* Stage Badge */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${stageInfo.color}`}>
                          Stage: {stageInfo.label}
                        </span>

                        {/* Compatibility Badge */}
                        <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{score}% Compatibility ({compText})</span>
                        </div>

                        {/* Bookmark Button */}
                        <button
                          onClick={() => handleToggleSave(p.id)}
                          className="ml-auto text-slate-400 hover:text-purple-600 transition-colors p-1"
                          title={isSaved ? 'Remove from Saved' : 'Save Project'}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4 text-purple-600 fill-purple-600" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Project Title & Problem Statement */}
                      <div>
                        <h3 
                          onClick={() => onSelectProject(p.id)}
                          className="text-base sm:text-lg font-extrabold text-slate-900 hover:text-purple-700 cursor-pointer transition-colors"
                        >
                          {p.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 font-normal leading-relaxed line-clamp-2">
                          {p.problemStatement || p.proposedSolution}
                        </p>
                      </div>

                      {/* Technology Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mr-1">Technology:</span>
                        {(p.technologies || ['IoT', 'Embedded C++', 'TinyML']).map((tech, i) => (
                          <span 
                            key={i}
                            className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#FAF8FF] text-slate-700 border border-purple-100"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Potential Industry Use Block */}
                      <div className="pt-2">
                        <div className="p-3.5 rounded-xl bg-purple-50/40 border border-purple-100/90 text-xs">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-800 block mb-0.5">
                            Potential Industry Use
                          </span>
                          <p className="text-slate-700 text-xs font-normal leading-relaxed">
                            {getPotentialIndustryUse(p)}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Right Column / Actions Panel */}
                    <div className="flex lg:flex-col items-center gap-2.5 lg:w-44 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-purple-50">
                      
                      {/* [ View Project ] */}
                      <button
                        id={`btn-view-project-${p.id}`}
                        onClick={() => onSelectProject(p.id)}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-purple-50 border border-purple-200/90 transition-all flex items-center justify-center space-x-1.5 shadow-2xs"
                      >
                        <span>View Project</span>
                        <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
                      </button>

                      {/* [ Express Interest ] */}
                      <button
                        id={`btn-express-interest-${p.id}`}
                        onClick={() => handleOpenInterestModal(p)}
                        disabled={hasExpressedInterest}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-sm ${
                          hasExpressedInterest
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white shadow-purple-500/20'
                        }`}
                      >
                        {hasExpressedInterest ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Interest Sent</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Express Interest</span>
                          </>
                        )}
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* MODAL: EXPRESS INTEREST INITIATION DIALOG                                */}
      {/* ========================================================================= */}
      {interestModalProject && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-4 border-b border-purple-50">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700">Official Inquiry</span>
                <h3 className="text-lg font-bold text-slate-900">
                  Express Collaboration Interest
                </h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {currentUser.organizationName || 'Industry Partner'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-purple-100 text-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Target Innovation</span>
              <h4 className="font-extrabold text-slate-900 text-sm">{interestModalProject.title}</h4>
              <p className="text-slate-500">Student Lead: {interestModalProject.ownerName} • {interestModalProject.ownerCollege || 'Academic Hub'}</p>
            </div>

            {/* Collaboration Model Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Proposed Collaboration Model:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'pilot', label: 'Field Pilot Sandbox', desc: 'Provide testbed, hardware rig, or test facility' },
                  { id: 'dataset', label: 'Data & Telemetry Access', desc: 'Provide real-world enterprise datasets' },
                  { id: 'mentorship', label: 'Technical Advisory', desc: 'Assign corporate engineering lead' },
                  { id: 'investment', label: 'Commercial Spinout Grant', desc: 'Non-dilutive pilot funding & grant' }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setCollaborationType(m.id as any)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      collaborationType === m.id
                        ? 'border-purple-600 bg-purple-50/80 text-purple-900 font-bold'
                        : 'border-purple-100 bg-white hover:bg-purple-50/40 text-slate-700'
                    }`}
                  >
                    <div className="font-bold">{m.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal mt-0.5 line-clamp-1">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Note to the Student Team */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Collaboration Scope / Note to Student Team:</label>
              <textarea
                rows={3}
                value={customInterestNote}
                onChange={(e) => setCustomInterestNote(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-800"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-purple-50">
              <button
                onClick={() => setInterestModalProject(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                id="modal-confirm-express-interest-btn"
                onClick={handleSubmitInterest}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 shadow-md shadow-purple-500/25 transition-all flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Collaboration Proposal</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
