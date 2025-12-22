package com.careerpivot.backend.billing.web;

import com.careerpivot.backend.auth.domain.User;
import com.careerpivot.backend.billing.domain.Subscription;
import com.careerpivot.backend.billing.domain.SubscriptionPlan;
import com.careerpivot.backend.billing.service.BillingService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/billing")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, String>> createCheckout(@AuthenticationPrincipal User user,
            @RequestBody Map<String, String> request) throws StripeException {
        SubscriptionPlan plan = SubscriptionPlan.valueOf(request.get("plan").toUpperCase());
        String url = billingService.createCheckoutSession(user, plan);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> handleWebhook(@RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            billingService.handleWebhook(payload, sigHeader);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/subscription")
    public ResponseEntity<Subscription> getSubscription(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(billingService.getSubscription(user));
    }
}
