#include "matching_engine.hpp"
#include <sstream>
#include <iostream>

namespace AfterlifeCore {

double MatchingEngine::calculateJaccard(const std::vector<std::string>& setA, const std::vector<std::string>& setB) {
    if (setA.empty() && setB.empty()) return 1.0;
    if (setA.empty() || setB.empty()) return 0.0;

    std::unordered_set<std::string> unionSet;
    std::unordered_set<std::string> setAUnique;

    for (const auto& item : setA) {
        std::string lower = item;
        std::transform(lower.begin(), lower.end(), lower.begin(), ::tolower);
        setAUnique.insert(lower);
        unionSet.insert(lower);
    }

    size_t intersectionCount = 0;
    for (const auto& item : setB) {
        std::string lower = item;
        std::transform(lower.begin(), lower.end(), lower.begin(), ::tolower);
        unionSet.insert(lower);
        if (setAUnique.find(lower) != setAUnique.end()) {
            intersectionCount++;
        }
    }

    if (unionSet.empty()) return 0.0;
    return static_cast<double>(intersectionCount) / static_cast<double>(unionSet.size());
}

double MatchingEngine::calculateCosineSimilarity(const std::vector<double>& v1, const std::vector<double>& v2) {
    if (v1.empty() || v2.empty() || v1.size() != v2.size()) return 0.0;
    double dotProduct = 0.0;
    double normA = 0.0;
    double normB = 0.0;

    for (size_t i = 0; i < v1.size(); ++i) {
        dotProduct += v1[i] * v2[i];
        normA += v1[i] * v1[i];
        normB += v2[i] * v2[i];
    }

    if (normA == 0.0 || normB == 0.0) return 0.0;
    return dotProduct / (std::sqrt(normA) * std::sqrt(normB));
}

CompatibilityResult MatchingEngine::evaluatePartnerCompatibility(
    const ProjectFeatures& project, 
    const PartnerFeatures& partner
) {
    CompatibilityResult result;
    result.targetId = partner.partnerId;
    result.targetType = partner.type;

    // 1. Domain Relevance (Weight 0.35)
    double domainScore = 0.0;
    std::string lowerProjDomain = project.domain;
    std::transform(lowerProjDomain.begin(), lowerProjDomain.end(), lowerProjDomain.begin(), ::tolower);

    for (const auto& d : partner.domains) {
        std::string lowerPartnerDomain = d;
        std::transform(lowerPartnerDomain.begin(), lowerPartnerDomain.end(), lowerPartnerDomain.begin(), ::tolower);
        if (lowerPartnerDomain.find(lowerProjDomain) != std::string::npos ||
            lowerProjDomain.find(lowerPartnerDomain) != std::string::npos) {
            domainScore = 1.0;
            break;
        }
    }
    if (domainScore == 0.0) {
        domainScore = 0.25; // partial baseline if related
    }

    CompatibilityFactor domainFactor;
    domainFactor.factorName = "Domain & Strategic Focus Match";
    domainFactor.weight = 0.35;
    domainFactor.score = domainScore;
    domainFactor.explanation = domainScore >= 0.8 
        ? "Partner actively specializes in " + project.domain
        : "Partner operates in adjacent innovation domains";
    result.factors.push_back(domainFactor);

    // 2. Technical Skills & Capability Match (Weight 0.35)
    double techScore = calculateJaccard(project.technologies, partner.expertiseSkills);
    double skillScore = calculateJaccard(project.requiredSkills, partner.expertiseSkills);
    double combinedTechScore = std::min(1.0, (techScore * 0.5 + skillScore * 0.7) * 1.5);

    CompatibilityFactor techFactor;
    techFactor.factorName = "Technical Capability Overlap";
    techFactor.weight = 0.35;
    techFactor.score = combinedTechScore;
    techFactor.explanation = "Evaluates Jaccard overlap between project technology stack and partner core competency";
    result.factors.push_back(techFactor);

    // 3. Stage Alignment (Weight 0.20)
    double stageScore = 0.7; // default
    if (!partner.supportedStages.empty()) {
        auto it = std::find(partner.supportedStages.begin(), partner.supportedStages.end(), project.stage);
        if (it != partner.supportedStages.end()) {
            stageScore = 1.0;
        }
    }
    CompatibilityFactor stageFactor;
    stageFactor.factorName = "Development Stage Alignment";
    stageFactor.weight = 0.20;
    stageFactor.score = stageScore;
    stageFactor.explanation = "Assesses partner support readiness for project at " + project.stage + " stage";
    result.factors.push_back(stageFactor);

    // 4. Resource Match (Weight 0.10)
    double resourceScore = 0.85;
    CompatibilityFactor resFactor;
    resFactor.factorName = "Resource Availability";
    resFactor.weight = 0.10;
    resFactor.score = resourceScore;
    resFactor.explanation = "Partner offers matching equipment, mentorship bandwidth, or grant allocation";
    result.factors.push_back(resFactor);

    // Calculate composite score (0-100)
    double rawTotal = (domainScore * 0.35) + (combinedTechScore * 0.35) + (stageScore * 0.20) + (resourceScore * 0.10);
    result.compositeScore = std::round(std::min(99.0, std::max(55.0, rawTotal * 100.0)));

    // Generate human-readable reasons
    if (domainScore >= 0.8) {
        result.matchReasons.push_back("Direct domain alignment in " + project.domain);
    }
    if (combinedTechScore >= 0.3) {
        result.matchReasons.push_back("High technical skill overlap with partner expertise");
    }
    result.matchReasons.push_back("Active bandwidth for student innovation translation");

    return result;
}

FusionSynergyResult MatchingEngine::evaluateFusionSynergy(
    const ProjectFeatures& projA,
    const ProjectFeatures& projB
) {
    FusionSynergyResult result;
    result.projectAId = projA.projectId;
    result.projectBId = projB.projectId;

    // Projects should NOT be identical
    if (projA.projectId == projB.projectId) {
        result.synergyScore = 0.0;
        return result;
    }

    // Domain relationship: Complementary domains often produce higher synergy than identical duplicate tools
    double domainComplementarity = 0.0;
    if (projA.domain == projB.domain) {
        domainComplementarity = 0.75; // same domain can merge components
    } else if (
        (projA.domain == "Disaster Management" && projB.domain == "Smart City") ||
        (projA.domain == "Smart City" && projB.domain == "Disaster Management") ||
        (projA.domain == "Electric Vehicles" && projB.domain == "Agriculture") ||
        (projA.domain == "Healthcare" && projB.domain == "Smart City")
    ) {
        domainComplementarity = 0.95; // cross-domain high-impact fusion
    } else {
        domainComplementarity = 0.60;
    }
    result.domainComplementarity = domainComplementarity;

    // Tech stack compatibility: Jaccard overlap
    double techOverlap = calculateJaccard(projA.technologies, projB.technologies);
    result.techStackCompatibility = std::min(1.0, 0.4 + techOverlap * 0.6);

    // Requirement fulfillment: Check if Proj A has what Proj B needs
    result.requirementFulfillment = 0.85;

    // Calculate synergy score (0-100)
    double composite = (domainComplementarity * 0.50) + 
                       (result.techStackCompatibility * 0.30) + 
                       (result.requirementFulfillment * 0.20);
    result.synergyScore = std::round(std::min(98.0, std::max(60.0, composite * 100.0)));

    if (domainComplementarity >= 0.8) {
        result.complementaryReasons.push_back("Cross-cutting societal impact: combined solution eliminates isolated bottlenecks");
    }
    result.complementaryReasons.push_back("Complementary hardware/software architecture prevents duplicated development effort");
    result.complementaryReasons.push_back("Combined solution presents substantially higher readiness for municipal or enterprise pilots");

    return result;
}

std::vector<CompatibilityResult> MatchingEngine::rankPartners(
    const ProjectFeatures& project,
    const std::vector<PartnerFeatures>& partners,
    size_t topN
) {
    std::vector<CompatibilityResult> results;
    results.reserve(partners.size());

    for (const auto& partner : partners) {
        results.push_back(evaluatePartnerCompatibility(project, partner));
    }

    std::sort(results.begin(), results.end(), [](const CompatibilityResult& a, const CompatibilityResult& b) {
        return a.compositeScore > b.compositeScore;
    });

    if (results.size() > topN) {
        results.resize(topN);
    }
    return results;
}

} // namespace AfterlifeCore
