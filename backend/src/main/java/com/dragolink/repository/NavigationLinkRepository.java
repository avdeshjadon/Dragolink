package com.dragolink.repository;

import com.dragolink.entity.NavigationLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NavigationLinkRepository extends JpaRepository<NavigationLink, Long> {
    List<NavigationLink> findAllByOrderByCategoryAscSortOrderAsc();
}
