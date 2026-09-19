import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  RotateCcw,
  ExternalLink,
  ChevronRight,
  PlusCircle,
  Cpu
} from 'lucide-react';
import { Project, ProjectStage, RequirementType } from '../types';

interface ProjectDiscoveryViewProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onOpenUpload: () => void;
}

const LIFECYCLE_STAGES = [
  { key: 'idea', label: 'IDEA' },
  { key: 'hackathon', label: 'HACKATHON' },
  { key: 'prototype', label: 'PROTOTYPE' },
  { key: 'mvp', label: 'MVP' },
  { key: 'pilot', label: 'PILOT' },
  { key: 'impact', label: 'IMPACT' }
];

export const ProjectDiscoveryView: React.FC<ProjectDiscoveryViewProps> = ({
  projects,
  onSelectProject,
  onOpenUpload,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedTech, setSelectedTech] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [selectedNeed, setSelectedNeed] = useState<string>('All');
  const [selectedCollege, setSelectedCollege] = useState<string>('All');

  // Dynamic filter lists derived from data
  const domains = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => {
      if (p.domain) set.add(p.domain);
    });
    return ['All', ...Array.from(set).sort()];
  }, [projects]);

  const technologiesList = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => {
      p.technologies?.forEach(t => set.add(t));
    });
    return ['All', ...Array.from(set).sort()];
  }, [projects]);

  const collegesList = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => {
      if (p.ownerCollege) set.add(p.ownerCollege);
    });
    return ['All', ...Array.from(set).sort()];
  }, [projects]);

  const stagesList = ['All', 'Idea', 'Prototype', 'MVP / Tested', 'Pilot', 'Deployment'];

  const needsList = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => {
      p.requirements?.forEach(r => set.add(r));
    });
    return ['All', ...Array.from(set).sort()];
  }, [projects]);

  // Helper to map project stage to lifecycle index
  const getStageIndex = (stage: ProjectStage): number => {
    switch (stage) {
      case 'idea': return 1; // Hackathon / Ideation phase
      case 'prototype': return 2; // PROTOTYPE
      case 'tested': return 3; // MVP
      case 'pilot': return 4; // PILOT
      case 'deployment': return 5; // IMPACT
      default: return 2;
    }
  };

  const getStageDisplayName = (stage: ProjectStage): string => {
    switch (stage) {
      case 'idea': return 'Idea / Hackathon';
      case 'prototype': return 'Prototype';
      case 'tested': return 'MVP';
      case 'pilot': return 'Pilot';
      case 'deployment': return 'Impact Ready';
      default: return stage;
    }
  };

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Must be marked discoverable (or default to true if undefined)
      if (p.isDiscoverable === false) return false;

      // 1. Search Query
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchDomain = p.domain?.toLowerCase().includes(q) || false;
        const matchDesc = 
          (p.problemStatement && p.problemStatement.toLowerCase().includes(q)) || 
          (p.proposedSolution && p.proposedSolution.toLowerCase().includes(q)) || 
          false;
        const matchTech = p.technologies?.some(t => t.toLowerCase().includes(q)) || false;
        const matchCollege = p.ownerCollege?.toLowerCase().includes(q) || false;
        const matchOwner = p.ownerName?.toLowerCase().includes(q) || false;

        if (!matchTitle && !matchDomain && !matchDesc && !matchTech && !matchCollege && !matchOwner) {
          return false;
        }
      }

      // 2. Domain Filter
      if (selectedDomain !== 'All' && p.domain !== selectedDomain) {
        return false;
      }

      // 3. Technology Filter
      if (selectedTech !== 'All' && !p.technologies?.includes(selectedTech)) {
        return false;
      }

      // 4. Development Stage Filter
      if (selectedStage !== 'All') {
        if (selectedStage === 'Idea' && p.stage !== 'idea') return false;
        if (selectedStage === 'Prototype' && p.stage !== 'prototype') return false;
        if (selectedStage === 'MVP / Tested' && p.stage !== 'tested') return false;
        if (selectedStage === 'Pilot' && p.stage !== 'pilot') return false;
        if (selectedStage === 'Deployment' && p.stage !== 'deployment') return false;
      }

      // 5. Project Need Filter
      if (selectedNeed !== 'All' && !p.requirements?.includes(selectedNeed as RequirementType)) {
        return false;
      }

      // 6. College Filter
      if (selectedCollege !== 'All' && p.ownerCollege !== selectedCollege) {
        return false;
      }

      return true;
    });
  }, [projects, searchTerm, selectedDomain, selectedTech, selectedStage, selectedNeed, selectedCollege]);

  const hasActiveFilters = 
    searchTerm.trim() !== '' || 
    selectedDomain !== 'All' || 
    selectedTech !== 'All' || 
    selectedStage !== 'All' || 
    selectedNeed !== 'All' || 
    selectedCollege !== 'All';

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDomain('All');
    setSelectedTech('All');
    setSelectedStage('All');
    setSelectedNeed('All');
    setSelectedCollege('All');
  };

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-800 selection:bg-purple-200 selection:text-purple-900 py-12 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-purple-200/80 text-purple-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span>PROJECT IDEATEC DIRECTORY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Discover Student Innovation
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Explore promising projects looking for mentorship, collaboration and opportunities.
          </p>
        </div>

        {/* SEARCH & FILTERS CONTAINER */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100/90 shadow-2xs mb-10 space-y-6">
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="search-projects-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-12 pr-4 py-3.5 bg-purple-50/40 border border-purple-100/80 focus:border-purple-400 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>

          {/* 5 Filters: Domain, Technology, Development Stage, Project Need, College */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* 1. Domain */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Domain
              </label>
              <select
                id="filter-domain"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-purple-100/90 focus:border-purple-400 rounded-xl text-xs text-slate-700 focus:outline-none transition-colors"
              >
                {domains.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* 2. Technology */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Technology
              </label>
              <select
                id="filter-technology"
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-purple-100/90 focus:border-purple-400 rounded-xl text-xs text-slate-700 focus:outline-none transition-colors"
              >
                {technologiesList.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* 3. Development Stage */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Development Stage
              </label>
              <select
                id="filter-stage"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-purple-100/90 focus:border-purple-400 rounded-xl text-xs text-slate-700 focus:outline-none transition-colors"
              >
                {stagesList.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* 4. Project Need */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Project Need
              </label>
              <select
                id="filter-need"
                value={selectedNeed}
                onChange={(e) => setSelectedNeed(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-purple-100/90 focus:border-purple-400 rounded-xl text-xs text-slate-700 focus:outline-none transition-colors"
              >
                {needsList.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* 5. College */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                College
              </label>
              <select
                id="filter-college"
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-purple-100/90 focus:border-purple-400 rounded-xl text-xs text-slate-700 focus:outline-none transition-colors"
              >
                {collegesList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Reset Filters Toolbar */}
          {hasActiveFilters && (
            <div className="pt-2 flex items-center justify-between border-t border-purple-50 text-xs">
              <span className="text-slate-500 font-medium">
                Filtering by active search criteria
              </span>
              <button
                onClick={handleResetFilters}
                className="text-purple-700 hover:text-purple-900 font-bold flex items-center space-x-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            </div>
          )}

        </div>

        {/* RESULTS BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-1 text-xs">
          <p className="text-slate-600 font-medium">
            Showing <strong className="text-slate-900 font-bold text-sm">{filteredProjects.length}</strong> {filteredProjects.length === 1 ? 'project' : 'projects'}
          </p>

          <button
            onClick={onOpenUpload}
            className="inline-flex items-center space-x-2 text-purple-700 font-bold hover:text-purple-900 transition-colors self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit a New Student Project</span>
          </button>
        </div>

        {/* PROJECTS GRID */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-purple-100/90 shadow-2xs p-8">
            <Cpu className="w-12 h-12 text-purple-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No projects found matching criteria</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
              Try clearing some of your filters or searching for broader terms.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const currentStageIdx = getStageIndex(project.stage);
              const stageLabel = getStageDisplayName(project.stage);

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-3xl border border-purple-100/90 p-7 shadow-2xs hover:shadow-lg hover:border-purple-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Metadata: Domain & Stage Badges */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100">
                        {project.domain}
                      </span>

                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {stageLabel}
                      </span>
                    </div>

                    {/* Project Name */}
                    <h2 
                      onClick={() => onSelectProject(project.id)}
                      className="text-xl font-extrabold text-slate-900 hover:text-purple-700 transition-colors cursor-pointer tracking-tight"
                    >
                      {project.title}
                    </h2>

                    {/* College & Author */}
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                      {project.ownerCollege || 'Engineering Institute'} • By {project.ownerName}
                    </p>

                    {/* Technologies */}
                    <div className="mt-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies?.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-purple-50/70 text-purple-800 rounded-lg border border-purple-100/80"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies && project.technologies.length > 4 && (
                          <span className="px-2 py-1 text-[10px] font-semibold text-slate-400">
                            +{project.technologies.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed line-clamp-3 font-normal">
                      {project.problemStatement || project.proposedSolution}
                    </p>

                    {/* Required Support / Needs */}
                    <div className="mt-5 p-3.5 rounded-2xl bg-[#FAF8FF] border border-purple-100/80">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                        Needs:
                      </span>
                      <div className="space-y-1">
                        {project.requirements && project.requirements.length > 0 ? (
                          project.requirements.slice(0, 3).map((req) => (
                            <div key={req} className="text-xs font-semibold text-purple-900 flex items-center space-x-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                              <span>{req}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">Open to general mentorship</span>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* BOTTOM SECTION: PROGRESS INDICATOR & VIEW PROJECT BUTTON */}
                  <div className="mt-6 pt-5 border-t border-purple-50 space-y-4">
                    
                    {/* Project IdeaTec Progress Indicator: IDEA → HACKATHON → PROTOTYPE → MVP → PILOT → IMPACT */}
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <span>Project IdeaTec Progress</span>
                        <span className="text-purple-700 font-bold">{stageLabel}</span>
                      </div>

                      {/* Stepper Display */}
                      <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold font-mono tracking-tight text-slate-400">
                        {LIFECYCLE_STAGES.map((stage, idx) => {
                          const isCurrent = idx === currentStageIdx;
                          const isPast = idx < currentStageIdx;

                          return (
                            <React.Fragment key={stage.key}>
                              <span 
                                className={`transition-colors ${
                                  isCurrent 
                                    ? 'text-purple-700 font-extrabold underline decoration-2 underline-offset-4' 
                                    : isPast 
                                      ? 'text-purple-500/80' 
                                      : 'text-slate-300'
                                }`}
                              >
                                {stage.label}
                              </span>
                              {idx < LIFECYCLE_STAGES.length - 1 && (
                                <span className={isPast ? 'text-purple-400' : 'text-slate-200'}>
                                  →
                                </span>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>

                    {/* View Project Button */}
                    <button
                      id={`view-project-btn-${project.id}`}
                      onClick={() => onSelectProject(project.id)}
                      className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition-all flex items-center justify-center space-x-2"
                    >
                      <span>View Project</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
