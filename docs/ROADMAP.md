# BookForge Pro: Goal and Plan

_Last updated: 2026-10-05_

## The goal

**Become the default first step for anyone starting a book, and be on the
"best of 2026" lists by launching into November's novel-writing month.**

Measurable version (by 2026-12-31):

| Metric | Target | Why it matters |
| --- | --- | --- |
| Blueprints generated | 100,000 | Core usage |
| Share links / cards created | 15,000 | The viral loop is working |
| Viral coefficient (new visitors per sharer) | > 0.4 | Growth without paid ads |
| Product Hunt | Top 5 of the day | Launch credibility and backlinks |
| Paying Pro customers | 750 | Proof people will pay |
| Revenue | $10k cumulative, $3k MRR | A business, not a toy |

Stretch (end of Q1 2027): 1M blueprints, $15k MRR.

## Honest strategic read

**What we have that others don't:** instant results, no signup, fully
private and offline, and deterministic output, so a share link alone can
rebuild a whole blueprint with no server. Writers are wary of AI tools that
train on their work, and "nothing leaves your browser" is a real selling point.

**The biggest risk:** the free engine is template-based. A writer who
compares it with a general chatbot will see that the prose is generic. The
plan handles this by keeping the free engine as the instant, private hook
and charging for an **AI deep-forge** tier that writes properly. The free
tier gets people in. Pro is where the money comes from.

**Timing:** November is novel-writing month. Hundreds of thousands of writers
start a book on Nov 1 and need an outline in late October. That sets the
deadline: **launch by Oct 27**.

## Business model

| Tier | Price | What you get |
| --- | --- | --- |
| Free (forever) | $0 | Offline engine, all 3 book types, share links and cards, MD/TXT/PDF export |
| Pro | $9/mo or $59/yr | AI deep-forge (real prose loglines, blurbs, chapter beats), DOCX + Scrivener export, unlimited saved projects, query-letter and synopsis generator |
| Lifetime (launch only) | $79, first 500 buyers | Pro forever: creates urgency at launch and front-loads cash |

Implementation (keeps the free tier backend-free):

- Checkout: Lemon Squeezy or Stripe Payment Links (merchant-of-record handles
  global VAT). The buyer gets a license key.
- AI: a single Vercel serverless function that proxies to the Claude API and
  checks the license key. Rate limit per key. Costs about $0.01-0.03 per
  deep-forge at current API prices, which leaves gross margin above 90% at $9/mo.
- Second revenue stream: an affiliate shelf (editing services, cover designers,
  KDP courses) in the Publishing Assets section.

## The plan

### Phase 1: Product-ready (done in this branch)

- [x] Shareable blueprint links (`#b=...`). The engine is deterministic, so the
      link rebuilds the exact blueprint in the recipient's browser. Untrusted input is
      sanitized and covered by tests.
- [x] Share Card: a 1200x630 PNG with title, logline, and score, built for
      X/Threads/Instagram/BookTok. Uses the native share sheet on mobile.
- [x] PDF export via a print stylesheet that prints only the blueprint.
- [x] Fixed: the studio was invisible on phones after generating, because the
      scroll-reveal threshold could never be met on a tall section.
- [x] Fixed: the mobile nav overflowed at 390px.
- [x] Fixed: ungrammatical fiction titles ("Letter of Village").
- [x] SEO and social: Open Graph and Twitter cards, OG image, JSON-LD, favicon.
- [x] Installable PWA with an offline service worker.
- [x] `vercel.json` with security headers (CSP, frame-deny, nosniff).
- [x] GitHub Actions CI running the engine tests and syntax checks.

### Phase 2: Ship (week of Oct 6)

- [ ] **Pick and buy the domain** (needs you). Then set absolute `og:image`,
      `og:url`, and `<link rel="canonical">` in `index.html`, and add `sitemap.xml`.
- [ ] **Deploy to Vercel** from `main` (needs you to approve the project).
- [ ] Privacy-friendly analytics (Vercel Web Analytics or Plausible; no cookies)
      with events for: generate, share link, share card, export, and `#b=` landings.
      Without this, the viral loop can't be measured.
- [ ] Email capture: "Get the 30-day writing plan for your blueprint" (Buttondown
      or ConvertKit). This builds the launch list.
- [ ] A one-click "Remix this blueprint" banner on shared links, so every viewer
      becomes a creator.

### Phase 3: Monetize (Oct 13-24)

- [ ] Pricing section and Pro upgrade modal (checkout link set in one config constant).
- [ ] `/api/forge` serverless function: Claude API proxy with license check,
      per-key rate limit, and streaming output.
- [ ] AI deep-forge buttons on Logline, Blurb, and Chapter Outline (Pro).
- [ ] DOCX export (Pro).
- [ ] Multiple saved projects (the current storage holds one).
- [ ] Engine quality pass: more genre profiles and better name/place
      extraction. The free tier still has to impress.

### Phase 4: Launch (Oct 27 - Nov 1)

- [ ] Seed 20 example blueprints as shareable links and an "inspiration gallery".
- [ ] Product Hunt launch on Tuesday, Oct 27 (12:01am PT), with the hunter lined up a week ahead.
- [ ] Show HN the same week. Angle: "a book planner that is 100% client-side,
      where the share link *is* the data".
- [ ] Reddit (r/writing, r/selfpublish, r/fantasywriters, r/NaNoWriMo): lead
      with value and follow each sub's self-promo rules.
- [ ] BookTok and Reels: "I gave this tool a one-sentence idea and it built my
      whole novel outline" (screen recording of the share card reveal).
- [ ] Lifetime deal live for launch week only.

Paste-ready copy is in [`LAUNCH_KIT.md`](LAUNCH_KIT.md).

### Phase 5: Go viral and compound (November onward)

- [ ] "Blueprint of the Day" posts, built from (opt-in) shared links.
- [ ] Writing-community partnerships: free Pro for Discord writing servers'
      moderators in exchange for a pinned link.
- [ ] Programmatic SEO pages: "How to outline a {genre} novel" for each genre,
      each with an embedded live engine.
- [ ] Year-end push: submit to "best tools of 2026" roundups and newsletters
      in December.
- [ ] Referral: give a friend a month of Pro, get a month of Pro.

## Viral loops (how growth actually happens)

1. **Share link → recipient sees a full blueprint → "Make your own" → new
   sharer.** Zero friction because there's no signup.
2. **Share card on social → curiosity → visit.** The card carries the URL.
3. **PDF export → shared with writing groups and critique partners.**
4. **SEO pages → organic traffic → share loop.**

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Free output feels generic next to chatbots | AI deep-forge in Pro; free tier marketed on speed and privacy |
| Writers distrust "AI" | Free tier makes no AI calls at all; Pro sends only what you send, and data is never trained on |
| Share links get long with big ideas | Ideas are capped at 2,000 characters; compress with `CompressionStream` if needed |
| Launch timing slips past November | Phase 2/3 are scoped so the launch can go out with free tier + lifetime deal only |

## Decisions that need you

1. Domain name.
2. Vercel deploy approval (team and project).
3. Payment provider account (Lemon Squeezy recommended).
4. Anthropic API key for the Pro serverless function (stored as a Vercel env var).
5. Analytics provider.
