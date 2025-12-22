package com.careerpivot.backend.roadmap.repository;

import com.careerpivot.backend.roadmap.domain.Roadmap;
import com.careerpivot.backend.roadmap.domain.RoadmapFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoadmapFeedbackRepository extends JpaRepository<RoadmapFeedback, Integer> {
    List<RoadmapFeedback> findByRoadmapOrderByVersionDesc(Roadmap roadmap);
}
