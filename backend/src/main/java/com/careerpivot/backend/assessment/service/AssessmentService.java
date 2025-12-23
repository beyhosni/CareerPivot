package com.careerpivot.backend.assessment.service;

import com.careerpivot.backend.assessment.domain.Assessment;
import com.careerpivot.backend.assessment.repository.AssessmentRepository;
import com.careerpivot.backend.assessment.web.AssessmentRequest;
import com.careerpivot.backend.auth.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AssessmentService {

    private final AssessmentRepository repository;

    public Assessment saveAssessment(User user, AssessmentRequest request) {
        Assessment assessment = repository.findByUser(user)
                .orElse(Assessment.builder().user(user).build());

        assessment.setAnswers(request.getAnswers());
        return repository.save(assessment);
    }

    public Assessment getAssessment(User user) {
        return repository.findByUser(user)
                .orElse(null);
    }
}
