package com.careerpivot.backend.scenario.repository;

import com.careerpivot.backend.scenario.domain.Scenario;
import com.careerpivot.backend.auth.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ScenarioRepository extends JpaRepository<Scenario, Integer> {
    List<Scenario> findByUser(User user);
}
