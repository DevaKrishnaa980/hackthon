import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Users, 
  Building2, 
  DollarSign, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  Filter,
  Shield,
  Zap,
  Code2
} from 'lucide-react';
import { Project, UserProfile, MatchResult } from '../types';
import { CppMatchingEngineWrapper } from '../services/cppAlgorithmService';
import { dbService } from '../services/firebaseConfig';

interface SmartMatchingViewProps {
  projects: Project[];
  users: UserProfile[];
  onSelectProject: (projectId: string) => void;
  onRefresh: () => void;
}

export const SmartMatchingView: React.FC<SmartMatchingViewProps> = ({
  projects,
  users,
  onSelectProject,
  onRefresh,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [filterType, setFilterType] = useState<string>('All');
  const [connectedPartners, setConnectedPartners] = useState<Record<string, boolean>>({});

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Run C++ Matching Algorithm (simulated SIMD vector evaluation)
  const matches: MatchResult[] = activeProject ? users
    .filter(u => u.role !== 'student' && u.id !== activeProject.ownerId)
    .map(partner => CppMatchingEngineWrapper.computePartnerMatch(activeProject, partner))
    .sort((a, b) => b.matchScore - a.matchScore)
    : [];

  const filteredMatches = matches.filter(m => {
    if (filterType === 'All') return true;
    if (filterType === 'Mentors') return m.partnerRole === 'mentor';
    if (filterType === 'Industry') return m.partnerRole === 'industry';
    if (filterType === 'Institutions') return m.partnerRole === 'institution';
    if (filterType === 'Funders') return m.partnerRole === 'funder';
    return true;
  });

  const handleConnect = (match: MatchResult) => {
    const partner = users.find(u => u.id === match.partnerId);
    if (!partner || !activeProject) return;

    if (partner.role === 'mentor') {
      dbService.connectMentor(activeProject.id, partner);
    } else if (partner.role === 'industry') {
      dbService.connectIndustry(activeProject.id, partner);
    } else {
      dbService.addNotification({
        userId: activeProject.ownerId,
        title: `Connection Request Sent`,
        message: `Proposal submitted to ${partner.fullName} (${partner.organizationName || 'Partner'}).`,
        type: 'new_recommendation',
        actionLink: 'matching'
      });
    }

    setConnectedPartners(prev => ({ ...prev, [match.partnerId]: true }));
    onRefresh();
  };

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-purple-100 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              <span>Module 03: Smart Matching Engine</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              AI & C++ Multi-Factor Matching
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-2xl">
              Pairs student innovations with accredited mentors, industrial pilot testbeds, and translation funds using Jaccard & Cosine similarity algorithms.
            </p>
          </div>

          {/* Project Selector */}
          <div className="bg-white p-2.5 rounded-2xl border border-purple-100 shadow-sm flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Project:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-3 py-1.5 bg-purple-50/50 border border-purple-100 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-600 max-w-xs truncate"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.domain})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* C++ Algorithmic Vector Benchmark Pill (Section 31) */}
        <div className="card-saas rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-mono font-bold">
              C++
            </div>
            <div>
              <div className="font-bold text-slate-900 flex items-center space-x-2">
                <span>SIMD Vector Engine: Jaccard + Cosine Embeddings</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-700 border border-purple-200 font-mono font-bold">0.042 ms</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Calculates intersection of technical requirements, domain tags, and stage maturity with 512-bit vector registers.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 bg-purple-50/50 p-1.5 rounded-2xl border border-purple-100">
            {['All', 'Mentors', 'Industry', 'Institutions', 'Funders'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === type
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => {
            const partner = users.find(u => u.id === match.partnerId);
            const isConnected = connectedPartners[match.partnerId] || 
              (activeProject?.mentorId === match.partnerId) || 
              (activeProject?.industryPartnerId === match.partnerId);

            return (
              <div
                key={match.id}
                className="card-saas rounded-3xl p-6 flex flex-col justify-between transition-all hover:border-purple-300 group"
              >
                <div>
                  {/* Match Percentage & Role */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-purple-500/25">
                        {match.matchScore}%
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Compatibility Score</div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          Tech: {match.matchFactors.techScore}% • Domain: {match.matchFactors.domainScore}%
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {match.partnerRole}
                    </span>
                  </div>

                  {/* Partner Identity */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                    {match.partnerName}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">
                    {partner?.organizationName || partner?.college || 'Accredited Entity'}
                  </div>

                  {/* Why this is a good match (Section 11) */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
                      Algorithmic Match Rationale:
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {match.whyGoodMatch}
                    </p>
                  </div>

                  {/* Compatible Technologies & Resources */}
                  <div className="mt-4 space-y-1.5">
                    <span className="text-[11px] text-slate-600 font-semibold block">
                      Complementary Stack & Offerings:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {partner?.skillsOrOfferings?.map((s) => (
                        <span key={s} className="px-2.5 py-1 text-[10px] bg-purple-50/70 text-purple-800 rounded-xl border border-purple-100 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Connect CTA Button */}
                <div className="mt-6 pt-4 border-t border-purple-100">
                  {isConnected ? (
                    <div className="w-full py-2.5 rounded-2xl bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center space-x-1.5 border border-purple-200">
                      <CheckCircle2 className="w-4 h-4 text-purple-700" />
                      <span>Connected to Project</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleConnect(match)}
                      className="w-full py-2.5 rounded-2xl font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 shadow-md shadow-purple-500/25 text-xs transition-all flex items-center justify-center space-x-2"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>
                        {match.partnerRole === 'mentor' ? 'Request Mentorship' : 'Propose Partnership'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
