package com.careerpivot.backend.billing.service;

import com.careerpivot.backend.auth.domain.User;
import com.careerpivot.backend.billing.domain.Subscription;
import com.careerpivot.backend.billing.domain.SubscriptionPlan;
import com.careerpivot.backend.billing.repository.SubscriptionRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Slf4j
@Service
@RequiredArgsConstructor
public class BillingService {

    @Value("${stripe.secret-key}")
    private String secretKey;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    private final SubscriptionRepository subscriptionRepository;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public String createCheckoutSession(User user, SubscriptionPlan plan) throws StripeException {
        // Find or create subscription
        Subscription subscription = subscriptionRepository.findByUser(user)
                .orElse(Subscription.builder()
                        .user(user)
                        .plan(SubscriptionPlan.FREE)
                        .status("none")
                        .build());

        subscriptionRepository.save(subscription);

        // Map plans to Stripe Price IDs (Placeholders for now)
        String priceId = switch (plan) {
            case PRO -> "price_pro_placeholder";
            case PREMIUM -> "price_premium_placeholder";
            default -> null;
        };

        if (priceId == null)
            throw new IllegalArgumentException("Invalid plan for checkout");

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setSuccessUrl(frontendUrl + "/dashboard?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(frontendUrl + "/pricing")
                .setCustomerEmail(user.getEmail())
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPrice(priceId)
                        .build())
                .build();

        Session session = Session.create(params);
        return session.getUrl();
    }

    public void handleWebhook(String payload, String sigHeader) throws Exception {
        Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

        log.info("Received Stripe event: {}", event.getType());

        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer().getObject().get();
            handleCheckoutCompleted(session);
        } else if ("customer.subscription.updated".equals(event.getType())) {
            com.stripe.model.Subscription stripeSub = (com.stripe.model.Subscription) event.getDataObjectDeserializer()
                    .getObject().get();
            handleSubscriptionUpdated(stripeSub);
        } else if ("customer.subscription.deleted".equals(event.getType())) {
            com.stripe.model.Subscription stripeSub = (com.stripe.model.Subscription) event.getDataObjectDeserializer()
                    .getObject().get();
            handleSubscriptionDeleted(stripeSub);
        }
    }

    private void handleCheckoutCompleted(Session session) {
        String customerId = session.getCustomer();
        String subscriptionId = session.getSubscription();
        String email = session.getCustomerDetails().getEmail();

        Subscription subscription = subscriptionRepository.findByStripeCustomerId(customerId)
                .orElseGet(() -> subscriptionRepository.findAll().stream()
                        .filter(s -> s.getUser().getEmail().equals(email))
                        .findFirst()
                        .orElse(null));

        if (subscription != null) {
            subscription.setStripeCustomerId(customerId);
            subscription.setStripeSubscriptionId(subscriptionId);
            subscription.setStatus("active");
            subscriptionRepository.save(subscription);
        }
    }

    private void handleSubscriptionUpdated(com.stripe.model.Subscription stripeSub) {
        subscriptionRepository.findByStripeSubscriptionId(stripeSub.getId()).ifPresent(sub -> {
            sub.setStatus(stripeSub.getStatus());
            sub.setCurrentPeriodEnd(LocalDateTime.ofInstant(
                    Instant.ofEpochSecond(stripeSub.getCurrentPeriodEnd()), ZoneId.systemDefault()));
            subscriptionRepository.save(sub);
        });
    }

    private void handleSubscriptionDeleted(com.stripe.model.Subscription stripeSub) {
        subscriptionRepository.findByStripeSubscriptionId(stripeSub.getId()).ifPresent(sub -> {
            sub.setStatus("canceled");
            sub.setPlan(SubscriptionPlan.FREE);
            subscriptionRepository.save(sub);
        });
    }

    public Subscription getSubscription(User user) {
        return subscriptionRepository.findByUser(user)
                .orElse(Subscription.builder()
                        .user(user)
                        .plan(SubscriptionPlan.FREE)
                        .status("active")
                        .build());
    }
}
