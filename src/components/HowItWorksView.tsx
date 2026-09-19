import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowUpRight,
  Upload, 
  Dna, 
  FileText, 
  Compass, 
  Users, 
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

interface HowItWorksViewProps {
  onNavigate: (tab: string) => void;
  onOpenUpload: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onNavigate, onOpenUpload }) => {
  const steps = [
    {
      num: '01',
      title: 'Upload Project',
      description: 'Student uploads PPT, PDF, GitHub, demo or project description.',
      icon: Upload,
      tag: 'Multi-Format Ingestion'
    },
    {
      num: '02',
      title: 'AI Project Analysis',
      description: 'AI understands the problem, solution, domain, technology and development stage.',
      icon: Dna,
      tag: 'Semantic Comprehension'
    },
    {
      num: '03',
      title: 'Project Passport',
      description: "The platform creates a structured Project Passport containing the project's important information.",
      icon: FileText,
      tag: 'Structured Specification'
    },
    {
      num: '04',
      title: 'Smart Matching',
      description: 'The platform identifies relevant mentors, industries, institutions and funding opportunities.',
      icon: Compass,
      tag: 'Intelligent Alignment'
    },
    {
      num: '05',
      title: 'Collaboration',
      description: 'Students and supporters connect through requests, messaging, tasks and milestones.',
      icon: Users,
      tag: 'Workspace & Milestones'
    },
    {
      num: '06',
      title: 'Project Development',
      description: 'The project progresses from prototype to MVP, pilot or real-world adoption.',
      icon: TrendingUp,
      tag: 'Lifecycle Scaffolding'
    }
  ];

  const timelineStages = [
    { name: 'IDEA', description: 'Initial concept & vision' },
    { name: 'HACKATHON', description: 'Sprint prototype build' },
    { name: 'PROTOTYPE', description: 'Functional working model' },
    { name: 'MVP', description: 'Tested minimal product' },
    { name: 'PILOT', description: 'Field sandbox deployment' },
    { name: 'IMPACT', description: 'Real-world adoption' }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-800 selection:bg-purple-200 selection:text-purple-900 pb-24">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-20 text-center">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[360px] bg-gradient-to-b from-purple-200/30 via-violet-100/20 to-transparent blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-purple-200/80 text-purple-700 text-xs font-bold uppercase tracking-wider mb-8 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span>THE CONTINUITY METHODOLOGY</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            From Hackathon to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800">
              IdeaTec
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            A seamless pathway guiding student innovations from intense hackathon competition sprints into sustained development, mentorship, and impactful field deployments.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={onOpenUpload}
              className="px-7 py-3.5 rounded-2xl font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 shadow-lg shadow-purple-500/25 transition-all text-sm inline-flex items-center space-x-2"
            >
              <span>Upload Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className="px-7 py-3.5 rounded-2xl font-semibold text-slate-700 bg-white hover:bg-purple-50/80 border border-purple-200/90 shadow-xs transition-all text-sm inline-flex items-center space-x-1.5"
            >
              <span>Explore Discoveries</span>
              <ArrowUpRight className="w-4 h-4 text-purple-600" />
            </button>
          </div>

        </div>
      </section>

      {/* 6 LARGE NUMBERED STEPS */}
      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step) => {
            const IconComp = step.icon;
            return (
              <div 
                key={step.num}
                className="bg-white p-8 sm:p-9 rounded-3xl border border-purple-100/90 shadow-2xs hover:shadow-lg hover:border-purple-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl sm:text-4xl font-extrabold text-purple-600 font-mono tracking-tight">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                    {step.tag}
                  </span>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-4 mb-3 tracking-tight">
                    {step.title}
                  </h2>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-purple-50 flex items-center justify-between text-xs text-purple-700 font-semibold">
                  <span>Stage {step.num} of 06</span>
                  <CheckCircle2 className="w-4 h-4 text-purple-500/70" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TIMELINE SECTION (Horizontal on Desktop, Vertical on Mobile) */}
      <section className="py-16 mt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-purple-100/90 shadow-2xs">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              Translational Lifecycle
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              End-to-End Innovation Progression
            </h3>
            <p className="text-slate-500 text-sm mt-2 font-normal">
              Tracking momentum from raw hackathon inspiration to verifiable societal impact.
            </p>
          </div>

          {/* DESKTOP HORIZONTAL TIMELINE */}
          <div className="hidden lg:block">
            <div className="relative pt-6 pb-2">
              
              {/* Horizontal Connector Line */}
              <div className="absolute top-11 left-8 right-8 h-0.5 bg-gradient-to-r from-purple-200 via-indigo-300 to-purple-500" />

              <div className="grid grid-cols-6 gap-2 relative">
                {timelineStages.map((stage, idx) => {
                  const isLast = idx === timelineStages.length - 1;
                  return (
                    <div key={stage.name} className="flex flex-col items-center text-center px-2">
                      
                      {/* Node Indicator */}
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs shadow-xs z-10 mb-4 transition-transform hover:scale-110 ${
                        isLast 
                          ? 'bg-purple-600 text-white border-2 border-purple-700' 
                          : 'bg-white border-2 border-purple-200 text-purple-700'
                      }`}>
                        {idx + 1}
                      </div>

                      {/* Stage Name */}
                      <span className="text-sm font-extrabold text-slate-900 tracking-tight mb-1">
                        {stage.name}
                      </span>

                      {/* Description */}
                      <span className="text-[11px] text-slate-500 leading-snug font-normal">
                        {stage.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stage Arrow Summary */}
            <div className="mt-8 pt-6 border-t border-purple-50 flex items-center justify-center space-x-3 text-xs font-bold text-purple-900 uppercase tracking-wider">
              {timelineStages.map((st, i) => (
                <React.Fragment key={st.name}>
                  <span className={i === timelineStages.length - 1 ? 'text-purple-600' : ''}>
                    {st.name}
                  </span>
                  {i < timelineStages.length - 1 && (
                    <span className="text-purple-300">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* MOBILE / TABLET VERTICAL TIMELINE */}
          <div className="block lg:hidden">
            <div className="relative pl-6 sm:pl-8 space-y-6">
              
              {/* Vertical Connector Line */}
              <div className="absolute top-4 bottom-4 left-3 sm:left-4 w-0.5 bg-gradient-to-b from-purple-200 via-indigo-300 to-purple-500" />

              {timelineStages.map((stage, idx) => {
                const isLast = idx === timelineStages.length - 1;
                return (
                  <div key={stage.name} className="relative flex items-start space-x-4">
                    
                    {/* Node Dot */}
                    <div className={`-ml-6 sm:-ml-8 w-7 h-7 rounded-xl flex items-center justify-center font-bold text-[11px] shadow-xs z-10 shrink-0 ${
                      isLast 
                        ? 'bg-purple-600 text-white border-2 border-purple-700' 
                        : 'bg-white border-2 border-purple-200 text-purple-700'
                    }`}>
                      {idx + 1}
                    </div>

                    <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">
                          {stage.name}
                        </h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                          Step 0{idx + 1}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-normal">
                        {stage.description}
                      </p>
                    </div>

                  </div>
                );
              })}

            </div>

            {/* Stage Arrow Summary Mobile */}
            <div className="mt-8 pt-4 border-t border-purple-50 text-center text-xs font-bold text-purple-900 flex flex-wrap justify-center items-center gap-1.5 uppercase tracking-wider">
              {timelineStages.map((st, i) => (
                <React.Fragment key={st.name}>
                  <span className={i === timelineStages.length - 1 ? 'text-purple-600' : ''}>
                    {st.name}
                  </span>
                  {i < timelineStages.length - 1 && (
                    <span className="text-purple-300">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center mt-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-purple-50/60 border border-purple-100/90">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Ready to give your prototype a second life?
          </h3>
          <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed font-normal">
            Upload your hackathon presentation or repository now to receive an automated Project Passport and tailored mentor matches.
          </p>
          <button
            onClick={onOpenUpload}
            className="px-8 py-3.5 rounded-2xl font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 shadow-lg shadow-purple-500/25 transition-all text-sm inline-flex items-center space-x-2"
          >
            <span>Start Your Project IdeaTec</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
