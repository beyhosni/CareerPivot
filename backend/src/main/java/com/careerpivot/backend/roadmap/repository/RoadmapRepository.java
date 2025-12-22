package com.careerpivot.backend.roadmap.repository;

import com.careerpivot.backend.roadmap.domain.Roadmap;
import com.careerpivot.backend.scenario.domain.Scenario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import com.careerpivot.backend.auth.domain.User;
import java.util.List;

public interface RoadmapRepository extends JpaRepository<Roadmap, Integer> {
    Optional<Roadmap> findByScenario(Scenario scenario);

    Optional<Roadmap> findByScenario_User(User user);
}
