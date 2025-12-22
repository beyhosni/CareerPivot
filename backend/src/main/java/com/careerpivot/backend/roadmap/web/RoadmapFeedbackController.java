package com.careerpivot.backend.roadmap.web;

import com.careerpivot.backend.auth.domain.User;
import com.careerpivot.backend.roadmap.domain.Roadmap;
import com.careerpivot.backend.roadmap.domain.RoadmapFeedback;
import com.careerpivot.backend.roadmap.repository.RoadmapFeedbackRepository;
import com.careerpivot.backend.roadmap.repository.RoadmapRepository;
import com.careerpivot.backend.roadmap.service.RoadmapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roadmaps")
@RequiredArgsConstructor
public class RoadmapFeedbackController {

    private final RoadmapService roadmapService;
    private final RoadmapRepository roadmapRepository;
    private final RoadmapFeedbackRepository roadmapFeedbackRepository;

    @PostMapping("/{id}/feedback")
    public ResponseEntity<RoadmapFeedback> addFeedback(
            @PathVariable Integer id,
            @AuthenticationPrincipal User coach,
            @RequestBody Map<String, String> request) {

        Roadmap roadmap = roadmapRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Roadmap non trouvée"));

        String comments = request.get("comments");
        String suggestedAdjustments = request.get("suggestedAdjustments");

        return ResponseEntity.ok(roadmapService.addFeedback(roadmap, coach, comments, suggestedAdjustments));
    }

    @GetMapping("/{id}/feedback")
    public ResponseEntity<List<RoadmapFeedback>> getFeedback(@PathVariable Integer id) {
        Roadmap roadmap = roadmapRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Roadmap non trouvée"));

        return ResponseEntity.ok(roadmapFeedbackRepository.findByRoadmapOrderByVersionDesc(roadmap));
    }
}
