package com.careerpivot.backend.roadmap.domain;

import com.careerpivot.backend.scenario.domain.Scenario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Roadmap {
    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "scenario_id")
    private Scenario scenario;

    @Enumerated(EnumType.STRING)
    private RoadmapHorizon horizon;

    @Enumerated(EnumType.STRING)
    private RoadmapStatus status;

    private Integer version;

    @ManyToOne
    @JoinColumn(name = "parent_roadmap_id")
    private Roadmap parentRoadmap;

    private LocalDate startDate;
    private LocalDate endDate;
}
