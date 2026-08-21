/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

package com.dragolink.config.seeders;

import com.dragolink.entity.NavigationLink;
import com.dragolink.repository.NavigationLinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@RequiredArgsConstructor
public class NavigationSeeder implements Seeder {
    private final NavigationLinkRepository navigationLinkRepository;

    @Override
    public void seed() {
        navigationLinkRepository.deleteAll();
        navigationLinkRepository.saveAll(List.of(
            // PUBLIC_FOOTER
            NavigationLink.builder().position("PUBLIC_FOOTER").label("Product").url("/product").category("Product").sortOrder(1).isExternal(false).build(),
            NavigationLink.builder().position("PUBLIC_FOOTER").label("Features").url("/features").category("Product").sortOrder(2).isExternal(false).build(),
            NavigationLink.builder().position("PUBLIC_FOOTER").label("Pricing").url("/pricing").category("Product").sortOrder(3).isExternal(false).build(),
            NavigationLink.builder().position("PUBLIC_FOOTER").label("QR Codes").url("/qr-codes").category("Product").sortOrder(4).isExternal(false).build(),
            
            NavigationLink.builder().position("PUBLIC_FOOTER").label("API Docs").url("/api").category("Resources").sortOrder(1).isExternal(false).build(),
            NavigationLink.builder().position("PUBLIC_FOOTER").label("Blog").url("/blog").category("Resources").sortOrder(2).isExternal(false).build(),
            NavigationLink.builder().position("PUBLIC_FOOTER").label("Documentation").url("/docs").category("Resources").sortOrder(3).isExternal(false).build(),
            NavigationLink.builder().position("PUBLIC_FOOTER").label("Guides").url("/guides").category("Resources").sortOrder(3).isExternal(false).build(),
            NavigationLink.builder().position("PUBLIC_FOOTER").label("Help Center").url("/help").category("Resources").sortOrder(4).isExternal(false).build(),

            
            NavigationLink.builder().position("PUBLIC_FOOTER").label("About Us").url("/about").category("Company").sortOrder(1).isExternal(false).build(),
            NavigationLink.builder().position("PUBLIC_FOOTER").label("Blog").url("/blog").category("Company").sortOrder(2).isExternal(false).build(),
            NavigationLink.builder().position("PUBLIC_FOOTER").label("Careers").url("/careers").category("Company").sortOrder(3).isExternal(false).badgeText("Hiring").build(),
            NavigationLink.builder().position("PUBLIC_FOOTER").label("Security").url("/security").category("Company").sortOrder(4).isExternal(false).build(),
            NavigationLink.builder().position("PUBLIC_FOOTER").label("Contact").url("/contact").category("Company").sortOrder(5).isExternal(false).build(),

            // PUBLIC_HEADER
            NavigationLink.builder().position("PUBLIC_HEADER").label("Product").url("/product").category("Header").sortOrder(1).isExternal(false).build(),
            NavigationLink.builder().position("PUBLIC_HEADER").label("Features").url("/features").category("Header").sortOrder(2).isExternal(false).build(),
            NavigationLink.builder().position("PUBLIC_HEADER").label("Pricing").url("/pricing").category("Header").sortOrder(3).isExternal(false).build(),
            NavigationLink.builder().position("PUBLIC_HEADER").label("About Us").url("/about").category("Header").sortOrder(4).isExternal(false).build(),

            // DASHBOARD_SIDEBAR
            NavigationLink.builder().position("DASHBOARD_SIDEBAR").label("Dashboard").url("/dashboard").category("Main").sortOrder(1).isExternal(false).badgeText("dashboard").build(),
            NavigationLink.builder().position("DASHBOARD_SIDEBAR").label("My Links").url("/links").category("Main").sortOrder(2).isExternal(false).badgeText("link").build(),
            NavigationLink.builder().position("DASHBOARD_SIDEBAR").label("Campaigns").url("/campaigns").category("Main").sortOrder(3).isExternal(false).badgeText("campaign").build(),
            NavigationLink.builder().position("DASHBOARD_SIDEBAR").label("QR Codes").url("/qr-codes").category("Main").sortOrder(4).isExternal(false).badgeText("qr_code").build(),
            NavigationLink.builder().position("DASHBOARD_SIDEBAR").label("Analytics").url("/analytics").category("Main").sortOrder(5).isExternal(false).badgeText("analytics").build(),
            NavigationLink.builder().position("DASHBOARD_SIDEBAR").label("Team").url("/team").category("Main").sortOrder(6).isExternal(false).badgeText("group").build(),
            NavigationLink.builder().position("DASHBOARD_SIDEBAR").label("API Keys").url("/api-keys").category("Main").sortOrder(7).isExternal(false).badgeText("vpn_key").build(),
            NavigationLink.builder().position("DASHBOARD_SIDEBAR").label("Admin").url("/admin/overview").category("Main").sortOrder(8).isExternal(false).badgeText("admin_panel_settings").build(),
            NavigationLink.builder().position("DASHBOARD_SIDEBAR").label("My Applications").url("/applications").category("Main").sortOrder(9).isExternal(false).badgeText("work").build(),

            // SETTINGS_SIDEBAR
            NavigationLink.builder().position("SETTINGS_SIDEBAR").label("Profile").url("/settings/profile").category("Settings").sortOrder(1).isExternal(false).badgeText("person").build(),
            NavigationLink.builder().position("SETTINGS_SIDEBAR").label("Security").url("/settings/security").category("Settings").sortOrder(2).isExternal(false).badgeText("security").build(),
            NavigationLink.builder().position("SETTINGS_SIDEBAR").label("API Keys").url("/settings/api-keys").category("Settings").sortOrder(3).isExternal(false).badgeText("vpn_key").build(),
            NavigationLink.builder().position("SETTINGS_SIDEBAR").label("Team").url("/settings/team").category("Settings").sortOrder(4).isExternal(false).badgeText("group").build(),

            // ADMIN_TABS
            NavigationLink.builder().position("ADMIN_TABS").label("Overview").url("/admin/overview").category("Admin").sortOrder(1).isExternal(false).badgeText("dashboard").build(),
            NavigationLink.builder().position("ADMIN_TABS").label("Users").url("/admin/users").category("Admin").sortOrder(2).isExternal(false).badgeText("people").build(),
            NavigationLink.builder().position("ADMIN_TABS").label("Domains").url("/admin/domains").category("Admin").sortOrder(3).isExternal(false).badgeText("public").build(),
            NavigationLink.builder().position("ADMIN_TABS").label("Billing").url("/admin/billing").category("Admin").sortOrder(4).isExternal(false).badgeText("payment").build()
        ));
    }
}
