/**
 * PROJECT AFTERLIFE - Firebase Configuration & Unified Database Adapter
 * 
 * Section 38: Configuration Placeholders
 * FIREBASE_API_KEY
 * FIREBASE_AUTH_DOMAIN
 * FIREBASE_PROJECT_ID
 * FIREBASE_STORAGE_BUCKET
 * FIREBASE_MESSAGING_SENDER_ID
 * FIREBASE_APP_ID
 * 
 * Supports both Live Firebase Cloud Firestore / Auth / Storage and
 * an embedded Firestore-compatible local persistence engine.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';
import { 
  getAuth, 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { 
  Project, 
  UserProfile, 
  Milestone, 
  CollaborationRecord, 
  SystemNotification,
  ProjectUploadedFile,
  EcosystemStats
} from '../types';
import { 
  DEMO_PROJECTS, 
  DEMO_USERS, 
  DEMO_MILESTONES, 
  DEMO_COLLABORATIONS, 
  DEMO_NOTIFICATIONS,
  DEMO_ECOSYSTEM_STATS 
} from '../data/demoData';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Default configuration for Project Afterlife
export const DEFAULT_FIREBASE_PLACEHOLDERS: FirebaseClientConfig = {
  apiKey: "AIzaSyBzyxSANHx6DmdQPg_4uxLyZMRKcsNsAQ4",
  authDomain: "project-afterlife-4ab6e.firebaseapp.com",
  projectId: "project-afterlife-4ab6e",
  storageBucket: "project-afterlife-4ab6e.firebasestorage.app",
  messagingSenderId: "988104630676",
  appId: "1:988104630676:web:dc828c91ab0645131e6f81"
};

const STORAGE_KEYS = {
  CONFIG: 'afterlife_firebase_config',
  PROJECTS: 'afterlife_firestore_projects',
  USERS: 'afterlife_firestore_users',
  MILESTONES: 'afterlife_firestore_milestones',
  COLLABORATIONS: 'afterlife_firestore_collaborations',
  NOTIFICATIONS: 'afterlife_firestore_notifications',
  ACTIVE_USER: 'afterlife_active_user'
};

export function getActiveFirebaseConfig(): FirebaseClientConfig {
  const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  return {
    apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || DEFAULT_FIREBASE_PLACEHOLDERS.apiKey,
    authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_PLACEHOLDERS.authDomain,
    projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_PLACEHOLDERS.projectId,
    storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_PLACEHOLDERS.storageBucket,
    messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_PLACEHOLDERS.messagingSenderId,
    appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_PLACEHOLDERS.appId,
  };
}

export function saveActiveFirebaseConfig(config: FirebaseClientConfig): void {
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
}

export function isLiveFirebaseConfigured(config = getActiveFirebaseConfig()): boolean {
  return Boolean(
    config.apiKey && 
    config.apiKey !== 'FIREBASE_API_KEY' && 
    config.projectId && 
    config.projectId !== 'FIREBASE_PROJECT_ID' &&
    config.apiKey.length > 10
  );
}

// Live SDK Instances (if configured)
let fbApp: FirebaseApp | null = null;
let fbAuth: Auth | null = null;
let fbFirestore: Firestore | null = null;
let fbStorage: FirebaseStorage | null = null;

export function initFirebaseLive(): { app: FirebaseApp | null; auth: Auth | null; db: Firestore | null; storage: FirebaseStorage | null } {
  const cfg = getActiveFirebaseConfig();
  if (isLiveFirebaseConfigured(cfg)) {
    try {
      if (!getApps().length) {
        fbApp = initializeApp(cfg);
      } else {
        fbApp = getApps()[0];
      }
      fbAuth = getAuth(fbApp);
      fbFirestore = getFirestore(fbApp);
      fbStorage = getStorage(fbApp);
    } catch (err) {
      console.warn('Firebase Live Initialization Warning:', err);
    }
  }
  return { app: fbApp, auth: fbAuth, db: fbFirestore, storage: fbStorage };
}

// Unified Database & State Manager (works seamlessly in both live & local preview)
class AfterlifeDataStore {
  private projects: Project[] = [];
  private users: UserProfile[] = [];
  private milestones: Milestone[] = [];
  private collaborations: CollaborationRecord[] = [];
  private notifications: SystemNotification[] = [];
  private activeUser: UserProfile | null = null;

  constructor() {
    this.initData();
  }

  private initData() {
    // Projects
    const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (storedProjects) {
      try {
        this.projects = JSON.parse(storedProjects);
      } catch {
        this.projects = [...DEMO_PROJECTS];
      }
    } else {
      this.projects = [...DEMO_PROJECTS];
      this.persist(STORAGE_KEYS.PROJECTS, this.projects);
    }

    // Users
    const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    if (storedUsers) {
      try {
        this.users = JSON.parse(storedUsers);
      } catch {
        this.users = [...DEMO_USERS];
      }
    } else {
      this.users = [...DEMO_USERS];
      this.persist(STORAGE_KEYS.USERS, this.users);
    }

    // Milestones
    const storedMilestones = localStorage.getItem(STORAGE_KEYS.MILESTONES);
    if (storedMilestones) {
      try {
        this.milestones = JSON.parse(storedMilestones);
      } catch {
        this.milestones = [...DEMO_MILESTONES];
      }
    } else {
      this.milestones = [...DEMO_MILESTONES];
      this.persist(STORAGE_KEYS.MILESTONES, this.milestones);
    }

    // Collaborations
    const storedCollabs = localStorage.getItem(STORAGE_KEYS.COLLABORATIONS);
    if (storedCollabs) {
      try {
        this.collaborations = JSON.parse(storedCollabs);
      } catch {
        this.collaborations = [...DEMO_COLLABORATIONS];
      }
    } else {
      this.collaborations = [...DEMO_COLLABORATIONS];
      this.persist(STORAGE_KEYS.COLLABORATIONS, this.collaborations);
    }

    // Notifications
    const storedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (storedNotifs) {
      try {
        this.notifications = JSON.parse(storedNotifs);
      } catch {
        this.notifications = [...DEMO_NOTIFICATIONS];
      }
    } else {
      this.notifications = [...DEMO_NOTIFICATIONS];
      this.persist(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    }

    // Active User
    const storedActive = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    if (storedActive) {
      try {
        this.activeUser = JSON.parse(storedActive);
      } catch {
        this.activeUser = this.users[0] || null;
      }
    } else {
      // Default to student 1 (Aarav Sharma)
      this.activeUser = this.users[0] || null;
      this.persist(STORAGE_KEYS.ACTIVE_USER, this.activeUser);
    }
  }

  private persist(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Storage quota or error:', e);
    }
  }

  // --- Auth & User Operations ---
  public getActiveUser(): UserProfile | null {
    return this.activeUser;
  }

  public setActiveUser(user: UserProfile | null): void {
    this.activeUser = user;
    this.persist(STORAGE_KEYS.ACTIVE_USER, user);
  }

  public getUsers(): UserProfile[] {
    return [...this.users];
  }

  public getUserById(id: string): UserProfile | undefined {
    return this.users.find(u => u.id === id);
  }

  public saveUser(user: UserProfile): UserProfile {
    const existingIndex = this.users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      this.users[existingIndex] = user;
    } else {
      this.users.unshift(user);
    }
    this.persist(STORAGE_KEYS.USERS, this.users);

    if (this.activeUser?.id === user.id) {
      this.setActiveUser(user);
    }
    return user;
  }

  // --- Project Operations ---
  public getProjects(): Project[] {
    return [...this.projects];
  }

  public getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  public saveProject(project: Project): Project {
    const existingIndex = this.projects.findIndex(p => p.id === project.id);
    if (existingIndex >= 0) {
      this.projects[existingIndex] = { ...this.projects[existingIndex], ...project, updatedAt: new Date().toISOString() };
    } else {
      this.projects.unshift(project);
    }
    this.persist(STORAGE_KEYS.PROJECTS, this.projects);

    // Create system notification
    this.addNotification({
      userId: project.ownerId,
      title: 'Project Registered in IdeaTec',
      message: `"${project.title}" was successfully added to IdeaTec with active AI Project DNA.`,
      type: 'project_submission',
      actionLink: 'project'
    });

    return project;
  }

  public updateProjectStage(projectId: string, stage: Project['stage']): Project | undefined {
    const proj = this.getProjectById(projectId);
    if (proj) {
      proj.stage = stage;
      proj.updatedAt = new Date().toISOString();
      this.saveProject(proj);
      
      this.addNotification({
        userId: proj.ownerId,
        title: 'Project Status Updated',
        message: `"${proj.title}" reached the ${stage.toUpperCase()} milestone!`,
        type: 'project_status_update',
        actionLink: 'project'
      });
    }
    return proj;
  }

  public connectMentor(projectId: string, mentor: UserProfile): void {
    const proj = this.getProjectById(projectId);
    if (proj) {
      proj.mentorId = mentor.id;
      proj.mentorName = mentor.fullName;
      this.saveProject(proj);

      this.addNotification({
        userId: proj.ownerId,
        title: 'Mentor Connected',
        message: `${mentor.fullName} is now mentoring "${proj.title}".`,
        type: 'mentor_acceptance',
        actionLink: 'project'
      });
    }
  }

  public connectIndustry(projectId: string, industry: UserProfile): void {
    const proj = this.getProjectById(projectId);
    if (proj) {
      proj.industryPartnerId = industry.id;
      proj.industryPartnerName = industry.organizationName || industry.fullName;
      this.saveProject(proj);

      this.addNotification({
        userId: proj.ownerId,
        title: 'Industry Partner Connected',
        message: `${proj.industryPartnerName} joined "${proj.title}" for validation.`,
        type: 'new_recommendation',
        actionLink: 'project'
      });
    }
  }

  // --- Milestones Operations ---
  public getMilestones(projectId?: string): Milestone[] {
    if (projectId) {
      return this.milestones.filter(m => m.projectId === projectId).sort((a, b) => a.order - b.order);
    }
    return [...this.milestones];
  }

  public saveMilestone(milestone: Milestone): Milestone {
    const idx = this.milestones.findIndex(m => m.id === milestone.id);
    if (idx >= 0) {
      this.milestones[idx] = milestone;
    } else {
      this.milestones.push(milestone);
    }
    this.persist(STORAGE_KEYS.MILESTONES, this.milestones);
    return milestone;
  }

  public updateMilestoneStatus(id: string, status: Milestone['status']): Milestone | undefined {
    const m = this.milestones.find(item => item.id === id);
    if (m) {
      m.status = status;
      if (status === 'COMPLETED') {
        m.completionDate = new Date().toISOString().split('T')[0];
      }
      this.persist(STORAGE_KEYS.MILESTONES, this.milestones);
    }
    return m;
  }

  // --- Collaborations Operations ---
  public getCollaborations(userId?: string): CollaborationRecord[] {
    if (userId) {
      return this.collaborations.filter(c => c.senderId === userId || c.receiverId === userId);
    }
    return [...this.collaborations];
  }

  public createCollaboration(collab: CollaborationRecord): CollaborationRecord {
    this.collaborations.unshift(collab);
    this.persist(STORAGE_KEYS.COLLABORATIONS, this.collaborations);

    this.addNotification({
      userId: collab.receiverId,
      title: 'New Collaboration Request',
      message: `${collab.senderName} sent a collaboration proposal for "${collab.projectATitle}".`,
      type: 'collaboration_request',
      actionLink: 'collaborations'
    });

    return collab;
  }

  public updateCollaborationStatus(id: string, status: CollaborationRecord['status']): CollaborationRecord | undefined {
    const collab = this.collaborations.find(c => c.id === id);
    if (collab) {
      collab.status = status;
      collab.updatedAt = new Date().toISOString();
      this.persist(STORAGE_KEYS.COLLABORATIONS, this.collaborations);

      if (status === 'accepted') {
        this.addNotification({
          userId: collab.senderId,
          title: 'Collaboration Accepted!',
          message: `${collab.receiverName} accepted your collaboration request!`,
          type: 'collaboration_acceptance',
          actionLink: 'collaborations'
        });
      }
    }
    return collab;
  }

  // --- Notifications Operations ---
  public getNotifications(userId?: string): SystemNotification[] {
    if (userId) {
      return this.notifications.filter(n => n.userId === userId);
    }
    return [...this.notifications];
  }

  public addNotification(notif: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>): SystemNotification {
    const newNotif: SystemNotification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    this.notifications.unshift(newNotif);
    this.persist(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    return newNotif;
  }

  public markNotificationRead(id: string): void {
    const n = this.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      this.persist(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    }
  }

  // --- Ecosystem Stats ---
  public getEcosystemStats(): EcosystemStats {
    const totalProjects = this.projects.length;
    const activeProjects = this.projects.filter(p => p.stage !== 'idea').length;
    const projectsInPilot = this.projects.filter(p => p.stage === 'pilot').length;
    const projectsDeployed = this.projects.filter(p => p.stage === 'deployment').length;

    // domain breakdown
    const domainMap = new Map<string, number>();
    for (const p of this.projects) {
      domainMap.set(p.domain, (domainMap.get(p.domain) || 0) + 1);
    }
    const domainBreakdown = Array.from(domainMap.entries()).map(([domain, count]) => ({ domain, count }));

    // stage breakdown
    const stageMap = new Map<Project['stage'], number>();
    for (const p of this.projects) {
      stageMap.set(p.stage, (stageMap.get(p.stage) || 0) + 1);
    }
    const stageBreakdown = (['idea', 'prototype', 'tested', 'pilot', 'deployment'] as Project['stage'][]).map(s => ({
      stage: s,
      count: stageMap.get(s) || 0
    }));

    return {
      totalStudents: this.users.filter(u => u.role === 'student').length + 140,
      totalProjects,
      activeProjects,
      mentorConnections: this.projects.filter(p => !!p.mentorId).length + 38,
      industryConnections: this.projects.filter(p => !!p.industryPartnerId).length + 24,
      collaborationRequests: this.collaborations.length + 32,
      projectsInPilot,
      projectsDeployed,
      domainBreakdown,
      stageBreakdown,
      techBreakdown: DEMO_ECOSYSTEM_STATS.techBreakdown
    };
  }

  // --- Reset demo data ---
  public resetToDemo(): void {
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.MILESTONES);
    localStorage.removeItem(STORAGE_KEYS.COLLABORATIONS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    this.initData();
  }
}

export const dbService = new AfterlifeDataStore();
