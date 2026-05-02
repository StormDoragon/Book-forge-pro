# BookForge Pro

BookForge Pro is a frontend-only book planning studio that converts raw concepts into structured manuscript blueprints.

It is designed to run fully offline in the browser with no API keys, backend, or login.

## Highlights

- Separate planning engines for Fiction, Nonfiction, and Memoir
- Concept analyzer with naturalized signal output
- Chapter intelligence with story beats and chapter-level hooks
- Depth levels: Quick, Professional, Publisher-Level
- Blueprint Intelligence Score with strengths and fix suggestions
- Project memory in localStorage (titles, chapter notes, progress, export history)
- Section tools: copy, regenerate, and refine
- Exports: Markdown and TXT

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

## Repository Layout

```text
bookforge-pro/
├── index.html
├── style.css
├── script.js
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── .editorconfig
└── .gitignore
```

## Roadmap

- Improve offline prose realism and chapter hook diversity
- Add DOCX/PDF export pipeline
- Introduce backend AI mode as an optional upgrade path

## License

MIT. See LICENSE.

## Publishing to GitHub

If GitHub only shows README, your other files are likely not committed yet.

```bash
git add .
git commit -m "Add BookForge Pro app files and project docs"
git push origin main
```