import React from 'react';
import { Sparkles, Shield, Cpu, Code2, Flame, Heart, ArrowRight } from 'lucide-react';

interface FooterProps {
  onOpenTechModal: () => void;
  onOpenFirebaseModal: () => void;
  onNavigate?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTechModal, onOpenFirebaseModal, onNavigate }) => {
  const handleNav = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white border-t border-purple-100 text-slate-500 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          
          <div className="space-y-3 sm:col-span-2">
            <div 
              className="flex items-center space-x-2.5 text-slate-900 font-bold text-base cursor-pointer"
              onClick={() => handleNav('home')}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#B76BE8] to-[#7C4DFF] flex items-center justify-center text-white shadow-sm shadow-purple-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="tracking-tight font-extrabold text-lg">IdeaTec</span>
            </div>
            <p className="text-purple-700 font-semibold text-xs italic">
              "Give Every Student Project a Second Life."
            </p>
            <p className="text-slate-600 text-xs max-w-md leading-relaxed font-normal">
              IdeaTec is an AI-powered national platform designed to prevent student hackathon, academic, and innovation projects from being abandoned after competitions. Transforming prototypes into real-world pilot deployments.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">Platform Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-purple-700 font-medium transition-colors">
                  Home Page
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-purple-700 font-medium transition-colors">
                  About / Mission
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('how-it-works')} className="hover:text-purple-700 font-medium transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('projects')} className="hover:text-purple-700 font-medium transition-colors">
                  Project Discovery
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('fusion')} className="hover:text-purple-700 font-medium transition-colors">
                  Project Fusion
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('login')} className="hover:text-purple-700 font-medium transition-colors">
                  Login / Registration
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">Role Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('student-dashboard')} className="hover:text-purple-700 font-medium transition-colors">
                  Student Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('mentor-dashboard')} className="hover:text-purple-700 font-medium transition-colors">
                  Mentor Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('industry-dashboard')} className="hover:text-purple-700 font-medium transition-colors">
                  Industry Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('admin-dashboard')} className="hover:text-purple-700 font-medium transition-colors">
                  Admin Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('workspace')} className="hover:text-purple-700 font-medium transition-colors">
                  Collaboration Workspace
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('opportunities')} className="hover:text-purple-700 font-medium transition-colors">
                  Grants & Sandboxes
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">System Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenTechModal} className="hover:text-purple-700 font-medium transition-colors flex items-center space-x-1.5">
                  <Code2 className="w-3.5 h-3.5 text-purple-500" />
                  <span>Java Spring Boot REST</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenTechModal} className="hover:text-purple-700 font-medium transition-colors flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                  <span>C++ SIMD Vector Engine</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenFirebaseModal} className="hover:text-purple-700 font-medium transition-colors flex items-center space-x-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Cloud Firestore Integration</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenTechModal} className="hover:text-purple-700 font-medium transition-colors flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Gemini 2.5 Flash AI DNA</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-purple-100 flex flex-col sm:flex-row items-center justify-between text-slate-500 space-y-4 sm:space-y-0 text-xs">
          <p>© 2026 IdeaTec Ecosystem. Empowering Student Innovation.</p>
          <div className="flex items-center space-x-4 font-medium text-purple-700">
            <span>Engineered for zero student innovation abandonment</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
