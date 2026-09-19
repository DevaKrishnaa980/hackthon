import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Building2, 
  Award, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Filter, 
  Mail 
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { dbService } from '../services/firebaseConfig';

interface MentorsDirectoryViewProps {
  users: UserProfile[];
  currentUser: UserProfile;
  onRefresh: () => void;
}

export const MentorsDirectoryView: React.FC<MentorsDirectoryViewProps> = ({
  users,
  currentUser,
  onRefresh,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [contacted, setContacted] = useState<Record<string, boolean>>({});

  // Filter partners/mentors
  const partners = users.filter(u => u.role !== 'student');
  const filtered = partners.filter(p => {
    if (selectedRole === 'All') return true;
    if (selectedRole === 'Mentors') return p.role === 'mentor';
    if (selectedRole === 'Industry') return p.role === 'industry';
    if (selectedRole === 'Institutions') return p.role === 'institution';
    if (selectedRole === 'Funders') return p.role === 'funder';
    return true;
  });

  const handleRequestMentorship = (partner: UserProfile) => {
    dbService.addNotification({
      userId: currentUser.id,
      title: 'Mentorship / Partner Request Submitted',
      message: `Your request was routed to ${partner.fullName} (${partner.organizationName || partner.role}).`,
      type: 'mentor_acceptance',
      actionLink: 'mentors'
    });

    setContacted(prev => ({ ...prev, [partner.id]: true }));
    onRefresh();
  };

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-purple-100 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Accredited Advisory Network</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Mentors & Industry Partners
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-2xl">
              Connect with senior industry architects, university research directors, and test facility managers committed to reviving student prototypes.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl border border-purple-100 shadow-sm">
            {['All', 'Mentors', 'Industry', 'Institutions', 'Funders'].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === role
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                    : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-purple-50/50'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((partner) => {
            const hasRequested = contacted[partner.id];

            return (
              <div
                key={partner.id}
                className="card-saas rounded-3xl p-6 flex flex-col justify-between transition-all hover:border-purple-300 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={partner.photoUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`}
                        alt={partner.fullName}
                        className="w-12 h-12 rounded-2xl object-cover border border-purple-100"
                      />
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                          {partner.fullName}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">{partner.organizationName || partner.college}</p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {partner.role}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {partner.bio}
                  </p>

                  {/* Skills / Offerings */}
                  <div className="mt-4 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Expertise & Facilities:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {partner.skillsOrOfferings?.map((s) => (
                        <span key={s} className="px-2.5 py-1 text-[10px] bg-purple-50/70 text-purple-800 rounded-xl border border-purple-100 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="mt-6 pt-4 border-t border-purple-100 flex items-center justify-between">
                  <span className="text-[11px] text-purple-700 font-semibold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    <span>Open to Advising</span>
                  </span>

                  {hasRequested ? (
                    <div className="px-3 py-1.5 rounded-2xl bg-purple-100 text-purple-800 text-xs font-bold flex items-center space-x-1 border border-purple-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" />
                      <span>Request Sent</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRequestMentorship(partner)}
                      className="px-3.5 py-1.5 rounded-2xl font-bold text-white bg-purple-600 hover:bg-purple-700 text-xs transition-all shadow-md shadow-purple-500/25 flex items-center space-x-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Connect</span>
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
