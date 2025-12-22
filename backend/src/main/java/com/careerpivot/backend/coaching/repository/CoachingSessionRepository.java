package com.careerpivot.backend.coaching.repository;

import com.careerpivot.backend.auth.domain.User;
import com.careerpivot.backend.coaching.domain.CoachingSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CoachingSessionRepository extends JpaRepository<CoachingSession, Integer> {
    List<CoachingSession> findByUser(User user);

    List<CoachingSession> findByCoach(User coach);

    List<CoachingSession> findByStatus(String status);
}
