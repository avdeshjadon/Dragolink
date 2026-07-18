export const categories = ['All', 'Product Updates', 'Engineering', 'Marketing', 'Growth', 'Case Studies'];

export const blogPosts = [
  {
    id: 1,
    title: 'The Future of Link Management in Web3',
    excerpt: 'Discover how decentralized identifiers and blockchain technology are reshaping how we share and track links securely in the modern web era. We explore the latest trends and what it means for creators and enterprises.',
    category: 'Product Updates',
    date: 'Oct 24, 2023',
    author: 'Sarah Jenkins',
    readTime: '6 min read',
    featured: true,
    imageUrl: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=Web3&backgroundColor=b6e3f4',
    content: [
      {
        heading: 'Why links still matter in a decentralized web',
        body: [
          'Every conversation about Web3 tends to jump straight to wallets and tokens, but the humble link is quietly becoming one of the most contested pieces of infrastructure on the internet. A link is a promise: click here and you will land where you expect. As more of the web moves toward decentralized identity and content addressing, that promise gets harder to keep, and easier to break.',
          'At Dragolink we spend a lot of time thinking about the boring middle layer that makes the flashy parts of the web work. Link management sits squarely in that middle layer, and its job is about to get a lot more interesting.'
        ]
      },
      {
        heading: 'Decentralized identifiers, in plain terms',
        body: [
          'A decentralized identifier, or DID, is a way of proving who created or owns a piece of content without relying on a single central authority to vouch for it. Instead of a platform saying "trust us, this is really from this person," the proof lives in a distributed ledger that anyone can verify independently.',
          'For link management, this opens up a new category of short link: one that carries a cryptographic signature alongside the destination URL. A signed link can prove, at the moment someone clicks it, that the link was created by the account it claims to be from, and that it has not been silently swapped out after the fact.'
        ]
      },
      {
        heading: 'What changes for creators',
        body: [
          'For an individual creator, the biggest shift is portability. Today, your link history and click analytics live inside whichever platform issued the link. If you switch tools, that history typically does not travel with you. A DID-anchored link, by contrast, is tied to your identity rather than to any single platform, which means your reputation and your historical performance data can move with you.',
          'This also changes how audiences relate to links. A verified badge next to a shortened URL, backed by an on-chain signature rather than a platform\'s internal trust system, gives people a reason to click that does not depend on recognizing the brand behind the shortener itself.'
        ]
      },
      {
        heading: 'What changes for enterprises',
        body: [
          'Enterprises care about a different set of problems: brand safety, auditability, and compliance. A tamper-evident link record makes it possible to prove, months after the fact, exactly what a campaign link pointed to at the moment it was published. That matters enormously in regulated industries where a redirect change could constitute a compliance violation.',
          'It also simplifies vendor risk. When your link infrastructure is anchored to open standards rather than a single vendor\'s proprietary database, migrating away from any one provider becomes a technical exercise instead of a full re-platforming project.'
        ]
      },
      {
        heading: 'Where Dragolink is headed',
        body: [
          'We are actively prototyping signed link records as an opt-in feature for enterprise workspaces, starting with support for widely used DID methods. Our goal is not to force every link through a blockchain, most links will remain exactly as simple as they are today, but to give teams that need verifiable provenance a first-class way to get it.',
          'We will be sharing more in this space as our beta program progresses. If tamper-evident links sound useful for your team, reach out and we will get you early access.'
        ]
      }
    ]
  },
  {
    id: 2,
    title: '10 Advanced UTM Strategies for 2024',
    excerpt: 'Master campaign tracking with these lesser-known UTM parameters and structures to perfectly attribute your marketing ROI.',
    category: 'Marketing',
    date: 'Oct 18, 2023',
    author: 'Michael Chen',
    readTime: '4 min read',
    imageUrl: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=Marketing&backgroundColor=ffdfbf',
    content: [
      {
        heading: 'UTMs are still underused',
        body: [
          'Most marketing teams use the same three UTM parameters on every link: source, medium, and campaign. That covers the basics, but it leaves a lot of attribution nuance on the table. The parameters below are ones we see high-performing teams use to get sharper answers out of their analytics without adding any new tooling.'
        ]
      },
      {
        heading: '1. Use utm_content to separate creative variants',
        body: [
          'If you are running two versions of the same ad with different images or headlines, utm_content lets you tell them apart in your analytics without spinning up a separate campaign for each. This is the single highest-leverage parameter that teams skip.'
        ]
      },
      {
        heading: '2. Standardize casing before it becomes a problem',
        body: [
          'Analytics platforms treat "Newsletter" and "newsletter" as two different values. The fix is not clever, it is discipline: agree on lowercase, hyphen-separated values across your entire team and put it in a shared naming doc before your next campaign launch, not after you discover the fragmentation in a quarterly report.'
        ]
      },
      {
        heading: '3. Encode the funnel stage, not just the channel',
        body: [
          'Instead of a campaign name like "spring-sale," add the funnel stage: "spring-sale-tofu" versus "spring-sale-retarget." This lets you answer "which stage of the funnel is underperforming" directly from your link data instead of cross-referencing multiple reports.'
        ]
      },
      {
        heading: '4. Use utm_term intentionally, even outside paid search',
        body: [
          'utm_term was designed for paid search keywords, but nothing stops you from repurposing it as a generic "targeting detail" field, for example the audience segment name in a paid social campaign. Just document the reuse clearly so future team members are not confused by search-shaped field names in a social report.'
        ]
      },
      {
        heading: '5. Build a template, not a memory exercise',
        body: [
          'The teams with the cleanest UTM data are not the ones with the strictest people, they are the ones with the best templates. A shared spreadsheet or, better, a Dragolink link creation flow with pre-filled dropdowns removes the guesswork and keeps parameter values consistent by default rather than by willpower.'
        ]
      },
      {
        heading: 'The other five, briefly',
        body: [
          'Round out your strategy with: campaign-level version numbers so you can track iterative changes over time, a consistent separator convention across all parameters, source-of-truth documentation linked directly from your link shortener, periodic audits to catch parameter drift, and a retirement process for old campaign tags so your dashboards do not accumulate years of dead filters.'
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'How Enterprise Teams Use Dragolink API',
    excerpt: 'A technical deep-dive into integrating our high-throughput link generation API into your existing CI/CD and deployment workflows.',
    category: 'Engineering',
    date: 'Oct 12, 2023',
    author: 'Alex Rivera',
    readTime: '8 min read',
    imageUrl: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=Analytics&backgroundColor=c0aede',
    content: [
      {
        heading: 'Link generation as infrastructure, not an afterthought',
        body: [
          'When a marketing team generates a handful of links by hand, a web UI is perfectly fine. When an engineering team needs to generate hundreds of thousands of links as part of a deploy pipeline, product feed, or transactional email system, link creation has to behave like any other piece of infrastructure: predictable, observable, and fast under load.',
          'This post walks through the patterns we see enterprise engineering teams reach for most often when they wire the Dragolink API into production systems.'
        ]
      },
      {
        heading: 'Batch creation over one-at-a-time calls',
        body: [
          'The single biggest performance mistake we see is looping over individual create-link requests inside a deploy script. Our batch endpoint accepts up to 1,000 link definitions per call and processes them concurrently server-side, which typically cuts total request time by an order of magnitude compared to sequential single calls.'
        ]
      },
      {
        heading: 'Idempotency keys for safe retries',
        body: [
          'CI/CD pipelines fail and retry constantly, and you do not want a retried step to generate a duplicate link. Every create-link call accepts an idempotency key, so a retried request with the same key returns the original link instead of minting a new one. This one detail eliminates an entire category of duplicate-link bugs in pipelines that redeploy frequently.'
        ]
      },
      {
        heading: 'Slotting link creation into a deploy stage',
        body: [
          'A common pattern is generating short links for release notes, changelog entries, or feature-flag documentation as a dedicated step immediately after a successful build, before the deploy stage runs. That way, if link generation fails, the pipeline halts before anything ships with broken or missing links.'
        ]
      },
      {
        heading: 'Rate limits and backoff',
        body: [
          'Our API enforces per-workspace rate limits that scale with your plan tier. Rather than hard-coding a fixed delay between requests, we recommend implementing exponential backoff keyed off the Retry-After response header, which adapts automatically as your usage grows instead of requiring a manual limit bump every time you scale.'
        ]
      },
      {
        heading: 'Observability',
        body: [
          'Every API call emits structured logs with a request ID that you can correlate against our dashboard. Teams running high-volume pipelines typically forward these into their existing observability stack so link creation failures show up in the same alerting system as everything else, rather than requiring a separate check of the Dragolink dashboard.'
        ]
      },
      {
        heading: 'Getting started',
        body: [
          'If you are integrating Dragolink into a CI/CD pipeline for the first time, our API reference includes a reference implementation for GitHub Actions and GitLab CI. Reach out to our solutions engineering team if you need help mapping this onto a different pipeline tool.'
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Introducing Dynamic QR Codes: What\'s New',
    excerpt: 'Update your destination URLs without reprinting your marketing materials. Everything you need to know about our latest feature release.',
    category: 'Product Updates',
    date: 'Oct 05, 2023',
    author: 'David Kim',
    readTime: '3 min read',
    imageUrl: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=QRCode&backgroundColor=ffd5dc',
    content: [
      {
        heading: 'The problem with static QR codes',
        body: [
          'A traditional QR code encodes a destination URL directly into its pattern. That works fine until you need to change where it points, at which point you are reprinting posters, packaging, or signage, or living with a dead link forever. For any campaign with a physical footprint, that is an expensive and slow failure mode.'
        ]
      },
      {
        heading: 'How dynamic QR codes solve it',
        body: [
          'Dynamic QR codes encode a Dragolink short link instead of a raw destination. The physical code never changes, but you can update where that short link redirects at any time from your dashboard. Print once, redirect as many times as your campaign needs.'
        ]
      },
      {
        heading: 'What is new in this release',
        body: [
          'Dynamic QR codes are now available directly from the link creation flow, no separate tool required. You can generate a QR code for any short link with one click, customize its color and embedded logo to match your brand, and export it as SVG or high-resolution PNG for print.'
        ]
      },
      {
        heading: 'Scan analytics, broken out from click analytics',
        body: [
          'Because a QR scan and a regular link click both route through the same short link, we now separate the two in your analytics dashboard so you can see exactly how much traffic is coming from print versus digital placements of the same campaign.'
        ]
      },
      {
        heading: 'Try it now',
        body: [
          'Open any existing short link in your dashboard and you will see a new QR tab. If you are on our free tier, dynamic QR codes are included at no extra cost for your first ten active codes.'
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'The Psychology of Click-Through Rates',
    excerpt: 'Why do users click some links and ignore others? An analysis of over 10 million links generated on the Dragolink platform.',
    category: 'Growth',
    date: 'Sep 28, 2023',
    author: 'Elena Rostova',
    readTime: '5 min read',
    imageUrl: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=CaseStudy&backgroundColor=b6e3f4',
    content: [
      {
        heading: 'What we looked at',
        body: [
          'We analyzed anonymized, aggregate performance data across ten million links created on Dragolink over an eighteen-month window, looking for patterns that consistently correlated with higher click-through rates regardless of industry or audience.'
        ]
      },
      {
        heading: 'Custom slugs outperform random strings',
        body: [
          'Links with a human-readable custom slug, for example a brand name or short descriptive word, consistently out-clicked randomly generated character strings. The effect was strongest in cold outreach and social contexts, where the reader has no other signal to judge trustworthiness before deciding whether to click.'
        ]
      },
      {
        heading: 'Shorter is not always better',
        body: [
          'There is a common assumption that the shortest possible link performs best. Our data does not fully support that: links between roughly eight and fourteen characters after the domain performed about as well as much shorter ones, as long as they were legible words rather than compressed noise.'
        ]
      },
      {
        heading: 'Placement context matters more than link design',
        body: [
          'The single strongest predictor of click-through rate was not anything about the link itself, it was the surrounding context: a clear, specific call to action immediately before the link consistently outperformed generic phrasing like "click here," regardless of how the link itself was formatted.'
        ]
      },
      {
        heading: 'Trust signals compound',
        body: [
          'Branded domains, which route through a custom domain you control rather than a shared shortener domain, showed a meaningful lift over generic shortener domains, and that lift was larger when combined with a recognizable slug. The two effects are not redundant, they stack.'
        ]
      },
      {
        heading: 'What this means for your next campaign',
        body: [
          'If you take one thing from this analysis, prioritize a branded domain and a readable slug before you worry about shaving off a few extra characters. The data suggests that legibility and trust drive more clicks than raw brevity.'
        ]
      }
    ]
  },
  {
    id: 6,
    title: 'Building a Link Analytics Dashboard from Scratch',
    excerpt: 'Learn the technical architecture behind our real-time analytics engine processing thousands of events per second.',
    category: 'Engineering',
    date: 'Sep 21, 2023',
    author: 'Alex Rivera',
    readTime: '7 min read',
    imageUrl: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=Infrastructure&backgroundColor=ffdfbf',
    content: [
      {
        heading: 'The problem with naive click tracking',
        body: [
          'The simplest possible implementation of click tracking writes a row to a database on every redirect. That works at small scale and falls over immediately at production scale, because every redirect now blocks on a synchronous database write directly in the critical path of the user experience.'
        ]
      },
      {
        heading: 'Separating the redirect path from the analytics path',
        body: [
          'Our redirect service does exactly one job on the hot path: look up the destination and issue the HTTP redirect as fast as possible. Click events are published asynchronously to a message queue and never block the redirect response, so analytics load has zero impact on click latency.'
        ]
      },
      {
        heading: 'Stream processing for near real-time aggregates',
        body: [
          'A stream processing layer consumes the click event queue and maintains rolling aggregates, such as clicks per minute per link, so dashboard queries never have to scan raw event data for common views. This is what makes the "live" click counter on your dashboard update within a couple of seconds of an actual click.'
        ]
      },
      {
        heading: 'Storage tiers for cost and speed',
        body: [
          'Recent, frequently queried data lives in a fast in-memory store. Anything older than thirty days rolls into columnar storage optimized for the kind of range queries a historical report needs, at a fraction of the storage cost. Your dashboard queries both tiers transparently, so the boundary is invisible to you.'
        ]
      },
      {
        heading: 'Handling bot traffic without corrupting real numbers',
        body: [
          'Not every request that hits a redirect endpoint is a human. We run a lightweight classification pass on every click event using request signals like user agent and request timing, and flag likely bot traffic in a separate field rather than silently dropping it, so you can choose whether to include it in your reports.'
        ]
      },
      {
        heading: 'What we would do differently',
        body: [
          'If we were starting over today, we would introduce the bot classification layer from day one instead of retrofitting it eight months in. Filtering out low-quality signal after the fact is far more painful than building the filter into the pipeline from the start.'
        ]
      }
    ]
  },
  {
    id: 7,
    title: 'Case Study: How TechCorp Boosted Conversions by 40%',
    excerpt: 'See exactly how switching to branded short links improved brand trust and significantly increased click-through rates for TechCorp.',
    category: 'Case Studies',
    date: 'Sep 15, 2023',
    author: 'Sarah Jenkins',
    readTime: '6 min read',
    imageUrl: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=Migration&backgroundColor=c0aede',
    content: [
      {
        heading: 'The starting point',
        body: [
          'TechCorp, a mid-sized B2B software company, was running email and social campaigns through a generic shortener domain shared across thousands of unrelated companies. Their marketing team suspected that unfamiliar-looking links were quietly suppressing click-through rates, but had no way to test the theory without changing infrastructure.'
        ]
      },
      {
        heading: 'What changed',
        body: [
          'TechCorp migrated their campaign links to a branded domain on Dragolink, matching their existing marketing subdomain, and standardized on readable, descriptive slugs instead of the auto-generated strings their previous tool produced. The migration ran alongside their existing tool for six weeks so both link types could be compared under identical campaign conditions.'
        ]
      },
      {
        heading: 'The results',
        body: [
          'Over the comparison window, branded links achieved a 40 percent higher click-through rate than generic-domain links sent to equivalent audience segments. Email campaigns showed the largest gap, which the team attributed to inbox security tools flagging unfamiliar shortener domains more aggressively than recognizable branded ones.'
        ]
      },
      {
        heading: 'Beyond click-through rate',
        body: [
          'TechCorp also reported a secondary effect: their sales team noticed prospects were more willing to click links shared directly in outbound emails once those links carried the company\'s own domain, since the link itself now functioned as a small trust signal rather than a generic redirect.'
        ]
      },
      {
        heading: 'Lessons for other teams',
        body: [
          'TechCorp\'s marketing lead summarized the takeaway as a shift in mindset: a short link is part of your brand surface, not just plumbing. Teams considering a similar migration should budget time for domain verification and DNS setup, which took TechCorp about two business days, well before their next campaign launch.'
        ]
      }
    ]
  }
];

export const getPostById = (id) => blogPosts.find((p) => String(p.id) === String(id));
