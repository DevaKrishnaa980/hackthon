import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { HowItWorksView } from './components/HowItWorksView';
import { ProjectDiscoveryView } from './components/ProjectDiscoveryView';
import { StudentDashboardView } from './components/StudentDashboardView';
import { MentorDashboardView } from './components/MentorDashboardView';
import { IndustryDashboardView } from './components/IndustryDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AuthPageView } from './components/AuthPageView';
import { RegisterPageView } from './components/RegisterPageView';
import { ProjectDetailsView } from './components/ProjectDetailsView';
import { ProjectUploadView } from './components/ProjectUploadView';
import { ProjectUploadModal } from './components/ProjectUploadModal';
import { ProjectAnalysisView, ProjectAnalysisData } from './components/ProjectAnalysisView';
import { SmartMatchingView } from './components/SmartMatchingView';
import { ProjectFusionView } from './components/ProjectFusionView';
import { CollaborationWorkspaceView } from './components/CollaborationWorkspaceView';
import { MentorsDirectoryView } from './components/MentorsDirectoryView';
import { OpportunitiesView } from './components/OpportunitiesView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NotificationCenter } from './components/NotificationCenter';
import { FirebaseSettingsModal } from './components/FirebaseSettingsModal';
import { AuthModal } from './components/AuthModal';
import { TechArchitectureModal } from './components/TechArchitectureModal';
import { ToastNotification, ToastMessage } from './components/ToastNotification';
import { 
  Project, 
  UserProfile, 
  UserRole, 
  Milestone, 
  CollaborationRecord, 
  SystemNotification, 
  EcosystemStats 
} from './types';
import { dbService, initFirebaseLive } from './services/firebaseConfig';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [fusionPreselectedId, setFusionPreselectedId] = useState<string | undefined>(undefined);
  const [latestAnalysisData, setLatestAnalysisData] = useState<ProjectAnalysisData | null>(null);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isFirebaseOpen, setIsFirebaseOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTechOpen, setIsTechOpen] = useState(false);

  // Toast feedback state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: 'success' | 'error' | 'info' | 'loading', message: string, detail?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts(prev => [...prev, { id, type, message, detail }]);
    if (type !== 'loading') {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4500);
    }
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Domain State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [collaborations, setCollaborations] = useState<CollaborationRecord[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<EcosystemStats>({
    totalStudents: 1420,
    totalProjects: 0,
    activeProjects: 0,
    mentorConnections: 28,
    industryConnections: 14,
    collaborationRequests: 32,
    projectsInPilot: 6,
    projectsDeployed: 2,
    domainBreakdown: [],
    stageBreakdown: [],
    techBreakdown: [],
    activeMatches: 0,
    pilotsCompleted: 0,
    grantsAllocated: '₹0L',
    fusionsCreated: 0
  });

  // Initial Load & Listeners
  useEffect(() => {
    initFirebaseLive();
    refreshData();
  }, []);

  const refreshData = () => {
    const loadedProjects = dbService.getProjects();
    const loadedCollabs = dbService.getCollaborations();
    const loadedMilestones = dbService.getMilestones();
    const loadedNotifs = dbService.getNotifications();
    const loadedUsers = dbService.getUsers();
    const user = dbService.getActiveUser();

    setProjects(loadedProjects);
    setCollaborations(loadedCollabs);
    setMilestones(loadedMilestones);
    setNotifications(loadedNotifs);
    setUsers(loadedUsers);
    setCurrentUser(user);

    const inPilot = loadedProjects.filter(p => p.stage === 'pilot').length;
    const deployed = loadedProjects.filter(p => p.stage === 'deployment').length;

    setStats({
      totalStudents: 1420,
      totalProjects: loadedProjects.length,
      activeProjects: loadedProjects.length,
      mentorConnections: 28,
      industryConnections: 14,
      collaborationRequests: loadedCollabs.length,
      projectsInPilot: inPilot,
      projectsDeployed: deployed,
      domainBreakdown: [],
      stageBreakdown: [],
      techBreakdown: [],
      activeMatches: loadedCollabs.filter(c => c.status === 'accepted').length,
      pilotsCompleted: inPilot + deployed,
      grantsAllocated: '₹42.5L',
      fusionsCreated: 3
    });
  };

  // Switch demo persona
  const handleSwitchRole = (newRole: UserRole) => {
    const targetUser = users.find(u => u.role === newRole);
    if (targetUser) {
      dbService.setActiveUser(targetUser);
      setCurrentUser(targetUser);
      showToast('info', `Switched active persona to ${targetUser.fullName} (${newRole.toUpperCase()})`);
    } else {
      if (currentUser) {
        const updated = { ...currentUser, role: newRole };
        dbService.saveUser(updated);
        dbService.setActiveUser(updated);
        setCurrentUser(updated);
        showToast('info', `Updated persona role to ${newRole.toUpperCase()}`);
      }
    }
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenFusionWithProject = (projectId: string) => {
    setFusionPreselectedId(projectId);
    setSelectedProjectId(null);
    setActiveTab('fusion');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProjectCreated = (newProject: Project) => {
    refreshData();
    setSelectedProjectId(newProject.id);
    showToast('success', `Project "${newProject.title}" registered successfully! AI DNA generated.`);
  };

  const handleLogout = () => {
    // Switch to first student user or clear
    const defaultStudent = users.find(u => u.role === 'student');
    if (defaultStudent) {
      dbService.setActiveUser(defaultStudent);
      setCurrentUser(defaultStudent);
      showToast('info', 'Reset active session to student demo account.');
    }
  };

  const activeProject = projects.find(p => p.id === selectedProjectId);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Fallback active user if none set
  const effectiveUser: UserProfile = currentUser || {
    id: 'usr_student_aarav',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@iitd.ac.in',
    role: 'student',
    college: 'IIT Delhi',
    department: 'Electrical Engineering & Computer Science',
    year: '4th Year B.Tech',
    skills: ['IoT', 'Embedded C++', 'TinyML', 'CAN Bus', 'ROS2'],
    skillsOrOfferings: ['IoT', 'Embedded C++', 'TinyML', 'CAN Bus', 'ROS2'],
    areasOfInterest: ['Electric Vehicles', 'CleanTech', 'Autonomous Systems'],
    createdAt: new Date().toISOString()
  };

  const handleNavigate = (tab: string) => {
    setSelectedProjectId(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-[#1E1B4B] flex flex-col font-sans selection:bg-purple-200 selection:text-purple-900">
      
      {/* Universal Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        currentUser={effectiveUser}
        onOpenUpload={() => handleNavigate('upload')}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotifOpen(true)}
        onOpenFirebaseModal={() => setIsFirebaseOpen(true)}
        onOpenAuthModal={() => setIsAuthOpen(true)}
        onOpenTechModal={() => setIsTechOpen(true)}
        onSwitchRole={handleSwitchRole}
        onLogout={handleLogout}
        unreadCount={unreadCount}
      />

      {/* Main View Area */}
      <main className="flex-1">
        
        {/* If a project detail is active, render ProjectDetailsView */}
        {selectedProjectId && activeProject ? (
          <ProjectDetailsView
            project={activeProject}
            onBack={() => setSelectedProjectId(null)}
            currentUser={effectiveUser}
            milestones={milestones}
            onRefreshProject={refreshData}
            onOpenFusionWithProject={handleOpenFusionWithProject}
          />
        ) : (
          <>
            {/* PROJECT UPLOAD PAGE */}
            {activeTab === 'upload' && (
              <ProjectUploadView
                currentUser={effectiveUser}
                onProjectCreated={handleProjectCreated}
                onNavigate={handleNavigate}
                onSelectProject={handleSelectProject}
                onShowToast={showToast}
                onNavigateToAnalysis={(dnaData) => {
                  setLatestAnalysisData(dnaData);
                  setActiveTab('analysis');
                  showToast('info', 'Viewing Project DNA diagnostic page.');
                }}
              />
            )}

            {/* AI PROJECT ANALYSIS PAGE ("Your Project DNA") */}
            {activeTab === 'analysis' && (
              <ProjectAnalysisView
                initialData={latestAnalysisData || undefined}
                currentUser={effectiveUser}
                onConfirm={(confirmed) => {
                  setLatestAnalysisData(confirmed);
                  showToast('success', 'Project DNA confirmed successfully! You can now explore opportunities.');
                }}
                onEdit={(edited) => {
                  setLatestAnalysisData(edited);
                  showToast('info', 'Project DNA updated.');
                }}
                onFindOpportunities={(projectOrData) => {
                  handleNavigate('matching');
                  showToast('info', 'Matching partners and funding opportunities for your Project DNA...');
                }}
                onNavigate={handleNavigate}
              />
            )}

            {/* 1. HOME VIEW */}
            {activeTab === 'home' && (
              <HomeView
                onOpenUpload={() => handleNavigate('upload')}
                onNavigate={handleNavigate}
                onSelectProject={handleSelectProject}
                projects={projects}
                stats={stats}
                currentUser={effectiveUser}
              />
            )}

            {/* 2. ABOUT / MISSION VIEW */}
            {activeTab === 'about' && (
              <AboutView
                onNavigate={handleNavigate}
                onOpenUpload={() => handleNavigate('upload')}
              />
            )}

            {/* 3. HOW IT WORKS VIEW */}
            {activeTab === 'how-it-works' && (
              <HowItWorksView
                onNavigate={handleNavigate}
                onOpenUpload={() => handleNavigate('upload')}
              />
            )}

            {/* 4. PROJECTS DISCOVERY VIEW */}
            {activeTab === 'projects' && (
              <ProjectDiscoveryView
                projects={projects}
                onSelectProject={handleSelectProject}
                onOpenUpload={() => handleNavigate('upload')}
              />
            )}

            {/* 5. LOGIN PAGE */}
            {activeTab === 'login' && (
              <AuthPageView
                initialMode="login"
                onSuccess={(user) => {
                  setCurrentUser(user);
                  refreshData();
                }}
                onNavigate={handleNavigate}
                onShowToast={showToast}
              />
            )}

            {/* 6. REGISTRATION PAGE */}
            {activeTab === 'register' && (
              <RegisterPageView
                onSuccess={(user) => {
                  setCurrentUser(user);
                  refreshData();
                }}
                onNavigate={handleNavigate}
                onShowToast={showToast}
              />
            )}

            {/* 7. SMART MATCHING VIEW */}
            {activeTab === 'matching' && (
              <SmartMatchingView
                projects={projects}
                users={users}
                onSelectProject={handleSelectProject}
                onRefresh={refreshData}
              />
            )}

            {/* 8. PROJECT FUSION VIEW */}
            {activeTab === 'fusion' && (
              <ProjectFusionView
                projects={projects}
                currentUser={effectiveUser}
                initialProjectId={fusionPreselectedId}
                onNavigateToWorkspace={() => handleNavigate('workspace')}
                onSelectProject={handleSelectProject}
              />
            )}

            {/* 9. COLLABORATION WORKSPACE VIEW */}
            {activeTab === 'workspace' && (
              <CollaborationWorkspaceView
                collaborations={collaborations}
                currentUser={effectiveUser}
                onRefresh={refreshData}
              />
            )}

            {/* 10. MENTORS DIRECTORY VIEW */}
            {activeTab === 'mentors' && (
              <MentorsDirectoryView
                users={users}
                currentUser={effectiveUser}
                onRefresh={refreshData}
              />
            )}

            {/* 11. OPPORTUNITIES VIEW */}
            {activeTab === 'opportunities' && (
              <OpportunitiesView
                currentUser={effectiveUser}
                onRefresh={refreshData}
              />
            )}

            {/* 12. ROLE-BASED DASHBOARDS */}
            
            {/* Generic 'dashboard' redirects based on effectiveUser.role */}
            {activeTab === 'dashboard' && (
              <>
                {effectiveUser.role === 'admin' && (
                  <AdminDashboardView
                    stats={stats}
                    projects={projects}
                    users={users}
                    onSelectProject={handleSelectProject}
                    onRefresh={refreshData}
                  />
                )}
                {effectiveUser.role === 'mentor' && (
                  <MentorDashboardView
                    currentUser={effectiveUser}
                    projects={projects}
                    collaborations={collaborations}
                    onSelectProject={handleSelectProject}
                    onNavigateToWorkspace={() => handleNavigate('workspace')}
                    onRefresh={refreshData}
                    onShowToast={showToast}
                  />
                )}
                {effectiveUser.role === 'industry' && (
                  <IndustryDashboardView
                    currentUser={effectiveUser}
                    projects={projects}
                    users={users}
                    onSelectProject={handleSelectProject}
                    onNavigateToOpportunities={() => handleNavigate('opportunities')}
                    onShowToast={showToast}
                  />
                )}
                {(effectiveUser.role === 'student' || effectiveUser.role === 'institution' || effectiveUser.role === 'funder') && (
                  <StudentDashboardView
                    currentUser={effectiveUser}
                    projects={projects}
                    collaborations={collaborations}
                    milestones={milestones}
                    users={users}
                    onOpenUpload={() => handleNavigate('upload')}
                    onSelectProject={handleSelectProject}
                    onNavigate={handleNavigate}
                    onRefresh={refreshData}
                    onShowToast={showToast}
                  />
                )}
              </>
            )}

            {/* Explicit Student Dashboard */}
            {activeTab === 'student-dashboard' && (
              <StudentDashboardView
                currentUser={effectiveUser}
                projects={projects}
                collaborations={collaborations}
                milestones={milestones}
                users={users}
                onOpenUpload={() => handleNavigate('upload')}
                onSelectProject={handleSelectProject}
                onNavigate={handleNavigate}
                onRefresh={refreshData}
                onShowToast={showToast}
              />
            )}

            {/* Explicit Mentor Dashboard */}
            {activeTab === 'mentor-dashboard' && (
              <MentorDashboardView
                currentUser={effectiveUser}
                projects={projects}
                collaborations={collaborations}
                onSelectProject={handleSelectProject}
                onNavigateToWorkspace={() => handleNavigate('workspace')}
                onRefresh={refreshData}
                onShowToast={showToast}
              />
            )}

            {/* Explicit Industry Dashboard */}
            {activeTab === 'industry-dashboard' && (
              <IndustryDashboardView
                currentUser={effectiveUser}
                projects={projects}
                users={users}
                onSelectProject={handleSelectProject}
                onNavigateToOpportunities={() => handleNavigate('opportunities')}
                onShowToast={showToast}
              />
            )}

            {/* Explicit Admin Dashboard */}
            {activeTab === 'admin-dashboard' && (
              <AdminDashboardView
                stats={stats}
                projects={projects}
                users={users}
                onSelectProject={handleSelectProject}
                onRefresh={refreshData}
                onShowToast={showToast}
              />
            )}

          </>
        )}

      </main>

      {/* Universal Footer with Navigation */}
      <Footer
        onOpenTechModal={() => setIsTechOpen(true)}
        onOpenFirebaseModal={() => setIsFirebaseOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* MODALS */}
      {/* 1. Project Upload Modal */}
      <ProjectUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        currentUser={effectiveUser}
        onProjectCreated={handleProjectCreated}
      />

      {/* 2. Global Search Modal (Cmd+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        projects={projects}
        users={users}
        onSelectProject={handleSelectProject}
        onSelectMentor={() => handleNavigate('mentors')}
      />

      {/* 3. Notification Center Drawer */}
      <NotificationCenter
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onNavigate={handleNavigate}
        onRefresh={refreshData}
      />

      {/* 4. Firebase Setup / Config Modal */}
      <FirebaseSettingsModal
        isOpen={isFirebaseOpen}
        onClose={() => setIsFirebaseOpen(false)}
        onConfigSaved={() => {
          refreshData();
          showToast('success', 'Firebase configuration updated successfully!');
        }}
      />

      {/* 5. Quick Profile / Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u: UserProfile) => {
          setCurrentUser(u);
          refreshData();
          showToast('success', `Signed in as ${u.fullName}`);
        }}
      />

      {/* 6. Deep Technical Architecture Modal */}
      <TechArchitectureModal
        isOpen={isTechOpen}
        onClose={() => setIsTechOpen(false)}
      />

      {/* 7. Floating Toast Feedback Notifications */}
      <ToastNotification
        toasts={toasts}
        onDismiss={dismissToast}
      />

    </div>
  );
}
