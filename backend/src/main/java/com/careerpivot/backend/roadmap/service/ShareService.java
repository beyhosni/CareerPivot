package com.careerpivot.backend.roadmap.service;

import com.careerpivot.backend.roadmap.domain.Roadmap;
import com.careerpivot.backend.roadmap.domain.ShareableLink;
import com.careerpivot.backend.roadmap.repository.ShareableLinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShareService {
    private final ShareableLinkRepository shareableLinkRepository;

    public ShareableLink createShareLink(Roadmap roadmap) {
        ShareableLink link = ShareableLink.builder()
                .roadmap(roadmap)
                .token(UUID.randomUUID().toString())
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
        return shareableLinkRepository.save(link);
    }

    public Roadmap getSharedRoadmap(String token) {
        return shareableLinkRepository.findByToken(token)
                .filter(link -> link.getExpiresAt().isAfter(LocalDateTime.now()))
                .map(ShareableLink::getRoadmap)
                .orElse(null);
    }
}
