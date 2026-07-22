package com.dragolink.repository;

import com.dragolink.entity.TeamMember;
import com.dragolink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    List<TeamMember> findByOwnerOrderByCreatedAtDesc(User owner);
    List<TeamMember> findByMember(User member);
    Optional<TeamMember> findByOwnerAndEmail(User owner, String email);
}
