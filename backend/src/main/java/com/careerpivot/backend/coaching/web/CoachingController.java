package com.careerpivot.backend.coaching.web;

import com.careerpivot.backend.auth.domain.User;
import com.careerpivot.backend.coaching.domain.CoachingSession;
import com.careerpivot.backend.coaching.service.CoachingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coaching")
@RequiredArgsConstructor
public class CoachingController {

    private final CoachingService coachingService;

    @GetMapping("/coaches")
    public ResponseEntity<List<User>> getCoaches(@RequestParam(required = false) String industry) {
        return ResponseEntity.ok(coachingService.getAvailableCoaches(industry));
    }

    @PostMapping("/sessions")
    public ResponseEntity<CoachingSession> bookSession(@AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> request) {
        Integer coachId = (Integer) request.get("coachId");
        LocalDateTime time = LocalDateTime.parse(request.get("scheduledAt").toString());
        return ResponseEntity.ok(coachingService.bookSession(user, coachId, time));
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<CoachingSession>> getSessions(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(coachingService.getUserSessions(user));
    }

    @PostMapping("/sessions/{id}/feedback")
    public ResponseEntity<Void> submitFeedback(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        coachingService.submitFeedback(id, request.get("feedback"));
        return ResponseEntity.ok().build();
    }
}
