import React, { useState, useEffect } from 'react';
import { Search, X, FolderGit2, Users, Cpu, ArrowRight } from 'lucide-react';
import { Project, UserProfile } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  users: UserProfile[];
  onSelectProject: (projectId: string) => void;
  onSelectMentor: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  projects,
  users,
  onSelectProject,
  onSelectMentor,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProjects = query
    ? projects.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.domain.toLowerCase().includes(query.toLowerCase()) ||
        p.technologies.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    : projects.slice(0, 4);

  const filteredMentors = query
    ? users.filter(u => u.role !== 'student' && (
        u.fullName.toLowerCase().includes(query.toLowerCase()) ||
        (u.organizationName && u.organizationName.toLowerCase().includes(query.toLowerCase())) ||
        (u.skillsOrOfferings && u.skillsOrOfferings.some(s => s.toLowerCase().includes(query.toLowerCase())))
      ))
    : users.filter(u => u.role !== 'student').slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in">
      <div className="bg-white border border-purple-100 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
        
        {/* Search Input Bar */}
        <div className="relative p-4 border-b border-purple-100 flex items-center bg-purple-50/30">
          <Search className="w-5 h-5 text-purple-500 absolute left-6" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, domains (EV, Disaster), tech (LoRaWAN, PyTorch), mentors..."
            className="w-full pl-12 pr-10 py-2.5 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
          />
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-purple-100/50 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
          
          {/* Projects */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-2">
              Projects & Innovations
            </span>
            <div className="space-y-1">
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p.id);
                    onClose();
                  }}
                  className="p-3 rounded-2xl hover:bg-purple-50/70 cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs group-hover:text-purple-700 transition-colors">{p.title}</div>
                      <div className="text-[11px] text-slate-500">{p.domain} • Stage: {p.stage}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              ))}
            </div>
          </div>

          {/* Mentors */}
          <div className="pt-3 border-t border-purple-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-2">
              Mentors & Industry Partners
            </span>
            <div className="space-y-1">
              {filteredMentors.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    onSelectMentor();
                    onClose();
                  }}
                  className="p-3 rounded-2xl hover:bg-purple-50/70 cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs group-hover:text-purple-700 transition-colors">{m.fullName}</div>
                      <div className="text-[11px] text-slate-500">{m.organizationName || m.role}</div>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-purple-700 px-2 py-0.5 rounded-lg bg-purple-100">
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-3 bg-purple-50/40 border-t border-purple-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="font-medium">Navigate with mouse or keyboard</span>
          <span className="px-2 py-0.5 bg-white border border-purple-100 rounded-md font-semibold text-[10px] text-slate-600 shadow-2xs">ESC to close</span>
        </div>

      </div>
    </div>
  );
};
