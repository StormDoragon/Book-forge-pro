# BookForge Pro

BookForge Pro is a frontend-only book planning studio that converts raw concepts into structured manuscript blueprints.

It is designed to run fully offline in the browser with no API keys, backend, or login.

## Highlights

- Separate planning engines for Fiction, Nonfiction, and Memoir
- A concept-driven engine: it extracts the protagonist, setting, central
  object, antagonist, goal, and stakes from your idea and threads them through
  every module, so two different ideas produce two genuinely different blueprints
- Genre-aware vocabulary for Fantasy, Sci-fi, Mystery, Romance, Thriller,
  Historical, Literary, and more
- Chapter intelligence with story beats, unique chapter titles, and ending hooks
- Depth levels: Quick, Professional, Publisher-Level
- Blueprint Intelligence Score with strengths and fix suggestions
- Project memory in localStorage (titles, chapter notes, progress, export history)
- Section tools: copy, regenerate, and refine (Professional / Cinematic / Shorter / Specific)
- Non-blocking toast notifications instead of blocking alerts
- Exports: Markdown, TXT, and PDF (print-optimized)
- Share links: the URL fragment carries the input and the recipient's browser
  rebuilds the identical blueprint. No server involved
- Remix banner: anyone opening a share link can remix it or start their own
- Share cards: a 1200x630 PNG (title, logline, score) for social posts
- Installable PWA that works offline
- Deterministic output: the same idea always yields the same blueprint

## Core Workflow

Idea -> Strategy -> Blueprint -> Chapter Intelligence -> Draft Support -> Revision

## Engines and Outputs

### Fiction Engine

- Logline
- Core dramatic question
- Protagonist, flaw, desire, need
- Antagonistic force
- Natural stakes
- World rules
- Theme
- Act structure
- Chapter outline with beat-level intelligence
- Scene prompts
- Character arcs
- Back cover blurb
- Comparable reader promise

### Nonfiction Engine

- Reader problem
- Reader promise
- Transformation path
- Core framework
- Chapter-by-chapter learning path
- Case studies
- Exercises and action steps
- Credibility angle
- Revision checklist
- Back cover blurb
- SEO and marketplace keywords

### Memoir Engine

- Life question
- Before state
- Inciting life event
- Emotional wound
- Turning points
- Inner transformation
- Memory map
- Chapter themes
- Reflective takeaway
- Back cover blurb

## Local Development

1. Start a local server:

```bash
python3 -m http.server 8081
```

2. Open:

```text
http://localhost:8081
```

## Deployment

The site is fully static. `vercel.json` sets security headers (CSP,
frame-deny, nosniff) and keeps `sw.js` uncached so updates roll out promptly.
Any static host works; the service worker only registers over HTTPS.

Analytics use Vercel Web Analytics (cookieless), loaded from `index.html` on
any host except localhost. Custom events go through `track()` in
`script.js` and must only carry categories (engine, genre, format), never
text the user typed. URL fragments are stripped because share links carry
the user's idea there.

Email signup uses Buttondown's embed form (a plain form POST in a new tab, as
Buttondown requires). Set the username in
`<meta name="buttondown-username">` in `index.html`; the forms stay hidden
until it is set. Only the email and category tags are sent. See
[`docs/emails/30-day-writing-plan.md`](docs/emails/30-day-writing-plan.md).

Pricing checkout links live in `<meta name="checkout-pro-monthly">`,
`checkout-pro-yearly`, and `checkout-lifetime` in `index.html` (https only).
While a plan's link is empty, it shows "Coming soon" and its button joins a
Buttondown waitlist instead. Set them only once the Pro features exist.

## Roadmap

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for the goal, business model, and
launch plan, and [`docs/LAUNCH_KIT.md`](docs/LAUNCH_KIT.md) for launch copy.

## Architecture

`script.js` is split into two halves:

1. A pure, DOM-free engine (data + functions) that turns an idea into a
   structured blueprint. It has no side effects and is exported for tests.
2. A browser layer (guarded by `typeof document`) that wires the engine to the
   page: rendering, project memory, save/load, exports, and toasts.

`site.js` is separate and owns only presentational chrome (theme toggle,
mobile nav, scroll reveal, the "Try an example" demo). It never touches
generation logic. All colors are CSS tokens with a dark default and a
`[data-theme="light"]` override, so the theme toggle applies everywhere.

This separation keeps the generation logic testable in Node with zero
dependencies while the app stays fully frontend-only.

## Tests

The engine has a zero-dependency smoke suite. Run it with:

```bash
node tests/engine.test.js
```

It asserts the core promise (output reflects the actual concept), checks
chapter-title uniqueness, determinism, depth-level behavior, and the rewrite
modes.

## Repository Layout

```text
bookforge-pro/
├── index.html
├── style.css
├── script.js          # blueprint engine + studio wiring
├── site.js            # website chrome: theme, nav, reveal, demo
├── tests/
│   └── engine.test.js
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── .editorconfig
└── .gitignore
```

## Roadmap

- Add DOCX/PDF export pipeline
- Expand genre vocabulary banks and entity extraction
- Introduce an optional backend AI mode as an upgrade path

## License

MIT. See LICENSE.

## Publishing to GitHub

If GitHub only shows README, your other files are likely not committed yet.

```bash
git add .
git commit -m "Add BookForge Pro app files and project docs"
git push origin main
```