/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.repository;

import com.dragolink.entity.ApiKey;
import com.dragolink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {
    List<ApiKey> findByUserOrderByCreatedAtDesc(User user);
    Optional<ApiKey> findByIdAndUser(Long id, User user);
    Optional<ApiKey> findByKeyHash(String keyHash);
}
