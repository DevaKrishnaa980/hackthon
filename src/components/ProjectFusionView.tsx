import React, { useState } from 'react';
import { 
  GitMerge, 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  ChevronRight,
  Info
} from 'lucide-react';
import { Project, ProjectFusionSuggestion, UserProfile } from '../types';
import { CppMatchingEngineWrapper } from '../services/cppAlgorithmService';
import { dbService } from '../services/firebaseConfig';

interface ProjectFusionViewProps {
  projects: Project[];
  currentUser: UserProfile;
  initialProjectId?: string;
  onNavigateToWorkspace: () => void;
  onSelectProject: (projectId: string) => void;
}

export const ProjectFusionView: React.FC<ProjectFusionViewProps> = ({
  projects,
  currentUser,
  initialProjectId,
  onNavigateToWorkspace,
  onSelectProject,
}) => {
  const [projectAId, setProjectAId] = useState<string>(initialProjectId || projects[0]?.id || '');
  const [projectBId, setProjectBId] = useState<string>(projects[1]?.id || '');
  const [requestedCollabs, setRequestedCollabs] = useState<Record<string, boolean>>({});

  const projectA = projects.find(p => p.id === projectAId) || projects[0];
  const projectB = projects.find(p => p.id === projectBId) || projects[1];

  // Run C++ Fusion Evaluation
  const activeFusion: ProjectFusionSuggestion | null = (projectA && projectB && projectA.id !== projectB.id)
    ? CppMatchingEngineWrapper.evaluateProjectFusion(projectA, projectB)
    : null;

  // Auto-discovered complementary pairs across the entire platform
  const allPairCombinations: ProjectFusionSuggestion[] = [];
  for (let i = 0; i < projects.length; i++) {
    for (let j = i + 1; j < projects.length; j++) {
      allPairCombinations.push(CppMatchingEngineWrapper.evaluateProjectFusion(projects[i], projects[j]));
    }
  }
  const topDiscoveredPairs = allPairCombinations.sort((a, b) => b.synergyScore - a.synergyScore).slice(0, 4);

  const handleRequestCollaboration = (fusion: ProjectFusionSuggestion) => {
    dbService.createCollaboration({
      id: `collab_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      receiverId: fusion.projectBOwnerId,
      receiverName: fusion.projectBOwnerName,
      projectAId: fusion.projectAId,
      projectATitle: fusion.projectATitle,
      projectBId: fusion.projectBId,
      projectBTitle: fusion.projectBTitle,
      proposedArchitecture: fusion.combinedArchitecture,
      synergyScore: fusion.synergyScore,
      status: 'pending',
      message: `Hi ${fusion.projectBOwnerName}, our AI Fusion analysis identified that combining "${fusion.projectATitle}" with "${fusion.projectBTitle}" creates "${fusion.combinedSolutionName}". Let's co-develop this while preserving individual team IP!`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    setRequestedCollabs(prev => ({ ...prev, [`${fusion.projectAId}_${fusion.projectBId}`]: true }));
  };

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-purple-100 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
              <GitMerge className="w-4 h-4" />
              <span>Module 04: Project Fusion Engine</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Project Fusion Co-Development
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl">
              Pairs complementary student technologies into end-to-end mission solutions. Each team preserves independent ownership while unlocking joint pilot deployments.
            </p>
          </div>

          <button
            onClick={onNavigateToWorkspace}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-purple-50 border border-purple-200 text-xs font-bold text-purple-800 transition-colors flex items-center space-x-2 shadow-sm"
          >
            <span>View Active Collaborations</span>
            <ChevronRight className="w-4 h-4 text-purple-600" />
          </button>
        </div>

        {/* Ownership Preservation Principle Notice */}
        <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-purple-900 flex items-start space-x-3 text-xs leading-relaxed">
          <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-purple-950 font-bold">IdeaTec Co-Development Charter:</strong> We do not force mergers. Project Fusion presents collaborative architectures where each student team maintains 100% intellectual property of their original repository and codebase while jointly interfacing to deploy higher-order pilot systems.
          </div>
        </div>

        {/* Interactive Fusion Sandbox Selector */}
        <div className="card-saas p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Interactive Fusion Simulator</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Select any two projects to evaluate co-development synergy</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            
            {/* Project A */}
            <div className="md:col-span-5 p-5 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-3">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                Primary Project (A)
              </span>
              <select
                value={projectAId}
                onChange={(e) => setProjectAId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-purple-100 rounded-xl text-xs text-slate-800 focus:outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.domain})
                  </option>
                ))}
              </select>
              {projectA && (
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="line-clamp-2">{projectA.proposedSolution}</p>
                  <div className="text-[11px] text-purple-700 font-medium">By {projectA.ownerName} • Stage: {projectA.stage}</div>
                </div>
              )}
            </div>

            {/* Fusion Symbol */}
            <div className="md:col-span-1 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shadow-sm">
                <Plus className="w-5 h-5" />
              </div>
            </div>

            {/* Project B */}
            <div className="md:col-span-5 p-5 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-3">
              <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider block">
                Complementary Project (B)
              </span>
              <select
                value={projectBId}
                onChange={(e) => setProjectBId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-purple-100 rounded-xl text-xs text-slate-800 focus:outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.domain})
                  </option>
                ))}
              </select>
              {projectB && (
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="line-clamp-2">{projectB.proposedSolution}</p>
                  <div className="text-[11px] text-violet-700 font-medium">By {projectB.ownerName} • Stage: {projectB.stage}</div>
                </div>
              )}
            </div>

          </div>

          {/* Active Fusion Analysis Card */}
          {activeFusion && (
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-white via-purple-50/30 to-violet-50/40 border border-purple-200 shadow-xl space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
                <div>
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                    Synthesized Combined Solution Name:
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {activeFusion.combinedSolutionName}
                  </h3>
                </div>

                <div className="flex items-center space-x-3 self-start sm:self-auto bg-purple-50 px-4 py-2 rounded-xl border border-purple-100">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Synergy Score</div>
                    <div className="text-lg font-extrabold text-purple-700">{activeFusion.synergyScore}%</div>
                  </div>
                </div>
              </div>

              {/* Why Complementary */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-purple-800 uppercase tracking-wider block">
                  Why These Projects Are Complementary:
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {activeFusion.whyComplementary}
                </p>
              </div>

              {/* Combined System Architecture */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Combined System Architecture:
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-mono bg-white p-3 rounded-xl border border-purple-100">
                  {activeFusion.combinedArchitecture}
                </p>
              </div>

              {/* Request Collaboration Button */}
              <div className="pt-2 flex justify-end">
                {requestedCollabs[`${activeFusion.projectAId}_${activeFusion.projectBId}`] ? (
                  <div className="px-5 py-2.5 rounded-xl bg-purple-100 border border-purple-200 text-purple-800 text-xs font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    <span>Collaboration Proposal Dispatched</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRequestCollaboration(activeFusion)}
                    className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#A855F7] via-[#7C3AED] to-[#6366F1] hover:opacity-95 active:scale-95 text-xs shadow-md shadow-purple-500/25 transition-all flex items-center space-x-2"
                  >
                    <GitMerge className="w-4 h-4" />
                    <span>Request Collaboration</span>
                  </button>
                )}
              </div>

            </div>
          )}
        </div>

        {/* AI Top Discovered Complementary Pairs */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Platform-Wide High-Synergy Pairs</h3>
            <p className="text-xs text-slate-500">
              Autonomous pairings detected by the vector matching engine across the student database.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topDiscoveredPairs.map((pair, idx) => (
              <div
                key={idx}
                className="card-saas p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                      Synergy: {pair.synergyScore}%
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">Automated Match</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">
                    {pair.combinedSolutionName}
                  </h4>

                  <div className="mt-2 text-xs text-slate-600 space-y-1">
                    <div><strong className="text-slate-700">Project A:</strong> {pair.projectATitle}</div>
                    <div><strong className="text-slate-700">Project B:</strong> {pair.projectBTitle}</div>
                  </div>

                  <p className="mt-3 text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {pair.whyComplementary}
                  </p>
                </div>

                <div className="pt-4 border-t border-purple-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setProjectAId(pair.projectAId);
                      setProjectBId(pair.projectBId);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-purple-700 hover:underline font-bold"
                  >
                    Inspect in Simulator
                  </button>

                  <button
                    onClick={() => handleRequestCollaboration(pair)}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold transition-colors"
                  >
                    Propose Fusion
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
