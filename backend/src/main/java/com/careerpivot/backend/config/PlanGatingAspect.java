package com.careerpivot.backend.config;

import com.careerpivot.backend.auth.domain.User;
import com.careerpivot.backend.billing.domain.PlanGuard;
import com.careerpivot.backend.billing.domain.Subscription;
import com.careerpivot.backend.billing.service.BillingService;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class PlanGatingAspect {

    private final BillingService billingService;

    @Before("@annotation(planGuard)")
    public void checkPlan(PlanGuard planGuard) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof User user)) {
            throw new SecurityException("Unauthorized");
        }

        Subscription subscription = billingService.getSubscription(user);

        if (subscription.getPlan().ordinal() < planGuard.value().ordinal()) {
            throw new SecurityException("Ce contenu requiert un plan " + planGuard.value() + " ou supérieur.");
        }
    }
}
