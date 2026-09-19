import React, { useState, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  AlertCircle, 
  FileText, 
  Film, 
  Image as ImageIcon, 
  Github, 
  Globe, 
  CheckCircle2, 
  Compass, 
  Building2, 
  Banknote, 
  Activity, 
  BookOpen, 
  Cpu, 
  Users, 
  Zap, 
  Info 
} from 'lucide-react';
import { Project, ProjectStage, RequirementType, UserProfile, ProjectUploadedFile } from '../types';
import { AiIntelligenceEngine } from '../services/aiIntelligenceService';
import { dbService } from '../services/firebaseConfig';

interface ProjectUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onProjectCreated: (project: Project) => void;
}

const PROJECT_NEEDS: { id: RequirementType; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'Mentor', label: 'Mentor', icon: Compass },
  { id: 'Industry Support', label: 'Industry Support', icon: Building2 },
  { id: 'Funding', label: 'Funding', icon: Banknote },
  { id: 'Testing', label: 'Testing', icon: Activity },
  { id: 'Research', label: 'Research', icon: BookOpen },
  { id: 'Hardware', label: 'Hardware', icon: Cpu },
  { id: 'Team Members', label: 'Team Members', icon: Users },
];

const DEV_STAGES: { id: ProjectStage; label: string; description: string }[] = [
  { id: 'idea', label: 'Idea', description: 'Problem definition & early specs' },
  { id: 'prototype', label: 'Prototype', description: 'Functional benchtop proof-of-concept' },
  { id: 'tested', label: 'Tested / MVP', description: 'Lab-bench benchmarked build' },
  { id: 'pilot', label: 'Pilot', description: 'Live testbed sandbox trial' },
  { id: 'deployment', label: 'Deployment', description: 'Commercial spinout or public utility' },
];

export const ProjectUploadModal: React.FC<ProjectUploadModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onProjectCreated,
}) => {
  if (!isOpen) return null;

  // Form State
  const [projectName, setProjectName] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [solution, setSolution] = useState('');
  const [domain, setDomain] = useState('CleanTech & Smart Mobility');
  const [technology, setTechnology] = useState('');
  const [targetUsers, setTargetUsers] = useState('');
  const [stage, setStage] = useState<ProjectStage>('prototype');

  // Checkbox Project Needs
  const [selectedNeeds, setSelectedNeeds] = useState<RequirementType[]>([
    'Mentor',
    'Industry Support',
    'Testing'
  ]);

  // Upload States
  const [pptFile, setPptFile] = useState<{ name: string; size: string } | null>(null);
  const [demoVideoFile, setDemoVideoFile] = useState<{ name: string; size: string } | null>(null);
  const [demoVideoUrl, setDemoVideoUrl] = useState('');
  const [projectImageFile, setProjectImageFile] = useState<{ name: string; preview: string } | null>(null);

  // Links
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');

  // Flow State
  const [analysisState, setAnalysisState] = useState<'idle' | 'loading' | 'completed'>('idle');
  const [loadingStep, setLoadingStep] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // AI Output State
  const [analysisResult, setAnalysisResult] = useState<{
    dna: any;
    maturity: any;
    needs: any[];
    rawProject: any;
  } | null>(null);

  const pptInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const loadingSteps = [
    'Parsing problem-solution congruence and domain keywords...',
    'Evaluating technical architecture and maturity factors...',
    'Synthesizing second-life translation pathways and industry pilots...'
  ];

  // Quick prefill for instant testability
  const handleLoadSample = () => {
    setProjectName('Adaptive Multi-Cell EV Battery Management System');
    setProblemStatement('Electric vehicle battery packs suffer from premature cell degradation and catastrophic thermal runaway risk caused by passive charge-balancing limitations under extreme weather conditions.');
    setSolution('An active balance BMS using CAN bus telemetry, edge TinyML thermal predictive modeling, and sub-second shunt switching that extends lithium pack longevity by 28%.');
    setDomain('CleanTech & Smart Mobility');
    setTechnology('ESP32-S3, CAN Bus Protocol, C++, TinyML, FreeRTOS, Python');
    setTargetUsers('Electric 2-wheeler OEMs, commercial battery retrofitters, and fleet operators.');
    setStage('prototype');
    setSelectedNeeds(['Mentor', 'Industry Support', 'Testing', 'Hardware']);
    setGithubUrl('https://github.com/innovator/ev-bms-telemetry');
    setDemoUrl('https://bms-telemetry-demo.internal');
    setPptFile({ name: 'EV_BMS_Phase1_DesignReview.pdf', size: '3.4 MB' });
    setProjectImageFile({
      name: 'bms_hardware_bench.jpg',
      preview: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    });
    setValidationError(null);
  };

  const handleToggleNeed = (needId: RequirementType) => {
    setSelectedNeeds(prev => 
      prev.includes(needId) 
        ? prev.filter(n => n !== needId) 
        : [...prev, needId]
    );
  };

  const handlePptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPptFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDemoVideoFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProjectImageFile({
          name: file.name,
          preview: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeProject = async () => {
    if (!projectName.trim()) {
      setValidationError('Please specify the Project Name.');
      return;
    }
    if (!problemStatement.trim()) {
      setValidationError('Please provide the Problem Statement.');
      return;
    }
    if (!solution.trim()) {
      setValidationError('Please describe your Solution.');
      return;
    }

    setValidationError(null);
    setAnalysisState('loading');
    setLoadingStep(0);

    const timer1 = setTimeout(() => setLoadingStep(1), 600);
    const timer2 = setTimeout(() => setLoadingStep(2), 1200);

    try {
      const techArray = technology.split(',').map(t => t.trim()).filter(Boolean);
      const rawProjectData: Partial<Project> = {
        title: projectName.trim(),
        problemStatement: problemStatement.trim(),
        proposedSolution: solution.trim(),
        domain: domain.trim(),
        technologies: techArray.length > 0 ? techArray : ['Hardware', 'Software'],
        targetUsers: targetUsers.trim() || undefined,
        stage,
        requirements: selectedNeeds,
        githubRepo: githubUrl.trim() || undefined,
        demoUrl: demoUrl.trim() || demoVideoUrl.trim() || undefined
      };

      const analysis = await AiIntelligenceEngine.generateProjectDNA(rawProjectData);

      setTimeout(() => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        setAnalysisResult({
          dna: analysis.dna,
          maturity: analysis.maturity,
          needs: analysis.needs,
          rawProject: rawProjectData
        });
        setAnalysisState('completed');
      }, 1800);
    } catch (err) {
      console.error(err);
      const fallback = AiIntelligenceEngine.fallbackAnalyze({
        title: projectName,
        problemStatement,
        proposedSolution: solution,
        domain,
        technologies: technology.split(',').map(s => s.trim()).filter(Boolean),
        stage
      });
      setAnalysisResult({
        dna: fallback.dna,
        maturity: fallback.maturity,
        needs: fallback.needs,
        rawProject: { title: projectName, problemStatement, proposedSolution: solution, domain, stage }
      });
      setAnalysisState('completed');
    }
  };

  const handlePublishProject = async () => {
    if (!analysisResult) return;
    setIsPublishing(true);

    try {
      const files: ProjectUploadedFile[] = [];
      if (pptFile) {
        files.push({
          name: pptFile.name,
          type: 'pdf',
          url: 'https://example.com/project-doc.pdf',
          sizeBytes: 2500000,
          uploadedAt: new Date().toISOString()
        });
      }
      if (demoVideoFile || demoVideoUrl) {
        files.push({
          name: demoVideoFile?.name || 'Demo Video',
          type: 'video',
          url: demoVideoUrl || 'https://example.com/demo.mp4',
          sizeBytes: 15000000,
          uploadedAt: new Date().toISOString()
        });
      }

      const techList = technology.split(',').map(s => s.trim()).filter(Boolean);

      const finalProject: Project = {
        id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        ownerId: currentUser.id,
        ownerName: currentUser.fullName,
        ownerCollege: currentUser.college || 'Engineering Institute',
        title: projectName.trim(),
        category: domain.includes('CleanTech') || domain.includes('IoT') ? 'Hardware & IoT' : 'Software & AI',
        domain: domain.trim(),
        problemStatement: problemStatement.trim(),
        proposedSolution: solution.trim(),
        innovationDescription: solution.trim(),
        targetUsers: targetUsers.trim() || undefined,
        imageUrl: projectImageFile?.preview || undefined,
        videoUrl: demoVideoUrl || undefined,
        pptUrl: pptFile?.name || undefined,
        technologies: techList.length ? techList : analysisResult.dna.technologies,
        programmingLanguages: techList.filter(t => ['C++', 'Python', 'TypeScript', 'Java', 'Rust'].includes(t)),
        hardwareUsed: techList.filter(t => ['ESP32', 'Arduino', 'PCB', 'Sensors', 'LoRaWAN'].includes(t)),
        aiMlUsed: techList.filter(t => ['TinyML', 'PyTorch', 'TensorFlow', 'OpenCV'].includes(t)),
        githubRepo: githubUrl.trim() || undefined,
        demoUrl: demoUrl.trim() || undefined,
        stage,
        requirements: selectedNeeds,
        files,
        projectDNA: analysisResult.dna,
        maturityAssessment: analysisResult.maturity,
        needsNext: analysisResult.needs,
        isDiscoverable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewCount: 1
      };

      dbService.saveProject(finalProject);

      dbService.saveMilestone({
        id: `ms_${finalProject.id}_1`,
        projectId: finalProject.id,
        title: 'Project Onboarding & AI DNA Synthesis',
        description: 'Structured extraction of engineering capabilities and maturity baseline.',
        status: 'COMPLETED',
        deadline: new Date().toISOString().split('T')[0],
        responsiblePerson: currentUser.fullName,
        completionDate: new Date().toISOString().split('T')[0],
        order: 1
      });

      onProjectCreated(finalProject);
      onClose();
    } catch (err: any) {
      console.error(err);
      setValidationError('Failed to publish project. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-purple-100 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header: Exact Heading "Give Your Project a Second Life." */}
        <div className="px-6 py-4 border-b border-purple-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center space-x-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Project Intake & AI Analysis</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Give Your Project a Second Life.
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLoadSample}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60 transition-colors hidden sm:inline-block"
            >
              Prefill Sample
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-purple-50 rounded-2xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          
          {validationError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* LOADING STATE */}
          {analysisState === 'loading' && (
            <div className="py-12 px-6 rounded-2xl bg-[#FAF8FF] border border-purple-100 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-purple-200/50 animate-ping" />
                <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/30 relative z-10">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Understanding your project...
                </h3>
                <p className="text-xs text-purple-700 font-semibold mt-1">
                  {loadingSteps[loadingStep]}
                </p>
              </div>
            </div>
          )}

          {/* FORM: IDLE STATE */}
          {analysisState === 'idle' && (
            <div className="space-y-6">
              {/* 1. Project Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Project Name <span className="text-purple-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Adaptive Multi-Cell EV Battery Management System"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-[#FAF8FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs font-semibold text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* 2. Problem Statement */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Problem Statement <span className="text-purple-600">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="What core challenge does this project solve?"
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-[#FAF8FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs text-slate-800 placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* 3. Solution */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Solution <span className="text-purple-600">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the technical solution and architecture..."
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-[#FAF8FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs text-slate-800 placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* 4. Domain & 5. Technology */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Domain
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-[#FAF8FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs font-medium text-slate-800"
                  >
                    <option value="CleanTech & Smart Mobility">CleanTech & Smart Mobility</option>
                    <option value="Disaster Management & IoT">Disaster Management & IoT</option>
                    <option value="Healthcare & Biomedical Tech">Healthcare & Biomedical Tech</option>
                    <option value="AgriTech & Rural Innovations">AgriTech & Rural Innovations</option>
                    <option value="Autonomous Robotics & AI">Autonomous Robotics & AI</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Technology
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., ESP32, Python, C++, TinyML"
                    value={technology}
                    onChange={(e) => setTechnology(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-[#FAF8FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* 6. Target Users */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Target Users
                </label>
                <input
                  type="text"
                  placeholder="e.g., EV manufacturers, emergency responders, municipal authorities"
                  value={targetUsers}
                  onChange={(e) => setTargetUsers(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-[#FAF8FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs text-slate-800 placeholder:text-slate-400"
                />
              </div>

              {/* 7. Current Development Stage */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Current Development Stage
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {DEV_STAGES.map((stg) => {
                    const isSelected = stage === stg.id;
                    return (
                      <button
                        key={stg.id}
                        type="button"
                        onClick={() => setStage(stg.id)}
                        className={`p-2 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50 text-purple-900'
                            : 'border-purple-100 bg-[#FAF8FF] text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold">{stg.label}</span>
                          {isSelected && <Check className="w-3 h-3 text-purple-700" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PROJECT NEEDS (CHECKBOXES) */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Project Needs
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PROJECT_NEEDS.map((need) => {
                    const isChecked = selectedNeeds.includes(need.id);
                    const IconComp = need.icon;
                    return (
                      <label
                        key={need.id}
                        className={`flex items-center space-x-2 p-2 rounded-xl border cursor-pointer select-none transition-all ${
                          isChecked
                            ? 'border-purple-400 bg-purple-50 text-purple-900'
                            : 'border-purple-100 bg-[#FAF8FF] text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleNeed(need.id)}
                          className="w-3.5 h-3.5 rounded text-purple-600 accent-purple-600"
                        />
                        <IconComp className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                        <span className="text-[11px] font-bold">{need.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* UPLOADS: PPT/PDF, Demo Video, Project Image */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Upload
                </label>
                <div className="grid grid-cols-3 gap-3">
                  
                  {/* PPT/PDF */}
                  <div
                    onClick={() => pptInputRef.current?.click()}
                    className="p-3 rounded-xl border border-dashed border-purple-200 hover:border-purple-400 bg-[#FAF8FF] cursor-pointer text-center space-y-1"
                  >
                    <input type="file" ref={pptInputRef} accept=".pdf,.ppt,.pptx" className="hidden" onChange={handlePptUpload} />
                    <FileText className="w-4 h-4 text-purple-700 mx-auto" />
                    <span className="text-[11px] font-bold text-slate-800 block">PPT / PDF</span>
                    <span className="text-[10px] text-slate-500 truncate block">{pptFile?.name || 'Attach slide deck'}</span>
                  </div>

                  {/* Demo Video */}
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className="p-3 rounded-xl border border-dashed border-purple-200 hover:border-purple-400 bg-[#FAF8FF] cursor-pointer text-center space-y-1"
                  >
                    <input type="file" ref={videoInputRef} accept="video/*" className="hidden" onChange={handleVideoUpload} />
                    <Film className="w-4 h-4 text-purple-700 mx-auto" />
                    <span className="text-[11px] font-bold text-slate-800 block">Demo Video</span>
                    <span className="text-[10px] text-slate-500 truncate block">{demoVideoFile?.name || 'Attach recording'}</span>
                  </div>

                  {/* Project Image */}
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    className="p-3 rounded-xl border border-dashed border-purple-200 hover:border-purple-400 bg-[#FAF8FF] cursor-pointer text-center space-y-1"
                  >
                    <input type="file" ref={imageInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <ImageIcon className="w-4 h-4 text-purple-700 mx-auto" />
                    <span className="text-[11px] font-bold text-slate-800 block">Project Image</span>
                    <span className="text-[10px] text-slate-500 truncate block">{projectImageFile ? 'Attached' : 'Attach photo'}</span>
                  </div>

                </div>
              </div>

              {/* LINKS: GitHub & Demo URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="relative">
                  <Github className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="GitHub Repo URL"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-purple-100 bg-[#FAF8FF] text-xs text-slate-800 placeholder:text-slate-400"
                  />
                </div>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="Demo URL"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-purple-100 bg-[#FAF8FF] text-xs text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* AI-GENERATED ANALYSIS DISPLAY */}
          {analysisState === 'completed' && analysisResult && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-purple-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>AI Analysis Generated</span>
                </div>
                <button
                  onClick={() => setAnalysisState('idle')}
                  className="text-[11px] font-bold text-purple-700 hover:underline"
                >
                  Edit Inputs
                </button>
              </div>

              {/* DNA Card */}
              <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-purple-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project DNA</span>
                <div className="text-sm font-bold text-slate-900">{analysisResult.dna.domain}</div>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.dna.technologies.slice(0, 4).map((t: string, i: number) => (
                    <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-purple-100 text-purple-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Maturity Score */}
              <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-purple-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Maturity Diagnostic</span>
                  <span className="text-xs font-extrabold text-purple-700">Score: {analysisResult.maturity.confidenceScore}%</span>
                </div>
                <p className="text-xs text-slate-700">
                  {analysisResult.maturity.reason}
                </p>
              </div>

              {/* Needs Intervention */}
              <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-purple-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Targeted Interventions</span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedNeeds.slice(0, 4).map((need, i) => (
                    <div key={i} className="p-2 rounded-lg bg-white border border-purple-100 text-[11px] font-semibold text-slate-800 flex items-center space-x-1.5">
                      <Zap className="w-3 h-3 text-purple-600 shrink-0" />
                      <span>{need} Support</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-purple-100 bg-white flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          {analysisState === 'idle' && (
            <button
              onClick={handleAnalyzeProject}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm shadow-purple-500/25 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze Project with AI</span>
            </button>
          )}

          {analysisState === 'completed' && (
            <button
              onClick={handlePublishProject}
              disabled={isPublishing}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm shadow-purple-500/25 transition-all disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isPublishing ? 'Publishing...' : 'Save & Publish to Ecosystem'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
