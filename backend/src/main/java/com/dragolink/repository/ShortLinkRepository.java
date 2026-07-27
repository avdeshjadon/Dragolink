package com.dragolink.repository;

import com.dragolink.entity.ShortLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ShortLinkRepository extends JpaRepository<ShortLink, Long> {
    Optional<ShortLink> findByShortCode(String shortCode);
    Optional<ShortLink> findByCustomAlias(String customAlias);
    List<ShortLink> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<ShortLink> findByCampaignId(Long campaignId);
    long countByUserId(Long userId);
    
    boolean existsByCustomAlias(String customAlias);
    boolean existsByShortCode(String shortCode);

    @Modifying
    @Query("UPDATE ShortLink s SET s.clickCount = s.clickCount + 1 WHERE s.id = :id")
    void incrementClickCount(@Param("id") Long id);
}
