package com.careerpivot.backend.coaching.domain;

import com.careerpivot.backend.auth.domain.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class CoachingSession {
    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "coach_id")
    private User coach;

    private LocalDateTime requestedAt;
    private LocalDateTime scheduledAt;

    private String meetingLink;

    private String status; // REQUESTED, CONFIRMED, COMPLETED, CANCELED

    @Column(columnDefinition = "TEXT")
    private String coachNotes;

    @Column(columnDefinition = "TEXT")
    private String userFeedback;
}
