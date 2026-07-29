/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.repository;

import com.dragolink.entity.BlockedDomain;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlockedDomainRepository extends JpaRepository<BlockedDomain, Long> {
    boolean existsByDomain(String domain);
}
