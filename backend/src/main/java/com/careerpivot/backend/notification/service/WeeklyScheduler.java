package com.careerpivot.backend.notification.service;

import com.careerpivot.backend.auth.domain.User;
import com.careerpivot.backend.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WeeklyScheduler {
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    // Every Monday at 9 AM
    @Scheduled(cron = "0 0 9 * * MON")
    public void sendWeeklyNudges() {
        log.info("Starting weekly nudges check...");
        List<User> users = userRepository.findAll();

        for (User user : users) {
            // Logic to check activity or tasks
            // Simplified for Phase 2: send a generic weekly summary nudge
            notificationService.sendNotification(
                    user,
                    "Résumé de votre semaine",
                    "C'est le moment de faire le point sur votre roadmap CareerPivot !",
                    "INFO");
        }
    }
}
