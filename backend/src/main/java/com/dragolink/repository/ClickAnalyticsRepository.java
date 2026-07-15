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
    long countByShortLink_User_Id(Long userId);

    @Query("SELECT c.browser AS browser, COUNT(c) AS count FROM ClickAnalytics c WHERE c.shortLink.user.id = :userId GROUP BY c.browser")
    List<Map<String, Object>> countClicksByBrowser(@Param("userId") Long userId);

    @Query("SELECT c.deviceType AS device, COUNT(c) AS count FROM ClickAnalytics c WHERE c.shortLink.user.id = :userId GROUP BY c.deviceType")
    List<Map<String, Object>> countClicksByDevice(@Param("userId") Long userId);

    @Query("SELECT FUNCTION('DATE', c.clickedAt) AS date, COUNT(c) AS count FROM ClickAnalytics c WHERE c.shortLink.user.id = :userId AND c.clickedAt >= :startDate GROUP BY FUNCTION('DATE', c.clickedAt) ORDER BY date")
    List<Map<String, Object>> countClicksByDate(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate);
}
