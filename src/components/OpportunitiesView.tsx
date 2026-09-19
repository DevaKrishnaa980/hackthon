import React, { useState } from 'react';
import { 
  DollarSign, 
  Sparkles, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  Award,
  Layers
} from 'lucide-react';
import { UserProfile } from '../types';
import { dbService } from '../services/firebaseConfig';

interface OpportunitiesViewProps {
  currentUser: UserProfile;
  onRefresh: () => void;
}

interface OpportunityItem {
  id: string;
  title: string;
  organization: string;
  type: 'Grant' | 'Sandbox Testbed' | 'Corporate Sponsorship' | 'Incubation';
  amountOrResource: string;
  deadline: string;
  domain: string;
  description: string;
  eligibility: string;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({ currentUser, onRefresh }) => {
  const [applied, setApplied] = useState<Record<string, boolean>>({});

  const opportunities: OpportunityItem[] = [
    {
      id: 'opp_1',
      title: 'National Hackathon Translation Grant',
      organization: 'Department of Science & Technology',
      type: 'Grant',
      amountOrResource: '$25,000 - $50,000 Non-Dilutive Grant',
      deadline: 'October 30, 2026',
      domain: 'Hardware & IoT, CleanTech, Disaster Management',
      description: 'Accelerate student academic and hackathon prototypes through PCB fabrication, stress chamber validation, and industrial design.',
      eligibility: 'Level 2 (Prototype) or Level 3 (Tested) student-led projects.'
    },
    {
      id: 'opp_2',
      title: 'Municipal Urban Resilience Testbed Pilot',
      organization: 'Smart Cities Mission & City Council',
      type: 'Sandbox Testbed',
      amountOrResource: 'Host Infrastructure & Telemetry Access',
      deadline: 'Rolling Admission',
      domain: 'Disaster Management, Smart City, Water Management',
      description: 'Install sensor hardware and edge AI telemetry on city storm channels and public bridges for 90-day real-world validation.',
      eligibility: 'Projects with working prototypes and faculty mentor approval.'
    },
    {
      id: 'opp_3',
      title: 'EV Powertrain & Battery Reliability Challenge',
      organization: 'Continental Clean Mobility Consortium',
      type: 'Corporate Sponsorship',
      amountOrResource: '$40,000 Equipment & Battery Lab Access',
      deadline: 'November 15, 2026',
      domain: 'Electric Vehicles, Energy Storage',
      description: 'Corporate engineering mentorship, hardware component testing in accredited climate chambers, and potential OEM acquisition.',
      eligibility: 'Student innovators in electrical, mechatronics, or software BMS.'
    },
    {
      id: 'opp_4',
      title: 'Precision AgriTech Soil & Drone Fellowship',
      organization: 'AgriFuture Innovation Fund',
      type: 'Incubation',
      amountOrResource: '$20,000 Grant + 100-Acre Testbed',
      deadline: 'December 1, 2026',
      domain: 'Agriculture, Robotics, Satellite Imaging',
      description: 'Direct field testing with cooperative farmers, cloud server credits, and regulatory advisory for commercial deployment.',
      eligibility: 'Teams with working hardware or ML crop health models.'
    }
  ];

  const handleApply = (opp: OpportunityItem) => {
    dbService.addNotification({
      userId: currentUser.id,
      title: `Grant Application Submitted`,
      message: `Your project dossier was sent to ${opp.organization} for "${opp.title}".`,
      type: 'new_recommendation',
      actionLink: 'opportunities'
    });

    setApplied(prev => ({ ...prev, [opp.id]: true }));
    onRefresh();
  };

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="pb-6 border-b border-purple-100">
          <div className="flex items-center space-x-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-4 h-4 text-purple-600" />
            <span>Second-Life Translation Capital</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Funding & Testbed Opportunities
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            Non-dilutive prototype grants, municipal sandboxes, and corporate testing labs looking to sponsor promising student innovations.
          </p>
        </div>

        {/* Opportunity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((opp) => {
            const isApplied = applied[opp.id];

            return (
              <div
                key={opp.id}
                className="card-saas rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all hover:border-purple-300 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 text-[11px] font-bold uppercase rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {opp.type}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-600" />
                      <span>Deadline: {opp.deadline}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{opp.organization}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Award / Resource Value</div>
                    <div className="text-sm font-extrabold text-purple-700 mt-0.5">{opp.amountOrResource}</div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="text-[11px] text-slate-500">
                    <strong className="text-slate-700">Eligibility:</strong> {opp.eligibility}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-purple-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]">
                    {opp.domain}
                  </span>

                  {isApplied ? (
                    <div className="px-4 py-2 rounded-2xl bg-purple-100 text-purple-800 text-xs font-bold flex items-center space-x-1.5 border border-purple-200">
                      <CheckCircle2 className="w-4 h-4 text-purple-700" />
                      <span>Application Lodged</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(opp)}
                      className="px-4 py-2.5 rounded-2xl font-bold text-white bg-purple-600 hover:bg-purple-700 text-xs transition-all shadow-md shadow-purple-500/25 flex items-center space-x-1.5"
                    >
                      <span>Submit Project Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
