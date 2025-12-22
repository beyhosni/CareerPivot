package com.careerpivot.backend.roadmap.repository;

import com.careerpivot.backend.roadmap.domain.ShareableLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShareableLinkRepository extends JpaRepository<ShareableLink, Integer> {
    Optional<ShareableLink> findByToken(String token);
}
