/*
 * Zero-dependency smoke tests for the BookForge Pro engine.
 * Run with: node tests/engine.test.js
 *
 * These tests assert the core promise: a blueprint must reflect the user's
 * actual concept (its characters, setting, and central object), not a fixed
 * template story.
 */

const assert = require("assert");
const engine = require("../script.js");

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`  ok  - ${name}`);
  } catch (err) {
    console.error(`  FAIL - ${name}`);
    console.error(`        ${err.message}`);
    process.exitCode = 1;
  }
}

function baseInput(overrides) {
  return Object.assign(
    {
      projectName: "Test Project",
      bookIdea: "",
      genre: "Sci-fi",
      bookType: "Fiction",
      targetReader: "curious readers",
      tone: "Professional",
      depthLevel: "Professional Blueprint",
      positioning: "a fresh angle",
      length: 60000
    },
    overrides
  );
}

console.log("BookForge Pro engine tests\n");

test("blueprint reflects a sci-fi murder concept (not the old map story)", () => {
  const idea = "A space detective named Vega investigates a murder aboard a Mars mining colony";
  const { modules } = engine.buildBlueprint(baseInput({ bookIdea: idea, genre: "Sci-fi" }));
  const text = modules.map((m) => `${m.title}\n${m.body}`).join("\n").toLowerCase();
  assert.ok(text.includes("detective"), "should mention the detective role");
  assert.ok(text.includes("mars") || text.includes("colony"), "should mention the Mars setting");
  assert.ok(text.includes("vega"), "should use the named protagonist");
  assert.ok(!text.includes("cartographer"), "must NOT fall back to the hardcoded mapmaker story");
  assert.ok(!text.includes("saltwater ink"), "must NOT contain hardcoded sea-map content");
});

test("a totally different concept yields different output", () => {
  const a = engine.buildBlueprint(baseInput({
    bookIdea: "Two sisters inherit a failing bakery in a small village",
    genre: "Literary"
  }));
  const b = engine.buildBlueprint(baseInput({
    bookIdea: "A hacker uncovers a conspiracy inside a megacorporation",
    genre: "Thriller"
  }));
  const ta = a.modules.find((m) => m.title === "Logline").body.toLowerCase();
  const tb = b.modules.find((m) => m.title === "Logline").body.toLowerCase();
  assert.notStrictEqual(ta, tb, "two concepts should not share a logline");
  assert.ok(ta.includes("bakery") || ta.includes("sister"), "concept A should surface its nouns");
  assert.ok(tb.includes("hacker") || tb.includes("corporation") || tb.includes("conspiracy"),
    "concept B should surface its nouns");
});

test("fiction chapter titles are unique", () => {
  const { modules } = engine.buildBlueprint(baseInput({
    bookIdea: "A knight must recover a stolen crown before the kingdom falls into war",
    genre: "Fantasy",
    depthLevel: "Publisher-Level Blueprint"
  }));
  const chapters = modules.find((m) => m.title === "Chapter Outline").body;
  const titles = chapters.split("\n").filter((l) => /^\d+\.\s/.test(l));
  assert.ok(titles.length >= 14, `expected >= 14 chapters, got ${titles.length}`);
  assert.strictEqual(new Set(titles).size, titles.length, "chapter title lines must be unique");
});

test("nonfiction engine produces a reader-problem module", () => {
  const { modules } = engine.buildBlueprint(baseInput({
    bookIdea: "A practical guide to productivity for overwhelmed founders",
    genre: "Business",
    bookType: "Business"
  }));
  const titles = modules.map((m) => m.title);
  assert.ok(titles.includes("Reader Problem"), "nonfiction should include Reader Problem");
  assert.ok(titles.includes("Core Framework"), "nonfiction should include Core Framework");
});

test("memoir engine produces a memory map", () => {
  const { modules } = engine.buildBlueprint(baseInput({
    bookIdea: "My years rebuilding a life after losing my home to a flood",
    genre: "Memoir",
    bookType: "Memoir"
  }));
  const titles = modules.map((m) => m.title);
  assert.ok(titles.includes("Memory Map"), "memoir should include Memory Map");
});

test("depth levels change module count", () => {
  const quick = engine.buildBlueprint(baseInput({ bookIdea: "A spy thriller in Berlin", depthLevel: "Quick Blueprint" }));
  const pub = engine.buildBlueprint(baseInput({ bookIdea: "A spy thriller in Berlin", depthLevel: "Publisher-Level Blueprint" }));
  assert.ok(pub.modules.length > quick.modules.length, "publisher level should add modules");
});

test("same input is deterministic", () => {
  const input = baseInput({ bookIdea: "A botanist on a dying planet searches for one living seed" });
  const a = engine.buildBlueprint(input);
  const b = engine.buildBlueprint(input);
  assert.strictEqual(
    JSON.stringify(a.modules),
    JSON.stringify(b.modules),
    "identical input must yield identical output"
  );
});

test("quality score stays within 0..10", () => {
  const { quality } = engine.buildBlueprint(baseInput({ bookIdea: "x" }));
  assert.ok(quality.score >= 0 && quality.score <= 10, `score out of range: ${quality.score}`);
});

test("rewrite 'professional' actually transforms text", () => {
  const out = engine.rewriteText("This is a big thing and good stuff!", "professional", null);
  assert.ok(!/\bbig\b/.test(out), "should replace 'big'");
  assert.ok(!out.includes("!"), "should soften exclamation");
  assert.notStrictEqual(out, "This is a big thing and good stuff!", "must change the text");
});

test("module titles are unique", () => {
  const { modules } = engine.buildBlueprint(baseInput({ bookIdea: "A detective story" }));
  const titles = modules.map((m) => m.title);
  assert.strictEqual(new Set(titles).size, titles.length, "module titles must be unique");
});

console.log(`\n${passed} checks passed.`);
if (process.exitCode) {
  console.error("\nSome tests failed.");
} else {
  console.log("All tests passed.");
}
