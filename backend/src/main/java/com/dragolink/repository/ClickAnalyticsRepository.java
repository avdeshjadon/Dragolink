/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.repository;

import com.dragolink.entity.ClickAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface ClickAnalyticsRepository extends JpaRepository<ClickAnalytics, Long> {
    List<ClickAnalytics> findByShortLinkIdOrderByClickedAtDesc(Long shortLinkId);
    void deleteByShortLinkId(Long shortLinkId);
    long countByShortLink_User_Id(Long userId);

    @Query("SELECT c.browser AS browser, COUNT(c) AS count FROM ClickAnalytics c WHERE c.shortLink.user.id = :userId AND (c.isBot IS NULL OR c.isBot = false) GROUP BY c.browser")
    List<Map<String, Object>> countClicksByBrowser(@Param("userId") Long userId);

    @Query("SELECT c.deviceType AS device, COUNT(c) AS count FROM ClickAnalytics c WHERE c.shortLink.user.id = :userId AND (c.isBot IS NULL OR c.isBot = false) GROUP BY c.deviceType")
    List<Map<String, Object>> countClicksByDevice(@Param("userId") Long userId);

    @Query("SELECT FUNCTION('DATE', c.clickedAt) AS date, COUNT(c) AS count FROM ClickAnalytics c WHERE c.shortLink.user.id = :userId AND c.clickedAt >= :startDate AND (c.isBot IS NULL OR c.isBot = false) GROUP BY FUNCTION('DATE', c.clickedAt) ORDER BY date")
    List<Map<String, Object>> countClicksByDate(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate);

    @Query("SELECT COUNT(DISTINCT CONCAT(c.ipAddress, COALESCE(c.userAgent, ''))) FROM ClickAnalytics c WHERE c.shortLink.user.id = :userId AND (c.isBot IS NULL OR c.isBot = false)")
    long countUniqueVisitorsByUserId(@Param("userId") Long userId);

    @Query("SELECT c.referrer AS referrer, COUNT(c) AS count FROM ClickAnalytics c WHERE c.shortLink.user.id = :userId AND (c.isBot IS NULL OR c.isBot = false) GROUP BY c.referrer")
    List<Map<String, Object>> countClicksByReferrer(@Param("userId") Long userId);

    @Query("SELECT c.country AS country, COUNT(c) AS count FROM ClickAnalytics c WHERE c.shortLink.user.id = :userId AND (c.isBot IS NULL OR c.isBot = false) GROUP BY c.country")
    List<Map<String, Object>> countClicksByCountry(@Param("userId") Long userId);
}
