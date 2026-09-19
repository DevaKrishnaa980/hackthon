import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  Edit3, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Compass, 
  Building2, 
  Banknote, 
  Activity, 
  BookOpen, 
  Cpu, 
  Users, 
  Layers, 
  Target, 
  Lightbulb, 
  Code2, 
  HelpCircle, 
  Briefcase, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Project, ProjectDNA, ProjectStage, RequirementType, UserProfile } from '../types';

export interface ProjectAnalysisData {
  projectName: string;
  problem: string;
  solution: string;
  domain: string;
  technology: string[];
  targetUsers: string;
  developmentStage: ProjectStage;
  potentialApplications: string[];
  requiredExpertise: string[];
  projectNeeds: RequirementType[];
}

interface ProjectAnalysisViewProps {
  initialData?: Partial<ProjectAnalysisData>;
  project?: Project;
  currentUser?: UserProfile;
  onConfirm?: (confirmedData: ProjectAnalysisData) => void;
  onEdit?: (currentData: ProjectAnalysisData) => void;
  onFindOpportunities?: (projectOrData: ProjectAnalysisData | Project) => void;
  onNavigate?: (tab: string) => void;
}

export const ProjectAnalysisView: React.FC<ProjectAnalysisViewProps> = ({
  initialData,
  project,
  currentUser,
  onConfirm,
  onEdit,
  onFindOpportunities,
  onNavigate
}) => {
  // Extract or synthesize default data from props or rich default
  const defaultData: ProjectAnalysisData = {
    projectName: project?.title || initialData?.projectName || 'Adaptive Multi-Cell EV Battery Management System',
    problem: project?.problemStatement || initialData?.problem || 'Electric vehicle battery packs suffer from premature cell degradation and catastrophic thermal runaway risk caused by passive charge-balancing limitations under extreme weather conditions.',
    solution: project?.proposedSolution || initialData?.solution || 'An active balance BMS using CAN bus telemetry, edge TinyML thermal predictive modeling, and sub-second shunt switching that extends lithium pack longevity by 28%.',
    domain: project?.domain || initialData?.domain || 'CleanTech & Smart Mobility',
    technology: (project?.technologies && project.technologies.length > 0)
      ? project.technologies 
      : (initialData?.technology && initialData.technology.length > 0) 
        ? initialData.technology 
        : ['ESP32-S3', 'CAN Bus Protocol', 'C++', 'TinyML', 'FreeRTOS', 'Python'],
    targetUsers: project?.targetUsers || initialData?.targetUsers || 'Electric 2-wheeler OEMs, commercial battery retrofitters, and fleet operators.',
    developmentStage: project?.stage || initialData?.developmentStage || 'prototype',
    potentialApplications: (project?.projectDNA?.possibleApplications && project.projectDNA.possibleApplications.length > 0)
      ? project.projectDNA.possibleApplications
      : (initialData?.potentialApplications && initialData.potentialApplications.length > 0)
        ? initialData.potentialApplications
        : [
            'Commercial 2-Wheeler & 3-Wheeler Fleet Telemetry & Battery Health Tracking',
            'Second-Life Solar Microgrid Energy Storage Pack Management',
            'Heavy Machinery Auxiliary Battery Thermal Safety Interlocks'
          ],
    requiredExpertise: (project?.projectDNA?.requiredSkills && project.projectDNA.requiredSkills.length > 0)
      ? project.projectDNA.requiredSkills
      : (initialData?.requiredExpertise && initialData.requiredExpertise.length > 0)
        ? initialData.requiredExpertise
        : [
            'High-Voltage Automotive Safety Protocols (ISO 26262)',
            'Embedded C/C++ & CAN Transceiver Firmware Architecture',
            'Edge TinyML Thermal Runaway Predictive Surrogate Modeling',
            'Multilayer PCB Thermal Dissipation & Shunt Engineering'
          ],
    projectNeeds: (project?.requirements && project.requirements.length > 0)
      ? project.requirements
      : (initialData?.projectNeeds && initialData.projectNeeds.length > 0)
        ? initialData.projectNeeds
        : ['Mentor', 'Industry Support', 'Testing', 'Funding']
  };

  const [data, setData] = useState<ProjectAnalysisData>(defaultData);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Editable Form State
  const [editForm, setEditForm] = useState<ProjectAnalysisData>(defaultData);

  const handleStartEdit = () => {
    setEditForm({ ...data });
    setIsEditing(true);
    setIsConfirmed(false);
  };

  const handleSaveEdit = () => {
    setData({ ...editForm });
    setIsEditing(false);
    if (onEdit) {
      onEdit(editForm);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({ ...data });
    setIsEditing(false);
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    if (onConfirm) {
      onConfirm(data);
    }
  };

  const handleTriggerOpportunities = () => {
    if (onFindOpportunities) {
      onFindOpportunities(data);
    } else if (onNavigate) {
      onNavigate('matching');
    }
  };

  // Helper stage label & styling
  const stageLabels: Record<ProjectStage, { label: string; badge: string; desc: string }> = {
    idea: { label: 'Idea', badge: 'bg-amber-50 text-amber-800 border-amber-200', desc: 'Concept, technical architecture & specification' },
    prototype: { label: 'Prototype', badge: 'bg-purple-50 text-purple-800 border-purple-200', desc: 'Functional benchtop proof-of-concept build' },
    tested: { label: 'Tested / MVP', badge: 'bg-blue-50 text-blue-800 border-blue-200', desc: 'Lab-bench validated & benchmarked build' },
    pilot: { label: 'Pilot', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', desc: 'Live testbed or municipal sandbox deployment' },
    deployment: { label: 'Deployment', badge: 'bg-teal-50 text-teal-800 border-teal-200', desc: 'Active commercial spinout or public utility' }
  };

  // Need icon mapper
  const getNeedIcon = (need: string) => {
    switch (need.toLowerCase()) {
      case 'mentor': return Compass;
      case 'industry partner':
      case 'industry support': return Building2;
      case 'funding': return Banknote;
      case 'testing':
      case 'field testing':
      case 'testing facility': return Activity;
      case 'research':
      case 'research support': return BookOpen;
      case 'hardware': return Cpu;
      case 'team members': return Users;
      default: return Layers;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-800 font-sans pb-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* ======================================================================= */}
        {/* HEADER SECTION                                                          */}
        {/* Heading: "Your Project DNA"                                             */}
        {/* Subtitle: "AI-generated understanding of your project."                 */}
        {/* ======================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-2xs relative overflow-hidden">
          {/* Subtle AI ambient glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-100/50 via-indigo-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>AI Project Analysis</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Your Project DNA
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-normal max-w-2xl">
                AI-generated understanding of your project.
              </p>
            </div>

            {/* Quick Status / Project pill */}
            <div className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-purple-100 shrink-0 self-start md:self-auto flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm">
                DNA
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 max-w-[200px] truncate">
                  {data.projectName}
                </div>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-[11px] text-slate-500 font-medium capitalize">
                    {isConfirmed ? 'Confirmed' : 'Pending Confirmation'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* EDIT MODAL / INLINE EDIT VIEW                                           */}
        {/* ======================================================================= */}
        {isEditing && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-300 shadow-xl space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-purple-50">
              <div className="flex items-center space-x-2 text-purple-800 font-bold text-base">
                <Edit3 className="w-5 h-5 text-purple-600" />
                <span>Edit Project DNA Information</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">Update any field to re-align your profile</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Problem */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-bold text-slate-700 uppercase tracking-wider">Problem</label>
                <textarea
                  rows={3}
                  value={editForm.problem}
                  onChange={(e) => setEditForm({ ...editForm, problem: e.target.value })}
                  className="w-full p-3 rounded-xl border border-purple-200 bg-[#FAF8FF] text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs"
                />
              </div>

              {/* Solution */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-bold text-slate-700 uppercase tracking-wider">Solution</label>
                <textarea
                  rows={3}
                  value={editForm.solution}
                  onChange={(e) => setEditForm({ ...editForm, solution: e.target.value })}
                  className="w-full p-3 rounded-xl border border-purple-200 bg-[#FAF8FF] text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs"
                />
              </div>

              {/* Domain */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase tracking-wider">Domain</label>
                <input
                  type="text"
                  value={editForm.domain}
                  onChange={(e) => setEditForm({ ...editForm, domain: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-purple-200 bg-[#FAF8FF] text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs"
                />
              </div>

              {/* Development Stage */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase tracking-wider">Development Stage</label>
                <select
                  value={editForm.developmentStage}
                  onChange={(e) => setEditForm({ ...editForm, developmentStage: e.target.value as ProjectStage })}
                  className="w-full p-2.5 rounded-xl border border-purple-200 bg-[#FAF8FF] text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs font-medium"
                >
                  <option value="idea">Idea</option>
                  <option value="prototype">Prototype</option>
                  <option value="tested">Tested / MVP</option>
                  <option value="pilot">Pilot</option>
                  <option value="deployment">Deployment</option>
                </select>
              </div>

              {/* Technology */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-bold text-slate-700 uppercase tracking-wider">Technology (comma separated)</label>
                <input
                  type="text"
                  value={editForm.technology.join(', ')}
                  onChange={(e) => setEditForm({ ...editForm, technology: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  className="w-full p-2.5 rounded-xl border border-purple-200 bg-[#FAF8FF] text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs"
                />
              </div>

              {/* Target Users */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-bold text-slate-700 uppercase tracking-wider">Target Users</label>
                <input
                  type="text"
                  value={editForm.targetUsers}
                  onChange={(e) => setEditForm({ ...editForm, targetUsers: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-purple-200 bg-[#FAF8FF] text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-purple-100">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* CARDS GRID: EXACT 9 CARDS                                               */}
        {/* 1. Problem                                                              */}
        {/* 2. Solution                                                             */}
        {/* 3. Domain                                                               */}
        {/* 4. Technology                                                           */}
        {/* 5. Target Users                                                         */}
        {/* 6. Development Stage                                                    */}
        {/* 7. Potential Applications                                               */}
        {/* 8. Required Expertise                                                   */}
        {/* 9. Project Needs                                                        */}
        {/* ======================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* CARD 1: Problem */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-2xs space-y-3 flex flex-col justify-between hover:border-purple-200 transition-all">
            <div>
              <div className="flex items-center space-x-2 text-purple-700 mb-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Problem</h3>
              </div>
              <p className="text-sm text-slate-700 font-normal leading-relaxed">
                {data.problem}
              </p>
            </div>
            <div className="pt-3 border-t border-purple-50/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Challenge Framing</span>
              <span className="text-purple-600 font-semibold">Parsed</span>
            </div>
          </div>

          {/* CARD 2: Solution */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-2xs space-y-3 flex flex-col justify-between hover:border-purple-200 transition-all">
            <div>
              <div className="flex items-center space-x-2 text-purple-700 mb-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Solution</h3>
              </div>
              <p className="text-sm text-slate-700 font-normal leading-relaxed">
                {data.solution}
              </p>
            </div>
            <div className="pt-3 border-t border-purple-50/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Proposed Architecture</span>
              <span className="text-purple-600 font-semibold">Active</span>
            </div>
          </div>

          {/* CARD 3: Domain */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-2xs space-y-3 flex flex-col justify-between hover:border-purple-200 transition-all">
            <div>
              <div className="flex items-center space-x-2 text-purple-700 mb-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Domain</h3>
              </div>
              <div className="text-lg font-extrabold text-slate-900 mt-1">
                {data.domain}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Categorized under high-impact sustainable engineering and hardware modernization frameworks.
              </p>
            </div>
            <div className="pt-3 border-t border-purple-50/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Sector Taxonomy</span>
              <span className="text-purple-600 font-semibold">Verified</span>
            </div>
          </div>

          {/* CARD 4: Technology */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-2xs space-y-3 flex flex-col justify-between hover:border-purple-200 transition-all">
            <div>
              <div className="flex items-center space-x-2 text-purple-700 mb-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Technology</h3>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {data.technology.map((tech, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FAF8FF] border border-purple-200/80 text-purple-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-purple-50/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Tech Stack</span>
              <span className="text-purple-600 font-semibold">{data.technology.length} Detected</span>
            </div>
          </div>

          {/* CARD 5: Target Users */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-2xs space-y-3 flex flex-col justify-between hover:border-purple-200 transition-all">
            <div>
              <div className="flex items-center space-x-2 text-purple-700 mb-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Target Users</h3>
              </div>
              <p className="text-sm text-slate-700 font-normal leading-relaxed">
                {data.targetUsers}
              </p>
            </div>
            <div className="pt-3 border-t border-purple-50/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Beneficiary Segment</span>
              <span className="text-purple-600 font-semibold">Identified</span>
            </div>
          </div>

          {/* CARD 6: Development Stage */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-2xs space-y-3 flex flex-col justify-between hover:border-purple-200 transition-all">
            <div>
              <div className="flex items-center space-x-2 text-purple-700 mb-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Development Stage</h3>
              </div>
              <div className="mt-1">
                <span className={`inline-block px-3 py-1 rounded-xl text-xs font-extrabold border ${stageLabels[data.developmentStage].badge}`}>
                  {stageLabels[data.developmentStage].label}
                </span>
                <p className="text-xs text-slate-600 mt-2 font-normal leading-relaxed">
                  {stageLabels[data.developmentStage].desc}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-purple-50/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Maturity Baseline</span>
              <span className="text-purple-600 font-semibold">Assessed</span>
            </div>
          </div>

          {/* CARD 7: Potential Applications */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-2xs space-y-3 flex flex-col justify-between hover:border-purple-200 transition-all">
            <div>
              <div className="flex items-center space-x-2 text-purple-700 mb-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Potential Applications</h3>
              </div>
              <ul className="space-y-2 pt-1">
                {data.potentialApplications.map((app, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-3 border-t border-purple-50/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Second-Life Use Cases</span>
              <span className="text-purple-600 font-semibold">{data.potentialApplications.length} Pathways</span>
            </div>
          </div>

          {/* CARD 8: Required Expertise */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-2xs space-y-3 flex flex-col justify-between hover:border-purple-200 transition-all">
            <div>
              <div className="flex items-center space-x-2 text-purple-700 mb-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Required Expertise</h3>
              </div>
              <div className="space-y-2 pt-1">
                {data.requiredExpertise.map((exp, idx) => (
                  <div 
                    key={idx} 
                    className="p-2 rounded-xl bg-[#FAF8FF] border border-purple-100 text-xs font-medium text-slate-800"
                  >
                    {exp}
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-purple-50/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Advisory Focus</span>
              <span className="text-purple-600 font-semibold">Specialized</span>
            </div>
          </div>

          {/* CARD 9: Project Needs */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-2xs space-y-3 flex flex-col justify-between hover:border-purple-200 transition-all">
            <div>
              <div className="flex items-center space-x-2 text-purple-700 mb-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Project Needs</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {data.projectNeeds.map((need, idx) => {
                  const NeedIcon = getNeedIcon(need);
                  return (
                    <div 
                      key={idx} 
                      className="p-2 rounded-xl bg-purple-50/70 border border-purple-200/80 text-xs font-bold text-purple-900 flex items-center space-x-2"
                    >
                      <NeedIcon className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                      <span className="truncate">{need}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="pt-3 border-t border-purple-50/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Ecosystem Catalysts</span>
              <span className="text-purple-600 font-semibold">{data.projectNeeds.length} Selected</span>
            </div>
          </div>

        </div>

        {/* ======================================================================= */}
        {/* CONFIDENCE / VERIFICATION MESSAGE & BUTTONS CONTAINER                    */}
        {/* Message: "Review and confirm the AI-generated information before continuing." */}
        {/* Buttons: [ Confirm ] [ Edit ]                                           */}
        {/* After confirmation: [ Find Opportunities ]                              */}
        {/* ======================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-2xs space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Confidence/Verification message */}
            <div className="flex items-start sm:items-center space-x-3 text-slate-700">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                isConfirmed ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-purple-50 text-purple-600 border border-purple-100'
              }`}>
                {isConfirmed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                )}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800">
                  {isConfirmed ? (
                    <span className="text-emerald-800 font-bold">Project DNA verified and confirmed!</span>
                  ) : (
                    "Review and confirm the AI-generated information before continuing."
                  )}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Accurate project parameters ensure precise mentor matches and funding opportunities.
                </p>
              </div>
            </div>

            {/* Action Buttons: [ Edit ], [ Confirm ], and after confirmation: [ Find Opportunities ] */}
            <div className="flex items-center space-x-3 shrink-0">
              
              {/* [ Edit ] Button */}
              <button
                type="button"
                id="btn-edit-dna"
                onClick={handleStartEdit}
                className="px-5 py-2.5 rounded-2xl border border-purple-200 bg-white hover:bg-purple-50/60 active:scale-[0.99] text-xs font-bold text-slate-700 flex items-center space-x-2 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-600" />
                <span>Edit</span>
              </button>

              {/* [ Confirm ] Button */}
              {!isConfirmed ? (
                <button
                  type="button"
                  id="btn-confirm-dna"
                  onClick={handleConfirm}
                  className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white text-xs font-extrabold flex items-center space-x-2 shadow-md shadow-purple-500/20 transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm</span>
                </button>
              ) : (
                /* After confirmation: [ Find Opportunities ] */
                <button
                  type="button"
                  id="btn-find-opportunities"
                  onClick={handleTriggerOpportunities}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.99] text-white text-xs font-extrabold flex items-center space-x-2 shadow-lg shadow-purple-500/25 transition-all animate-in zoom-in-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                  <span>Find Opportunities</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              )}

            </div>

          </div>

          {/* Post-confirmation helper guide */}
          {isConfirmed && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between animate-in fade-in">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your project DNA is verified. Ready to match with mentors, industry partners, and pilot funding grants.</span>
              </div>
              <button
                onClick={handleTriggerOpportunities}
                className="font-bold underline text-emerald-800 hover:text-emerald-950 shrink-0 ml-3"
              >
                Launch Opportunities →
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
