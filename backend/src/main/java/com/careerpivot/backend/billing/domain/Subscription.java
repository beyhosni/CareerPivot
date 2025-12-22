package com.careerpivot.backend.billing.domain;

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
public class Subscription {
    @Id
    @GeneratedValue
    private Integer id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private SubscriptionPlan plan;

    private String stripeCustomerId;
    private String stripeSubscriptionId;

    private String status; // active, past_due, canceled
    private LocalDateTime currentPeriodEnd;
}
