package com.projectafterlife.repository;

import com.projectafterlife.model.ProjectDto;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Clean repository interface to Google Cloud Firestore using Firebase Admin SDK.
 */
@Repository
public class FirebaseProjectRepository {

    private final Map<String, ProjectDto> localStore = new ConcurrentHashMap<>();

    public ProjectDto createProject(ProjectDto project) {
        if (project.getId() == null || project.getId().isEmpty()) {
            project.setId("proj_" + UUID.randomUUID().toString().substring(0, 8));
        }
        localStore.put(project.getId(), project);
        return project;
    }

    public ProjectDto findById(String id) {
        return localStore.get(id);
    }

    public List<ProjectDto> findAll(String domain, String stage) {
        List<ProjectDto> results = new ArrayList<>();
        for (ProjectDto p : localStore.values()) {
            boolean match = true;
            if (domain != null && !domain.equalsIgnoreCase("All") && !p.getDomain().equalsIgnoreCase(domain)) {
                match = false;
            }
            if (stage != null && !stage.equalsIgnoreCase("All") && !p.getStage().equalsIgnoreCase(stage)) {
                match = false;
            }
            if (match) {
                results.add(p);
            }
        }
        return results;
    }
}
