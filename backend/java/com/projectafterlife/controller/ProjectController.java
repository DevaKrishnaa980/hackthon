package com.projectafterlife.controller;

import com.projectafterlife.model.ProjectDto;
import com.projectafterlife.service.ProjectService;
import com.projectafterlife.service.MatchingOrchestratorService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/v1/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectService projectService;
    private final MatchingOrchestratorService matchingService;

    public ProjectController(ProjectService projectService, MatchingOrchestratorService matchingService) {
        this.projectService = projectService;
        this.matchingService = matchingService;
    }

    @PostMapping
    public ResponseEntity<ProjectDto> createProject(
            @RequestHeader("Authorization") String token,
            @RequestBody ProjectDto projectDto) {
        try {
            ProjectDto created = projectService.saveProject(token, projectDto);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable String id) {
        ProjectDto project = projectService.getProject(id);
        if (project == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(project);
    }

    @GetMapping
    public ResponseEntity<List<ProjectDto>> getDiscoverableProjects(
            @RequestParam(required = false) String domain,
            @RequestParam(required = false) String stage) {
        return ResponseEntity.ok(projectService.listProjects(domain, stage));
    }

    @GetMapping("/{id}/matches")
    public ResponseEntity<Map<String, Object>> getRecommendedMatches(@PathVariable String id) {
        Map<String, Object> matches = matchingService.computeMatches(id);
        return ResponseEntity.ok(matches);
    }
}
