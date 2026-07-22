package com.dragolink.config.seeders;

import com.dragolink.entity.BlogPost;
import com.dragolink.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import java.util.Base64;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Component
@RequiredArgsConstructor
public class BlogPostsSeeder implements Seeder {
    private final BlogPostRepository blogPostRepository;

    private String getBase64DataUri(String path) {
        try {
            byte[] bytes = new ClassPathResource(path).getInputStream().readAllBytes();
            String base64 = Base64.getEncoder().encodeToString(bytes);
            return "data:image/svg+xml;base64," + base64;
        } catch (Exception e) {
            System.err.println("Failed to load image for seeding: " + path);
            return "";
        }
    }

    @Override
    public void seed() {
        if (blogPostRepository.count() == 0) {
            String qrBase64 = getBase64DataUri("images/qr-blog-image.svg");
            String urlBase64 = getBase64DataUri("images/url-blog-image.svg");
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm", Locale.ENGLISH);

            BlogPost p0 = new BlogPost();
            p0.setTitle("The Future of Link Management in Web3");
            p0.setExcerpt("Discover how decentralized identifiers and blockchain technology are reshaping how we share and track links securely in the modern web era. We explore the latest trends and what it means for creators and enterprises.");
            p0.setAuthor("Sarah Jenkins");
            p0.setCategory("Product Updates");
            p0.setReadTime("6 min read");
            p0.setImageUrl(urlBase64);
            p0.setContent("<h2>Why links still matter in a decentralized web</h2><p>Every conversation about Web3 tends to jump straight to wallets and tokens, but the humble link is quietly becoming one of the most contested pieces of infrastructure on the internet. A link is a promise: click here and you will land where you expect. As more of the web moves toward decentralized identity and content addressing, that promise gets harder to keep, and easier to break.</p><p>At Dragolink we spend a lot of time thinking about the boring middle layer that makes the flashy parts of the web work. Link management sits squarely in that middle layer, and its job is about to get a lot more interesting.</p><h2>Decentralized identifiers, in plain terms</h2><p>A decentralized identifier, or DID, is a way of proving who created or owns a piece of content without relying on a single central authority to vouch for it. Instead of a platform saying \"trust us, this is really from this person,\" the proof lives in a distributed ledger that anyone can verify independently.</p><p>For link management, this opens up a new category of short link: one that carries a cryptographic signature alongside the destination URL. A signed link can prove, at the moment someone clicks it, that the link was created by the account it claims to be from, and that it has not been silently swapped out after the fact.</p><h2>What changes for creators</h2><p>For an individual creator, the biggest shift is portability. Today, your link history and click analytics live inside whichever platform issued the link. If you switch tools, that history typically does not travel with you. A DID-anchored link, by contrast, is tied to your identity rather than to any single platform, which means your reputation and your historical performance data can move with you.</p><p>This also changes how audiences relate to links. A verified badge next to a shortened URL, backed by an on-chain signature rather than a platform's internal trust system, gives people a reason to click that does not depend on recognizing the brand behind the shortener itself.</p><h2>What changes for enterprises</h2><p>Enterprises care about a different set of problems: brand safety, auditability, and compliance. A tamper-evident link record makes it possible to prove, months after the fact, exactly what a campaign link pointed to at the moment it was published. That matters enormously in regulated industries where a redirect change could constitute a compliance violation.</p><p>It also simplifies vendor risk. When your link infrastructure is anchored to open standards rather than a single vendor's proprietary database, migrating away from any one provider becomes a technical exercise instead of a full re-platforming project.</p><h2>Where Dragolink is headed</h2><p>We are actively prototyping signed link records as an opt-in feature for enterprise workspaces, starting with support for widely used DID methods. Our goal is not to force every link through a blockchain, most links will remain exactly as simple as they are today, but to give teams that need verifiable provenance a first-class way to get it.</p><p>We will be sharing more in this space as our beta program progresses. If tamper-evident links sound useful for your team, reach out and we will get you early access.</p>");
            p0.setCreatedAt(LocalDateTime.parse("Oct 24, 2023 10:00", formatter));
            blogPostRepository.save(p0);
            
            BlogPost p1 = new BlogPost();
            p1.setTitle("10 Advanced UTM Strategies for 2024");
            p1.setExcerpt("Master campaign tracking with these lesser-known UTM parameters and structures to perfectly attribute your marketing ROI.");
            p1.setAuthor("Michael Chen");
            p1.setCategory("Marketing");
            p1.setReadTime("4 min read");
            p1.setImageUrl(urlBase64);
            p1.setContent("<h2>UTMs are still underused</h2><p>Most marketing teams use the same three UTM parameters on every link: source, medium, and campaign. That covers the basics, but it leaves a lot of attribution nuance on the table. The parameters below are ones we see high-performing teams use to get sharper answers out of their analytics without adding any new tooling.</p><h2>1. Use utm_content to separate creative variants</h2><p>If you are running two versions of the same ad with different images or headlines, utm_content lets you tell them apart in your analytics without spinning up a separate campaign for each. This is the single highest-leverage parameter that teams skip.</p><h2>2. Standardize casing before it becomes a problem</h2><p>Analytics platforms treat \"Newsletter\" and \"newsletter\" as two different values. The fix is not clever, it is discipline: agree on lowercase, hyphen-separated values across your entire team and put it in a shared naming doc before your next campaign launch, not after you discover the fragmentation in a quarterly report.</p><h2>3. Encode the funnel stage, not just the channel</h2><p>Instead of a campaign name like \"spring-sale,\" add the funnel stage: \"spring-sale-tofu\" versus \"spring-sale-retarget.\" This lets you answer \"which stage of the funnel is underperforming\" directly from your link data instead of cross-referencing multiple reports.</p><h2>4. Use utm_term intentionally, even outside paid search</h2><p>utm_term was designed for paid search keywords, but nothing stops you from repurposing it as a generic \"targeting detail\" field, for example the audience segment name in a paid social campaign. Just document the reuse clearly so future team members are not confused by search-shaped field names in a social report.</p><h2>5. Build a template, not a memory exercise</h2><p>The teams with the cleanest UTM data are not the ones with the strictest people, they are the ones with the best templates. A shared spreadsheet or, better, a Dragolink link creation flow with pre-filled dropdowns removes the guesswork and keeps parameter values consistent by default rather than by willpower.</p><h2>The other five, briefly</h2><p>Round out your strategy with: campaign-level version numbers so you can track iterative changes over time, a consistent separator convention across all parameters, source-of-truth documentation linked directly from your link shortener, periodic audits to catch parameter drift, and a retirement process for old campaign tags so your dashboards do not accumulate years of dead filters.</p>");
            p1.setCreatedAt(LocalDateTime.parse("Oct 18, 2023 10:00", formatter));
            blogPostRepository.save(p1);
        }
    }
}
