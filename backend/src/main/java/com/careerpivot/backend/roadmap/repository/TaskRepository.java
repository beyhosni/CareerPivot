package com.careerpivot.backend.roadmap.repository;

import com.careerpivot.backend.roadmap.domain.Task;
import com.careerpivot.backend.roadmap.domain.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findByRoadmap(Roadmap roadmap);
}
