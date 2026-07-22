package com.dragolink.repository;

import com.dragolink.entity.CustomDomain;
import com.dragolink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomDomainRepository extends JpaRepository<CustomDomain, Long> {
    List<CustomDomain> findByUserOrderByCreatedAtDesc(User user);
    boolean existsByDomainName(String domainName);
}
