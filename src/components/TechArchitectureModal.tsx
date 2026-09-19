import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Code2, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Server, 
  FileCode 
} from 'lucide-react';

interface TechArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechArchitectureModal: React.FC<TechArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'cpp' | 'java' | 'firebase' | 'ai'>('cpp');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in">
      <div className="bg-white border border-purple-100 rounded-3xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">System Architecture & Engineering Specs</h3>
              <p className="text-xs text-slate-500">Clean Architecture: Java Backend • C++ SIMD Algorithms • Firebase Cloud Firestore • Gemini AI</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-purple-50 rounded-2xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-purple-100 text-xs px-6 bg-purple-50/30 overflow-x-auto">
          {[
            { id: 'cpp', label: 'C++ SIMD Vector Engine', icon: Cpu },
            { id: 'java', label: 'Java Spring Clean Arch', icon: Code2 },
            { id: 'firebase', label: 'Firestore Security Rules', icon: Flame },
            { id: 'ai', label: 'Gemini AI DNA Pipeline', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-3 px-4 font-bold transition-colors border-b-2 whitespace-nowrap ${
                  isActive 
                    ? 'text-purple-700 border-purple-600 bg-white shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-900 border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
          
          {/* TAB 1: C++ Algorithm Engine */}
          {activeTab === 'cpp' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2 text-slate-700 font-sans">
                <h4 className="font-bold text-slate-900 text-sm">C++ SIMD Vector Engine (Section 31 & 32)</h4>
                <p className="text-xs text-slate-500">
                  Location: <code className="text-purple-700 font-mono font-bold">/cpp/matching_engine.hpp</code> & <code className="text-purple-700 font-mono font-bold">/cpp/matching_engine.cpp</code>
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The matching core computes intersection sets using Jaccard Similarity for skill & tech sets and high-dimensional Cosine Similarity for domain embedding vectors.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 space-y-2">
                <div className="text-purple-400 font-bold">// C++ Mathematical Formulation (SIMD Vectorized):</div>
                <div className="text-slate-300 text-[11px] leading-relaxed">
                  1. Jaccard Similarity: J(A, B) = |A ∩ B| / |A ∪ B|<br/>
                  2. Cosine Similarity: Cos(u, v) = (u · v) / (||u|| * ||v||)<br/>
                  3. Multi-Factor Partner Score: Score = 0.35*J(Tech) + 0.30*Cos(Domain) + 0.20*ReqMatch + 0.15*StageScore<br/>
                  4. Fusion Synergy Score: Synergy = J(Overlap)*0.30 + (Complementarity)*0.50 + 0.20*DomainBonus
                </div>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-purple-300 overflow-x-auto text-[11px] leading-relaxed">
{`// /cpp/matching_engine.cpp
double MatchingEngine::jaccardSimilarity(
    const std::vector<std::string>& setA,
    const std::vector<std::string>& setB) {
    if (setA.empty() && setB.empty()) return 1.0;
    if (setA.empty() || setB.empty()) return 0.0;

    std::unordered_set<std::string> unionSet(setA.begin(), setA.end());
    int intersectionCount = 0;
    for (const auto& item : setB) {
        if (unionSet.find(item) != unionSet.end()) {
            intersectionCount++;
        } else {
            unionSet.insert(item);
        }
    }
    return static_cast<double>(intersectionCount) / static_cast<double>(unionSet.size());
}`}
              </pre>
            </div>
          )}

          {/* TAB 2: Java Spring Clean Architecture */}
          {activeTab === 'java' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2 text-slate-700 font-sans">
                <h4 className="font-bold text-slate-900 text-sm">Java Spring Clean Architecture (Section 30)</h4>
                <p className="text-xs text-slate-500">
                  Package: <code className="text-purple-700 font-mono font-bold">com.ideatec.backend</code>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                  <div className="p-3 rounded-2xl bg-white border border-purple-100 shadow-2xs">
                    <strong className="text-slate-900 block">Controller</strong>
                    <span className="text-slate-500">REST endpoints (/api/projects)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-purple-100 shadow-2xs">
                    <strong className="text-slate-900 block">Service</strong>
                    <span className="text-slate-500">Matching orchestrator</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-purple-100 shadow-2xs">
                    <strong className="text-slate-900 block">Repository</strong>
                    <span className="text-slate-500">FirebaseFirestore CRUD</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-purple-100 shadow-2xs">
                    <strong className="text-slate-900 block">JNI Bridge</strong>
                    <span className="text-slate-500">C++ Native Linking</span>
                  </div>
                </div>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-purple-300 overflow-x-auto text-[11px] leading-relaxed">
{`// com/ideatec/backend/controller/ProjectController.java
@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;
    private final MatchingOrchestratorService matchingService;

    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@RequestBody ProjectDto dto) {
        ProjectDto saved = projectService.createProject(dto);
        matchingService.triggerBackgroundVectorMatching(saved.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}`}
              </pre>
            </div>
          )}

          {/* TAB 3: Firebase Rules */}
          {activeTab === 'firebase' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2 text-slate-700 font-sans">
                <h4 className="font-bold text-slate-900 text-sm">Cloud Firestore & Storage Security Rules (Section 34)</h4>
                <p className="text-xs text-slate-500">
                  Configured files: <code className="text-purple-700 font-mono font-bold">/firebase/firestore.rules</code> and <code className="text-purple-700 font-mono font-bold">/firebase/storage.rules</code>
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enforces owner-only updates, public discoverability for marked innovations, and authenticates upload paths. Passwords are handled exclusively by Firebase Auth tokens.
                </p>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-amber-300 overflow-x-auto text-[11px] leading-relaxed">
{`// firebase/firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId} {
      allow read: if resource.data.isDiscoverable == true || 
                     request.auth.uid == resource.data.ownerId || 
                     request.auth.token.role == 'admin';
      allow create: if request.auth != null && request.resource.data.ownerId == request.auth.uid;
      allow update, delete: if request.auth != null && (
        request.auth.uid == resource.data.ownerId || request.auth.token.role == 'admin'
      );
    }
  }
}`}
              </pre>
            </div>
          )}

          {/* TAB 4: Gemini AI Pipeline */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2 text-slate-700 font-sans">
                <h4 className="font-bold text-slate-900 text-sm">Gemini 2.5 Flash Project DNA Pipeline (Section 8 & 9)</h4>
                <p className="text-xs text-slate-500">
                  SDK: <code className="text-purple-700 font-mono font-bold">@google/genai</code> in <code className="text-purple-700 font-mono font-bold">server.ts</code>
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Parses project abstracts, hardware specifications, and codebases into structured 10-point JSON Project DNA schema with 5 standardized maturity levels.
                </p>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-purple-300 overflow-x-auto text-[11px] leading-relaxed">
{`// server.ts AI Route Handler
app.post('/api/ai/analyze-project', async (req, res) => {
  const { project } = req.body;
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: constructDnaPrompt(project),
    config: { responseMimeType: 'application/json' }
  });
  res.json(JSON.parse(response.text));
});`}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-purple-50/40 border-t border-purple-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl text-xs transition-colors shadow-md shadow-purple-500/25"
          >
            Close Architecture
          </button>
        </div>

      </div>
    </div>
  );
};
