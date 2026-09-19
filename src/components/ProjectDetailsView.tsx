import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Dna, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Github, 
  ExternalLink, 
  PlusCircle, 
  Users, 
  Building2, 
  ShieldCheck, 
  Calendar, 
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  Award,
  Zap,
  Check
} from 'lucide-react';
import { Project, Milestone, ProjectStage, UserProfile } from '../types';
import { dbService } from '../services/firebaseConfig';

interface ProjectDetailsViewProps {
  project: Project;
  onBack: () => void;
  currentUser: UserProfile;
  milestones: Milestone[];
  onRefreshProject: () => void;
  onOpenFusionWithProject: (projectId: string) => void;
}

export const ProjectDetailsView: React.FC<ProjectDetailsViewProps> = ({
  project,
  onBack,
  currentUser,
  milestones,
  onRefreshProject,
  onOpenFusionWithProject,
}) => {
  const [activeTab, setActiveTab] = useState<'dna' | 'maturity' | 'needs' | 'roadmap' | 'files'>('dna');
  
  // New milestone form state
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  const dna = project.projectDNA;
  const maturity = project.maturityAssessment;
  const needs = project.needsNext || [];
  const projectMilestones = milestones.filter(m => m.projectId === project.id).sort((a, b) => a.order - b.order);

  // Compute roadmap completion percentage
  const completedCount = projectMilestones.filter(m => m.status === 'COMPLETED').length;
  const completionPercentage = projectMilestones.length > 0 
    ? Math.round((completedCount / projectMilestones.length) * 100) 
    : 35;

  const handleStageChange = (newStage: ProjectStage) => {
    dbService.updateProjectStage(project.id, newStage);
    onRefreshProject();
  };

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newM: Milestone = {
      id: `ms_${project.id}_${Date.now()}`,
      projectId: project.id,
      title: newTitle.trim(),
      description: newDesc.trim(),
      status: 'PLANNED',
      deadline: newDeadline || new Date(Date.now() + 45 * 24 * 3600 * 1000).toISOString().split('T')[0],
      responsiblePerson: currentUser.fullName,
      order: projectMilestones.length + 1
    };

    dbService.saveMilestone(newM);
    setIsAddingMilestone(false);
    setNewTitle('');
    setNewDesc('');
    setNewDeadline('');
    onRefreshProject();
  };

  const handleUpdateMilestoneStatus = (id: string, status: Milestone['status']) => {
    dbService.updateMilestoneStatus(id, status);
    onRefreshProject();
  };

  const stages: ProjectStage[] = ['idea', 'prototype', 'tested', 'pilot', 'deployment'];

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects Discovery</span>
          </button>

          <div className="card-saas p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
                  {project.domain}
                </span>
                <span className="px-2.5 py-1 text-[11px] font-mono font-bold uppercase rounded-lg bg-violet-50 text-violet-700 border border-violet-200">
                  Level {maturity?.numericLevel || 2}: {project.stage}
                </span>
                {project.mentorName && (
                  <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-purple-100/80 text-purple-800 border border-purple-200 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                    <span>Mentor: {project.mentorName}</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {project.title}
              </h1>

              <p className="text-xs text-slate-500">
                Created by <strong className="text-slate-800">{project.ownerName}</strong> ({project.ownerCollege}) • Updated {new Date(project.updatedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              {project.githubRepo && (
                <a
                  href={project.githubRepo}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-purple-50 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors border border-purple-100 shadow-sm"
                >
                  <Github className="w-4 h-4 text-purple-700" />
                  <span>GitHub</span>
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-purple-50 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors border border-purple-100 shadow-sm"
                >
                  <ExternalLink className="w-4 h-4 text-purple-700" />
                  <span>Live Demo</span>
                </a>
              )}
              <button
                onClick={() => onOpenFusionWithProject(project.id)}
                className="btn-purple-primary text-xs flex items-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Simulate Project Fusion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stage Updater Bar */}
        <div className="card-saas p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider">Maturity Progression:</span>
            <span className="text-slate-500">Promote stage when validated</span>
          </div>
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
            {stages.map((stg) => (
              <button
                key={stg}
                onClick={() => handleStageChange(stg)}
                className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] transition-all whitespace-nowrap ${
                  project.stage === stg
                    ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-500/20'
                    : 'bg-white text-slate-600 hover:text-purple-700 hover:bg-purple-50 border border-purple-100'
                }`}
              >
                {stg}
              </button>
            ))}
          </div>
        </div>

        {/* Module Subtabs */}
        <div className="flex items-center space-x-2 border-b border-purple-100 pb-2 overflow-x-auto text-xs">
          {[
            { id: 'dna', label: '02. Project DNA Engine', icon: Dna },
            { id: 'maturity', label: 'Maturity Analysis', icon: TrendingUp },
            { id: 'needs', label: 'AI Need Detection', icon: Zap },
            { id: 'roadmap', label: '05. IdeaTec Roadmap', icon: Calendar },
            { id: 'files', label: 'Uploaded Documents', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/15'
                    : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Project DNA Engine (Section 8) */}
        {activeTab === 'dna' && dna && (
          <div className="space-y-6">
            
            {/* Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Problem Statement */}
              <div className="card-saas p-6 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Analyzed Problem
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {dna.problem}
                </p>
              </div>

              {/* Proposed Solution */}
              <div className="card-saas p-6 space-y-2 border-purple-200">
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                  Engineered Solution
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {dna.solution}
                </p>
              </div>

            </div>

            {/* Structured DNA Extraction Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Technologies */}
              <div className="card-saas p-5 space-y-3">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">
                  Technologies & Hardware
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {dna.technologies.map((tech) => (
                    <span key={tech} className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-50 border border-purple-100 text-purple-900">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Required Skills */}
              <div className="card-saas p-5 space-y-3">
                <span className="text-xs font-bold text-violet-700 uppercase tracking-wider block">
                  Required Engineering Skills
                </span>
                <ul className="space-y-2 text-xs text-slate-600">
                  {dna.requiredSkills.map((skill) => (
                    <li key={skill} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Resources */}
              <div className="card-saas p-5 space-y-3">
                <span className="text-xs font-bold text-purple-800 uppercase tracking-wider block">
                  Required Resources
                </span>
                <ul className="space-y-2 text-xs text-slate-600">
                  {dna.requiredResources.map((res) => (
                    <li key={res} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span>{res}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Potential Users */}
              <div className="card-saas p-5 space-y-3">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">
                  Potential Users / Beneficiaries
                </span>
                <ul className="space-y-2 text-xs text-slate-600">
                  {dna.potentialUsers.map((u) => (
                    <li key={u} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Possible Applications */}
              <div className="card-saas p-5 space-y-3 md:col-span-2">
                <span className="text-xs font-bold text-purple-800 uppercase tracking-wider block">
                  Commercial & Municipal Applications
                </span>
                <ul className="space-y-2 text-xs text-slate-600">
                  {dna.possibleApplications.map((app) => (
                    <li key={app} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Keywords */}
            <div className="p-4 rounded-2xl bg-white border border-purple-100 flex items-center space-x-3 text-xs shadow-sm">
              <span className="font-bold text-slate-600 uppercase tracking-wider">DNA Keywords:</span>
              <div className="flex flex-wrap gap-1.5">
                {dna.keywords.map((k) => (
                  <span key={k} className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                    #{k}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Project Maturity Analysis (Section 9) */}
        {activeTab === 'maturity' && maturity && (
          <div className="space-y-6">
            
            <div className="card-saas p-6 sm:p-8 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-100">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span>{maturity.disclaimer}</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    Level {maturity.numericLevel} of 5: {maturity.currentStage.toUpperCase()}
                  </h3>
                </div>

                {/* Circular indicator representation */}
                <div className="flex items-center space-x-4 bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-purple-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-purple-600"
                        strokeDasharray={`${(maturity.numericLevel / 5) * 100}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute font-extrabold text-sm text-purple-900">{maturity.confidenceScore}%</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Confidence Score</div>
                    <div className="text-[11px] text-slate-500">Standardized Scale</div>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Progression from Idea to Real-World Deployment</span>
                  <span className="text-purple-700 font-mono">{maturity.numericLevel * 20}%</span>
                </div>
                <div className="w-full h-3 bg-purple-50 rounded-full overflow-hidden p-0.5 border border-purple-100">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${maturity.numericLevel * 20}%` }}
                  />
                </div>
              </div>

              {/* Maturity Factors Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
                  <div className="text-[11px] font-bold text-slate-500">Code Maturity</div>
                  <div className="text-lg font-extrabold text-slate-900 mt-1">{maturity.maturityFactors.codeMaturity}%</div>
                  <div className="w-full h-1.5 bg-purple-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-purple-600" style={{ width: `${maturity.maturityFactors.codeMaturity}%` }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
                  <div className="text-[11px] font-bold text-slate-500">Hardware Validation</div>
                  <div className="text-lg font-extrabold text-slate-900 mt-1">{maturity.maturityFactors.hardwareValidation}%</div>
                  <div className="w-full h-1.5 bg-purple-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: `${maturity.maturityFactors.hardwareValidation}%` }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
                  <div className="text-[11px] font-bold text-slate-500">User Testing</div>
                  <div className="text-lg font-extrabold text-slate-900 mt-1">{maturity.maturityFactors.userTesting}%</div>
                  <div className="w-full h-1.5 bg-purple-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-purple-600" style={{ width: `${maturity.maturityFactors.userTesting}%` }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
                  <div className="text-[11px] font-bold text-slate-500">Market Readiness</div>
                  <div className="text-lg font-extrabold text-slate-900 mt-1">{maturity.maturityFactors.marketReadiness}%</div>
                  <div className="w-full h-1.5 bg-purple-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-violet-600" style={{ width: `${maturity.maturityFactors.marketReadiness}%` }} />
                  </div>
                </div>
              </div>

              {/* Next Recommended Stage & Reason (Section 9) */}
              <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">
                    Next Recommended Stage: {maturity.nextRecommendedStage.toUpperCase()}
                  </span>
                  <p className="text-xs text-slate-700 max-w-2xl leading-relaxed">
                    {maturity.reason}
                  </p>
                </div>
                <button
                  onClick={() => handleStageChange(maturity.nextRecommendedStage)}
                  className="btn-purple-primary text-xs whitespace-nowrap"
                >
                  Advance to {maturity.nextRecommendedStage}
                </button>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: AI Need Detection (Section 10) */}
        {activeTab === 'needs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">What Your Project Needs Next</h3>
                <p className="text-xs text-slate-500">
                  AI-detected engineering, facility, and mentorship prerequisites to prevent post-hackathon stagnation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {needs.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl card-saas flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
                        {item.type}
                      </span>
                      <span className={`text-[10px] font-bold uppercase ${
                        item.priority === 'high' ? 'text-rose-600' : 'text-amber-600'
                      }`}>
                        {item.priority} Priority
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.reason}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-purple-100">
                    <button
                      onClick={() => onOpenFusionWithProject(project.id)}
                      className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors border border-purple-200"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Find Matching Partner</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Afterlife Roadmap & Milestones (Section 13 & 14) */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">IdeaTec Roadmap</h3>
                <p className="text-xs text-slate-500">
                  Track verification milestones from hackathon prototype to pilot testing and real-world impact.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-xs text-right">
                  <span className="text-slate-500">Progress: </span>
                  <strong className="text-purple-700">{completionPercentage}% Completed</strong>
                </div>
                <button
                  onClick={() => setIsAddingMilestone(!isAddingMilestone)}
                  className="btn-purple-primary text-xs flex items-center space-x-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Milestone</span>
                </button>
              </div>
            </div>

            {/* Add Milestone Form */}
            {isAddingMilestone && (
              <form onSubmit={handleCreateMilestone} className="p-5 rounded-2xl card-saas space-y-4 text-xs">
                <div className="font-bold text-slate-900 text-sm">Add New Verification Milestone</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">Milestone Title</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g., Stress chamber sensor calibration report"
                      className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">Target Deadline</label>
                    <input
                      type="date"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">Description & Acceptance Criteria</label>
                  <textarea
                    rows={2}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="What evidence confirms this milestone is successfully completed?"
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingMilestone(false)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-purple-primary"
                  >
                    Save Milestone
                  </button>
                </div>
              </form>
            )}

            {/* Milestones Timeline */}
            <div className="space-y-4">
              {projectMilestones.map((m, idx) => {
                const statusColors: Record<Milestone['status'], string> = {
                  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  'IN PROGRESS': 'bg-purple-50 text-purple-700 border-purple-200',
                  'NOT STARTED': 'bg-slate-100 text-slate-600 border-slate-200',
                  PLANNED: 'bg-purple-50/50 text-purple-600 border-purple-100',
                  BLOCKED: 'bg-rose-50 text-rose-700 border-rose-200'
                };

                return (
                  <div
                    key={m.id}
                    className="p-5 rounded-2xl card-saas flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold text-slate-500">0{idx + 1}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${statusColors[m.status]}`}>
                          {m.status}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center space-x-1 font-medium">
                          <Calendar className="w-3 h-3 text-purple-600" />
                          <span>Deadline: {m.deadline}</span>
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                      <p className="text-xs text-slate-600 max-w-2xl">{m.description}</p>
                    </div>

                    <div className="flex items-center space-x-2 self-end md:self-auto">
                      <select
                        value={m.status}
                        onChange={(e) => handleUpdateMilestoneStatus(m.id, e.target.value as any)}
                        className="px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      >
                        <option value="PLANNED">Planned</option>
                        <option value="IN PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="BLOCKED">Blocked</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 5: Uploaded Documents */}
        {activeTab === 'files' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Project Artifacts & Documents</h3>
              <p className="text-xs text-slate-500">Presentations, specifications, and telemetry records uploaded by the team.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {project.files.map((file, idx) => (
                <div key={idx} className="p-5 rounded-2xl card-saas flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-purple-600">
                      <FileText className="w-5 h-5" />
                      <span className="text-[10px] uppercase font-bold text-slate-500">{file.type}</span>
                    </div>
                    <div className="font-bold text-xs text-slate-900 truncate">{file.name}</div>
                    <div className="text-[11px] text-slate-500">{(file.sizeBytes / (1024 * 1024)).toFixed(1)} MB</div>
                  </div>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center justify-center py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold rounded-xl transition-colors border border-purple-200"
                  >
                    Download File
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
