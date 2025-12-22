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

    @OneToOne
    @JoinColumn(name = "scenario_id")
    private Scenario scenario;

    private LocalDate startDate;
    private LocalDate endDate;
}
