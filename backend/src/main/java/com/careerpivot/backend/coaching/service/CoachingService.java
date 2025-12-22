package com.careerpivot.backend.coaching.service;

import com.careerpivot.backend.auth.domain.Role;
import com.careerpivot.backend.auth.domain.User;
import com.careerpivot.backend.auth.repository.UserRepository;
import com.careerpivot.backend.coaching.domain.CoachingSession;
import com.careerpivot.backend.coaching.repository.CoachingSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CoachingService {

    private final CoachingSessionRepository sessionRepository;
    private final UserRepository userRepository;

    public List<User> getAvailableCoaches(String industry) {
        List<User> coaches = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.COACH)
                .toList();

        if (industry != null && !industry.isEmpty()) {
            return coaches.stream()
                    .filter(c -> industry.equalsIgnoreCase(c.getIndustry()))
                    .toList();
        }
        return coaches;
    }

    public CoachingSession bookSession(User user, Integer coachId, LocalDateTime scheduledAt) {
        User coach = userRepository.findById(coachId)
                .filter(u -> u.getRole() == Role.COACH)
                .orElseThrow(() -> new IllegalArgumentException("Coach non trouvé"));

        CoachingSession session = CoachingSession.builder()
                .user(user)
                .coach(coach)
                .requestedAt(LocalDateTime.now())
                .scheduledAt(scheduledAt)
                .status("REQUESTED")
                .build();

        return sessionRepository.save(session);
    }

    public List<CoachingSession> getUserSessions(User user) {
        return sessionRepository.findByUser(user);
    }

    public List<CoachingSession> getCoachSessions(User coach) {
        return sessionRepository.findByCoach(coach);
    }

    public void submitFeedback(Integer sessionId, String feedback) {
        sessionRepository.findById(sessionId).ifPresent(s -> {
            s.setUserFeedback(feedback);
            sessionRepository.save(s);
        });
    }

    public void updateStatus(Integer sessionId, String status) {
        sessionRepository.findById(sessionId).ifPresent(s -> {
            s.setStatus(status);
            sessionRepository.save(s);
        });
    }
}
