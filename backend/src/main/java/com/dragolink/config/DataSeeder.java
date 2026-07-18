package com.dragolink.config;

import com.dragolink.entity.BlogPost;
import com.dragolink.entity.PageContent;
import com.dragolink.entity.User;
import com.dragolink.entity.Role;
import com.dragolink.entity.NavigationLink;
import com.dragolink.repository.UserRepository;
import com.dragolink.repository.BlogPostRepository;
import com.dragolink.repository.PageContentRepository;
import com.dragolink.repository.NavigationLinkRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final BlogPostRepository blogPostRepository;
    private final PageContentRepository pageContentRepository;
    private final NavigationLinkRepository navigationLinkRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@gmail.com")) {
            userRepository.save(User.builder()
                .name("Super Admin")
                .email("admin@gmail.com")
                .password(passwordEncoder.encode("admin"))
                .role(Role.ADMIN)
                .build());
        }

        if (navigationLinkRepository.count() == 0) {
            navigationLinkRepository.saveAll(List.of(
                // PRODUCT
                NavigationLink.builder().label("Features").url("/features").category("Product").sortOrder(1).isExternal(false).build(),
                NavigationLink.builder().label("Pricing").url("/pricing").category("Product").sortOrder(2).isExternal(false).build(),
                NavigationLink.builder().label("Analytics Engine").url("/public-analytics").category("Product").sortOrder(3).isExternal(false).build(),
                NavigationLink.builder().label("QR Codes").url("/qr-codes").category("Product").sortOrder(4).isExternal(false).build(),
                NavigationLink.builder().label("Integrations").url("/integrations").category("Product").sortOrder(5).isExternal(false).build(),
                NavigationLink.builder().label("Developer API").url("/api").category("Product").sortOrder(6).isExternal(false).build(),
                // RESOURCES
                NavigationLink.builder().label("Blog").url("/blog").category("Resources").sortOrder(1).isExternal(false).build(),
                NavigationLink.builder().label("Documentation").url("/docs").category("Resources").sortOrder(2).isExternal(false).build(),
                NavigationLink.builder().label("Help Center").url("/help").category("Resources").sortOrder(3).isExternal(false).build(),
                NavigationLink.builder().label("Link Management Guides").url("/guides").category("Resources").sortOrder(4).isExternal(false).build(),
                NavigationLink.builder().label("Case Studies").url("/case-studies").category("Resources").sortOrder(5).isExternal(false).build(),
                NavigationLink.builder().label("System Status").url("/status").category("Resources").sortOrder(6).isExternal(false).build(),
                // COMPANY
                NavigationLink.builder().label("About Us").url("/about").category("Company").sortOrder(1).isExternal(false).build(),
                NavigationLink.builder().label("Careers").url("/careers").category("Company").sortOrder(2).isExternal(false).badgeText("HIRING").build(),
                NavigationLink.builder().label("Contact Sales").url("/contact").category("Company").sortOrder(3).isExternal(false).build(),
                NavigationLink.builder().label("Privacy Policy").url("/privacy").category("Company").sortOrder(4).isExternal(false).build(),
                NavigationLink.builder().label("Terms of Service").url("/terms").category("Company").sortOrder(5).isExternal(false).build(),
                NavigationLink.builder().label("Security").url("/security").category("Company").sortOrder(6).isExternal(false).build()
            ));
        }

        List<PageContent> defaultPages = List.of(
                PageContent.builder()
                    .slug("privacy")
                    .title("Privacy Policy")
                    .htmlContent("<h2>1. Introduction</h2><p>At Dragolink, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.</p>")
                    .build(),
                PageContent.builder()
                    .slug("terms")
                    .title("Terms of Service")
                    .htmlContent("<h2>1. Acceptance of Terms</h2><p>By accessing or using Dragolink, you agree to be bound by these Terms of Service.</p>")
                    .build(),
                PageContent.builder()
                    .slug("security")
                    .title("Enterprise Security")
                    .htmlContent("<h2>Data Protection</h2><p>All data is encrypted at rest using AES-256 and in transit using TLS 1.3.</p>")
                    .build(),
                PageContent.builder()
                    .slug("about")
                    .title("About Dragolink")
                    .htmlContent("<h2>Our Mission</h2><p>We are on a mission to build the world's most reliable, scalable, and intelligent link infrastructure.</p>")
                    .build(),
                PageContent.builder()
                    .slug("pricing")
                    .title("Pricing")
                    .htmlContent("<h2>Simple, transparent pricing</h2><p>Flexible plans that scale with your business.</p>")
                    .build(),
                PageContent.builder()
                    .slug("public-analytics")
                    .title("Analytics Engine")
                    .htmlContent("<h2>Real-time Analytics</h2><p>Get insights into your link performance instantly.</p>")
                    .build(),
                PageContent.builder()
                    .slug("qr-codes")
                    .title("QR Codes")
                    .htmlContent("<h2>Dynamic QR Codes</h2><p>Generate customizable, trackable QR codes for your brand.</p>")
                    .build(),
                PageContent.builder()
                    .slug("integrations")
                    .title("Integrations")
                    .htmlContent("<h2>Connect your tools</h2><p>Seamlessly integrate Dragolink into your existing workflow.</p>")
                    .build(),
                PageContent.builder()
                    .slug("api")
                    .title("Developer API")
                    .htmlContent("<h2>Build with Dragolink</h2><p>Powerful REST API for developers to manage links programmatically.</p>")
                    .build(),
                PageContent.builder()
                    .slug("blog")
                    .title("Blog")
                    .htmlContent("<h2>Dragolink Blog</h2><p>Insights, updates, and deep-dives on link management.</p>")
                    .build(),
                PageContent.builder()
                    .slug("docs")
                    .title("Documentation")
                    .htmlContent("<h2>Dragolink Docs</h2><p>Everything you need to know about using Dragolink.</p>")
                    .build(),
                PageContent.builder()
                    .slug("help")
                    .title("Help Center")
                    .htmlContent("<h2>How can we help?</h2><p>Search our knowledge base or contact support.</p>")
                    .build(),
                PageContent.builder()
                    .slug("guides")
                    .title("Link Management Guides")
                    .htmlContent("<h2>Best Practices</h2><p>Learn how to optimize your link management strategy.</p>")
                    .build(),
                PageContent.builder()
                    .slug("case-studies")
                    .title("Case Studies")
                    .htmlContent("<h2>Customer Success Stories</h2><p>See how leading brands use Dragolink.</p>")
                    .build(),
                PageContent.builder()
                    .slug("status")
                    .title("System Status")
                    .htmlContent("<h2>All Systems Operational</h2><p>Check the real-time status of Dragolink services.</p>")
                    .build(),
                PageContent.builder()
                    .slug("careers")
                    .title("Careers")
                    .htmlContent("<h2>Join Our Team</h2><p>We are always looking for talented individuals to join our growing team.</p>")
                    .build(),
                PageContent.builder()
                    .slug("contact")
                    .title("Contact Sales")
                    .htmlContent("<h2>Get in Touch</h2><p>Contact our sales team for enterprise plans and custom solutions.</p>")
                    .build(),
                PageContent.builder()
                    .slug("home")
                    .title("Home Page")
                    .htmlContent("{\"hero\":{\"title1\":\"Shorten links.\",\"title2\":\"Understand every click.\",\"subtitle\":\"Create powerful short links, track engagement, generate QR codes, and manage your entire link infrastructure from one intelligent platform.\"},\"capabilities\":{\"title1\":\"Everything you need to\",\"title2\":\"scale\",\"subtitle\":\"Dragolink provides a comprehensive suite of tools designed for modern teams and creators who demand the best.\"},\"features\":[{\"title\":\"Custom short links\",\"description\":\"Create branded, memorable links that stand out, build audience trust, and drive higher click-through rates across all your marketing channels.\",\"icon\":\"LinkIcon\"},{\"title\":\"Advanced analytics\",\"description\":\"Track clicks, devices, browsers, and geographic data in real time. Make data-driven decisions with comprehensive performance reports.\",\"icon\":\"BarChart3\"},{\"title\":\"QR code generation\",\"description\":\"Generate dynamic, highly-customizable QR codes for offline marketing campaigns that bridge the gap between physical and digital spaces.\",\"icon\":\"QrCode\"},{\"title\":\"Security & Reliability\",\"description\":\"Enterprise-grade protection with advanced threat filtering and 99.99% uptime SLA to ensure your links are always secure and accessible.\",\"icon\":\"ShieldCheck\"},{\"title\":\"API Access\",\"description\":\"Integrate powerful link generation and analytics directly into your own applications seamlessly with our robust, developer-friendly API.\",\"icon\":\"Settings2\"},{\"title\":\"Team Collaboration\",\"description\":\"Work together effortlessly with granular role-based access control, shared workspaces, and detailed audit logs for your entire team.\",\"icon\":\"Users\"}],\"cta\":{\"title\":\"Ready to optimize your links?\",\"subtitle\":\"Join thousands of teams who trust Dragolink for their link management and analytics.\",\"buttonText\":\"Get Started Now\"}}")
                    .build(),
                PageContent.builder()
                    .slug("product")
                    .title("Product Page")
                    .htmlContent("{\"hero\":{\"title1\":\"One platform to manage\",\"title2\":\"all your links\",\"subtitle\":\"Dragolink is the complete, high-performance link management infrastructure built for modern enterprises. We provide the tools you need to shorten, brand, organize, and track every single click across your entire marketing funnel with zero friction and absolute reliability.\",\"button1\":\"Start for free\",\"button2\":\"Talk to sales\",\"guarantee\":\"No credit card required • Free plan includes 1,000 links/month\"},\"featuresHeader\":{\"title\":\"Everything you need, nothing you don't\",\"subtitle\":\"Dragolink brings link creation, tracking, and governance into a single workflow so your team stops piecing tools together.\"},\"features\":[{\"title\":\"QR codes\",\"desc\":\"Generate a branded, scannable QR code for any link in one click.\",\"icon\":\"QrCode\"},{\"title\":\"Webhooks & API\",\"desc\":\"Trigger workflows on click events and manage links programmatically.\",\"icon\":\"Webhook\"},{\"title\":\"Link retargeting\",\"desc\":\"Attach pixels to any short link and retarget visitors across ad platforms.\",\"icon\":\"Zap\"},{\"title\":\"Team workspaces\",\"desc\":\"Organize links by project with shared folders and granular permissions.\",\"icon\":\"Users\"},{\"title\":\"Link expiration\",\"desc\":\"Set links to expire or redirect elsewhere after a date or click limit.\",\"icon\":\"Clock\"},{\"title\":\"Geo-targeting\",\"desc\":\"Send visitors to different destinations based on their location or device.\",\"icon\":\"Globe\"}],\"quote\":\"\\\"The links we build today create the pathways to our success tomorrow. Every connection is an opportunity waiting to be realized.\\\"\",\"cta\":{\"title\":\"Experience the Dragolink difference\",\"subtitle\":\"Join thousands of teams shortening, branding, and tracking their links with confidence.\",\"buttonText\":\"Get started\"}}")
                    .build()
        );

        for (PageContent page : defaultPages) {
            if (pageContentRepository.findBySlug(page.getSlug()).isEmpty()) {
                pageContentRepository.save(page);
            }
        }

        if (pageContentRepository.findBySlug("features").isEmpty()) {
            pageContentRepository.save(
                PageContent.builder()
                    .slug("features")
                    .title("Features")
                    .htmlContent("""
                        {
                          "hero": {
                            "title1": "Powerful features for modern",
                            "title2": "link management",
                            "subtitle": "Everything you need to create, manage, track, and scale your links globally. From dynamic QR codes and deep linking to advanced threat protection and real-time granular analytics, Dragolink equips your team with absolute precision and unmatched security."
                          },
                          "categories": [
                            {
                              "name": "Create",
                              "tagline": "Turn any URL into a branded, trackable asset",
                              "features": [
                                { "title": "Custom Short Links", "description": "Create deeply memorable, branded short links that immediately increase click-through rates, build unshakeable audience trust, and drive meaningful engagement across every single marketing channel.", "icon": "LinkIcon" },
                                { "title": "Dynamic QR Codes", "description": "Generate high-resolution, dynamic QR codes that seamlessly bridge offline and online worlds. Update the destination URL at any time without ever needing to reprint your physical marketing materials.", "icon": "QrCode" },
                                { "title": "UTM Builder", "description": "Automatically construct and append UTM parameters to track complex campaign performance with pinpoint accuracy directly inside Google Analytics and other BI tools.", "icon": "Cpu" },
                                { "title": "Deep Linking", "description": "Intelligently route mobile users directly into specific screens within your iOS or Android applications, dramatically improving the user experience and app engagement.", "icon": "Smartphone" }
                              ]
                            },
                            {
                              "name": "Measure",
                              "tagline": "See exactly how every link performs",
                              "features": [
                                { "title": "Real-time Analytics", "description": "Track every single click as it happens with ultra-detailed breakdowns by device type, geographic location, browser, and referrer. Make lightning-fast, data-driven decisions.", "icon": "BarChart3" },
                                { "title": "Geotargeting", "description": "Automatically route users to entirely different destination URLs or localized landing pages based on their exact geographic location for maximum conversion rates.", "icon": "Globe" },
                                { "title": "Link Expiration", "description": "Maintain absolute control over your campaigns by setting links to automatically expire on a specific date and time, or after hitting a precise click threshold.", "icon": "Zap" }
                              ]
                            },
                            {
                              "name": "Protect & Scale",
                              "tagline": "Governance and infrastructure your security team trusts",
                              "features": [
                                { "title": "Advanced Threat Protection", "description": "Enterprise-grade, automated scanning of all destination URLs instantly protects your audience from malware, phishing, and malicious redirects, keeping your brand reputation pristine.", "icon": "ShieldCheck" },
                                { "title": "Team Workspaces", "description": "Collaborate effortlessly by inviting team members to secure workspaces. Manage everything with granular, role-based access control and comprehensive audit logs.", "icon": "Users" },
                                { "title": "SSO & SAML", "description": "Enterprise-grade security integrations supporting SAML and Single Sign-On (SSO) for seamless identity management and frictionless onboarding for large organizations.", "icon": "Lock" },
                                { "title": "High Availability", "description": "Built on a globally distributed, high-performance edge network infrastructure guaranteeing 99.99% uptime and lightning-fast redirects from anywhere in the world.", "icon": "Server" },
                                { "title": "Developer API", "description": "Integrate powerful link generation and analytics programmatically into your own applications, internal tools, or workflows using our blazing-fast, robust REST API.", "icon": "Settings2" }
                              ]
                            }
                          ],
                          "integrations": {
                            "title": "Connects with the tools you already use",
                            "subtitle": "Wire Dragolink into your existing stack in minutes, no custom code required.",
                            "items": [
                              { "label": "Slack", "icon": "MessageSquare" },
                              { "label": "Webhooks", "icon": "WebhookIcon" },
                              { "label": "Zapier", "icon": "Network" },
                              { "label": "Chrome extension", "icon": "Layout" }
                            ]
                          },
                          "comparison": {
                            "without": ["Untrusted, generic short links", "Click data scattered across tools", "No visibility into link security", "Manual UTM tagging every time"],
                            "with": ["Branded links on your own domain", "One dashboard for every click", "Automatic malware & phishing scans", "UTM parameters built in by default"]
                          }
                        }
                        """)
                    .build()
            );
        }

        if (blogPostRepository.count() == 0) {
            blogPostRepository.saveAll(List.of(
                BlogPost.builder()
                    .title("The Future of Link Management in Web3")
                    .excerpt("Discover how decentralized identifiers and blockchain technology are reshaping how we share and track links securely.")
                    .category("Product Updates")
                    .author("Sarah Jenkins")
                    .readTime("6 min read")
                    .imageUrl("https://api.dicebear.com/9.x/open-peeps/svg?seed=Web3&backgroundColor=b6e3f4")
                    .content("[{\"heading\":\"Why links still matter\",\"body\":[\"Every conversation about Web3 tends to jump straight to wallets...\"]}]")
                    .build(),
                BlogPost.builder()
                    .title("10 Advanced UTM Strategies for 2024")
                    .excerpt("Stop using basic source/medium tags. We analyzed 50 million clicks to find the tagging structures that actually drive revenue.")
                    .category("Marketing")
                    .author("Michael Chen")
                    .readTime("4 min read")
                    .imageUrl("https://api.dicebear.com/9.x/open-peeps/svg?seed=Marketing&backgroundColor=ffdfbf")
                    .content("[{\"heading\":\"UTMs are still underused\",\"body\":[\"It is 2023, and most marketing teams are still barely scratching the surface of what UTM parameters can do.\"]}]")
                    .build(),
                BlogPost.builder()
                    .title("Why We Built Our Own Analytics Engine")
                    .excerpt("A technical deep-dive into why we moved away from off-the-shelf tracking databases and built a custom high-throughput ingestion pipeline.")
                    .category("Engineering")
                    .author("Alex Rivera")
                    .readTime("8 min read")
                    .imageUrl("https://api.dicebear.com/9.x/open-peeps/svg?seed=Analytics&backgroundColor=c0aede")
                    .content("[{\"heading\":\"Link generation as infrastructure\",\"body\":[\"When a marketing team generates a handful of links by hand, a web UI is perfectly fine.\"]}]")
                    .build()
            ));
        }
    }
}
