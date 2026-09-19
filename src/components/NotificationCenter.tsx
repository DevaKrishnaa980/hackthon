import React from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  Users, 
  GitMerge, 
  Sparkles, 
  Calendar, 
  ShieldCheck, 
  ChevronRight 
} from 'lucide-react';
import { SystemNotification } from '../types';
import { dbService } from '../services/firebaseConfig';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SystemNotification[];
  onNavigate: (tab: string) => void;
  onRefresh: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onNavigate,
  onRefresh,
}) => {
  if (!isOpen) return null;

  const handleMarkAsRead = (id: string) => {
    dbService.markNotificationRead(id);
    onRefresh();
  };

  const handleNotificationClick = (n: SystemNotification) => {
    handleMarkAsRead(n.id);
    if (n.actionLink) {
      if (n.actionLink === 'project') onNavigate('projects');
      else if (n.actionLink === 'collaborations') onNavigate('fusion');
      else if (n.actionLink === 'matching') onNavigate('matching');
      else if (n.actionLink === 'mentors') onNavigate('mentors');
      else if (n.actionLink === 'opportunities') onNavigate('opportunities');
      else onNavigate('dashboard');
    }
    onClose();
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-purple-100 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="p-5 border-b border-purple-100 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Ecosystem Notifications</h3>
            <p className="text-[11px] text-slate-500">Real-time alerts & collaboration requests</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-purple-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
        {notifications.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Bell className="w-10 h-10 text-purple-200 mx-auto mb-3" />
            <p className="font-bold text-slate-700">All caught up!</p>
            <p className="text-[11px] text-slate-500 mt-1">No unread notifications.</p>
          </div>
        ) : (
          notifications.map((n) => {
            const iconMap: Record<string, any> = {
              mentor_acceptance: ShieldCheck,
              collaboration_request: GitMerge,
              collaboration_acceptance: CheckCircle2,
              new_recommendation: Sparkles,
              project_status_update: Calendar,
              project_submission: CheckCircle2
            };
            const Icon = iconMap[n.type] || Sparkles;

            return (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  n.read 
                    ? 'bg-white border-purple-100 text-slate-500 hover:border-purple-200 shadow-2xs' 
                    : 'bg-purple-50/70 border-purple-200 text-slate-900 shadow-sm hover:border-purple-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs leading-snug">{n.title}</h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {n.message}
                    </p>
                    <div className="text-[10px] text-slate-400 pt-1">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-purple-100 bg-purple-50/40 text-center">
        <button
          onClick={() => {
            notifications.forEach(n => dbService.markNotificationRead(n.id));
            onRefresh();
          }}
          className="text-xs text-purple-700 hover:text-purple-900 font-bold hover:underline transition-colors"
        >
          Mark all as read
        </button>
      </div>

    </div>
  );
};
