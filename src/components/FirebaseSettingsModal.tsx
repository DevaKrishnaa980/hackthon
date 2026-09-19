import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Lock, 
  Database, 
  ExternalLink,
  Save,
  RotateCcw
} from 'lucide-react';
import { 
  getActiveFirebaseConfig, 
  saveActiveFirebaseConfig, 
  isLiveFirebaseConfigured, 
  DEFAULT_FIREBASE_PLACEHOLDERS, 
  FirebaseClientConfig 
} from '../services/firebaseConfig';

interface FirebaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const FirebaseSettingsModal: React.FC<FirebaseSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  if (!isOpen) return null;

  const [config, setConfig] = useState<FirebaseClientConfig>(getActiveFirebaseConfig());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const isLive = isLiveFirebaseConfigured(config);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveActiveFirebaseConfig(config);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onConfigSaved();
      onClose();
    }, 1200);
  };

  const handleResetToPlaceholders = () => {
    setConfig(DEFAULT_FIREBASE_PLACEHOLDERS);
    saveActiveFirebaseConfig(DEFAULT_FIREBASE_PLACEHOLDERS);
    onConfigSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in">
      <div className="bg-white border border-purple-100 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200">
              <Flame className="w-5 h-5 fill-purple-600 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Firebase & Firestore Configuration</h3>
              <p className="text-xs text-slate-500">Section 38 Configuration Placeholders & Live Storage</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-purple-50 rounded-2xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          
          {/* Status Alert */}
          <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${
            isLive 
              ? 'bg-purple-50 border-purple-200 text-purple-900' 
              : 'bg-purple-50/50 border-purple-100 text-slate-700'
          }`}>
            {isLive ? (
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            ) : (
              <Database className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="font-bold text-slate-900 text-xs">
                {isLive ? 'Live Firebase Credentials Connected' : 'Embedded Firestore Engine Active'}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isLive 
                  ? 'Real Firestore collection transactions and Firebase Auth token validations are enabled.'
                  : 'IdeaTec includes an embedded Firestore persistence engine with identical schema, collections, and security simulation. You can paste your own Firebase project credentials below to connect to your live Google Cloud Firestore.'}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                FIREBASE_API_KEY
              </label>
              <input
                type="text"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2.5 bg-white border border-purple-100 focus:border-purple-600 rounded-2xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  FIREBASE_PROJECT_ID
                </label>
                <input
                  type="text"
                  value={config.projectId}
                  onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
                  placeholder="project-afterlife-demo"
                  className="w-full px-3 py-2.5 bg-white border border-purple-100 focus:border-purple-600 rounded-2xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  FIREBASE_AUTH_DOMAIN
                </label>
                <input
                  type="text"
                  value={config.authDomain}
                  onChange={(e) => setConfig({ ...config, authDomain: e.target.value })}
                  placeholder="project-afterlife.firebaseapp.com"
                  className="w-full px-3 py-2.5 bg-white border border-purple-100 focus:border-purple-600 rounded-2xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  FIREBASE_STORAGE_BUCKET
                </label>
                <input
                  type="text"
                  value={config.storageBucket}
                  onChange={(e) => setConfig({ ...config, storageBucket: e.target.value })}
                  placeholder="project-afterlife.appspot.com"
                  className="w-full px-3 py-2.5 bg-white border border-purple-100 focus:border-purple-600 rounded-2xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  FIREBASE_APP_ID
                </label>
                <input
                  type="text"
                  value={config.appId}
                  onChange={(e) => setConfig({ ...config, appId: e.target.value })}
                  placeholder="1:123456789:web:abcdef"
                  className="w-full px-3 py-2.5 bg-white border border-purple-100 focus:border-purple-600 rounded-2xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-purple-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetToPlaceholders}
              className="text-[11px] text-slate-500 hover:text-purple-700 font-semibold flex items-center space-x-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Placeholders</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-purple-100 hover:bg-purple-50 text-slate-600 rounded-2xl font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold transition-all shadow-md shadow-purple-500/25 flex items-center space-x-1.5"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Config</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
