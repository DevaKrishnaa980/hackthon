import React, { useState } from 'react';
import { 
  GitMerge, 
  MessageSquare, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send, 
  ShieldCheck, 
  Users, 
  PlusCircle, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { CollaborationRecord, UserProfile } from '../types';
import { dbService } from '../services/firebaseConfig';

interface CollaborationWorkspaceViewProps {
  collaborations: CollaborationRecord[];
  currentUser: UserProfile;
  onRefresh: () => void;
}

export const CollaborationWorkspaceView: React.FC<CollaborationWorkspaceViewProps> = ({
  collaborations,
  currentUser,
  onRefresh,
}) => {
  const [selectedCollabId, setSelectedCollabId] = useState<string>(collaborations[0]?.id || '');
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'discussions' | 'milestones' | 'agreements' | 'scheduler'>('discussions');

  const activeCollab = collaborations.find(c => c.id === selectedCollabId) || collaborations[0];

  const handleUpdateStatus = (id: string, status: CollaborationRecord['status']) => {
    dbService.updateCollaborationStatus(id, status);
    onRefresh();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeCollab) return;

    dbService.addNotification({
      userId: activeCollab.senderId === currentUser.id ? activeCollab.receiverId : activeCollab.senderId,
      title: `New Message in ${activeCollab.projectATitle} Fusion`,
      message: `${currentUser.fullName}: "${newMessage.trim()}"`,
      type: 'collaboration_request',
      actionLink: 'collaborations'
    });

    setNewMessage('');
    onRefresh();
  };

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="pb-6 border-b border-purple-100">
          <div className="flex items-center space-x-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-4 h-4 text-purple-600" />
            <span>Module 05: Collaboration Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Inter-Project Co-Development Workspace
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            Coordinate shared milestones, exchange technical telemetries, and ratify IP boundaries between complementary student teams.
          </p>
        </div>

        {collaborations.length === 0 ? (
          <div className="text-center py-24 card-saas rounded-3xl border border-purple-100">
            <GitMerge className="w-12 h-12 text-purple-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No active collaboration proposals</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Visit the Project Fusion Engine to evaluate synergy and propose a co-development partnership with another project team.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Sidebar list of collaborations */}
            <div className="lg:col-span-4 card-saas rounded-3xl p-4 space-y-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block px-1">
                Active Co-Development Threads
              </span>

              <div className="space-y-2">
                {collaborations.map((collab) => {
                  const isSelected = collab.id === activeCollab?.id;
                  const statusColors: Record<CollaborationRecord['status'], string> = {
                    accepted: 'text-purple-700 bg-purple-100 border-purple-200',
                    pending: 'text-amber-700 bg-amber-50 border-amber-200',
                    rejected: 'text-rose-700 bg-rose-50 border-rose-200'
                  };

                  return (
                    <div
                      key={collab.id}
                      onClick={() => setSelectedCollabId(collab.id)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all border text-xs ${
                        isSelected 
                          ? 'bg-purple-50/80 border-purple-300 text-slate-900 shadow-sm'
                          : 'bg-white border-purple-100 text-slate-600 hover:border-purple-200 hover:bg-purple-50/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-purple-700">
                          Synergy: {collab.synergyScore}%
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${statusColors[collab.status]}`}>
                          {collab.status}
                        </span>
                      </div>

                      <div className="font-bold text-slate-900 truncate">
                        {collab.projectATitle} × {collab.projectBTitle}
                      </div>

                      <div className="text-[11px] text-slate-500 mt-1 truncate">
                        Between {collab.senderName} & {collab.receiverName}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Collaboration Detail View */}
            {activeCollab && (
              <div className="lg:col-span-8 card-saas rounded-3xl p-6 sm:p-8 space-y-6">
                
                {/* Proposal Top Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-100">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                        Synergy {activeCollab.synergyScore}%
                      </span>
                      <span className="text-xs text-slate-500">
                        Initiated {new Date(activeCollab.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900">
                      {activeCollab.projectATitle} × {activeCollab.projectBTitle}
                    </h2>
                    
                    <p className="text-xs text-slate-500">
                      Co-leads: <strong className="text-slate-800">{activeCollab.senderName}</strong> & <strong className="text-slate-800">{activeCollab.receiverName}</strong>
                    </p>
                  </div>

                  {/* Status update buttons */}
                  {activeCollab.status === 'pending' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(activeCollab.id, 'accepted')}
                        className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-purple-500/25"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Proposal</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(activeCollab.id, 'rejected')}
                        className="px-4 py-2 rounded-2xl bg-white border border-purple-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {activeCollab.status === 'accepted' && (
                    <div className="px-4 py-2 rounded-2xl bg-purple-100 border border-purple-200 text-purple-800 text-xs font-bold flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-700" />
                      <span>Co-Development Active</span>
                    </div>
                  )}
                </div>

                {/* Subtabs: Discussions, Milestones, Terms, Scheduler */}
                <div className="flex items-center space-x-2 border-b border-purple-100 pb-3 overflow-x-auto text-xs">
                  {[
                    { id: 'discussions', label: 'Project Discussions', icon: MessageSquare },
                    { id: 'milestones', label: 'Shared Milestones', icon: Calendar },
                    { id: 'agreements', label: 'IP Terms & Charter', icon: ShieldCheck },
                    { id: 'scheduler', label: 'Meeting Scheduler', icon: Clock },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 px-3.5 py-2 rounded-2xl font-bold transition-all whitespace-nowrap ${
                          isActive
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-purple-50/60'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* TAB 1: Discussions & Messages */}
                {activeTab === 'discussions' && (
                  <div className="space-y-4">
                    {/* Proposal message */}
                    <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-bold text-slate-800">{activeCollab.senderName} (Proposal Originator)</span>
                        <span>{new Date(activeCollab.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-normal">
                        {activeCollab.message}
                      </p>
                      <div className="p-3 rounded-xl bg-white border border-purple-100 text-[11px] text-purple-700 font-mono">
                        <strong>Target Architecture:</strong> {activeCollab.proposedArchitecture}
                      </div>
                    </div>

                    {/* Message input */}
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Reply with integration specs, hardware schemas, or meeting notes..."
                        className="flex-1 px-4 py-2.5 bg-white border border-purple-100 focus:border-purple-600 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-2xl transition-colors flex items-center space-x-1.5 shadow-md shadow-purple-500/25"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </button>
                    </form>
                  </div>
                )}

                {/* TAB 2: Shared Milestones */}
                {activeTab === 'milestones' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">Milestone 1: Unified REST / MQTT Schema Agreement</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">Map JSON payload fields between sensory nodes and processing gateway</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        COMPLETED
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">Milestone 2: Joint Benchtop Simulation Test</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">Run 48-hour continuous stress test in university electronics laboratory</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        IN PROGRESS
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">Milestone 3: Field Pilot Deployment Dossier</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">Joint application to municipal innovation sandboxes</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        PLANNED
                      </span>
                    </div>
                  </div>
                )}

                {/* TAB 3: IP Terms & Charter */}
                {activeTab === 'agreements' && (
                  <div className="p-5 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-3 text-xs leading-relaxed text-slate-700">
                    <h4 className="font-bold text-slate-900 text-sm">Non-Exclusive Joint Innovation Charter</h4>
                    <p>
                      1. <strong>Pre-Existing IP:</strong> Each team retains 100% exclusive copyright and patent rights over their pre-existing source code, schematics, and trained models.
                    </p>
                    <p>
                      2. <strong>Interface Specifications:</strong> APIs, message formats, and connector harnesses developed jointly during this IdeaTec collaboration shall be licensed under reciprocal open-source Apache 2.0.
                    </p>
                    <p>
                      3. <strong>Commercial / Grant Revenue:</strong> Any pilot grants or commercial spinout opportunities arising from the combined solution shall be governed by an equitable revenue-sharing agreement ratified prior to funding disbursement.
                    </p>
                  </div>
                )}

                {/* TAB 4: Meeting Scheduler */}
                {activeTab === 'scheduler' && (
                  <div className="p-6 rounded-2xl bg-purple-50/40 border border-purple-100 text-center space-y-3">
                    <Calendar className="w-8 h-8 text-purple-600 mx-auto" />
                    <h4 className="font-bold text-slate-900 text-sm">Schedule Joint Engineering Sync</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Generate a verified Google Meet or calendar invite with automatic timezone coordination.
                    </p>
                    <button
                      onClick={() => alert('Calendar sync invitation sent to both team lead emails.')}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold transition-colors shadow-md shadow-purple-500/25"
                    >
                      Coordinate 30-Minute Video Sync
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
