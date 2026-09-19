/**
 * PROJECT AFTERLIFE - System Type Definitions
 * "Give Every Student Project a Second Life."
 */

export type UserRole = 
  | 'student' 
  | 'mentor' 
  | 'industry' 
  | 'institution' 
  | 'funder' 
  | 'admin';

export type ProjectStage = 
  | 'idea' 
  | 'prototype' 
  | 'tested' 
  | 'pilot' 
  | 'deployment';

export type RequirementType =
  | 'Mentor'
  | 'Mentorship'
  | 'Funding'
  | 'Industry Partner'
  | 'Industry Support'
  | 'Testing Facility'
  | 'Testing'
  | 'Field Testing'
  | 'Dataset'
  | 'Hardware'
  | 'Team Members'
  | 'Market Validation'
  | 'Research Support'
  | 'Research';

export type MilestoneStatus = 
  | 'NOT STARTED' 
  | 'IN PROGRESS' 
  | 'COMPLETED' 
  | 'BLOCKED'
  | 'PLANNED';

export type CollaborationStatus = 
  | 'pending' 
  | 'accepted' 
  | 'rejected';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  college?: string;
  department?: string;
  year?: string;
  skills: string[];
  skillsOrOfferings?: string[];
  areasOfInterest?: string[];
  location?: string;
  photoUrl?: string;
  bio?: string;
  organizationName?: string;
  title?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  createdAt: string;
  isVerified?: boolean;
}

export interface ProjectUploadedFile {
  name: string;
  type: 'pdf' | 'ppt' | 'image' | 'video' | 'document';
  url: string;
  sizeBytes: number;
  uploadedAt: string;
}

export interface ProjectDNA {
  domain: string;
  technologies: string[];
  problem: string;
  solution: string;
  developmentStage: ProjectStage;
  requiredSkills: string[];
  requiredResources: string[];
  potentialUsers: string[];
  possibleApplications: string[];
  keywords: string[];
}

export interface MaturityAssessment {
  currentStage: ProjectStage;
  numericLevel: number; // 1 to 5
  nextRecommendedStage: ProjectStage;
  reason: string;
  confidenceScore: number;
  maturityFactors: {
    codeMaturity: number; // 0-100
    hardwareValidation: number; // 0-100
    userTesting: number; // 0-100
    marketReadiness: number; // 0-100
  };
  disclaimer: string;
}

export interface NeededResourceItem {
  id: string;
  type: RequirementType;
  title: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Project {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerCollege?: string;
  title: string;
  category: string;
  domain: string;
  problemStatement: string;
  proposedSolution: string;
  innovationDescription: string;
  targetUsers?: string;
  imageUrl?: string;
  videoUrl?: string;
  pptUrl?: string;
  technologies: string[];
  programmingLanguages: string[];
  hardwareUsed: string[];
  aiMlUsed: string[];
  githubRepo?: string;
  demoUrl?: string;
  stage: ProjectStage;
  requirements: RequirementType[];
  files: ProjectUploadedFile[];
  projectDNA?: ProjectDNA;
  maturityAssessment?: MaturityAssessment;
  needsNext?: NeededResourceItem[];
  isDiscoverable: boolean;
  createdAt: string;
  updatedAt: string;
  mentorId?: string;
  mentorName?: string;
  industryPartnerId?: string;
  industryPartnerName?: string;
  maturityLevel?: number;
  needs?: { id: string; description: string }[];
  viewCount: number;
}

export interface MatchScoreFactor {
  name: string;
  weight: number;
  score: number;
  description: string;
}

export interface MatchRecommendation {
  id: string;
  targetId: string;
  targetType: 'mentor' | 'industry' | 'institution' | 'funder';
  name: string;
  titleOrOrg: string;
  avatarUrl?: string;
  expertiseOrFocus: string[];
  compatibilityScore: number; // 0-100
  scoreFactors: MatchScoreFactor[];
  matchReasons: string[];
  location?: string;
  status: 'available' | 'requested' | 'connected';
}

export interface ProjectFusionIdea {
  id: string;
  title: string;
  combinedSolutionName: string;
  summary: string;
  projectIds: string[];
  projectTitles: string[];
  complementaryReasons: string[];
  combinedArchitecture: {
    layerName: string;
    contributedBy: string;
    description: string;
  }[];
  synergyScore: number;
  status: 'suggested' | 'requested' | 'collaborating';
}

export interface CollaborationRecord {
  id: string;
  projectAId: string;
  projectATitle: string;
  projectBId: string;
  projectBTitle: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  fusionConceptTitle?: string;
  proposedArchitecture?: string;
  synergyScore?: number;
  message: string;
  status: CollaborationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFusionSuggestion {
  id: string;
  projectAId: string;
  projectATitle: string;
  projectBOwnerId: string;
  projectBOwnerName: string;
  projectBId: string;
  projectBTitle: string;
  synergyScore: number;
  whyComplementary: string;
  combinedSolutionName: string;
  combinedArchitecture: string;
}

export interface MatchResult {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerRole: UserRole;
  matchScore: number;
  matchFactors: {
    domainScore: number;
    techScore: number;
    stageScore: number;
    resourceScore: number;
    techJaccardSimilarity?: number;
    domainCosineSimilarity?: number;
  };
  whyGoodMatch: string;
  matchReasons: string[];
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  deadline: string;
  responsiblePerson: string;
  notes?: string;
  completionDate?: string;
  order: number;
}

export interface Roadmap {
  id: string;
  projectId: string;
  currentStage: ProjectStage;
  stages: {
    stage: ProjectStage;
    label: string;
    completed: boolean;
    active: boolean;
    estimatedCompletion?: string;
  }[];
  updatedAt: string;
}

export interface ActivityTimelineEvent {
  id: string;
  projectId: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'submission' | 'mentor' | 'collaboration' | 'milestone' | 'stage_change' | 'document';
}

export interface SystemNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 
    | 'project_submission'
    | 'mentor_request'
    | 'mentor_acceptance'
    | 'collaboration_request'
    | 'collaboration_acceptance'
    | 'new_recommendation'
    | 'milestone_deadline'
    | 'project_status_update';
  timestamp: string;
  read: boolean;
  actionLink?: string;
}

export interface EcosystemStats {
  totalStudents: number;
  totalProjects: number;
  activeProjects: number;
  mentorConnections: number;
  industryConnections: number;
  collaborationRequests: number;
  projectsInPilot: number;
  projectsDeployed: number;
  domainBreakdown: { domain: string; count: number }[];
  stageBreakdown: { stage: ProjectStage; count: number }[];
  techBreakdown: { tech: string; count: number }[];
  activeMatches?: number;
  pilotsCompleted?: number;
  grantsAllocated?: string;
  fusionsCreated?: number;
}
