package com.projectafterlife.service;

import com.projectafterlife.model.ProjectDto;
import com.projectafterlife.repository.FirebaseProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final FirebaseProjectRepository repository;

    public ProjectService(FirebaseProjectRepository repository) {
        this.repository = repository;
    }

    public ProjectDto saveProject(String authToken, ProjectDto dto) {
        // Authenticate token with Firebase Auth SDK
        // Validate payload fields
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Project title is required");
        }
        return repository.createProject(dto);
    }

    public ProjectDto getProject(String id) {
        return repository.findById(id);
    }

    public List<ProjectDto> listProjects(String domain, String stage) {
        return repository.findAll(domain, stage);
    }
}
