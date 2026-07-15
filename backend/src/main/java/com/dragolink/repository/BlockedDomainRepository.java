package com.dragolink.repository;

import com.dragolink.entity.BlockedDomain;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlockedDomainRepository extends JpaRepository<BlockedDomain, Long> {
    boolean existsByDomain(String domain);
}
