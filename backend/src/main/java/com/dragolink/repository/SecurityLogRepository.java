package com.dragolink.repository;

import com.dragolink.entity.SecurityLog;
import com.dragolink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecurityLogRepository extends JpaRepository<SecurityLog, Long> {
    List<SecurityLog> findByUserOrderByCreatedAtDesc(User user);
    List<SecurityLog> findTop10ByUserOrderByCreatedAtDesc(User user);
}
