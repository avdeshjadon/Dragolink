package com.dragolink.repository;

import com.dragolink.entity.Campaign;
import com.dragolink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByUserOrderByCreatedAtDesc(User user);
    Optional<Campaign> findByIdAndUser(Long id, User user);
}
