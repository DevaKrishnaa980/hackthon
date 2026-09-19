import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Dna, 
  Compass, 
  Calendar,
  FileCode, 
  Users, 
  Building2, 
  Award,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';
import { Project, EcosystemStats, UserProfile } from '../types';

interface HomeViewProps {
  onOpenUpload: () => void;
  onNavigate: (tab: string) => void;
  onSelectProject: (projectId: string) => void;
  projects: Project[];
  stats: EcosystemStats;
  currentUser?: UserProfile | null;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenUpload,
  onNavigate,
  onSelectProject,
  projects,
  stats,
  currentUser
}) => {
  const processSteps = [
    {
      num: '01',
      title: 'Upload',
      desc: 'Submit your hackathon deck, GitHub repository, or hardware schematics directly to the platform.'
    },
    {
      num: '02',
      title: 'Understand',
      desc: 'AI deeply analyzes the code, architecture, and maturity level to extract structured Project DNA.'
    },
    {
      num: '03',
      title: 'Connect',
      desc: 'Algorithmic smart matching links your prototype with domain-aligned faculty mentors and industry labs.'
    },
    {
      num: '04',
      title: 'Develop',
      desc: 'Collaborate in shared workspaces with clear milestone roadmaps and accredited testing facilities.'
    },
    {
      num: '05',
      title: 'Impact',
      desc: 'Deploy functional solutions in live municipal pilots, commercial spinouts, and funded grants.'
    }
  ];

  const pillarCards = [
    {
      id: 'dna',
      icon: Dna,
      title: 'Project DNA',
      subtitle: 'AI understands the project.',
      description: 'Automated extraction of technical architectures, library dependencies, maturity levels (L1–L5), and missing puzzle pieces without manual paperwork.',
      tag: 'Analysis Engine'
    },
    {
      id: 'matching',
      icon: Compass,
      title: 'Smart Matching',
      subtitle: 'Find relevant mentors and opportunities.',
      description: 'High-speed vector similarity algorithms match student solutions directly with verified academic mentors, corporate labs, and active pilot funding.',
      tag: 'Vector Match'
    },
    {
      id: 'roadmap',
      icon: Calendar,
      title: 'Afterlife Roadmap',
      subtitle: 'Track the project beyond the hackathon.',
      description: 'Milestone tracking, verification sign-offs, and live testbed telemetry keeping project momentum alive long after the demo day ends.',
      tag: 'Lifecycle Scaffolding'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-800 selection:bg-purple-200 selection:text-purple-900">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-14 pb-16 lg:pt-20 lg:pb-24">
        {/* Soft background ambient gradient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-b from-purple-200/30 via-violet-100/20 to-transparent blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline & Subheadline */}
            <div className="lg:col-span-6 text-left">
              
              {/* Pill badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-purple-200/80 text-purple-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>AI-POWERED INNOVATION ECOSYSTEM</span>
              </div>

              {/* Main heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-6">
                Your Hackathon{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800">
                  Shouldn't Be the End.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed max-w-xl font-normal">
                Project Afterlife helps promising student innovations move beyond competitions by connecting them with mentors, industries, institutions and funding opportunities.
              </p>

              {/* Primary & Secondary Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  id="hero-submit-btn"
                  onClick={onOpenUpload}
                  className="px-7 py-3.5 rounded-2xl font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 shadow-lg shadow-purple-500/25 transition-all flex items-center space-x-2 text-sm"
                >
                  <span>Submit Your Project</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-dashboard-btn"
                  onClick={() => onNavigate('student-dashboard')}
                  className="px-7 py-3.5 rounded-2xl font-semibold text-purple-800 bg-purple-50 hover:bg-purple-100/80 border border-purple-200/90 shadow-xs transition-all text-sm flex items-center space-x-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-purple-600" />
                  <span>Go to Dashboard</span>
                </button>
              </div>

            </div>

            {/* Right Column: Connected-Node Illustration */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              <div className="w-full max-w-lg p-6 sm:p-8 bg-white/95 rounded-3xl border border-purple-100/90 shadow-[0_12px_40px_-15px_rgba(124,77,255,0.12)] backdrop-blur-sm relative">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-5 border-b border-purple-50 mb-6">
                  <div className="flex items-center space-x-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                    <span>Translation Pipeline</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">Zero-Abandonment Flow</span>
                </div>

                {/* Node Pipeline Representation */}
                <div className="space-y-4 relative">
                  <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-purple-500 via-indigo-500 to-purple-600 opacity-25" />

                  {/* 1. Student Project Node */}
                  <div className="relative flex items-center space-x-4 p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 hover:border-purple-200 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-purple-200 flex items-center justify-center text-purple-700 shadow-xs shrink-0 z-10">
                      <FileCode className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900">Student Project</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                          Step 01
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Hackathon prototype & code repository</p>
                    </div>
                  </div>

                  {/* 2. Mentor Node */}
                  <div className="relative flex items-center space-x-4 p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 hover:border-purple-200 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-purple-200 flex items-center justify-center text-purple-700 shadow-xs shrink-0 z-10">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900">Mentor</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                          Step 02
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Faculty guidance & technical validation</p>
                    </div>
                  </div>

                  {/* 3. Industry Node */}
                  <div className="relative flex items-center space-x-4 p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 hover:border-purple-200 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-purple-200 flex items-center justify-center text-purple-700 shadow-xs shrink-0 z-10">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900">Industry</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                          Step 03
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Enterprise testbeds & datasets</p>
                    </div>
                  </div>

                  {/* 4. Impact Node */}
                  <div className="relative flex items-center space-x-4 p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 hover:border-purple-200 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-purple-600 border border-purple-700 flex items-center justify-center text-white shadow-xs shrink-0 z-10">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900">Impact</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Outcome
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Municipal pilots & funded spinouts</p>
                    </div>
                  </div>

                </div>

                {/* Footer telemetry */}
                <div className="mt-6 pt-4 border-t border-purple-50 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Continuous Translation</span>
                  </span>
                  <span className="font-semibold text-purple-700">Project IdeaTec</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PROCESS SECTION: 01 Upload, 02 Understand, 03 Connect, 04 Develop, 05 Impact */}
      <section className="py-20 bg-white border-y border-purple-100/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Simple 5-Step Process</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              From Competition Prototype to Production
            </h2>
          </div>

          {/* Clean Numbered Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {processSteps.map((step) => (
              <div 
                key={step.num}
                className="bg-white p-6 rounded-2xl border border-purple-100 hover:border-purple-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl font-extrabold text-purple-600 font-mono mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* THREE CARDS SECTION: "Give Good Ideas a Second Life." */}
      <section className="py-24 bg-[#FAF8FF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Give Good Ideas a Second Life.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 font-normal">
              Intelligent scaffolding that translates raw hackathon passion into verified engineering deployments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillarCards.map((card) => {
              const IconC = card.icon;
              return (
                <div
                  key={card.id}
                  className="bg-white p-8 rounded-3xl border border-purple-100/90 shadow-2xs hover:shadow-lg hover:border-purple-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-6">
                      <IconC className="w-6 h-6" />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                      {card.tag}
                    </span>

                    <h3 className="text-xl font-extrabold text-slate-900 mt-4 mb-2">
                      {card.title}
                    </h3>

                    <p className="text-sm font-semibold text-purple-700 mb-3">
                      {card.subtitle}
                    </p>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-purple-50">
                    <button
                      onClick={() => {
                        if (card.id === 'dna') onNavigate('projects');
                        else if (card.id === 'matching') onNavigate('matching');
                        else onNavigate('projects');
                      }}
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center space-x-1"
                    >
                      <span>Explore {card.title}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-20 bg-white border-t border-purple-100/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="p-8 sm:p-14 rounded-3xl bg-purple-50/60 border border-purple-100/90">
            
            <div className="w-12 h-12 rounded-2xl bg-white text-purple-700 border border-purple-200 flex items-center justify-center mx-auto mb-6 shadow-xs">
              <Zap className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Have a project that deserves another chance?
            </h2>

            <p className="text-sm text-slate-600 max-w-lg mx-auto mb-8 leading-relaxed font-normal">
              Connect with experienced mentors, unlock accredited testbeds, and take your innovation from an abandoned repository to real-world pilot deployment.
            </p>

            <button
              id="bottom-cta-ideatec-btn"
              onClick={onOpenUpload}
              className="px-8 py-4 rounded-2xl font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 shadow-lg shadow-purple-500/25 transition-all text-sm inline-flex items-center space-x-2"
            >
              <span>Start Your Project IdeaTec</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </div>
      </section>

    </div>
  );
};
