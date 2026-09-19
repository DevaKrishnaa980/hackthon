package com.projectafterlife.model;

import java.util.List;

public class ProjectDto {
    private String id;
    private String ownerId;
    private String ownerName;
    private String title;
    private String domain;
    private String problemStatement;
    private String proposedSolution;
    private String stage; // idea, prototype, tested, pilot, deployment
    private List<String> technologies;
    private List<String> requirements;
    private boolean isDiscoverable;

    public ProjectDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getProblemStatement() { return problemStatement; }
    public void setProblemStatement(String problemStatement) { this.problemStatement = problemStatement; }

    public String getProposedSolution() { return proposedSolution; }
    public void setProposedSolution(String proposedSolution) { this.proposedSolution = proposedSolution; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public List<String> getTechnologies() { return technologies; }
    public void setTechnologies(List<String> technologies) { this.technologies = technologies; }

    public List<String> getRequirements() { return requirements; }
    public void setRequirements(List<String> requirements) { this.requirements = requirements; }

    public boolean isDiscoverable() { return isDiscoverable; }
    public void setDiscoverable(boolean discoverable) { isDiscoverable = discoverable; }
}
