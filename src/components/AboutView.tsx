import React from 'react';
import { 
  ArrowRight, 
  ArrowDown, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface AboutViewProps {
  onNavigate: (tab: string) => void;
  onOpenUpload: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate, onOpenUpload }) => {
  const visualFlowSteps = [
    {
      title: 'Hackathon',
      description: 'Intense 24-48 hour sprint generating creative concepts and initial working code.'
    },
    {
      title: 'Prototype',
      description: 'A functional proof-of-concept built and demonstrated to competition judges.'
    },
    {
      title: 'Connection',
      description: 'AI comprehension matches the project to verified mentors, labs, and domain partners.'
    },
    {
      title: 'Development',
      description: 'Guided milestones, technical testing, and resource scaffolding bridge the capability gaps.'
    },
    {
      title: 'Impact',
      description: 'Field deployments, published research, funded pilots, or sustainable spinouts.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-800 selection:bg-purple-200 selection:text-purple-900 pb-24">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24">
        {/* Soft background ambient gradient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[360px] bg-gradient-to-b from-purple-200/30 via-violet-100/20 to-transparent blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-purple-200/80 text-purple-700 text-xs font-bold uppercase tracking-wider mb-8 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span>ABOUT PROJECT IDEATEC</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-8">
            Great Ideas Shouldn't Disappear{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800">
              After Demo Day.
            </span>
          </h1>

          {/* Problem Explanation */}
          <div className="max-w-2xl mx-auto space-y-4 text-base sm:text-xl text-slate-600 leading-relaxed font-normal">
            <p>
              Thousands of student projects are created during hackathons and academic events.
            </p>
            <p>
              Many promising ideas stop developing after evaluation.
            </p>
            <p className="font-semibold text-purple-900 pt-2 text-lg sm:text-2xl">
              Project IdeaTec provides a path for these projects to continue.
            </p>
          </div>

          {/* Action buttons */}
          <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={onOpenUpload}
              className="px-7 py-3.5 rounded-2xl font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 shadow-lg shadow-purple-500/25 transition-all text-sm inline-flex items-center space-x-2"
            >
              <span>Submit Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className="px-7 py-3.5 rounded-2xl font-semibold text-slate-700 bg-white hover:bg-purple-50/80 border border-purple-200/90 shadow-xs transition-all text-sm inline-flex items-center space-x-1.5"
            >
              <span>Explore Projects</span>
              <ArrowUpRight className="w-4 h-4 text-purple-600" />
            </button>
          </div>

        </div>
      </section>

      {/* SIMPLE VISUAL FLOW SECTION */}
      <section className="py-16 bg-white border-y border-purple-100/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              The Continuity Path
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              How Projects Move Forward
            </h2>
          </div>

          {/* Vertical flow diagram: Hackathon -> Prototype -> Connection -> Development -> Impact */}
          <div className="max-w-md mx-auto space-y-3">
            {visualFlowSteps.map((step, index) => {
              const isLast = index === visualFlowSteps.length - 1;
              return (
                <React.Fragment key={step.title}>
                  <div className={`p-5 rounded-2xl border transition-all ${
                    isLast 
                      ? 'bg-purple-50/80 border-purple-200 text-purple-950 shadow-xs' 
                      : 'bg-white border-purple-100/90 shadow-2xs'
                  }`}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                        {step.title}
                      </h3>
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isLast 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-purple-100/70 text-purple-700'
                      }`}>
                        Stage 0{index + 1}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed font-normal">
                      {step.description}
                    </p>
                  </div>

                  {!isLast && (
                    <div className="flex justify-center py-1">
                      <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 border border-purple-200/80 flex items-center justify-center">
                        <ArrowDown className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

        </div>
      </section>

      {/* THREE CORE SECTIONS: THE PROBLEM, THE SOLUTION, THE VISION */}
      <section className="py-20 lg:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-20">
        
        {/* 1. THE PROBLEM */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-purple-100/90 shadow-2xs">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-3">
            THE PROBLEM
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
            Projects often disappear after competitions.
          </h2>
          <div className="space-y-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            <p>
              Hackathons, design contests, and academic capstones generate extraordinary bursts of student creativity. Teams spend intense weekends and semesters constructing functioning hardware nodes, diagnostic apps, and software tools.
            </p>
            <p>
              Yet when the final presentations end and the awards are announced, the energy inevitably drops. Without dedicated continuity, student teams disband, repositories sit unmaintained, and high-potential solutions are archived into digital obscurity as shelfware.
            </p>
            <p>
              The challenge isn't a lack of talent or good ideas—it is the absence of a bridge that carries prototypes past demo day into practical validation.
            </p>
          </div>
        </div>

        {/* 2. THE SOLUTION */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-purple-100/90 shadow-2xs">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-widest block mb-3">
            THE SOLUTION
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
            Project IdeaTec understands projects and connects them with relevant support.
          </h2>
          <div className="space-y-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            <p>
              Project IdeaTec changes the trajectory of student innovation by ingesting pitch decks, code repositories, and technical summaries directly.
            </p>
            <p>
              Using structured AI Project DNA, the platform understands the technical stack, maturity level, and missing puzzle pieces of each submission. It replaces manual paperwork with automated comprehension.
            </p>
            <p>
              Once understood, projects are intelligently paired with experienced academic advisors, corporate testbeds, municipal programs, and non-dilutive funding sources tailored to their exact stage of readiness.
            </p>
          </div>
        </div>

        {/* 3. THE VISION */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-purple-100/90 shadow-2xs">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-3">
            THE VISION
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
            Create an ecosystem where student innovations can continue toward research, pilots, startups or real-world adoption.
          </h2>
          <div className="space-y-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            <p>
              We believe every promising technical idea conceived by students deserves a continuous pathway to make a difference in the physical and digital world.
            </p>
            <p>
              Our vision is a national innovation infrastructure where hackathons and capstones are not finish lines, but the opening chapter of real-world translation.
            </p>
            <p>
              Whether an innovation evolves into peer-reviewed research, a municipal field trial, a commercial spinout, or an open-source standard, Project IdeaTec ensures student effort converts into lasting impact.
            </p>
          </div>
        </div>

      </section>

      {/* MINIMAL CLOSING SECTION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-purple-50/60 border border-purple-100/90">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Have a project that deserves to move forward?
          </h3>
          <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed font-normal">
            Submit your prototype today to get structured feedback, discover mentors, and find testing opportunities.
          </p>
          <button
            onClick={onOpenUpload}
            className="px-8 py-3.5 rounded-2xl font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 shadow-lg shadow-purple-500/25 transition-all text-sm inline-flex items-center space-x-2"
          >
            <span>Submit Your Project</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
