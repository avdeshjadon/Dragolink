/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.repository;

import com.dragolink.entity.NavigationLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NavigationLinkRepository extends JpaRepository<NavigationLink, Long> {
    List<NavigationLink> findAllByOrderByCategoryAscSortOrderAsc();
    List<NavigationLink> findAllByPositionOrderByCategoryAscSortOrderAsc(String position);
    List<NavigationLink> findAllByPositionOrderBySortOrderAsc(String position);
}
