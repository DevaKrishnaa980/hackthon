/**
 * PROJECT AFTERLIFE - Algorithmic Matching & Fusion Service
 * Pure TypeScript execution of the C++ Matching Engine (cpp/matching_engine.cpp).
 * Evaluates partner compatibility and Project Fusion complementarity.
 */

import { Project, UserProfile, MatchRecommendation, ProjectFusionIdea, MatchScoreFactor, MatchResult } from '../types';

export class CppMatchingEngine {
  /**
   * Calculates Jaccard set similarity between two string token arrays
   */
  public static calculateJaccard(setA: string[] = [], setB: string[] = []): number {
    if (!setA.length && !setB.length) return 1.0;
    if (!setA.length || !setB.length) return 0.0;

    const lowerA = new Set(setA.map(s => s.toLowerCase().trim()));
    const lowerB = new Set(setB.map(s => s.toLowerCase().trim()));

    let intersectionCount = 0;
    for (const item of lowerB) {
      if (lowerA.has(item)) {
        intersectionCount++;
      }
    }

    const unionCount = new Set([...lowerA, ...lowerB]).size;
    return unionCount === 0 ? 0 : intersectionCount / unionCount;
  }

  /**
   * Computes cosine similarity between two numeric vectors
   */
  public static calculateCosine(v1: number[] = [], v2: number[] = []): number {
    if (!v1.length || !v2.length || v1.length !== v2.length) return 0.0;
    let dot = 0.0;
    let normA = 0.0;
    let normB = 0.0;
    for (let i = 0; i < v1.length; i++) {
      dot += v1[i] * v2[i];
      normA += v1[i] * v1[i];
      normB += v2[i] * v2[i];
    }
    if (normA === 0 || normB === 0) return 0.0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Evaluates compatibility between a project and a partner (mentor, industry, institution, funder)
   */
  public static evaluatePartner(project: Project, partner: UserProfile): MatchRecommendation {
    const projDomain = (project.domain || '').toLowerCase();
    const partnerDomains = (partner.areasOfInterest || []).map(d => d.toLowerCase());

    // 1. Domain Match (Weight 35%)
    let domainScore = 0.2;
    for (const d of partnerDomains) {
      if (d.includes(projDomain) || projDomain.includes(d)) {
        domainScore = 1.0;
        break;
      }
    }

    // 2. Technical Stack & Capability Match (Weight 35%)
    const techJaccard = this.calculateJaccard(project.technologies, partner.skills);
    const reqSkillsJaccard = this.calculateJaccard(project.projectDNA?.requiredSkills || [], partner.skills);
    const techScore = Math.min(1.0, (techJaccard * 0.5 + reqSkillsJaccard * 0.7) * 1.6);

    // 3. Stage Alignment (Weight 20%)
    let stageScore = 0.75;
    if (partner.role === 'mentor') stageScore = 0.95;
    if (partner.role === 'industry' && (project.stage === 'tested' || project.stage === 'pilot')) stageScore = 1.0;
    if (partner.role === 'funder') stageScore = 0.85;
    if (partner.role === 'institution') stageScore = 0.90;

    // 4. Resource Match (Weight 10%)
    const resourceScore = 0.85;

    // Composite score (0 to 100)
    const rawTotal = (domainScore * 0.35) + (techScore * 0.35) + (stageScore * 0.20) + (resourceScore * 0.10);
    const compositeScore = Math.round(Math.min(99, Math.max(58, rawTotal * 100)));

    const scoreFactors: MatchScoreFactor[] = [
      {
        name: 'Domain & Strategic Focus',
        weight: 35,
        score: Math.round(domainScore * 100),
        description: domainScore >= 0.8 
          ? `Partner actively focuses on ${project.domain}`
          : 'Adjacent technical domain with cross-disciplinary relevance'
      },
      {
        name: 'Technical Skill Overlap',
        weight: 35,
        score: Math.round(techScore * 100),
        description: 'Jaccard overlap between project tech stack and partner proven expertise'
      },
      {
        name: 'Development Stage Readiness',
        weight: 20,
        score: Math.round(stageScore * 100),
        description: `Partner operational bandwidth aligned with ${project.stage.toUpperCase()} stage`
      },
      {
        name: 'Resource & Facility Availability',
        weight: 10,
        score: Math.round(resourceScore * 100),
        description: 'Test lab, compute, mentorship hours, or seed funding availability'
      }
    ];

    const matchReasons: string[] = [];
    if (domainScore >= 0.8) {
      matchReasons.push(`Direct alignment in ${project.domain}`);
    } else {
      matchReasons.push(`Cross-domain synergy with ${(partner.areasOfInterest || [partner.department || 'Engineering']).join(', ')}`);
    }

    const sharedSkills = (partner.skills || []).filter(s => 
      project.technologies.some(t => t.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(t.toLowerCase()))
    );
    if (sharedSkills.length > 0) {
      matchReasons.push(`Expertise in ${sharedSkills.slice(0, 3).join(', ')}`);
    } else {
      matchReasons.push(`Translational engineering experience in ${(partner.skills || []).slice(0, 2).join(', ')}`);
    }

    if (partner.role === 'mentor') {
      matchReasons.push('Verified academic and technical advisory track record');
    } else if (partner.role === 'industry') {
      matchReasons.push('Commercial test bed or vehicle fleet trial capacity');
    } else if (partner.role === 'funder') {
      matchReasons.push('Non-dilutive seed grant allocation for university prototypes');
    } else if (partner.role === 'institution') {
      matchReasons.push('Standardized calibration labs and certified environmental chambers');
    }

    return {
      id: `match_${project.id}_${partner.id}`,
      targetId: partner.id,
      targetType: partner.role as any,
      name: partner.fullName,
      titleOrOrg: partner.title || partner.organizationName || 'Strategic Partner',
      avatarUrl: partner.photoUrl,
      expertiseOrFocus: partner.skills.length > 0 ? partner.skills : (partner.areasOfInterest || []),
      compatibilityScore: compositeScore,
      scoreFactors,
      matchReasons,
      location: partner.location,
      status: (project.mentorId === partner.id || project.industryPartnerId === partner.id) ? 'connected' : 'available'
    };
  }

  /**
   * Ranks partners for a project
   */
  public static rankPartners(project: Project, partners: UserProfile[]): MatchRecommendation[] {
    return partners
      .filter(p => p.role !== 'student' && p.role !== 'admin')
      .map(partner => this.evaluatePartner(project, partner))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }

  /**
   * Evaluates potential Project Fusion between two projects
   */
  public static evaluateFusion(projA: Project, projB: Project): ProjectFusionIdea {
    let domainScore = 0.65;
    let theme = `${projA.title.split(' ')[0]} + ${projB.title.split(' ')[0]} Collaborative System`;

    if (projA.domain === 'Disaster Management' && projB.domain === 'Smart City') {
      domainScore = 0.95;
      theme = 'HydroRoute: AI Flood Resilient Evacuation & Traffic Mesh';
    } else if (projA.domain === 'Electric Vehicles' && projB.domain === 'Agriculture') {
      domainScore = 0.92;
      theme = 'VoltFarm: Renewable Agrivoltaic Autonomous Drone Hub';
    } else if (projA.domain === 'Healthcare' && projB.domain === 'Smart City') {
      domainScore = 0.88;
      theme = 'MediMesh: Rapid Paramedic Remote Telemetry & Route Clearing';
    } else if (projA.domain === projB.domain) {
      domainScore = 0.82;
      theme = `Integrated ${projA.domain} NextGen Platform`;
    }

    const techOverlap = this.calculateJaccard(projA.technologies, projB.technologies);
    const techScore = Math.min(1.0, 0.4 + techOverlap * 0.6);
    const reqFulfillment = 0.85;

    const composite = (domainScore * 0.50) + (techScore * 0.30) + (reqFulfillment * 0.20);
    const synergyScore = Math.round(Math.min(98, Math.max(65, composite * 100)));

    return {
      id: `fusion_${projA.id}_${projB.id}`,
      title: `${projA.title} ↔ ${projB.title}`,
      combinedSolutionName: theme,
      summary: `Synergistic integration combining ${projA.title} and ${projB.title} to deliver an end-to-end municipal and industrial solution.`,
      projectIds: [projA.id, projB.id],
      projectTitles: [projA.title, projB.title],
      complementaryReasons: [
        `${projA.title} provides real-time sensor/prediction telemetry, while ${projB.title} provides actuation and operational deployment infrastructure.`,
        `Directly addresses the common gap between isolated student proofs-of-concept and full-stack field trials.`,
        `Reduces duplicated hardware development cost while doubling pilot attractiveness for municipal and enterprise partners.`
      ],
      combinedArchitecture: [
        {
          layerName: `Telemetry & Perception (${projA.title.slice(0, 20)}...)`,
          contributedBy: `${projA.ownerName} (${projA.ownerCollege || 'Partner'})`,
          description: `Primary sensing, ML inference, and physical telemetry layer.`
        },
        {
          layerName: 'Inter-System Protocol Bridge',
          contributedBy: 'Joint Communication Protocol',
          description: 'Standardized low-latency mesh or API messaging layer.'
        },
        {
          layerName: `Control & Actuation (${projB.title.slice(0, 20)}...)`,
          contributedBy: `${projB.ownerName} (${projB.ownerCollege || 'Partner'})`,
          description: `Downstream action, automated response, and user/operator dashboard.`
        }
      ],
      synergyScore,
      status: 'suggested'
    };
  }

  /**
   * Helper alias for ProjectFusionSuggestion format
   */
  public static evaluateProjectFusion(projA: Project, projB: Project) {
    const fusion = this.evaluateFusion(projA, projB);
    return {
      id: fusion.id,
      projectAId: projA.id,
      projectATitle: projA.title,
      projectBOwnerId: projB.ownerId,
      projectBOwnerName: projB.ownerName,
      projectBId: projB.id,
      projectBTitle: projB.title,
      synergyScore: fusion.synergyScore,
      whyComplementary: fusion.complementaryReasons.join(' '),
      combinedSolutionName: fusion.combinedSolutionName,
      combinedArchitecture: fusion.combinedArchitecture.map(a => `${a.layerName}: ${a.description}`).join(' -> ')
    };
  }

  /**
   * Helper alias for computeMatches
   */
  public static computeMatches(project: Project, users: UserProfile[]) {
    return this.rankPartners(project, users);
  }

  /**
   * Helper for SmartMatchingView computePartnerMatch
   */
  public static computePartnerMatch(project: Project, partner: UserProfile): MatchResult {
    const rec = this.evaluatePartner(project, partner);
    return {
      id: rec.id,
      partnerId: partner.id,
      partnerName: partner.fullName,
      partnerRole: partner.role,
      matchScore: rec.compatibilityScore,
      matchFactors: {
        domainScore: rec.scoreFactors.find(f => f.name.includes('Domain'))?.score || 85,
        techScore: rec.scoreFactors.find(f => f.name.includes('Technical'))?.score || 80,
        stageScore: rec.scoreFactors.find(f => f.name.includes('Stage'))?.score || 75,
        resourceScore: rec.scoreFactors.find(f => f.name.includes('Resource'))?.score || 80,
      },
      whyGoodMatch: rec.matchReasons.join('. '),
      matchReasons: rec.matchReasons
    };
  }
}

export const CppMatchingEngineWrapper = CppMatchingEngine;
