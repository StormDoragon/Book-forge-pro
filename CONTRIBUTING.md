# Contributing

Thanks for improving BookForge Pro.

## Development Principles

- Keep the app frontend-only unless a planned architecture change is approved.
- Prefer small, focused pull requests.
- Preserve existing behavior unless the change is intentional and documented.
- Avoid adding dependencies for simple tasks.

## Local Run

```bash
python3 -m http.server 8081
```

Open http://localhost:8081.

## Code Style

- Follow .editorconfig settings.
- Keep JavaScript functions small and named by responsibility.
- Add concise comments only when logic is not obvious.
- Use ASCII unless there is a clear need for Unicode.

## Tests

The pure engine is covered by a zero-dependency Node suite. Run it before
opening a pull request:

```bash
node tests/engine.test.js
```

Keep generation logic in the pure (DOM-free) half of `script.js` so it stays
testable. Add or update a test when you change engine behavior.

## Pull Request Checklist

- [ ] Change is scoped and documented.
- [ ] README is updated if behavior or setup changed.
- [ ] `node tests/engine.test.js` passes.
- [ ] No debug logs or temporary files are committed.
- [ ] UI remains usable on desktop and mobile.
- [ ] Existing features still work: save/load, exports, section regeneration.
