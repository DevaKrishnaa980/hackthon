import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  FileText, 
  Film, 
  Image as ImageIcon, 
  Github, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Compass, 
  Building2, 
  Banknote, 
  Activity, 
  BookOpen, 
  Cpu, 
  Users, 
  Check, 
  RefreshCw, 
  Layers, 
  FileCheck, 
  X, 
  TrendingUp, 
  Share2, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { Project, ProjectStage, RequirementType, UserProfile, ProjectUploadedFile } from '../types';
import { AiIntelligenceEngine } from '../services/aiIntelligenceService';
import { dbService } from '../services/firebaseConfig';

interface ProjectUploadViewProps {
  currentUser: UserProfile;
  onProjectCreated: (project: Project) => void;
  onNavigate: (tab: string) => void;
  onSelectProject?: (projectId: string) => void;
  onShowToast?: (type: 'success' | 'error' | 'info', msg: string) => void;
  onNavigateToAnalysis?: (analysisData: any) => void;
}

// Checkbox items requested explicitly
const PROJECT_NEEDS: { id: RequirementType; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'Mentor', label: 'Mentor', icon: Compass },
  { id: 'Industry Support', label: 'Industry Support', icon: Building2 },
  { id: 'Funding', label: 'Funding', icon: Banknote },
  { id: 'Testing', label: 'Testing', icon: Activity },
  { id: 'Research', label: 'Research', icon: BookOpen },
  { id: 'Hardware', label: 'Hardware', icon: Cpu },
  { id: 'Team Members', label: 'Team Members', icon: Users },
];

// Common development stages
const DEV_STAGES: { id: ProjectStage; label: string; description: string }[] = [
  { id: 'idea', label: 'Idea', description: 'Problem definition, system architecture & early specs' },
  { id: 'prototype', label: 'Prototype', description: 'Functional benchtop proof-of-concept build' },
  { id: 'tested', label: 'Tested / MVP', description: 'Lab-bench validated & benchmarked build' },
  { id: 'pilot', label: 'Pilot', description: 'Live testbed or municipal sandbox deployment' },
  { id: 'deployment', label: 'Deployment', description: 'Commercial spinout or active public utility' },
];

export const ProjectUploadView: React.FC<ProjectUploadViewProps> = ({
  currentUser,
  onProjectCreated,
  onNavigate,
  onSelectProject,
  onShowToast,
  onNavigateToAnalysis
}) => {
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
  const [pptFile, setPptFile] = useState<{ name: string; size: string; url?: string } | null>(null);
  const [demoVideoFile, setDemoVideoFile] = useState<{ name: string; size: string; url?: string } | null>(null);
  const [demoVideoUrl, setDemoVideoUrl] = useState('');
  const [projectImageFile, setProjectImageFile] = useState<{ name: string; preview: string } | null>(null);

  // Links
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');

  // UI Flow State
  const [analysisState, setAnalysisState] = useState<'idle' | 'loading' | 'completed'>('idle');
  const [loadingStep, setLoadingStep] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Analysis Result
  const [analysisResult, setAnalysisResult] = useState<{
    dna: any;
    maturity: any;
    needs: any[];
    rawProject: any;
  } | null>(null);

  // File Input References
  const pptInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Loading step strings
  const loadingSteps = [
    'Parsing problem-solution congruence and domain keywords...',
    'Evaluating technical architecture and maturity factors...',
    'Synthesizing second-life translation pathways and industry pilots...'
  ];

  // Quick prefill for instant testability
  const handleLoadSample = (sampleType: 'bms' | 'flood') => {
    if (sampleType === 'bms') {
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
    } else {
      setProjectName('Decentralized Flash-Flood Early Alert Telemetry');
      setProblemStatement('Downstream river basin hamlets lack resilient real-time hydrological surge warnings due to cellular tower blackouts during heavy monsoon precipitation.');
      setSolution('Sub-GHz solar-powered ultrasonic river stage gauges communicating via LoRaWAN mesh with sirens and automated multi-lingual SMS dispatch.');
      setDomain('Disaster Management & IoT');
      setTechnology('LoRaWAN, Arduino, Ultrasonic Transducers, Edge AI, MQTT, Node.js');
      setTargetUsers('District Disaster Management Authorities (DDMA), riverside agrarian villages.');
      setStage('prototype');
      setSelectedNeeds(['Industry Support', 'Funding', 'Testing', 'Research']);
      setGithubUrl('https://github.com/innovator/flood-mesh-node');
      setDemoUrl('https://flood-telemetry.in');
      setPptFile({ name: 'Hydrology_LoRa_Report.pdf', size: '2.8 MB' });
      setProjectImageFile({
        name: 'river_node_sensor.jpg',
        preview: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
      });
    }
    setValidationError(null);
    if (onShowToast) onShowToast('info', 'Loaded sample innovation details.');
  };

  // Toggle Need Checkbox
  const handleToggleNeed = (needId: RequirementType) => {
    setSelectedNeeds(prev => 
      prev.includes(needId) 
        ? prev.filter(n => n !== needId) 
        : [...prev, needId]
    );
  };

  // Upload Handlers
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

  // AI Analysis Execution
  const handleAnalyzeProject = async () => {
    if (!projectName.trim()) {
      setValidationError('Please specify the Project Name.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!problemStatement.trim()) {
      setValidationError('Please provide the Problem Statement.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!solution.trim()) {
      setValidationError('Please describe your Solution.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setValidationError(null);
    setAnalysisState('loading');
    setLoadingStep(0);

    // Timed step progression for clean feedback
    const timer1 = setTimeout(() => setLoadingStep(1), 700);
    const timer2 = setTimeout(() => setLoadingStep(2), 1400);

    try {
      const techArray = technology
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const rawProjectData: Partial<Project> = {
        title: projectName.trim(),
        problemStatement: problemStatement.trim(),
        proposedSolution: solution.trim(),
        domain: domain.trim(),
        technologies: techArray.length > 0 ? techArray : ['Hardware', 'Software'],
        targetUsers: targetUsers.trim() || undefined,
        stage: stage,
        requirements: selectedNeeds,
        githubRepo: githubUrl.trim() || undefined,
        demoUrl: demoUrl.trim() || demoVideoUrl.trim() || undefined
      };

      const analysis = await AiIntelligenceEngine.generateProjectDNA(rawProjectData);

      // Finish simulated scan
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
        window.scrollTo({ top: 600, behavior: 'smooth' });
        if (onShowToast) onShowToast('success', 'AI Project Analysis complete!');
      }, 2000);
    } catch (err) {
      console.error('Analysis error:', err);
      // Fallback analysis
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

  // Save and Publish Project
  const handlePublishProject = async () => {
    if (!analysisResult) return;
    setIsPublishing(true);

    try {
      const files: ProjectUploadedFile[] = [];
      if (pptFile) {
        files.push({
          name: pptFile.name,
          type: 'pdf',
          url: pptFile.url || 'https://example.com/project-doc.pdf',
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
        stage: stage,
        requirements: selectedNeeds,
        files: files,
        projectDNA: analysisResult.dna,
        maturityAssessment: analysisResult.maturity,
        needsNext: analysisResult.needs,
        isDiscoverable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewCount: 1
      };

      // Save to database service
      dbService.saveProject(finalProject);

      // Seed lifecycle milestones
      dbService.saveMilestone({
        id: `ms_${finalProject.id}_1`,
        projectId: finalProject.id,
        title: 'Project Second-Life Ingestion & AI DNA Synthesis',
        description: 'Completed baseline architecture extraction and maturity diagnostic.',
        status: 'COMPLETED',
        deadline: new Date().toISOString().split('T')[0],
        completionDate: new Date().toISOString().split('T')[0],
        responsiblePerson: currentUser.fullName,
        order: 1
      });

      dbService.saveMilestone({
        id: `ms_${finalProject.id}_2`,
        projectId: finalProject.id,
        title: `${selectedNeeds[0] || 'Technical Testing'} Engagement Plan`,
        description: 'Commence partner match review and formal milestone validation.',
        status: 'IN PROGRESS',
        deadline: new Date(Date.now() + 21 * 24 * 3600 * 1000).toISOString().split('T')[0],
        responsiblePerson: currentUser.fullName,
        order: 2
      });

      onProjectCreated(finalProject);

      if (onShowToast) {
        onShowToast('success', `"${finalProject.title}" is now published to the Afterlife ecosystem!`);
      }

      if (onSelectProject) {
        onSelectProject(finalProject.id);
      } else {
        onNavigate('projects');
      }
    } catch (err: any) {
      console.error(err);
      if (onShowToast) onShowToast('error', 'Failed to publish project. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-800 font-sans pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* ======================================================================= */}
        {/* HEADER SECTION: "Give Your Project a Second Life."                      */}
        {/* ======================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-100/60 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Innovation Intake & AI Diagnostic</span>
              </div>

              {/* Sample prefill buttons for rapid evaluation */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-medium">Quick Prefill:</span>
                <button
                  onClick={() => handleLoadSample('bms')}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60 transition-colors"
                >
                  EV Battery BMS
                </button>
                <button
                  onClick={() => handleLoadSample('flood')}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60 transition-colors"
                >
                  Flood LoRa Mesh
                </button>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Give Your Project a Second Life.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl font-normal leading-relaxed">
              Don't let your hackathon sprint or capstone build gather digital dust. Enter your project details to generate an instant AI Project DNA, maturity scoring, and targeted second-life partnerships.
            </p>
          </div>
        </div>

        {/* Validation error notice */}
        {validationError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* ======================================================================= */}
        {/* FORM CONTAINER                                                          */}
        {/* ======================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-2xs space-y-8">
          
          {/* 1. Project Name */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Project Name <span className="text-purple-600">*</span>
            </label>
            <input
              type="text"
              id="upload-project-name"
              placeholder="e.g., Adaptive Multi-Cell EV Battery Management System"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-[#FAF8FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm font-semibold text-slate-900 placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* 2. Problem Statement */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Problem Statement <span className="text-purple-600">*</span>
            </label>
            <textarea
              rows={3}
              id="upload-problem-statement"
              placeholder="What core problem or inefficiency does this project target? Who experiences this challenge?"
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-[#FAF8FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm text-slate-800 placeholder:text-slate-400 transition-all resize-none"
            />
          </div>

          {/* 3. Solution */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Solution <span className="text-purple-600">*</span>
            </label>
            <textarea
              rows={3}
              id="upload-solution"
              placeholder="Describe your technical solution, system architecture, or core breakthrough..."
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-[#FAF8FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm text-slate-800 placeholder:text-slate-400 transition-all resize-none"
            />
          </div>

          {/* 4. Domain & 5. Technology (Two-Column Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Domain */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Domain <span className="text-purple-600">*</span>
              </label>
              <select
                id="upload-domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-[#FAF8FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm font-medium text-slate-800 transition-all"
              >
                <option value="CleanTech & Smart Mobility">CleanTech & Smart Mobility</option>
                <option value="Disaster Management & IoT">Disaster Management & IoT</option>
                <option value="Healthcare & Biomedical Tech">Healthcare & Biomedical Tech</option>
                <option value="AgriTech & Rural Innovations">AgriTech & Rural Innovations</option>
                <option value="Autonomous Robotics & AI">Autonomous Robotics & AI</option>
                <option value="Industrial Automation & Industry 4.0">Industrial Automation & Industry 4.0</option>
                <option value="CyberSecurity & Network Defense">CyberSecurity & Network Defense</option>
                <option value="EdTech & Knowledge Systems">EdTech & Knowledge Systems</option>
              </select>
            </div>

            {/* Technology */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Technology
              </label>
              <input
                type="text"
                id="upload-technology"
                placeholder="e.g., ESP32, C++, PyTorch, LoRaWAN, React"
                value={technology}
                onChange={(e) => setTechnology(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-[#FAF8FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm text-slate-800 placeholder:text-slate-400 transition-all"
              />
              <span className="text-[11px] text-slate-400 block">Comma-separated hardware, frameworks, or tools</span>
            </div>
          </div>

          {/* 6. Target Users */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Target Users
            </label>
            <input
              type="text"
              id="upload-target-users"
              placeholder="e.g., Electric vehicle manufacturers, fleet operators, municipal responders"
              value={targetUsers}
              onChange={(e) => setTargetUsers(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-[#FAF8FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm text-slate-800 placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* 7. Current Development Stage */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Current Development Stage
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {DEV_STAGES.map((stg) => {
                const isSelected = stage === stg.id;
                return (
                  <button
                    key={stg.id}
                    type="button"
                    onClick={() => setStage(stg.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 text-purple-900 ring-1 ring-purple-500'
                        : 'border-purple-100 bg-[#FAF8FF] hover:bg-purple-50/50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold">{stg.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-purple-700" />}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">{stg.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* PROJECT NEEDS (CHECKBOXES):                                            */}
          {/* □ Mentor, □ Industry Support, □ Funding, □ Testing,                    */}
          {/* □ Research, □ Hardware, □ Team Members                                */}
          {/* ===================================================================== */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Project Needs
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Select the external catalysts required to give this project a second life.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {PROJECT_NEEDS.map((need) => {
                const isChecked = selectedNeeds.includes(need.id);
                const IconComp = need.icon;
                return (
                  <label
                    key={need.id}
                    className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                      isChecked
                        ? 'border-purple-400 bg-purple-50/70 text-purple-900 shadow-2xs'
                        : 'border-purple-100 bg-[#FAF8FF] hover:bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleNeed(need.id)}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-400 border-purple-200 accent-purple-600"
                    />
                    <div className="flex items-center space-x-2">
                      <IconComp className={`w-4 h-4 ${isChecked ? 'text-purple-700' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold">{need.label}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* UPLOADS: PPT / PDF, Demo Video, Project Image                         */}
          {/* ===================================================================== */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Upload
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Attach slide decks, live demo recordings, and hardware photos for AI validation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* 1. PPT / PDF */}
              <div 
                onClick={() => pptInputRef.current?.click()}
                className="p-4 rounded-2xl border-2 border-dashed border-purple-200 hover:border-purple-400 bg-[#FAF8FF] hover:bg-purple-50/50 cursor-pointer text-center space-y-2 transition-all group"
              >
                <input 
                  type="file" 
                  ref={pptInputRef} 
                  accept=".pdf,.ppt,.pptx" 
                  className="hidden" 
                  onChange={handlePptUpload}
                />
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">PPT / PDF</span>
                  <span className="text-[11px] text-slate-500">Presentation or schematics</span>
                </div>
                {pptFile ? (
                  <div className="pt-1 text-[11px] font-semibold text-purple-700 bg-white p-1.5 rounded-lg border border-purple-200 truncate">
                    ✓ {pptFile.name}
                  </div>
                ) : (
                  <span className="inline-block text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-md border border-purple-100">
                    Click to browse
                  </span>
                )}
              </div>

              {/* 2. Demo Video */}
              <div 
                onClick={() => videoInputRef.current?.click()}
                className="p-4 rounded-2xl border-2 border-dashed border-purple-200 hover:border-purple-400 bg-[#FAF8FF] hover:bg-purple-50/50 cursor-pointer text-center space-y-2 transition-all group"
              >
                <input 
                  type="file" 
                  ref={videoInputRef} 
                  accept="video/*" 
                  className="hidden" 
                  onChange={handleVideoUpload}
                />
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Demo Video</span>
                  <span className="text-[11px] text-slate-500">MP4, MOV, or screen recording</span>
                </div>
                {demoVideoFile ? (
                  <div className="pt-1 text-[11px] font-semibold text-purple-700 bg-white p-1.5 rounded-lg border border-purple-200 truncate">
                    ✓ {demoVideoFile.name}
                  </div>
                ) : (
                  <span className="inline-block text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-md border border-purple-100">
                    Click to browse
                  </span>
                )}
              </div>

              {/* 3. Project Image */}
              <div 
                onClick={() => imageInputRef.current?.click()}
                className="p-4 rounded-2xl border-2 border-dashed border-purple-200 hover:border-purple-400 bg-[#FAF8FF] hover:bg-purple-50/50 cursor-pointer text-center space-y-2 transition-all group"
              >
                <input 
                  type="file" 
                  ref={imageInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Project Image</span>
                  <span className="text-[11px] text-slate-500">Hardware photo or architecture</span>
                </div>
                {projectImageFile ? (
                  <div className="pt-1 text-[11px] font-semibold text-purple-700 bg-white p-1.5 rounded-lg border border-purple-200 truncate">
                    ✓ Image attached
                  </div>
                ) : (
                  <span className="inline-block text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-md border border-purple-100">
                    Click to browse
                  </span>
                )}
              </div>
            </div>

            {/* Video URL Alternative */}
            <div className="pt-1">
              <input
                type="text"
                placeholder="Or paste Demo Video link (YouTube, Loom, Google Drive)"
                value={demoVideoUrl}
                onChange={(e) => setDemoVideoUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-purple-100 bg-[#FAF8FF] text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>
          </div>

          {/* ===================================================================== */}
          {/* LINKS: GitHub, Demo URL                                               */}
          {/* ===================================================================== */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Links
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* GitHub */}
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Github className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  id="upload-github-url"
                  placeholder="GitHub Repository URL"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-purple-100 bg-[#FAF8FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs font-medium text-slate-800 placeholder:text-slate-400 transition-all"
                />
              </div>

              {/* Demo URL */}
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  id="upload-demo-url"
                  placeholder="Demo URL or Live Web App"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-purple-100 bg-[#FAF8FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs font-medium text-slate-800 placeholder:text-slate-400 transition-all"
                />
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* BUTTON: [ Analyze Project with AI ]                                   */}
          {/* ===================================================================== */}
          <div className="pt-4 border-t border-purple-50 flex justify-end">
            <button
              id="btn-analyze-project-ai"
              onClick={handleAnalyzeProject}
              disabled={analysisState === 'loading'}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-extrabold text-sm flex items-center justify-center space-x-2.5 shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Analyze Project with AI</span>
            </button>
          </div>

        </div>

        {/* ======================================================================= */}
        {/* CLEAN LOADING STATE: "Understanding your project..."                   */}
        {/* ======================================================================= */}
        {analysisState === 'loading' && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-purple-100 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95">
            {/* Pulsing AI Scanner Animation */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-purple-200/50 animate-ping" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/30 relative z-10">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Understanding your project...
              </h3>
              <p className="text-xs sm:text-sm text-purple-700 font-semibold max-w-md mx-auto">
                {loadingSteps[loadingStep]}
              </p>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-center space-x-2 pt-2">
              <span className={`w-2.5 h-2.5 rounded-full transition-colors ${loadingStep >= 0 ? 'bg-purple-600' : 'bg-slate-200'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-colors ${loadingStep >= 1 ? 'bg-purple-600' : 'bg-slate-200'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-colors ${loadingStep >= 2 ? 'bg-purple-600' : 'bg-slate-200'}`} />
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* AI-GENERATED ANALYSIS DISPLAY                                           */}
        {/* ======================================================================= */}
        {analysisState === 'completed' && analysisResult && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Header / Banner */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-2xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-50">
                <div>
                  <div className="flex items-center space-x-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>AI Diagnostic Complete</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Your Project DNA
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    AI-generated understanding of your project.
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <button
                    onClick={() => {
                      setAnalysisState('idle');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 transition-colors"
                  >
                    Edit Form
                  </button>
                  {onNavigateToAnalysis && (
                    <button
                      onClick={() => {
                        const dnaData = {
                          projectName: projectName,
                          problem: problemStatement,
                          solution: solution,
                          domain: domain,
                          technology: technology.split(',').map(s => s.trim()).filter(Boolean),
                          targetUsers: targetUsers,
                          developmentStage: stage,
                          potentialApplications: analysisResult.dna.possibleApplications || [],
                          requiredExpertise: analysisResult.dna.requiredSkills || [],
                          projectNeeds: selectedNeeds
                        };
                        onNavigateToAnalysis(dnaData);
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 transition-colors flex items-center space-x-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Open Full DNA View</span>
                    </button>
                  )}
                  <button
                    onClick={handlePublishProject}
                    disabled={isPublishing}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold flex items-center space-x-2 shadow-sm shadow-purple-500/25 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isPublishing ? 'Publishing...' : 'Save & Publish to Ecosystem'}</span>
                  </button>
                </div>
              </div>

              {/* 1. Project DNA Overview Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Domain & Stage */}
                <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-purple-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Classification</span>
                  <div className="text-base font-extrabold text-slate-900">{analysisResult.dna.domain}</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                      Stage: {stage.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Level {analysisResult.maturity.numericLevel} of 5</span>
                  </div>
                </div>

                {/* Extracted Core Technologies */}
                <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-purple-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Extracted Tech Stack</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.dna.technologies.slice(0, 5).map((tech: string, i: number) => (
                      <span key={i} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-purple-100 text-purple-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Target Audience Identified */}
                <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-purple-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Primary Target Users</span>
                  <p className="text-xs text-slate-700 font-medium line-clamp-2">
                    {targetUsers || analysisResult.dna.potentialUsers?.[0] || 'Technical early-adopters & research institutions'}
                  </p>
                </div>

              </div>

              {/* 2. Maturity Assessment & Scoring */}
              <div className="p-5 rounded-2xl border border-purple-100 bg-white space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">Maturity Assessment & Progression Index</h4>
                    <p className="text-xs text-slate-500">
                      Recommendation: Advance from <span className="font-bold text-purple-700">{stage.toUpperCase()}</span> to <span className="font-bold text-purple-700">{analysisResult.maturity.nextRecommendedStage.toUpperCase()}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500 font-medium">Readiness Score:</span>
                    <span className="text-lg font-extrabold text-purple-700">{analysisResult.maturity.confidenceScore}%</span>
                  </div>
                </div>

                {/* 4 Dimension Factors */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-[#FAF8FF] border border-purple-100">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Code & Firmware</span>
                    <span className="text-base font-extrabold text-slate-900">{analysisResult.maturity.maturityFactors?.codeMaturity || 82}%</span>
                    <div className="w-full bg-purple-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: `${analysisResult.maturity.maturityFactors?.codeMaturity || 82}%` }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF8FF] border border-purple-100">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Tech Validation</span>
                    <span className="text-base font-extrabold text-slate-900">{analysisResult.maturity.maturityFactors?.hardwareValidation || 78}%</span>
                    <div className="w-full bg-purple-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: `${analysisResult.maturity.maturityFactors?.hardwareValidation || 78}%` }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF8FF] border border-purple-100">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">User Testing</span>
                    <span className="text-base font-extrabold text-slate-900">{analysisResult.maturity.maturityFactors?.userTesting || 65}%</span>
                    <div className="w-full bg-purple-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: `${analysisResult.maturity.maturityFactors?.userTesting || 65}%` }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF8FF] border border-purple-100">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Market Scalability</span>
                    <span className="text-base font-extrabold text-slate-900">{analysisResult.maturity.maturityFactors?.marketReadiness || 60}%</span>
                    <div className="w-full bg-purple-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: `${analysisResult.maturity.maturityFactors?.marketReadiness || 60}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/70 text-xs text-purple-900 flex items-start space-x-2">
                  <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <span className="font-bold">AI Assessment:</span> {analysisResult.maturity.reason}
                  </p>
                </div>
              </div>

              {/* 3. Actionable Second-Life Needs Strategy */}
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-slate-900">Customized Ecosystem Catalyst Roadmap</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedNeeds.map((need, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-purple-100 bg-[#FAF8FF] flex items-start space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{need} Intervention</div>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          {need === 'Mentor' && 'Connect with accredited faculty advisors for thermal & embedded protocol validation.'}
                          {need === 'Industry Support' && 'Match with corporate testbed sandboxes (e.g. Tata Mobility, Bosch IoT Hub).'}
                          {need === 'Funding' && 'Eligible for Stage-1 Prototype Micro-Grants (₹1.5L - ₹5.0L) under Afterlife Fund.'}
                          {need === 'Testing' && 'Access certified university high-voltage calibration and climatic test chambers.'}
                          {need === 'Research' && 'Formulate IEEE paper draft and formal intellectual property patent search.'}
                          {need === 'Hardware' && 'Procure component bill of materials and precision sensors via university fab labs.'}
                          {need === 'Team Members' && 'Recruit complementary frontend and embedded firmware developers on the platform.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Publishing Call To Action */}
              <div className="pt-4 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  Ready to connect this innovation with live mentors, testbeds, and funding?
                </div>
                <button
                  id="btn-confirm-publish-project"
                  onClick={handlePublishProject}
                  disabled={isPublishing}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md shadow-purple-500/25 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isPublishing ? 'Publishing Project...' : 'Save & Publish to Ecosystem'}</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
