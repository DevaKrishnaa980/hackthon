#ifndef PROJECT_AFTERLIFE_MATCHING_ENGINE_HPP
#define PROJECT_AFTERLIFE_MATCHING_ENGINE_HPP

#include <string>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <cmath>
#include <algorithm>

namespace AfterlifeCore {

struct ProjectFeatures {
    std::string projectId;
    std::string domain;
    std::string stage; // idea, prototype, tested, pilot, deployment
    std::vector<std::string> technologies;
    std::vector<std::string> requiredSkills;
    std::vector<std::string> requirements; // mentor, funding, industry, testing
    std::vector<double> embeddingVector; // optional dense semantic vector
};

struct PartnerFeatures {
    std::string partnerId;
    std::string type; // mentor, industry, institution, funder
    std::string name;
    std::vector<std::string> domains;
    std::vector<std::string> expertiseSkills;
    std::vector<std::string> supportedStages;
    std::string location;
};

struct CompatibilityFactor {
    std::string factorName;
    double weight;
    double score; // 0.0 to 1.0
    std::string explanation;
};

struct CompatibilityResult {
    std::string targetId;
    std::string targetType;
    double compositeScore; // 0 to 100
    std::vector<CompatibilityFactor> factors;
    std::vector<std::string> matchReasons;
};

struct FusionSynergyResult {
    std::string projectAId;
    std::string projectBId;
    double synergyScore; // 0 to 100
    double domainComplementarity;
    double techStackCompatibility;
    double requirementFulfillment;
    std::string combinedTheme;
    std::vector<std::string> complementaryReasons;
};

class MatchingEngine {
public:
    MatchingEngine() = default;

    // Calculates Jaccard set similarity between two string token sets
    static double calculateJaccard(const std::vector<std::string>& setA, const std::vector<std::string>& setB);

    // Computes cosine similarity between two numeric feature vectors
    static double calculateCosineSimilarity(const std::vector<double>& v1, const std::vector<double>& v2);

    // Matches a student project to a potential mentor/industry/institution/funder
    CompatibilityResult evaluatePartnerCompatibility(
        const ProjectFeatures& project, 
        const PartnerFeatures& partner
    );

    // Evaluates potential Project Fusion synergy between two student projects
    FusionSynergyResult evaluateFusionSynergy(
        const ProjectFeatures& projA,
        const ProjectFeatures& projB
    );

    // Multi-project ranking
    std::vector<CompatibilityResult> rankPartners(
        const ProjectFeatures& project,
        const std::vector<PartnerFeatures>& partners,
        size_t topN = 5
    );
};

} // namespace AfterlifeCore

#endif // PROJECT_AFTERLIFE_MATCHING_ENGINE_HPP
