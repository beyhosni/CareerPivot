package com.careerpivot.backend.assessment.repository;

import com.careerpivot.backend.assessment.domain.Assessment;
import com.careerpivot.backend.auth.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AssessmentRepository extends JpaRepository<Assessment, Integer> {
    Optional<Assessment> findByUser(User user);
}
