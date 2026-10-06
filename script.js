/*
 * BookForge Pro - offline book-blueprint engine.
 *
 * The file is split into two halves:
 *   1. A pure, DOM-free engine (data + functions) that turns a plain-language
 *      idea into a structured blueprint. This half is exported for Node tests.
 *   2. A browser layer (guarded by `typeof document`) that wires the engine to
 *      the page: rendering, project memory, save/load, exports, and toasts.
 *
 * Design goal: every blueprint must reflect the user's actual concept. The
 * engine extracts entities (protagonist, setting, central object, antagonist,
 * goal, stakes) from the idea and threads them through every module, rather
 * than emitting a fixed template story.
 */

const GENRES = [
  "Fantasy",
  "Sci-fi",
  "Mystery",
  "Romance",
  "Thriller",
  "Historical",
  "Literary",
  "Personal Development",
  "Business",
  "Health",
  "Technology",
  "Spiritual",
  "Education",
  "Memoir"
];

const BOOK_TYPES = [
  "Fiction",
  "Nonfiction",
  "Memoir",
  "Business",
  "Spiritual",
  "Sci-fi",
  "Self-help",
  "Educational"
];

const TONES = [
  "Professional",
  "Cinematic",
  "Poetic",
  "Academic",
  "Simple",
  "Bold",
  "Emotional"
];

const DEPTH_LEVELS = [
  "Quick Blueprint",
  "Professional Blueprint",
  "Publisher-Level Blueprint"
];

// Legacy single-draft key (pre multi-project); migrated on first load.
const STORAGE_KEY = "bookforge-pro-project-v2";
const PROJECTS_KEY = "bookforge-pro-projects-v1";
// "Unlimited saved projects" is a Pro feature on the pricing page.
const FREE_PROJECT_LIMIT = 3;

/*
 * Genre profiles supply tasteful fallbacks when the idea is sparse. They are
 * never used to override words the user actually provided; extracted concept
 * terms always win.
 */
const GENRE_PROFILES = {
  fantasy: {
    role: "an unlikely keeper of a dangerous secret",
    setting: "a kingdom built on a buried lie",
    object: "an artifact that rewrites what people believe",
    force: "an old power that was never truly gone",
    stakes: "a war that history was meant to prevent",
    titleNouns: ["Oath", "Throne", "Relic", "Tide", "Crown", "Ruin", "Oracle", "Gate"]
  },
  scifi: {
    role: "an operator who notices what the system hides",
    setting: "a colony living on borrowed time",
    object: "a signal that should not exist",
    force: "an intelligence optimizing for the wrong goal",
    stakes: "the survival of everyone still breathing",
    titleNouns: ["Signal", "Drift", "Orbit", "Protocol", "Vector", "Echo", "Relay", "Core"]
  },
  mystery: {
    role: "an investigator who cannot let one detail go",
    setting: "a town that prefers its secrets kept",
    object: "a piece of evidence that breaks the official story",
    force: "someone powerful who needs the truth buried",
    stakes: "justice for a victim no one else will name",
    titleNouns: ["Verdict", "Witness", "Alibi", "Motive", "Confession", "Cold Case"]
  },
  romance: {
    role: "a guarded heart that learns to risk again",
    setting: "a place where two lives keep colliding",
    object: "a promise neither of them meant to make",
    force: "the fear of being truly seen",
    stakes: "a love worth more than safety",
    titleNouns: ["Promise", "Spark", "Vow", "Distance", "Almost", "After"]
  },
  thriller: {
    role: "someone ordinary pulled into something lethal",
    setting: "a city where the rules quietly stopped applying",
    object: "proof that someone will kill to recover",
    force: "a network that erases its own mistakes",
    stakes: "staying alive long enough to expose the truth",
    titleNouns: ["Countdown", "Fallout", "Blacklist", "Endgame", "Trap", "Run"]
  },
  historical: {
    role: "a witness caught inside a turning point in history",
    setting: "a world about to be remade by force",
    object: "a record that powerful people want forgotten",
    force: "an era that punishes the wrong loyalties",
    stakes: "a future decided by who survives to tell it",
    titleNouns: ["Reckoning", "Exile", "Inheritance", "Aftermath", "Homeland"]
  },
  literary: {
    role: "a person quietly unraveling and rebuilding",
    setting: "an ordinary life with extraordinary pressure underneath",
    object: "a memory that refuses to stay buried",
    force: "the weight of a choice that cannot be undone",
    stakes: "the meaning of a single human life",
    titleNouns: ["Distances", "Inheritance", "The Years", "Small Rooms", "Aftertaste"]
  },
  default: {
    role: "a protagonist forced to choose between comfort and truth",
    setting: "a world where the old story no longer holds",
    object: "a discovery that changes what everyone believed",
    force: "a system that rewards silence",
    stakes: "the cost of staying the same versus the risk of change",
    titleNouns: ["Threshold", "Reckoning", "The Turn", "Aftermath", "The Edge"]
  }
};

/* Lexicons used to extract entities from a free-text idea. */
const ROLE_WORDS = [
  "detective", "investigator", "cartographer", "mapmaker", "scientist", "engineer",
  "doctor", "nurse", "teacher", "professor", "student", "soldier", "captain", "pilot",
  "hacker", "programmer", "journalist", "reporter", "lawyer", "judge", "thief", "spy",
  "assassin", "monk", "priest", "nun", "healer", "witch", "wizard", "sorcerer", "knight",
  "queen", "king", "princess", "prince", "warrior", "hunter", "sailor", "farmer", "chef",
  "baker", "artist", "painter", "musician", "singer", "writer", "poet", "actor", "dancer",
  "athlete", "boxer", "founder", "ceo", "entrepreneur", "manager", "nomad", "refugee",
  "immigrant", "survivor", "widow", "widower", "orphan", "twin", "sister", "brother",
  "mother", "father", "daughter", "son", "girl", "boy", "woman", "man", "child",
  "librarian", "historian", "archaeologist", "botanist", "astronaut", "miner", "smuggler",
  "bounty hunter", "mercenary", "rebel", "outlaw", "gardener", "clockmaker", "watchmaker"
];

const SETTING_WORDS = [
  "city", "town", "village", "kingdom", "empire", "republic", "nation", "island",
  "ocean", "sea", "harbor", "coast", "ship", "spaceship", "starship", "station",
  "planet", "moon", "colony", "galaxy", "orbit", "forest", "jungle", "desert",
  "mountain", "valley", "river", "swamp", "tundra", "wasteland", "frontier", "border",
  "school", "university", "academy", "hospital", "asylum", "prison", "castle", "palace",
  "monastery", "temple", "cathedral", "lab", "laboratory", "factory", "mine", "farm",
  "ranch", "mansion", "estate", "manor", "apartment", "suburb", "neighborhood", "bakery",
  "restaurant", "bar", "theater", "museum", "library", "archive", "warehouse", "bunker",
  "underground", "subway", "highway", "battlefield", "camp", "outpost", "settlement"
];

const OBJECT_WORDS = [
  "map", "letter", "diary", "journal", "notebook", "key", "crown", "ring", "amulet",
  "relic", "artifact", "sword", "blade", "weapon", "gun", "bomb", "formula", "equation",
  "algorithm", "code", "cipher", "machine", "device", "engine", "reactor", "painting",
  "portrait", "manuscript", "book", "scroll", "tablet", "virus", "cure", "vaccine",
  "serum", "treasure", "gold", "inheritance", "will", "testament", "photograph", "photo",
  "recording", "tape", "file", "ledger", "contract", "prophecy", "blueprint", "seed",
  "stone", "gem", "necklace", "watch", "clock", "compass", "telescope", "skeleton",
  "body", "corpse", "message", "signal", "transmission", "recipe", "song", "melody"
];

const FORCE_WORDS = [
  "war", "invasion", "rebellion", "revolution", "regime", "empire", "dictator",
  "tyrant", "corporation", "cartel", "cult", "gang", "mafia", "syndicate", "conspiracy",
  "disease", "plague", "virus", "epidemic", "famine", "drought", "storm", "flood",
  "monster", "beast", "dragon", "demon", "ghost", "spirit", "alien", "robot",
  "ai", "machine", "government", "police", "killer", "murderer", "assassin", "hunter",
  "predator", "addiction", "grief", "fear", "betrayal", "corruption", "collapse",
  "extinction", "apocalypse", "darkness", "curse", "prophecy", "fate"
];

const STOPWORDS = new Set(
  ("a an and or but of to in on at by for with from into over under about as is are " +
    "was were be been being who whom whose which that this these those it its they them " +
    "their there here he she his her you your we our i my me not no yes very more most " +
    "much many few little some any all each every when where while after before then " +
    "than so if because although though however meanwhile during between among")
    .split(" ")
);

/* Common capitalized words that are not names; keeps proper-noun detection clean. */
const NON_NAME_WORDS = new Set(
  ("the a an i it he she they we you my his her their our this that there when where " +
    "after before during chapter book story novel one two three first last new old")
    .split(" ")
);

const FICTION_BEATS = [
  "Opening Image",
  "Ordinary World",
  "Inciting Incident",
  "Refusal / Pressure",
  "First Doorway",
  "New World Rules",
  "First Major Cost",
  "Midpoint Revelation",
  "Betrayal or Collapse",
  "Dark Night Choice",
  "Final Confrontation",
  "New Order"
];

/* ------------------------------------------------------------------ */
/* Pure utilities                                                      */
/* ------------------------------------------------------------------ */

function sanitize(text) {
  return (text || "").trim();
}

function toTitleCase(text) {
  if (!text) return "";
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function capitalize(text) {
  if (!text) return "";
  return text[0].toUpperCase() + text.slice(1);
}

function uniqueList(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

/* Stable string hash so the same idea yields the same blueprint. */
function hashSeed(text) {
  let hash = 0;
  const str = String(text || "");
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function pick(arr, seed = 0) {
  if (!arr || !arr.length) return "";
  return arr[Math.abs(seed) % arr.length];
}

/* Pick `count` distinct items starting from a seeded offset. */
function pickN(arr, count, seed = 0) {
  if (!arr || !arr.length) return [];
  const out = [];
  const start = Math.abs(seed) % arr.length;
  for (let i = 0; i < arr.length && out.length < count; i += 1) {
    const item = arr[(start + i) % arr.length];
    if (!out.includes(item)) out.push(item);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Concept extraction                                                  */
/* ------------------------------------------------------------------ */

function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function findFirstMatch(idea, list) {
  const tokens = tokenize(idea);
  const set = new Set(tokens);
  // Prefer multi-word entries first (e.g. "bounty hunter").
  const multi = list.filter((w) => w.includes(" "));
  for (const phrase of multi) {
    if (idea.toLowerCase().includes(phrase)) return phrase;
  }
  for (const token of tokens) {
    if (list.includes(token)) return token;
  }
  // Singular/plural tolerance.
  for (const token of tokens) {
    const singular = token.replace(/s$/, "");
    if (set.has(token) && list.includes(singular)) return singular;
  }
  return "";
}

function extractProperNouns(idea) {
  const matches = idea.match(/\b[A-Z][a-zA-Z]+\b/g) || [];
  return uniqueList(
    matches
      .map((w) => w.trim())
      .filter((w) => w.length > 2 && !NON_NAME_WORDS.has(w.toLowerCase()))
  ).slice(0, 6);
}

function extractGoal(idea) {
  const lower = idea.toLowerCase();
  const patterns = [
    /(?:must|has to|needs to|wants to|tries to|sets out to|determined to|fights to|struggles to|hopes to|in order to)\s+([a-z][a-z'\s-]{4,60})/,
    /(?:to)\s+(save|protect|find|expose|escape|destroy|rebuild|avenge|uncover|stop|recover|win|survive)\s+([a-z'\s-]{2,40})/
  ];
  for (const re of patterns) {
    const m = lower.match(re);
    if (m) {
      const phrase = (m[2] ? `${m[1]} ${m[2]}` : m[1]).trim().replace(/\s+/g, " ");
      return phrase.split(" ").slice(0, 7).join(" ");
    }
  }
  return "";
}

function detectSignals(lower) {
  return {
    hasMagic: /magic|spell|curse|wizard|witch|sorcer|enchant|dragon|demon|fae|rune/.test(lower),
    hasMystery: /secret|hidden|mystery|murder|missing|disappear|clue|detective|investigat|conspiracy|cover-?up/.test(lower),
    hasWar: /war|battle|invasion|rebellion|revolution|empire|regime|army|soldier|siege/.test(lower),
    hasSea: /sea|ocean|island|tide|harbor|ship|sail|coast|shore|port|wave/.test(lower),
    hasSciFi: /space|planet|mars|moon|galaxy|starship|spaceship|robot|\bai\b|cyborg|alien|quantum|colony|orbit|simulation/.test(lower),
    hasRomance: /love|romance|marriage|heartbreak|relationship|wedding|affair|crush|lover/.test(lower),
    hasTech: /startup|software|app|algorithm|data|engineer|silicon|code|platform|venture/.test(lower),
    hasCrime: /heist|crime|gang|cartel|mafia|murder|theft|smuggl|detective|police/.test(lower)
  };
}

function genreKeyFromInput(input, signals) {
  const g = (input.genre || "").toLowerCase();
  if (g.includes("fantasy")) return "fantasy";
  if (g.includes("sci") || g.includes("technology")) return "scifi";
  if (g.includes("mystery")) return "mystery";
  if (g.includes("romance")) return "romance";
  if (g.includes("thriller")) return "thriller";
  if (g.includes("historical")) return "historical";
  if (g.includes("literary")) return "literary";
  // Fall back to detected signals when genre is generic.
  if (signals) {
    if (signals.hasSciFi) return "scifi";
    if (signals.hasMagic) return "fantasy";
    if (signals.hasCrime || signals.hasMystery) return "mystery";
    if (signals.hasRomance) return "romance";
  }
  return "default";
}

/*
 * Build a "world" of resolved narrative entities. Extracted concept terms are
 * used first; genre fallbacks fill any gaps so output is always coherent.
 */
function buildWorld(idea, input, signals) {
  const profile = GENRE_PROFILES[genreKeyFromInput(input, signals)] || GENRE_PROFILES.default;
  const names = extractProperNouns(idea);
  const role = findFirstMatch(idea, ROLE_WORDS);
  const settingWord = findFirstMatch(idea, SETTING_WORDS);
  const objectWord = findFirstMatch(idea, OBJECT_WORDS);
  const forceWord = findFirstMatch(idea, FORCE_WORDS);
  const goal = extractGoal(idea);

  const name = names[0] || "";
  const place = names.find((n) => n !== name) || "";

  let protagonist;
  let protagonistShort;
  if (name && role) {
    protagonist = `${name}, ${/^[aeiou]/i.test(role) ? "an" : "a"} ${role}`;
    protagonistShort = name;
  } else if (name) {
    protagonist = `${name}, ${profile.role}`;
    protagonistShort = name;
  } else if (role) {
    protagonist = `${/^[aeiou]/i.test(role) ? "an" : "a"} ${role}`;
    protagonistShort = `the ${role}`;
  } else {
    protagonist = profile.role;
    protagonistShort = "the protagonist";
  }

  let settingPhrase;
  if (settingWord && place) settingPhrase = `the ${settingWord} of ${place}`;
  else if (settingWord) settingPhrase = `the ${settingWord}`;
  else if (place) settingPhrase = place;
  else settingPhrase = profile.setting;

  const object = objectWord ? `the ${objectWord}` : profile.object;
  const antagonist = forceWord ? `the ${forceWord}` : profile.force;
  const resolvedGoal = goal || `to ${signals.hasWar ? "stop the coming catastrophe" : "set things right"}`;
  const stakes = profile.stakes;

  // Short, title-safe tokens. Only populated from genuinely extracted concrete
  // words so chapter/book titles never inline a long fallback phrase.
  const objectShort = objectWord ? capitalize(objectWord) : profile.titleNouns[0];
  const forceShort = forceWord ? capitalize(forceWord) : "";
  let settingTitle = "";
  if (place) settingTitle = place;
  else if (settingWord) settingTitle = `the ${capitalize(settingWord)}`;

  return {
    profile,
    names,
    protagonist,
    protagonistShort,
    settingPhrase,
    settingCap: capitalize(settingPhrase.replace(/^the\s+/i, "")),
    settingTitle,
    object,
    objectCap: capitalize(object.replace(/^the\s+/i, "")),
    objectExtracted: !!objectWord,
    objectShort,
    antagonist,
    antagonistCap: capitalize(antagonist.replace(/^the\s+/i, "")),
    forceShort,
    goal: resolvedGoal,
    stakes,
    disruption: objectWord ? `${object} resurfaces` : `${antagonist} makes its move`,
    firstClue: objectWord
      ? `${object} carries a detail that contradicts the official story`
      : `a small inconsistency exposes a much larger lie`
  };
}

function extractConceptElements(idea, world, signals) {
  const elements = [];
  if (world.names.length) elements.push(`Named: ${world.names.slice(0, 3).join(", ")}`);
  if (findFirstMatch(idea, ROLE_WORDS)) elements.push(`Protagonist role: ${findFirstMatch(idea, ROLE_WORDS)}`);
  if (findFirstMatch(idea, SETTING_WORDS)) elements.push(`Setting: ${findFirstMatch(idea, SETTING_WORDS)}`);
  if (findFirstMatch(idea, OBJECT_WORDS)) elements.push(`Central object: ${findFirstMatch(idea, OBJECT_WORDS)}`);
  if (findFirstMatch(idea, FORCE_WORDS)) elements.push(`Opposing force: ${findFirstMatch(idea, FORCE_WORDS)}`);
  if (signals.hasMagic) elements.push("Magic / supernatural");
  if (signals.hasSciFi) elements.push("Science-fiction frame");
  if (signals.hasMystery) elements.push("Mystery / hidden truth");
  if (signals.hasWar) elements.push("Large-scale conflict");
  if (signals.hasRomance) elements.push("Romantic thread");
  return uniqueList(elements);
}

function analyzeConcept(idea, input = { genre: "" }) {
  const text = sanitize(idea);
  const lower = text.toLowerCase();
  const signals = detectSignals(lower);
  const world = buildWorld(text, input, signals);
  const detectedElements = extractConceptElements(text, world, signals);

  return {
    ...signals,
    world,
    protagonistHint: world.protagonist,
    stakesHint: world.stakes,
    goalHint: world.goal,
    detectedElements
  };
}

/* ------------------------------------------------------------------ */
/* Fiction engine (concept-driven)                                     */
/* ------------------------------------------------------------------ */

function naturalizeSignals(concept) {
  const w = concept.world;
  return `${capitalize(w.protagonistShort)} must confront ${w.antagonist} after ${w.firstClue}, ` +
    `fighting ${w.goal} across ${w.settingPhrase} while ${w.stakes} hangs in the balance.`;
}

function makeDramaticQuestion(concept) {
  const w = concept.world;
  return `Can ${w.protagonistShort} ${w.goal.replace(/^to\s+/, "")} before ${w.antagonist} ` +
    `makes the cost unbearable, and what will it take from them to do it?`;
}

function makeProtagonistProfile(concept) {
  const w = concept.world;
  const skill = concept.hasMystery
    ? "They see the pattern everyone else dismisses as noise."
    : "They are competent in their world but untested where it matters most.";
  const fear = `Their private fear: that acting on the truth about ${w.object} will cost them the life they have built.`;
  const pressure = `As ${w.antagonist} closes in, ${w.protagonistShort} is forced from observer to participant.`;
  return `${capitalize(w.protagonist)}. ${skill} ${fear} ${pressure}`;
}

const BEAT_TEMPLATES = {
  "Opening Image": (w) => ({
    purpose: `Establish ${w.protagonistShort} inside ${w.settingPhrase} before the surface cracks.`,
    conflict: `An ordinary moment turns wrong: ${w.firstClue}.`,
    scene: `${capitalize(w.protagonistShort)} encounters ${w.object} and senses something does not add up.`,
    hook: `${w.objectCap} points to a truth that was meant to stay buried.`
  }),
  "Ordinary World": (w) => ({
    purpose: `Show the rules, comforts, and blind spots of ${w.settingPhrase}.`,
    conflict: `Everyone treats the official story as settled, making doubt socially dangerous.`,
    scene: `${capitalize(w.protagonistShort)} goes through a normal routine while quietly noticing what others ignore.`,
    hook: `One detail about ${w.object} refuses to fit the accepted version of events.`
  }),
  "Inciting Incident": (w) => ({
    purpose: `Deliver the first undeniable proof that the accepted story is wrong.`,
    conflict: `${capitalize(w.protagonistShort)} finds evidence that ${w.antagonist} is not what it claims to be.`,
    scene: `A hidden layer of ${w.object} reveals something that implicates people in power.`,
    hook: `The evidence names someone ${w.protagonistShort} trusted.`
  }),
  "Refusal / Pressure": (w) => ({
    purpose: `Force hesitation while outside pressure punishes curiosity.`,
    conflict: `Allies demand silence; pursuing the truth about ${w.object} now looks reckless.`,
    scene: `${capitalize(w.protagonistShort)} is warned to stop, framed as unstable or disloyal.`,
    hook: `A private threat arrives: walk away now, or lose everything.`
  }),
  "First Doorway": (w) => ({
    purpose: `Commit ${w.protagonistShort} to irreversible risk.`,
    conflict: `Crossing one line turns caution into open defiance of ${w.antagonist}.`,
    scene: `${capitalize(w.protagonistShort)} breaks a rule to reach what was hidden in ${w.settingPhrase}.`,
    hook: `On the other side of that choice, there is no way back.`
  }),
  "New World Rules": (w) => ({
    purpose: `Define what is true, costly, and dangerous in this new reality.`,
    conflict: `Every ally now has divided motives, and ${w.object} behaves in ways no one predicted.`,
    scene: `${capitalize(w.protagonistShort)} tests what they think they know and gets a result they did not expect.`,
    hook: `The new rule reveals that ${w.antagonist} has been planning longer than anyone realized.`
  }),
  "First Major Cost": (w) => ({
    purpose: `Show visible, painful consequences for pursuing the truth.`,
    conflict: `Protecting the truth about ${w.object} costs ${w.protagonistShort} status or someone they love.`,
    scene: `A trusted figure makes a sacrifice to keep the evidence out of the wrong hands.`,
    hook: `The loss exposes a second, larger secret beneath the first.`
  }),
  "Midpoint Revelation": (w) => ({
    purpose: `Deliver a truth that reframes the entire story.`,
    conflict: `${w.antagonistCap} was never the real threat, or never acting alone.`,
    scene: `${capitalize(w.protagonistShort)} learns the deception was engineered, not accidental.`,
    hook: `The real architect of the lie is someone still standing beside them.`
  }),
  "Betrayal or Collapse": (w) => ({
    purpose: `Break trust and remove the protagonist's fallback options.`,
    conflict: `A close ally trades ${w.object} for protection, leaving ${w.protagonistShort} exposed.`,
    scene: `At the worst moment, the protagonist's own plan is turned against them.`,
    hook: `The betrayal points to someone even higher up.`
  }),
  "Dark Night Choice": (w) => ({
    purpose: `Reduce the story to a single values-based choice with no safe path.`,
    conflict: `Silence protects the people ${w.protagonistShort} loves; truth endangers everyone at once.`,
    scene: `${capitalize(w.protagonistShort)} faces two doors and can only walk through one.`,
    hook: `Before the choice is made, ${w.antagonist} forces the timeline.`
  }),
  "Final Confrontation": (w) => ({
    purpose: `Force payment of the truth's highest cost.`,
    conflict: `To stop ${w.antagonist}, ${w.protagonistShort} must risk the very thing they set out to protect.`,
    scene: `${capitalize(w.protagonistShort)} confronts the source of the lie in front of everyone who matters.`,
    hook: `As the confrontation peaks, the hidden truth becomes impossible to deny.`
  }),
  "New Order": (w) => ({
    purpose: `Show what was rebuilt, what was lost, and who pays for the future.`,
    conflict: `Winning ends one threat but opens a harder era of accountability.`,
    scene: `${capitalize(w.protagonistShort)} stands in a changed ${w.settingPhrase}, counting the cost.`,
    hook: `One last detail hints that the story is not entirely finished.`
  })
};

function makeBeatContent(beat, world, index) {
  const template = BEAT_TEMPLATES[beat];
  if (template) return template(world);
  return {
    purpose: `Escalate the pressure on ${world.protagonistShort} and narrow the options.`,
    conflict: `A new complication makes the truth about ${world.object} harder to act on.`,
    scene: `${capitalize(world.protagonistShort)} is pushed one step closer to an irreversible choice.`,
    hook: `The cost of waiting just went up.`
  };
}

const EMOTIONAL_TURNS = [
  "Calm shifts to unease.",
  "Confidence turns to doubt.",
  "Curiosity becomes fear.",
  "Fear hardens into resolve.",
  "Resolve collides with regret.",
  "Control gives way to adaptation.",
  "Hope fractures under loss.",
  "Shock transforms into clarity.",
  "Trust collapses into isolation.",
  "Despair sharpens into conviction.",
  "Conviction demands sacrifice.",
  "Relief lands with responsibility."
];

/*
 * Build a pool of distinct, concept-derived chapter titles and return `count`
 * of them with no repeats.
 */
function makeChapterTitles(world, engineType, count, seed, offset = 0) {
  let pool;
  if (engineType === "fiction") {
    const setT = world.settingTitle;
    const obj = world.objectShort;
    const force = world.forceShort;
    pool = [
      world.objectExtracted ? `The ${obj} That Should Not Exist` : "The First Crack",
      setT ? `Beneath ${setT}` : "Beneath the Surface",
      "The First Lie",
      force ? `What the ${force} Buried` : "What Was Buried",
      "No Way Back",
      "The Witness",
      "The Cost of Truth",
      "Everything Breaks",
      setT ? `Into ${setT}` : "Into the Dark",
      `The Last ${pick(world.profile.titleNouns, seed)}`,
      `The ${pick(world.profile.titleNouns, seed + 3)}`,
      "The Turning Point",
      world.objectExtracted ? `The Price of the ${obj}` : "The Price of Truth",
      "Out of the Dark",
      "The Confrontation",
      "The New Order"
    ];
  } else if (engineType === "memoir") {
    pool = [
      "Before the Break",
      "The Day Everything Changed",
      "First Denial",
      "The Hidden Wound",
      "A Dangerous Choice",
      "The Turning Point",
      "What Was Lost",
      "What I Could Not Say",
      "Finding the Words",
      "The New Voice",
      "Coming Home to Myself",
      "What I Carry Now"
    ];
  } else {
    pool = [
      "Name the Pain",
      "Break the Old Belief",
      "Introduce the Framework",
      "The First Move",
      "The Second Move",
      "Proof It Works",
      "Build the System",
      "Overcome the Obstacles",
      "Make It Stick",
      "Scale Without Burnout",
      "Measure What Matters",
      "The Lasting Transformation"
    ];
  }

  // Select in narrative order (offset 0) so early chapters get opening titles
  // and later chapters get climax titles. `offset` is only non-zero when the
  // user explicitly asks to regenerate titles for variety.
  const titles = pickN(pool, count, offset);
  while (titles.length < count) {
    titles.push(`Chapter ${titles.length + 1}`);
  }
  return titles;
}

function chapterCountFromLength(length, depthLevel) {
  if (depthLevel === "Quick Blueprint") return 10;
  if (depthLevel === "Publisher-Level Blueprint") return 14;
  if (length <= 45000) return 10;
  if (length <= 80000) return 12;
  return 14;
}

function buildFictionChapterIntelligence(concept, chapterCount, seed) {
  const world = concept.world;
  const titles = makeChapterTitles(world, "fiction", chapterCount, seed);
  const blocks = [];

  for (let i = 0; i < chapterCount; i += 1) {
    const beat = FICTION_BEATS[i] || `Escalation ${i - FICTION_BEATS.length + 1}`;
    const content = makeBeatContent(beat, world, i);
    blocks.push([
      `${i + 1}. ${titles[i]}`,
      "",
      "Story Beat:",
      beat,
      "",
      "Purpose:",
      content.purpose,
      "",
      "Conflict:",
      content.conflict,
      "",
      "Emotional Turn:",
      EMOTIONAL_TURNS[i % EMOTIONAL_TURNS.length],
      "",
      "Scene Prompt:",
      `Setting: ${capitalize(world.settingPhrase)}. ${content.scene}`,
      "",
      "Ending Hook:",
      content.hook
    ].join("\n"));
  }
  return blocks.join("\n\n");
}

function buildActStructure(concept) {
  const w = concept.world;
  return [
    `Act 1: Setup and fracture. Establish ${w.protagonistShort} in ${w.settingPhrase} and crack the surface lie.`,
    `Act 2A: Pursuit and false wins. ${capitalize(w.protagonistShort)} learns the new rules but pays in trust.`,
    `Midpoint: An irreversible revelation reframes who the real threat is.`,
    `Act 2B: Collapse and moral pressure. ${capitalize(w.antagonist)} forces the worst possible choice.`,
    `Act 3: Final confrontation and a value-based resolution at full cost.`
  ].join("\n");
}

function buildFictionEngine(input, concept, chapterCount, titleIdeas, seed) {
  const w = concept.world;
  const elementsList = concept.detectedElements.length
    ? concept.detectedElements.join("; ")
    : "hidden tension, risky truth, and emotional cost";
  const naturalSignal = naturalizeSignals(concept);
  const worldRules = [
    concept.hasMagic ? "Power has a price: every use of it leaves a visible mark." : "Power follows leverage and hidden information.",
    `${w.objectCap} can be hidden or altered, but never without a trace.`,
    `The setting itself - ${w.settingPhrase} - behaves almost like a witness.`
  ].join("\n");

  return [
    { title: "Logline", body: naturalSignal },
    { title: "Core Dramatic Question", body: makeDramaticQuestion(concept) },
    { title: "Protagonist", body: makeProtagonistProfile(concept) },
    { title: "Protagonist Flaw", body: "Over-control: they believe competence can substitute for vulnerability and trust." },
    { title: "Protagonist Desire", body: `What they want: ${w.goal}.` },
    { title: "Protagonist Need", body: "What they actually need: to trust others and accept that truth demands sacrifice." },
    { title: "Antagonistic Force", body: `${capitalize(w.antagonist)} - it rewards silence, punishes witnesses, and protects the lie at the center of the story.` },
    { title: "Stakes", body: [
      `Public: if ${w.protagonistShort} is right, ${w.stakes}.`,
      `Personal: if they are wrong or silent, they lose credibility, allies, and the chance to act.`,
      `Moral: every chapter forces a choice between comfort, loyalty, and truth.`
    ].join("\n") },
    { title: "World Rules", body: worldRules },
    { title: "Theme", body: "Truth has a cost, but silence has a higher one." },
    { title: "Act 1 / Act 2A / Midpoint / Act 2B / Act 3", body: buildActStructure(concept) },
    { title: "Chapter Outline", body: buildFictionChapterIntelligence(concept, chapterCount, seed) },
    { title: "Scene Prompts", body: `Weave the detected elements into every scene: ${elementsList}.\nAnchor the prose in this core signal: ${naturalSignal}\nOpen with pressure, reveal one contradiction, end with a consequence.` },
    { title: "Character Arcs", body: `${capitalize(w.protagonistShort)}: certainty -> fracture -> earned conviction.\nClosest ally: guarded truth -> costly disclosure.\nAntagonist: control -> desperation.` },
    { title: "Back Cover Blurb", body: `${titleIdeas[0]} follows ${w.protagonist}. ${naturalSignal} Every discovery redraws the line between the story people were told and the truth someone worked hard to bury.` },
    { title: "Comparable Reader Promise", body: `Positioning: ${input.positioning}.\nReader promise: high-concept ${input.genre.toLowerCase()} with a character-led mystery, escalating stakes, and an emotionally costly truth.` }
  ];
}

/* ------------------------------------------------------------------ */
/* Nonfiction engine                                                   */
/* ------------------------------------------------------------------ */

const TOPIC_FILLER = new Set(
  ("practical guide book books story handbook manual approach simple complete ultimate " +
    "beginner beginners introduction overview about into your their these those very really")
    .split(" ")
);

function topicFromIdea(idea) {
  const tokens = tokenize(idea).filter(
    (t) => t.length > 3 && !STOPWORDS.has(t) && !TOPIC_FILLER.has(t)
  );
  return uniqueList(tokens).slice(0, 3).join(", ");
}

function buildNonfictionChapterIntelligence(input, concept, chapterCount, seed) {
  const titles = makeChapterTitles(concept.world, "nonfiction", chapterCount, seed);
  const lines = [];
  for (let i = 0; i < chapterCount; i += 1) {
    lines.push(
      `${i + 1}. ${titles[i]}\n` +
        `Purpose: Move the reader from confusion to capability on one specific sub-skill.\n` +
        `Action Step: One implementation sprint that ${input.targetReader.toLowerCase()} can run this week.`
    );
  }
  return lines.join("\n\n");
}

function buildNonfictionEngine(input, concept, chapterCount, titleIdeas, seed) {
  const topic = topicFromIdea(input.bookIdea) || input.genre.toLowerCase();
  const frameworkName = `${toTitleCase(input.positioning.split(" ").slice(0, 3).join(" ")) || "Core"} Framework`;
  return [
    { title: "Reader Problem", body: `${input.targetReader} struggle with ${topic}: scattered effort, unclear priorities, and inconsistent execution.` },
    { title: "Reader Promise", body: `This book helps ${input.targetReader} move from confusion about ${topic} to a repeatable system with measurable progress.` },
    { title: "Transformation Path", body: "Diagnose -> Reframe -> Build system -> Execute -> Measure -> Sustain." },
    { title: "Core Framework", body: `${frameworkName}\n1) Clarity Layer\n2) Design Layer\n3) Execution Layer\n4) Optimization Layer` },
    { title: "Chapter-by-Chapter Learning Path", body: buildNonfictionChapterIntelligence(input, concept, chapterCount, seed) },
    { title: "Examples / Case Studies", body: "Case 1: An early adopter who got quick wins.\nCase 2: A team-level rollout under real constraints.\nCase 3: Long-term optimization after the initial success." },
    { title: "Exercises / Action Steps", body: "Each chapter ends with one 20-minute exercise, one weekly sprint, and one checkpoint metric." },
    { title: "Credibility Angle", body: `Credibility lane: ${input.positioning}.\nSupport it with lived results, concrete examples, and transparent reasoning.` },
    { title: "Revision Checklist", body: "[ ] Is each chapter tied to a measurable reader outcome?\n[ ] Is every concept paired with a practical action?\n[ ] Does the structure avoid jargon drift?" },
    { title: "Back Cover Blurb", body: `${titleIdeas[0]} gives ${input.targetReader} a practical, chapter-by-chapter operating system for results that actually compound.` },
    { title: "SEO / Amazon Keywords", body: `${input.genre.toLowerCase()} strategy\n${input.bookType.toLowerCase()} framework\n${input.targetReader.toLowerCase()} guide\n${topic} system\nactionable playbook` }
  ];
}

/* ------------------------------------------------------------------ */
/* Memoir engine                                                       */
/* ------------------------------------------------------------------ */

const MEMOIR_THEMES = [
  "The life before, and what it cost to keep it",
  "The first fracture in the old story",
  "Denial, survival, and the things left unsaid",
  "The hidden wound beneath the surface",
  "A reckless, necessary turning point",
  "Naming the truth out loud",
  "Grief and what was permanently lost",
  "Finding language for the unspeakable",
  "Rebuilding identity from the pieces",
  "Claiming a new and honest voice",
  "Integration: holding the past without drowning in it",
  "What endures, and what is finally chosen"
];

function buildMemoirChapterIntelligence(input, concept, chapterCount, seed) {
  const titles = makeChapterTitles(concept.world, "memoir", chapterCount, seed);
  const detail = concept.detectedElements.length
    ? concept.detectedElements[0].replace(/^[^:]+:\s*/, "")
    : "";
  const lines = [];
  for (let i = 0; i < chapterCount; i += 1) {
    const theme = MEMOIR_THEMES[i % MEMOIR_THEMES.length];
    const seasoned = detail && i % 3 === 1 ? `${theme}, seen through ${detail}` : theme;
    lines.push(
      `${i + 1}. ${titles[i]}\n` +
        `Theme: ${seasoned}.\n` +
        `Reflective move: Connect the past scene to a present-day insight the reader can use.`
    );
  }
  return lines.join("\n\n");
}

function buildMemoirEngine(input, concept, chapterCount, titleIdeas, seed) {
  const w = concept.world;
  return [
    { title: "Life Question", body: "Who did I become while surviving, and who am I willing to become now?" },
    { title: "Before State", body: "Life looked functional on the surface but was fragmented underneath." },
    { title: "Inciting Life Event", body: `A rupture exposed the hidden truth around ${w.object !== GENRE_PROFILES.default.object ? w.object : "the old life"}: it could no longer hold.` },
    { title: "Emotional Wound", body: "A belief that love must be earned through performance and silence." },
    { title: "Turning Points", body: "Turning Point 1: Naming the wound.\nTurning Point 2: Refusing the old script.\nTurning Point 3: Choosing a new voice in public." },
    { title: "Inner Transformation", body: "From protection and image-management to agency and an integrated identity." },
    { title: "Memory Map", body: buildMemoirChapterIntelligence(input, concept, chapterCount, seed) },
    { title: "Chapter Themes", body: "Loss, witness, responsibility, repair, meaning, and a chosen future." },
    { title: "Reflective Takeaway", body: "Readers leave with language for their own turning points and the courage to narrate honestly." },
    { title: "Back Cover Blurb", body: `${titleIdeas[0]} is a memoir about rupture, memory, and the difficult grace of becoming whole.` }
  ];
}

/* ------------------------------------------------------------------ */
/* Titles, depth, scoring                                              */
/* ------------------------------------------------------------------ */

function buildFictionTitles(input, concept, seed) {
  const w = concept.world;
  const noun = pick(w.profile.titleNouns, seed);
  // settingTitle is "Avalon" or "the Village", and empty when no place was
  // extracted. Never inline the long fallback setting phrase into a title.
  const place = w.settingTitle;
  if (!place) {
    const second = pick(w.profile.titleNouns.slice(1), seed + 1) || noun;
    return uniqueList([
      `The ${w.objectShort}`,
      `The Last ${noun}`,
      `${w.objectShort} and ${second}`,
      `What the ${second} Remembers`,
      `After the ${noun}`
    ]);
  }
  return uniqueList([
    `The ${w.objectShort} of ${place}`,
    `The ${w.profile.titleNouns[0]}`,
    `Beneath ${place}`,
    `The Last ${noun}`,
    `When ${place} Falls`
  ]);
}

function buildNonfictionTitles(input) {
  const audience = input.targetReader.split(" ").slice(0, 2).join(" ") || "Leader";
  const outcome = input.positioning.split(" ").slice(0, 2).join(" ") || "Results";
  return uniqueList([
    `The ${toTitleCase(outcome)} Method`,
    `The ${toTitleCase(outcome)} Blueprint`,
    `From Overwhelm to ${toTitleCase(outcome)}`,
    `The ${toTitleCase(audience)} Operating System`,
    `Build ${toTitleCase(outcome)} Without Burnout`
  ]);
}

function buildMemoirTitles(input, concept) {
  const place = concept.world.settingCap || "Silence";
  return uniqueList([
    `Beneath ${place}`,
    `The Question I Could Not Ignore`,
    `When the Old Life Broke`,
    `A Map Back to Myself`,
    `${toTitleCase(input.projectName)}: A Memoir`
  ]);
}

function makeTitleIdeas(input, concept, engineType, seed) {
  if (engineType === "fiction") return buildFictionTitles(input, concept, seed);
  if (engineType === "memoir") return buildMemoirTitles(input, concept);
  return buildNonfictionTitles(input);
}

function normalizeBookType(bookType) {
  const normalized = (bookType || "").toLowerCase();
  if (normalized === "memoir") return "memoir";
  if (["nonfiction", "business", "self-help", "educational", "spiritual"].includes(normalized)) {
    return "nonfiction";
  }
  return "fiction";
}

function buildPublisherExtras(input, engineType, titleIdeas) {
  return [
    { title: "Market Positioning", body: `Audience promise: ${input.targetReader} gain clear outcomes through a structured, voice-led approach.\nCategory lane: ${input.genre} / ${input.bookType}.` },
    { title: "Comparable Titles", body: `Comp 1: A category leader in ${input.genre}.\nComp 2: A practical framework title with strong implementation.\nComp 3: A voice-driven book with high reader retention.` },
    { title: "Series Potential", body: engineType === "fiction" ? "Potential trilogy arc: discovery, escalation, reconstruction." : "Potential follow-ups: workbook, field guide, advanced volume." },
    { title: "Amazon Categories", body: `${input.genre} > Strategy\n${input.bookType} > Writing and Publishing\n${input.genre} > Applied Practice` },
    { title: "Launch Assets", body: "Lead-magnet chapter, pre-order bonus checklist, a 10-post social sequence, and a one-line author pitch." },
    { title: "Query Letter Angle", body: `Core hook: ${titleIdeas[0]} addresses ${input.targetReader.toLowerCase()} through a differentiated ${input.positioning.toLowerCase()} lens.` }
  ];
}

function applyDepthLevel(modules, input, engineType, titleIdeas) {
  if (input.depthLevel === "Quick Blueprint") {
    return modules.slice(0, Math.min(10, modules.length));
  }
  if (input.depthLevel === "Publisher-Level Blueprint") {
    return modules.concat(buildPublisherExtras(input, engineType, titleIdeas));
  }
  return modules;
}

function qualitySuggestions(score, engineType, concept) {
  const fixes = [];
  if (score < 6 || concept.detectedElements.length < 3) {
    fixes.push("Add more concrete nouns to your idea: a named character, a place, and the thing at stake.");
  }
  if (engineType === "fiction") {
    fixes.push("Give the antagonist a specific face or role rather than an abstract force.");
    fixes.push("Vary chapter-ending hooks so they do not settle into a single pattern.");
  }
  if (engineType === "nonfiction") {
    fixes.push("Tighten the promise into one measurable before/after statement.");
    fixes.push("Add one concrete, metric-backed case outcome per major module.");
  }
  if (engineType === "memoir") {
    fixes.push("Deepen the reflective bridge lines after memory-heavy chapters.");
  }
  return uniqueList(fixes).slice(0, 3);
}

function qualityStrengths(modules, input, engineType, concept) {
  const text = modules.map((mod) => `${mod.title}\n${mod.body}`).join("\n").toLowerCase();
  const strengths = [];
  if (concept.detectedElements.length >= 3) {
    strengths.push("Your idea gave the engine strong, specific material to build on.");
  }
  if (/stakes|conflict|catastrophe|cost/.test(text)) {
    strengths.push("Stakes are visible and escalating.");
  }
  if (engineType === "fiction" && /protagonist flaw|protagonist need/.test(text)) {
    strengths.push("The protagonist's internal arc is explicitly defined.");
  }
  if (engineType === "fiction" && /world rules/.test(text)) {
    strengths.push("World rules are concrete enough to shape plot decisions.");
  }
  if (engineType !== "fiction" && /framework|action step/.test(text)) {
    strengths.push("The practical execution path is chapter-linked.");
  }
  return strengths.slice(0, 4);
}

function scoreBlueprint(modules, input, concept) {
  let score = 3; // baseline for a complete structure
  const text = modules.map((mod) => mod.body.toLowerCase()).join("\n");

  score += Math.min(3, concept.detectedElements.length); // concept specificity
  if (/chapter\s+|\n\d+\.\s/.test(text)) score += 1;
  if (/stakes|conflict|transformation|promise/.test(text)) score += 1;
  if (/reader|audience|protagonist/.test(text)) score += 1;
  if (/blurb|amazon|seo|positioning|comparable/.test(text)) score += 1;

  return Math.min(10, Number(score.toFixed(1)));
}

function buildQualityReport(modules, input, engineType, concept) {
  const score = scoreBlueprint(modules, input, concept);
  return {
    score,
    strengths: qualityStrengths(modules, input, engineType, concept),
    suggestions: qualitySuggestions(score, engineType, concept)
  };
}

function buildCoreAnchors(input, concept) {
  const w = concept.world;
  const anchors = [
    `Protagonist: ${w.protagonist}`,
    `Setting: ${capitalize(w.settingPhrase)}`,
    `Central tension: ${w.antagonist}`,
    `Goal: ${w.goal}`,
    `Stakes: ${w.stakes}`
  ];
  if (concept.detectedElements.length) anchors.push(`Signals: ${concept.detectedElements.join("; ")}`);
  anchors.push(`Reader: ${input.targetReader}`);
  anchors.push(`Positioning: ${input.positioning}`);
  return anchors;
}

function ensureUniqueModuleTitles(modules) {
  const seen = {};
  return modules.map((mod) => {
    const key = mod.title.trim();
    seen[key] = (seen[key] || 0) + 1;
    if (seen[key] === 1) return mod;
    return { ...mod, title: `${key} (${seen[key]})` };
  });
}

/*
 * Pure entry point: input -> { modules, concept, quality, titleIdeas }.
 * No DOM, no globals, no side effects. This is what the Node tests exercise.
 */
function buildBlueprint(input) {
  const concept = analyzeConcept(input.bookIdea, input);
  const engineType = normalizeBookType(input.bookType);
  const chapterCount = chapterCountFromLength(input.length, input.depthLevel);
  const seed = hashSeed(`${input.projectName}|${input.bookIdea}`);
  const titleIdeas = makeTitleIdeas(input, concept, engineType, seed);

  let modules;
  if (engineType === "fiction") {
    modules = buildFictionEngine(input, concept, chapterCount, titleIdeas, seed);
  } else if (engineType === "memoir") {
    modules = buildMemoirEngine(input, concept, chapterCount, titleIdeas, seed);
  } else {
    modules = buildNonfictionEngine(input, concept, chapterCount, titleIdeas, seed);
  }

  modules = [{ title: "Concept Analyzer", body: buildCoreAnchors(input, concept).join("\n") }].concat(modules);
  modules = [{ title: "Title Ideas", body: titleIdeas.map((item, idx) => `${idx + 1}. ${item}`).join("\n") }].concat(modules);
  modules = applyDepthLevel(modules, input, engineType, titleIdeas);
  modules = ensureUniqueModuleTitles(modules);

  const quality = buildQualityReport(modules, input, engineType, concept);
  return { modules, concept, quality, titleIdeas, engineType };
}

/* ------------------------------------------------------------------ */
/* Section rewrite (refine controls)                                   */
/* ------------------------------------------------------------------ */

function rewriteText(text, mode, concept) {
  if (!text) return "";

  if (mode === "professional") {
    return text
      .replace(/\bthing(s)?\b/gi, (m, s) => (s ? "elements" : "element"))
      .replace(/\bbig\b/gi, "high-impact")
      .replace(/\bsmall\b/gi, "targeted")
      .replace(/\bget\b/gi, "achieve")
      .replace(/\bstuff\b/gi, "material")
      .replace(/\bgood\b/gi, "effective")
      .replace(/\bbad\b/gi, "ineffective")
      .replace(/\ba lot of\b/gi, "substantial")
      .replace(/!+/g, ".");
  }

  if (mode === "cinematic") {
    return `Frame this in motion and consequence:\n\n${text}\n\nAdd a sensory detail, one escalation, and an irreversible choice.`;
  }

  if (mode === "shorter") {
    return text
      .split("\n")
      .filter((line) => line.trim())
      .slice(0, 4)
      .join("\n");
  }

  if (mode === "specific") {
    const details = concept && concept.detectedElements && concept.detectedElements.length
      ? concept.detectedElements.join("; ")
      : "named places, named actors, and measurable outcomes";
    return `${text}\n\nSpecificity upgrade: explicitly weave in ${details}.`;
  }

  return text;
}

/* Export the pure engine for Node-based tests. */
/* ------------------------------------------------------------------ */
/* Share links                                                         */
/* ------------------------------------------------------------------ */

// The engine is deterministic, so a link only has to carry the input: the
// recipient's browser rebuilds the identical blueprint. No server involved.
const SHARE_VERSION = 1;
const SHARE_FIELDS = {
  n: "projectName",
  i: "bookIdea",
  g: "genre",
  b: "bookType",
  r: "targetReader",
  t: "tone",
  d: "depthLevel",
  p: "positioning",
  l: "length"
};
const SHARE_MAX_CHARS = 6000;
// One limit for the form, the encoder and the decoder, so nothing is truncated.
const SHARE_FIELD_MAX = 2000;
const SHARE_TEXT_FIELDS = ["projectName", "bookIdea", "targetReader", "positioning"];

function toBase64Url(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(encoded) {
  const padded = encoded.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((encoded.length + 3) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeShareState(input) {
  const payload = { v: SHARE_VERSION };
  Object.entries(SHARE_FIELDS).forEach(([key, field]) => {
    if (input[field] !== undefined && input[field] !== "") payload[key] = input[field];
  });
  return toBase64Url(JSON.stringify(payload));
}

// Encodes for sharing only if the decoder will rebuild exactly the same input.
// Returns { ok: true, encoded } or { ok: false, reason }.
function prepareShare(input) {
  const tooLong = SHARE_TEXT_FIELDS.find((field) => typeof input[field] === "string" && input[field].length > SHARE_FIELD_MAX);
  if (tooLong) {
    return { ok: false, reason: `Shorten the ${tooLong.replace(/([A-Z])/g, " $1").toLowerCase()} to ${SHARE_FIELD_MAX} characters or fewer to share it.` };
  }
  const encoded = encodeShareState(input);
  if (encoded.length > SHARE_MAX_CHARS) {
    return { ok: false, reason: "This project is too large for a share link. Shorten the idea or other text fields." };
  }
  const decoded = decodeShareState(encoded);
  const same = decoded && SHARE_TEXT_FIELDS.every((field) => !input[field] || decoded[field] === input[field]);
  if (!same) return { ok: false, reason: "This project can't be shared as a link without changing its text." };
  return { ok: true, encoded };
}

// Returns a sanitized input object, or null for anything malformed. Shared
// links are untrusted, so only known fields and allowed select values pass.
function decodeShareState(encoded) {
  if (typeof encoded !== "string" || !encoded || encoded.length > SHARE_MAX_CHARS) return null;
  let payload;
  try {
    payload = JSON.parse(fromBase64Url(encoded));
  } catch (err) {
    return null;
  }
  if (!payload || payload.v !== SHARE_VERSION || typeof payload.i !== "string") return null;

  const input = {};
  Object.entries(SHARE_FIELDS).forEach(([key, field]) => {
    if (typeof payload[key] === "string") input[field] = sanitize(payload[key]).slice(0, SHARE_FIELD_MAX);
  });
  if (!input.bookIdea) return null;

  const allowed = { genre: GENRES, bookType: BOOK_TYPES, tone: TONES, depthLevel: DEPTH_LEVELS };
  Object.entries(allowed).forEach(([field, options]) => {
    if (!options.includes(input[field])) input[field] = options[field === "depthLevel" ? 1 : 0];
  });
  const length = Number(payload.l);
  input.length = Number.isFinite(length) ? Math.min(250000, Math.max(5000, Math.round(length))) : 60000;
  input.projectName = input.projectName || "Untitled Project";
  input.targetReader = input.targetReader || "A clearly defined niche reader";
  input.positioning = input.positioning || "A unique angle with practical value";
  return input;
}

/* ------------------------------------------------------------------ */
/* Project store (pure; the browser layer persists it to localStorage) */
/* ------------------------------------------------------------------ */

function emptyProjectStore() {
  return { version: 1, activeId: null, projects: {} };
}

function isProjectState(state) {
  return !!state && typeof state === "object" && !!state.input && typeof state.input === "object";
}

function projectName(state) {
  const name = isProjectState(state) && typeof state.input.projectName === "string" ? state.input.projectName.trim() : "";
  return name || "Untitled Project";
}

function makeProjectId(now, salt) {
  return `p_${now.toString(36)}_${String(salt).replace(/[^a-z0-9]/gi, "").slice(0, 8)}`;
}

// Parse the stored JSON, dropping anything malformed. If there is no store
// yet, a legacy single draft becomes the first project.
function parseProjectStore(raw, legacyRaw, now) {
  let store = emptyProjectStore();
  try {
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && parsed.version === 1 && parsed.projects && typeof parsed.projects === "object") {
      Object.values(parsed.projects).forEach((project) => {
        if (project && typeof project.id === "string" && isProjectState(project.state)) {
          store.projects[project.id] = {
            id: project.id,
            name: projectName(project.state),
            updatedAt: Number(project.updatedAt) || 0,
            state: project.state
          };
        }
      });
      store.activeId = Object.prototype.hasOwnProperty.call(store.projects, parsed.activeId) ? parsed.activeId : null;
      return store;
    }
  } catch (err) {
    store = emptyProjectStore();
  }
  try {
    const legacy = legacyRaw ? JSON.parse(legacyRaw) : null;
    if (isProjectState(legacy)) {
      const id = makeProjectId(now, "legacy");
      store.projects[id] = { id, name: projectName(legacy), updatedAt: now, state: legacy };
    }
  } catch (err) {
    /* unreadable legacy draft: start empty */
  }
  return store;
}

function listProjects(store) {
  return Object.values(store.projects)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map(({ id, name, updatedAt, state }) => ({
      id,
      name,
      updatedAt,
      bookType: (state.input && state.input.bookType) || "",
      hasBlueprint: Array.isArray(state.blueprint) && state.blueprint.length > 0
    }));
}

// Returns { store, id, status } without mutating the input store. status is
// "updated" (overwrote the active project), "created", or "limit" (a new
// project would exceed the limit; nothing saved).
function saveToProjectStore(store, state, { now, salt, limit = FREE_PROJECT_LIMIT }) {
  const projects = { ...store.projects };
  const activeId = store.activeId && projects[store.activeId] ? store.activeId : null;
  if (!activeId && Object.keys(projects).length >= limit) {
    return { store, id: null, status: "limit" };
  }
  const id = activeId || makeProjectId(now, salt);
  projects[id] = { id, name: projectName(state), updatedAt: now, state };
  return { store: { ...store, activeId: id, projects }, id, status: activeId ? "updated" : "created" };
}

function emptyProjectMemory() {
  return { favoriteTitles: [], chapterNotes: {}, draftProgress: 0, exportHistory: [] };
}

// Saved memory may be partial or malformed; always hand back a usable copy
// that shares nothing with the stored object.
function normalizeProjectMemory(raw) {
  const memory = emptyProjectMemory();
  if (!raw || typeof raw !== "object") return memory;
  const strings = (list) => (Array.isArray(list) ? list.filter((item) => typeof item === "string") : []);
  memory.favoriteTitles = strings(raw.favoriteTitles);
  memory.exportHistory = strings(raw.exportHistory);
  if (raw.chapterNotes && typeof raw.chapterNotes === "object" && !Array.isArray(raw.chapterNotes)) {
    Object.entries(raw.chapterNotes).forEach(([line, note]) => {
      if (typeof note === "string") memory.chapterNotes[line] = note;
    });
  }
  memory.draftProgress = Math.min(100, Math.max(0, Number(raw.draftProgress) || 0));
  return memory;
}

// Carry this tab's active project over onto a freshly read store, so a write
// only changes what this tab did and never replaces other tabs' projects.
function withActiveProject(freshStore, activeId) {
  return { ...freshStore, activeId: activeId && freshStore.projects[activeId] ? activeId : null };
}

// Chapter notes are keyed by the full title line, so regenerating titles used
// to orphan every note. Match by exact line first, then by chapter number.
function reconcileChapterNotes(oldNotes, lines, matchByNumber = true) {
  const byNumber = {};
  Object.entries(oldNotes || {}).forEach(([line, note]) => {
    const m = line.match(/^(\d+)\.\s/);
    if (matchByNumber && m && note && !(m[1] in byNumber)) byNumber[m[1]] = note;
  });
  const notes = {};
  lines.forEach((line) => {
    const m = line.match(/^(\d+)\.\s/);
    notes[line] = (oldNotes && oldNotes[line]) || (m && byNumber[m[1]]) || "";
  });
  return notes;
}

function deleteFromProjectStore(store, id) {
  const projects = { ...store.projects };
  delete projects[id];
  return { ...store, activeId: store.activeId === id ? null : store.activeId, projects };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    analyzeConcept,
    buildBlueprint,
    encodeShareState,
    decodeShareState,
    prepareShare,
    SHARE_FIELD_MAX,
    emptyProjectStore,
    parseProjectStore,
    listProjects,
    saveToProjectStore,
    deleteFromProjectStore,
    withActiveProject,
    normalizeProjectMemory,
    reconcileChapterNotes,
    FREE_PROJECT_LIMIT,
    buildWorld,
    makeChapterTitles,
    normalizeBookType,
    naturalizeSignals,
    rewriteText,
    hashSeed,
    GENRES,
    BOOK_TYPES,
    TONES,
    DEPTH_LEVELS
  };
}

/* ================================================================== */
/* Browser layer                                                       */
/* ================================================================== */

if (typeof document !== "undefined") {
  const elements = {
    projectName: document.getElementById("projectName"),
    bookIdea: document.getElementById("bookIdea"),
    genre: document.getElementById("genre"),
    bookType: document.getElementById("bookType"),
    targetReader: document.getElementById("targetReader"),
    tone: document.getElementById("tone"),
    depthLevel: document.getElementById("depthLevel"),
    positioning: document.getElementById("positioning"),
    length: document.getElementById("length"),
    generateBtn: document.getElementById("generateBtn"),
    saveProjectBtn: document.getElementById("saveProjectBtn"),
    loadProjectBtn: document.getElementById("loadProjectBtn"),
    clearProjectBtn: document.getElementById("clearProjectBtn"),
    activeProjectLabel: document.getElementById("activeProjectLabel"),
    projectsDialog: document.getElementById("projectsDialog"),
    projectsDialogClose: document.getElementById("projectsDialogClose"),
    projectsList: document.getElementById("projectsList"),
    projectsLimitNote: document.getElementById("projectsLimitNote"),
    copyAllBtn: document.getElementById("copyAllBtn"),
    exportMdBtn: document.getElementById("exportMdBtn"),
    exportTxtBtn: document.getElementById("exportTxtBtn"),
    regenerateChapterTitlesBtn: document.getElementById("regenerateChapterTitlesBtn"),
    shareLinkBtn: document.getElementById("shareLinkBtn"),
    shareCardBtn: document.getElementById("shareCardBtn"),
    exportPdfBtn: document.getElementById("exportPdfBtn"),
    planSignup: document.getElementById("planSignup"),
    footerSignup: document.getElementById("footerSignup"),
    remixBanner: document.getElementById("remixBanner"),
    remixBannerName: document.getElementById("remixBannerName"),
    remixBtn: document.getElementById("remixBtn"),
    remixFreshBtn: document.getElementById("remixFreshBtn"),
    remixDismissBtn: document.getElementById("remixDismissBtn"),
    outputContainer: document.getElementById("outputContainer"),
    qualityPanel: document.getElementById("qualityPanel"),
    conceptPanel: document.getElementById("conceptPanel"),
    projectMemoryPanel: document.getElementById("projectMemoryPanel"),
    memoryProgress: document.getElementById("memoryProgress"),
    memoryFavoriteTitles: document.getElementById("memoryFavoriteTitles"),
    memoryExportHistory: document.getElementById("memoryExportHistory"),
    chapterNotesContainer: document.getElementById("chapterNotesContainer"),
    outputModuleTemplate: document.getElementById("outputModuleTemplate")
  };

  let blueprint = [];
  let lastInput = null;
  let lastConcept = null;
  let lastScore = null;
  let variationNonce = 0;
  // Set by the remix banner so the visitor's next generate is attributed to
  // the shared link that brought them here (the viral conversion).
  let pendingGenerateSource = null;
  let projectMemory = emptyProjectMemory();
  // Fingerprint of the workspace as last saved/opened/cleared, to detect edits.
  let cleanFingerprint = "";

  /*
   * Analytics: categories only. Never send the idea, project name, or any
   * other text the user typed. window.va is the Vercel Web Analytics queue
   * defined in index.html; without it this is a no-op.
   */
  function track(name, data) {
    try {
      if (typeof window.va === "function") window.va("event", { name, data });
    } catch (err) {
      /* analytics must never break the app */
    }
  }

  /* --- Toast notifications (non-blocking replacement for alert) --- */
  let toastContainer = null;
  function toast(message, kind = "info") {
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.className = "toast-container";
      document.body.appendChild(toastContainer);
    }
    const el = document.createElement("div");
    el.className = `toast toast-${kind}`;
    el.textContent = message;
    toastContainer.appendChild(el);
    requestAnimationFrame(() => el.classList.add("toast-show"));
    setTimeout(() => {
      el.classList.remove("toast-show");
      setTimeout(() => el.remove(), 250);
    }, 2600);
  }

  function populateSelect(selectEl, options) {
    options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      selectEl.appendChild(option);
    });
  }

  function collectInput() {
    return {
      projectName: sanitize(elements.projectName.value) || "Untitled Project",
      bookIdea: sanitize(elements.bookIdea.value),
      genre: elements.genre.value,
      bookType: elements.bookType.value,
      targetReader: sanitize(elements.targetReader.value) || "A clearly defined niche reader",
      tone: elements.tone.value,
      depthLevel: elements.depthLevel.value,
      positioning: sanitize(elements.positioning.value) || "A unique angle with practical value",
      length: Number(elements.length.value) || 60000
    };
  }

  function renderQuality(report) {
    if (!report) {
      elements.qualityPanel.textContent = "";
      return;
    }
    const lines = [
      `Blueprint Intelligence Score: ${report.score}/10`,
      "Strong:",
      ...(report.strengths.length ? report.strengths.map((item) => `- ${item}`) : ["- Core structure is present."]),
      "Needs work:",
      ...report.suggestions.map((item) => `- ${item}`)
    ];
    elements.qualityPanel.textContent = lines.join("\n");
  }

  function renderConcept(concept) {
    if (!concept) {
      elements.conceptPanel.textContent = "";
      return;
    }
    const lines = [
      "Detected elements:",
      ...(concept.detectedElements.length
        ? concept.detectedElements.map((item) => `- ${item}`)
        : ["- No strong pattern detected. Add concrete nouns and stakes for richer output."]),
      `Protagonist: ${concept.protagonistHint}`,
      `Goal: ${concept.goalHint}`,
      `Stakes: ${concept.stakesHint}`
    ];
    elements.conceptPanel.textContent = lines.join("\n");
  }

  function regenerateSection(moduleTitle) {
    if (!lastInput) return null;
    const fresh = buildBlueprint(lastInput).modules;
    return fresh.find((mod) => mod.title === moduleTitle) || null;
  }

  function renderBlueprint(modules) {
    elements.outputContainer.innerHTML = "";
    modules.forEach((mod, idx) => {
      const fragment = elements.outputModuleTemplate.content.cloneNode(true);
      const titleEl = fragment.querySelector(".module-title");
      const bodyEl = fragment.querySelector(".module-body");
      const copyBtn = fragment.querySelector(".copy-section");
      const regenBtn = fragment.querySelector(".regenerate-section");
      const rewriteBtns = fragment.querySelectorAll(".rewrite-section");
      const mobileRefineMode = fragment.querySelector(".mobile-refine-mode");
      const applyMobileRefineBtn = fragment.querySelector(".apply-mobile-refine");

      titleEl.textContent = mod.title;
      bodyEl.textContent = mod.body;

      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(`${mod.title}\n\n${mod.body}`);
          copyBtn.textContent = "Copied";
          setTimeout(() => { copyBtn.textContent = "Copy"; }, 1000);
        } catch (err) {
          toast("Copy failed. Your browser blocked clipboard access.", "error");
        }
      });

      regenBtn.addEventListener("click", () => {
        const refreshed = regenerateSection(mod.title);
        if (!refreshed) return;
        blueprint[idx] = refreshed;
        renderBlueprint(blueprint);
      });

      rewriteBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          blueprint[idx].body = rewriteText(blueprint[idx].body, btn.dataset.mode, lastConcept);
          renderBlueprint(blueprint);
        });
      });

      if (applyMobileRefineBtn && mobileRefineMode) {
        applyMobileRefineBtn.addEventListener("click", () => {
          blueprint[idx].body = rewriteText(blueprint[idx].body, mobileRefineMode.value, lastConcept);
          renderBlueprint(blueprint);
        });
      }

      elements.outputContainer.appendChild(fragment);
    });
  }

  function blueprintToMarkdown(modules, input) {
    const sections = modules.map((mod) => `## ${mod.title}\n\n${mod.body}`).join("\n\n");
    return `# ${input.projectName}\n\n${sections}\n`;
  }

  function blueprintToText(modules, input) {
    const sections = modules
      .map((mod) => `${mod.title}\n${"=".repeat(mod.title.length)}\n${mod.body}`)
      .join("\n\n");
    return `${input.projectName}\n${"#".repeat(input.projectName.length)}\n\n${sections}\n`;
  }

  function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function slugifyProjectName(name) {
    const cleaned = (name || "book-project")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return cleaned || "book-project";
  }

  function formatExportTimestamp(date = new Date()) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-` +
      `${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
  }

  function makeExportFilename(input, extension) {
    return `${slugifyProjectName(input.projectName)}-${formatExportTimestamp()}.${extension}`;
  }

  function detectChapterModule(modules) {
    return modules.find((mod) => /chapter outline|chapter-by-chapter learning path|memory map/i.test(mod.title));
  }

  function extractChapterTitleLines(text) {
    return text.split("\n").filter((line) => /^\d+\.\s+/.test(line));
  }

  function regenerateChapterTitlesOnly() {
    if (!blueprint.length || !lastInput || !lastConcept) {
      toast("Generate a blueprint first.", "error");
      return;
    }
    const engineType = normalizeBookType(lastInput.bookType);
    const chapterModuleIndex = blueprint.findIndex((mod) =>
      /chapter outline|chapter-by-chapter learning path|memory map/i.test(mod.title));
    if (chapterModuleIndex === -1) {
      toast("No chapter module found to regenerate.", "error");
      return;
    }

    variationNonce += 1;
    const module = blueprint[chapterModuleIndex];
    const lines = module.body.split("\n");
    const chapterNumbers = lines
      .filter((line) => /^\d+\.\s+/.test(line))
      .map((line) => Number(line.match(/^(\d+)\./)[1]));
    const count = chapterNumbers.length;
    const seed = hashSeed(`${lastInput.projectName}|${lastInput.bookIdea}`);
    const freshTitles = makeChapterTitles(lastConcept.world, engineType, count, seed, variationNonce);

    let cursor = 0;
    const updatedLines = lines.map((line) => {
      const match = line.match(/^(\d+)\.\s+/);
      if (!match) return line;
      const newTitle = freshTitles[cursor] || `Chapter ${match[1]}`;
      cursor += 1;
      return `${match[1]}. ${newTitle}`;
    });

    blueprint[chapterModuleIndex] = { ...module, body: updatedLines.join("\n") };
    updateProjectMemoryAfterGeneration(true);
    renderProjectMemory();
    renderBlueprint(blueprint);
    toast("Chapter titles regenerated.", "success");
  }

  function renderProjectMemory() {
    if (!elements.projectMemoryPanel) return;
    elements.memoryProgress.textContent =
      `Draft progress: ${projectMemory.draftProgress}% | Favorite titles: ${projectMemory.favoriteTitles.length} | Exports: ${projectMemory.exportHistory.length}`;

    elements.memoryFavoriteTitles.innerHTML = "";
    (projectMemory.favoriteTitles.length ? projectMemory.favoriteTitles : ["No title favorites yet."]).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      elements.memoryFavoriteTitles.appendChild(li);
    });

    elements.memoryExportHistory.innerHTML = "";
    (projectMemory.exportHistory.length ? projectMemory.exportHistory.slice(0, 8) : ["No exports yet."]).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      elements.memoryExportHistory.appendChild(li);
    });

    elements.chapterNotesContainer.innerHTML = "";
    const chapterEntries = Object.entries(projectMemory.chapterNotes).slice(0, 14);
    if (!chapterEntries.length) {
      const empty = document.createElement("p");
      empty.className = "memory-progress";
      empty.textContent = "No chapter notes yet. Generate a blueprint to start annotating chapters.";
      elements.chapterNotesContainer.appendChild(empty);
      return;
    }

    chapterEntries.forEach(([label, note]) => {
      const wrapper = document.createElement("div");
      wrapper.className = "chapter-note-item";
      const title = document.createElement("div");
      title.className = "chapter-note-label";
      title.textContent = label;
      const noteInput = document.createElement("textarea");
      noteInput.className = "chapter-note-input";
      noteInput.value = note;
      noteInput.placeholder = "Add chapter-specific writing notes...";
      noteInput.addEventListener("input", () => {
        projectMemory.chapterNotes[label] = noteInput.value;
      });
      wrapper.appendChild(title);
      wrapper.appendChild(noteInput);
      elements.chapterNotesContainer.appendChild(wrapper);
    });
  }

  function applyInputState(state) {
    elements.projectName.value = state.projectName || "";
    elements.bookIdea.value = state.bookIdea || "";
    elements.genre.value = state.genre || GENRES[0];
    elements.bookType.value = state.bookType || BOOK_TYPES[0];
    elements.targetReader.value = state.targetReader || "";
    elements.tone.value = state.tone || TONES[0];
    elements.depthLevel.value = state.depthLevel || "Professional Blueprint";
    elements.positioning.value = state.positioning || "";
    elements.length.value = state.length || 60000;
  }

  /* --- Saved projects (localStorage, several per browser) --- */

  let projectStore = emptyProjectStore();

  function readStoredProjects() {
    let raw = null;
    let legacy = null;
    try {
      raw = localStorage.getItem(PROJECTS_KEY);
      legacy = localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      /* storage blocked: work in memory only */
    }
    return { raw, legacy, store: parseProjectStore(raw, legacy, Date.now()) };
  }

  // Other tabs may have saved since this tab last read. Re-read before every
  // write so we never overwrite their projects with our stale copy.
  function freshProjectStore() {
    let stored;
    try {
      stored = readStoredProjects();
    } catch (err) {
      return projectStore;
    }
    if (!stored.raw && !stored.legacy) return projectStore;
    return withActiveProject(stored.store, projectStore.activeId);
  }

  function readProjectStore() {
    const { raw, legacy, store } = readStoredProjects();
    projectStore = store;
    // Persist a migrated legacy draft so it isn't re-imported later.
    if (!raw && legacy && Object.keys(projectStore.projects).length) writeProjectStore();
  }

  function writeProjectStore() {
    try {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projectStore));
      return true;
    } catch (err) {
      toast("Could not save: local storage is full or blocked.", "error");
      return false;
    }
  }

  function setActiveProject(id) {
    projectStore = withActiveProject({ ...freshProjectStore(), activeId: id }, id);
    writeProjectStore();
    renderActiveProject();
  }

  function renderActiveProject() {
    const label = elements.activeProjectLabel;
    if (!label) return;
    const active = projectStore.activeId && projectStore.projects[projectStore.activeId];
    label.textContent = "";
    if (!active) {
      label.textContent = "Unsaved project";
      return;
    }
    const name = document.createElement("strong");
    name.textContent = active.name;
    label.append("Editing ", name, ` · saved ${formatSavedAt(active.updatedAt)}`);
  }

  function formatSavedAt(timestamp) {
    const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.round(seconds / 60)} min ago`;
    return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  const clone = (value) => (value === undefined ? value : JSON.parse(JSON.stringify(value)));

  // `input` is what produced the saved blueprint; `draft` is the form as the
  // user left it, which may have been edited since.
  function currentProjectState() {
    const draft = collectInput();
    return clone({
      input: blueprint.length && lastInput ? lastInput : draft,
      draft,
      blueprint,
      concept: lastConcept,
      quality: lastScore,
      projectMemory
    });
  }

  function workspaceFingerprint() {
    return JSON.stringify([collectInput(), blueprint, projectMemory]);
  }

  function markClean() {
    cleanFingerprint = workspaceFingerprint();
  }

  function isDirty() {
    return workspaceFingerprint() !== cleanFingerprint;
  }

  function confirmDiscard(action) {
    return !isDirty() || confirm(`You have unsaved changes. ${action} and discard them?`);
  }

  function saveProject() {
    projectStore = freshProjectStore();
    const result = saveToProjectStore(projectStore, currentProjectState(), {
      now: Date.now(),
      salt: Math.random().toString(36).slice(2)
    });
    if (result.status === "limit") {
      track("Project", { action: "limit" });
      toast(`The free plan keeps ${FREE_PROJECT_LIMIT} projects. Open one to overwrite it, or delete one.`, "error");
      openProjectsDialog();
      return;
    }
    const previous = projectStore;
    projectStore = result.store;
    if (!writeProjectStore()) {
      projectStore = previous;
      return;
    }
    markClean();
    track("Project", { action: result.status === "created" ? "save_new" : "save" });
    renderActiveProject();
    toast(result.status === "created" ? "Saved as a new project." : "Project saved.", "success");
  }

  function applyProjectState(saved) {
    const state = clone(saved);
    applyInputState(state.draft && typeof state.draft === "object" ? state.draft : state.input);
    blueprint = Array.isArray(state.blueprint) ? state.blueprint : [];
    lastInput = blueprint.length ? state.input : null;
    lastConcept = state.concept || null;
    lastScore = state.quality || null;
    projectMemory = normalizeProjectMemory(state.projectMemory);
    renderConcept(lastConcept);
    renderQuality(lastScore);
    renderProjectMemory();
    elements.outputContainer.innerHTML = "";
    if (blueprint.length) renderBlueprint(blueprint);
    markClean();
  }

  function openProject(id) {
    const project = projectStore.projects[id];
    if (!project || !confirmDiscard(`Open "${project.name}"`)) return;
    applyProjectState(project.state);
    hideRemixBanner();
    if (blueprint.length) showPlanSignup(normalizeBookType(project.state.input.bookType));
    setActiveProject(id);
    track("Project", { action: "open" });
    closeProjectsDialog();
    toast(`Opened "${project.name}".`, "success");
  }

  function deleteProject(id) {
    const project = projectStore.projects[id];
    if (!project || !confirm(`Delete "${project.name}"? This can't be undone.`)) return;
    projectStore = deleteFromProjectStore(freshProjectStore(), id);
    writeProjectStore();
    track("Project", { action: "delete" });
    renderActiveProject();
    renderProjectsList();
    toast("Project deleted.", "info");
  }

  function renderProjectsList() {
    const list = elements.projectsList;
    list.innerHTML = "";
    const projects = listProjects(projectStore);
    if (!projects.length) {
      const empty = document.createElement("li");
      empty.className = "projects-empty";
      empty.textContent = "No saved projects yet. Generate a blueprint and press Save.";
      list.appendChild(empty);
    }
    projects.forEach((project) => {
      const row = document.createElement("li");
      row.className = `project-row${project.id === projectStore.activeId ? " is-active" : ""}`;
      const info = document.createElement("div");
      info.className = "project-info";
      const name = document.createElement("p");
      name.className = "project-name";
      name.textContent = project.name;
      const meta = document.createElement("p");
      meta.className = "project-meta";
      const parts = [project.bookType, project.hasBlueprint ? "blueprint" : "no blueprint yet", `saved ${formatSavedAt(project.updatedAt)}`];
      if (project.id === projectStore.activeId) parts.unshift("open now");
      meta.textContent = parts.filter(Boolean).join(" · ");
      info.append(name, meta);

      const actions = document.createElement("div");
      actions.className = "project-actions";
      const open = document.createElement("button");
      open.type = "button";
      open.className = "btn btn-secondary btn-small";
      open.textContent = "Open";
      open.setAttribute("aria-label", `Open ${project.name}`);
      open.addEventListener("click", () => openProject(project.id));
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "btn btn-ghost btn-small";
      remove.textContent = "Delete";
      remove.setAttribute("aria-label", `Delete ${project.name}`);
      remove.addEventListener("click", () => deleteProject(project.id));
      actions.append(open, remove);
      row.append(info, actions);
      list.appendChild(row);
    });

    const note = elements.projectsLimitNote;
    note.textContent = `${projects.length} of ${FREE_PROJECT_LIMIT} projects on the free plan. `;
    const link = document.createElement("a");
    link.href = "#pricing";
    link.textContent = "Pro (coming soon) keeps unlimited projects.";
    link.addEventListener("click", closeProjectsDialog);
    note.appendChild(link);
  }

  function openProjectsDialog() {
    renderProjectsList();
    const dialog = elements.projectsDialog;
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  function closeProjectsDialog() {
    const dialog = elements.projectsDialog;
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
  }

  // Clears the workspace for a fresh idea. Saved projects are untouched.
  function newProject() {
    if (!confirmDiscard("Start a new project")) return;
    [elements.projectName, elements.bookIdea, elements.targetReader, elements.positioning].forEach((el) => {
      el.value = "";
    });
    elements.length.value = 60000;
    elements.genre.value = GENRES[0];
    elements.bookType.value = BOOK_TYPES[0];
    elements.tone.value = TONES[0];
    elements.depthLevel.value = "Professional Blueprint";
    elements.outputContainer.innerHTML = "";
    elements.conceptPanel.textContent = "";
    elements.qualityPanel.textContent = "";
    blueprint = [];
    lastInput = null;
    lastConcept = null;
    lastScore = null;
    projectMemory = emptyProjectMemory();
    hideRemixBanner();
    if (elements.planSignup) elements.planSignup.hidden = true;
    renderProjectMemory();
    setActiveProject(null);
    markClean();
    elements.bookIdea.focus();
    toast("New project started. Your saved projects are still in My Projects.", "info");
  }

  function copyFullBlueprint() {
    if (!blueprint.length) {
      toast("Generate a blueprint first.", "error");
      return;
    }
    navigator.clipboard.writeText(blueprintToMarkdown(blueprint, collectInput()))
      .then(() => {
        track("Export", { format: "copy" });
        toast("Full blueprint copied to clipboard.", "success");
      })
      .catch(() => toast("Copy failed. Your browser blocked clipboard access.", "error"));
  }

  // Only a title-only refresh keeps notes by chapter number; a full re-generation
  // may tell a different story, so notes stay only on identical titles.
  function updateProjectMemoryAfterGeneration(titlesOnly = false) {
    const chapterModule = detectChapterModule(blueprint);
    if (chapterModule) {
      const lines = extractChapterTitleLines(chapterModule.body).slice(0, 20);
      projectMemory.chapterNotes = reconcileChapterNotes(projectMemory.chapterNotes, lines, titlesOnly);
    }
    projectMemory.draftProgress = Math.min(100, Math.round((blueprint.length / 20) * 100));
  }

  function recordExport(format, filename) {
    projectMemory.exportHistory.unshift(`${formatExportTimestamp()} | ${format} | ${filename}`);
    projectMemory.exportHistory = projectMemory.exportHistory.slice(0, 20);
  }

  function handleGenerate(source = "manual") {
    const input = collectInput();
    if (!input.bookIdea) {
      toast("Please enter your core book idea first.", "error");
      elements.bookIdea.focus();
      return;
    }
    const result = buildBlueprint(input);
    blueprint = result.modules;
    lastInput = input;
    lastConcept = result.concept;
    lastScore = result.quality;
    projectMemory.favoriteTitles = uniqueList(
      projectMemory.favoriteTitles.concat(result.titleIdeas.slice(0, 3))
    ).slice(0, 15);

    updateProjectMemoryAfterGeneration();
    renderConcept(lastConcept);
    renderQuality(lastScore);
    renderProjectMemory();
    renderBlueprint(blueprint);
    toast("Blueprint generated.", "success");
    showPlanSignup(result.engineType);
    track("Blueprint Generated", {
      source,
      engine: result.engineType,
      genre: input.genre,
      depth: input.depthLevel
    });
  }


  /* --- Sharing: links, social card, PDF --- */

  const SHARE_HASH_PREFIX = "#b=";

  // Returns null (after telling the user why) when the link can't carry the input.
  function makeShareUrl(input) {
    const prepared = prepareShare(input);
    if (!prepared.ok) {
      toast(prepared.reason, "error");
      return null;
    }
    return `${location.origin}${location.pathname}${SHARE_HASH_PREFIX}${prepared.encoded}`;
  }

  // Links carry only the inputs, so edits made after generating (refined
  // sections, regenerated chapter titles) are not part of what a recipient sees.
  function hasEditsBeyondInputs() {
    try {
      return JSON.stringify(buildBlueprint(lastInput).modules) !== JSON.stringify(blueprint);
    } catch (err) {
      return false;
    }
  }

  async function shareBlueprintLink() {
    if (!blueprint.length || !lastInput) {
      toast("Generate a blueprint first.", "error");
      return;
    }
    const url = makeShareUrl(lastInput);
    if (!url) return;
    const edited = hasEditsBeyondInputs();
    const title = `${lastInput.projectName} | BookForge Pro`;
    if (navigator.share && matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title, text: "I just forged my book's blueprint:", url });
        track("Share Link", { method: "native" });
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      track("Share Link", { method: "clipboard" });
      toast(
        edited
          ? "Link copied. It rebuilds the blueprint from your inputs; your section refinements and chapter title changes are not included."
          : "Link copied. Anyone who opens it gets the same blueprint.",
        edited ? "info" : "success"
      );
    } catch (err) {
      window.prompt("Copy your share link:", url);
      track("Share Link", { method: "prompt" });
    }
  }

  function headlineModule(modules) {
    return modules.find((mod) => /^(logline|reader promise|life question)$/i.test(mod.title)) ||
      modules.find((mod) => !/title ideas|concept analyzer/i.test(mod.title));
  }

  function wrapLines(ctx, text, maxWidth, maxLines) {
    const words = text.split(/\s+/);
    const lines = [];
    let line = "";
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > maxWidth && line) {
        lines.push(line);
        line = word;
        if (lines.length === maxLines) break;
      } else {
        line = next;
      }
    }
    if (lines.length < maxLines && line) lines.push(line);
    if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
      lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[\s,.;:]+\S*$/, "")}…`;
    }
    return lines;
  }

  function drawShareCard() {
    const W = 1200;
    const H = 630;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#081a1f");
    bg.addColorStop(1, "#14454a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(W * 0.85, H * 0.1, 10, W * 0.85, H * 0.1, 520);
    glow.addColorStop(0, "rgba(25, 183, 166, 0.45)");
    glow.addColorStop(1, "rgba(25, 183, 166, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    const pad = 72;
    ctx.textBaseline = "top";
    ctx.fillStyle = "#19b7a6";
    ctx.font = "600 26px 'Space Grotesk', system-ui, sans-serif";
    ctx.fillText("◆ BookForge Pro", pad, pad);

    const meta = `${lastInput.genre} · ${lastInput.bookType} · ${blueprint.length} modules`;
    ctx.fillStyle = "#a9c6c2";
    ctx.font = "500 24px 'Space Grotesk', system-ui, sans-serif";
    ctx.fillText(meta.toUpperCase(), pad, pad + 70);

    ctx.fillStyle = "#eaf4f1";
    ctx.font = "600 64px 'IBM Plex Serif', Georgia, serif";
    const titleLines = wrapLines(ctx, lastInput.projectName, W - pad * 2 - 180, 2);
    titleLines.forEach((line, idx) => ctx.fillText(line, pad, pad + 112 + idx * 76));

    const headline = headlineModule(blueprint);
    if (headline) {
      const text = headline.body.split("\n").find((l) => l.trim().length > 20) || headline.body;
      ctx.fillStyle = "#d4e6e2";
      ctx.font = "italic 30px 'IBM Plex Serif', Georgia, serif";
      const top = pad + 128 + titleLines.length * 76;
      wrapLines(ctx, text, W - pad * 2 - (lastScore ? 190 : 0), 5).forEach((line, idx) => ctx.fillText(line, pad, top + idx * 42));
    }

    if (lastScore) {
      const cx = W - pad - 70;
      const cy = pad + 150;
      ctx.beginPath();
      ctx.arc(cx, cy, 70, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(240, 180, 41, 0.14)";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#f0b429";
      ctx.stroke();
      ctx.textAlign = "center";
      ctx.fillStyle = "#eaf4f1";
      ctx.font = "700 48px 'Space Grotesk', system-ui, sans-serif";
      ctx.fillText(`${lastScore.score}`, cx, cy - 34);
      ctx.fillStyle = "#a9c6c2";
      ctx.font = "500 18px 'Space Grotesk', system-ui, sans-serif";
      ctx.fillText("/10 SCORE", cx, cy + 20);
      ctx.textAlign = "left";
    }

    ctx.fillStyle = "#f0b429";
    ctx.fillRect(pad, H - pad - 4, 64, 4);
    ctx.fillStyle = "#a9c6c2";
    ctx.font = "500 24px 'Space Grotesk', system-ui, sans-serif";
    ctx.fillText(`Forge your book's blueprint free · ${location.host || "bookforge"}`, pad + 84, H - pad - 16);
    return canvas;
  }

  function downloadShareCard() {
    if (!blueprint.length || !lastInput) {
      toast("Generate a blueprint first.", "error");
      return;
    }
    const canvas = drawShareCard();
    canvas.toBlob(async (blob) => {
      if (!blob) {
        toast("Could not render the share card.", "error");
        return;
      }
      const filename = `${slugifyProjectName(lastInput.projectName)}-card.png`;
      const file = typeof File === "function" ? new File([blob], filename, { type: "image/png" }) : null;
      if (file && navigator.canShare && navigator.canShare({ files: [file] }) && matchMedia("(pointer: coarse)").matches) {
        try {
          const cardUrl = makeShareUrl(lastInput);
          await navigator.share({ files: [file], title: lastInput.projectName, ...(cardUrl ? { url: cardUrl } : {}) });
          track("Share Card", { method: "native" });
          return;
        } catch (err) {
          if (err && err.name === "AbortError") return;
        }
      }
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      recordExport("Share card", filename);
      track("Share Card", { method: "download" });
      renderProjectMemory();
      toast("Share card saved. Post it with your share link.", "success");
    }, "image/png");
  }

  function exportPdf() {
    if (!blueprint.length) {
      toast("Generate a blueprint first.", "error");
      return;
    }
    recordExport("PDF", `${slugifyProjectName(collectInput().projectName)}.pdf`);
    track("Export", { format: "pdf" });
    renderProjectMemory();
    const heading = document.getElementById("outputs-title");
    const previous = { title: document.title, heading: heading ? heading.textContent : "" };
    document.title = collectInput().projectName;
    if (heading) heading.textContent = `${collectInput().projectName}: Book Blueprint`;
    window.addEventListener("afterprint", () => {
      document.title = previous.title;
      if (heading) heading.textContent = previous.heading;
    }, { once: true });
    window.print();
  }

  function loadFromShareHash() {
    if (!location.hash.startsWith(SHARE_HASH_PREFIX)) return false;
    const input = decodeShareState(location.hash.slice(SHARE_HASH_PREFIX.length));
    track("Shared Link Opened", { valid: !!input });
    if (!input) {
      toast("That share link is incomplete or damaged.", "error");
      return false;
    }
    if (!confirmDiscard("Open this shared blueprint")) {
      history.replaceState(null, "", `${location.pathname}${location.search}#studio`);
      return false;
    }
    applyInputState(input);
    if (projectStore.activeId) setActiveProject(null);
    projectMemory = emptyProjectMemory();
    handleGenerate("shared_link");
    showRemixBanner(input.projectName);
    // Drop the fragment so a refresh after edits doesn't revert to the link.
    history.replaceState(null, "", `${location.pathname}${location.search}#studio`);
    const studio = document.getElementById("studio");
    if (studio) studio.scrollIntoView();
    return true;
  }

  /* --- Email signup (Buttondown) --- */

  // Buttondown requires a plain form POST (no fetch) because subscribers may
  // need to finish a CAPTCHA on its page; the form opens it in a new tab.
  // Only the email and category tags are sent, never blueprint text.
  const BUTTONDOWN_USERNAME = (document.querySelector('meta[name="buttondown-username"]') || {}).content || "";
  const signupEnabled = /^[A-Za-z0-9_-]+$/.test(BUTTONDOWN_USERNAME);

  function initSignup() {
    if (!signupEnabled) return;
    const action = `https://buttondown.com/api/emails/embed-subscribe/${BUTTONDOWN_USERNAME}`;
    document.querySelectorAll(".signup-form").forEach((form) => {
      form.action = action;
      form.addEventListener("submit", () => {
        const engineTag = form.querySelector(".signup-engine-tag");
        const planTag = form.querySelector(".waitlist-plan-tag");
        track("Email Signup", {
          placement: form.dataset.placement,
          engine: engineTag && !engineTag.disabled ? engineTag.value : "none",
          plan: planTag ? planTag.value : "none"
        });
      });
    });
    if (elements.footerSignup) elements.footerSignup.hidden = false;
  }

  function showPlanSignup(engineType) {
    if (!signupEnabled || !elements.planSignup) return;
    const engineTag = elements.planSignup.querySelector(".signup-engine-tag");
    if (engineTag) {
      engineTag.value = engineType;
      engineTag.disabled = false;
    }
    elements.planSignup.hidden = false;
  }

  /* --- Pricing --- */

  // Checkout links come from <meta name="checkout-*"> tags. Until one is set,
  // that plan shows "Coming soon" and its button joins the waitlist (or is
  // disabled when Buttondown isn't configured either).
  function readCheckoutUrl(name) {
    const content = (document.querySelector(`meta[name="${name}"]`) || {}).content || "";
    return /^https:\/\/\S+$/.test(content) ? content : "";
  }

  const CHECKOUT = {
    pro: { monthly: readCheckoutUrl("checkout-pro-monthly"), yearly: readCheckoutUrl("checkout-pro-yearly") },
    lifetime: { monthly: readCheckoutUrl("checkout-lifetime"), yearly: readCheckoutUrl("checkout-lifetime") }
  };
  const PLAN_LABELS = { pro: "Pro", lifetime: "Lifetime" };
  let billing = "yearly";

  function checkoutUrl(plan) {
    return (CHECKOUT[plan] && CHECKOUT[plan][billing]) || "";
  }

  function renderPricing() {
    document.querySelectorAll(".billing-option").forEach((option) => {
      option.setAttribute("aria-checked", String(option.dataset.billing === billing));
    });
    document.querySelectorAll("#pricing [data-monthly]").forEach((el) => {
      el.textContent = el.dataset[billing];
    });
    document.querySelectorAll(".price-cta").forEach((cta) => {
      const plan = cta.dataset.plan;
      const label = PLAN_LABELS[plan];
      const card = cta.closest(".price-card");
      const badge = card && card.querySelector(".price-badge");
      const live = !!checkoutUrl(plan);
      if (badge) badge.hidden = live;
      cta.disabled = !live && !signupEnabled;
      if (live) cta.textContent = plan === "lifetime" ? "Get Lifetime" : `Get Pro ${billing}`;
      else if (signupEnabled) cta.textContent = `Join the ${label} waitlist`;
      else cta.textContent = "Coming soon";
    });
  }

  function openWaitlist(plan) {
    const form = document.getElementById("waitlistForm");
    if (!form) return;
    form.querySelector(".waitlist-plan-tag").value = plan;
    document.getElementById("waitlistTitle").textContent = `Join the ${PLAN_LABELS[plan]} waitlist.`;
    form.hidden = false;
    const email = form.querySelector('input[type="email"]');
    email.scrollIntoView({ block: "center", behavior: "smooth" });
    email.focus({ preventScroll: true });
  }

  function initPricing() {
    if (!document.getElementById("pricing")) return;
    document.querySelectorAll(".billing-option").forEach((option) => {
      option.addEventListener("click", () => {
        billing = option.dataset.billing;
        renderPricing();
      });
    });
    document.querySelectorAll(".price-cta").forEach((cta) => {
      cta.addEventListener("click", () => {
        const plan = cta.dataset.plan;
        const url = checkoutUrl(plan);
        if (url) {
          track("Pricing CTA", { plan, billing, action: "checkout" });
          window.open(url, "_blank", "noopener");
        } else if (signupEnabled) {
          track("Pricing CTA", { plan, billing, action: "waitlist" });
          openWaitlist(plan);
        }
      });
    });
    renderPricing();
  }

  /* --- Remix banner: turn every shared-link viewer into a creator --- */

  function showRemixBanner(projectName) {
    // Untrusted (from the link): textContent only, never innerHTML.
    elements.remixBannerName.textContent = projectName;
    elements.remixBanner.hidden = false;
  }

  function hideRemixBanner() {
    elements.remixBanner.hidden = true;
  }

  function focusIdea() {
    const idea = elements.bookIdea;
    idea.scrollIntoView({ block: "center", behavior: "smooth" });
    idea.focus({ preventScroll: true });
    idea.setSelectionRange(idea.value.length, idea.value.length);
  }

  function startRemix() {
    const name = sanitize(elements.projectName.value) || "Untitled Project";
    if (!/\(remix\)$/.test(name)) elements.projectName.value = `${name} (remix)`;
    pendingGenerateSource = "remix";
    track("Remix Banner", { action: "remix" });
    hideRemixBanner();
    focusIdea();
    toast("Change the idea, genre, or tone, then hit Generate.", "info");
  }

  function startFresh() {
    // Clear the shared text fields only; the visitor's own saved draft and
    // the select choices stay as they are.
    [elements.projectName, elements.bookIdea, elements.targetReader, elements.positioning].forEach((el) => {
      el.value = "";
    });
    pendingGenerateSource = "share_fresh";
    track("Remix Banner", { action: "fresh" });
    hideRemixBanner();
    focusIdea();
    toast("Describe your book in a sentence or two, then hit Generate.", "info");
  }

  function init() {
    populateSelect(elements.genre, GENRES);
    populateSelect(elements.bookType, BOOK_TYPES);
    populateSelect(elements.tone, TONES);

    elements.generateBtn.addEventListener("click", () => {
      // site.js tags example runs so they aren't counted as real ideas.
      const source = elements.generateBtn.dataset.source || pendingGenerateSource || "manual";
      delete elements.generateBtn.dataset.source;
      pendingGenerateSource = null;
      if (source !== "example") hideRemixBanner();
      else if (projectStore.activeId) setActiveProject(null);
      handleGenerate(source);
    });
    elements.remixBtn.addEventListener("click", startRemix);
    elements.remixFreshBtn.addEventListener("click", startFresh);
    elements.remixDismissBtn.addEventListener("click", () => {
      track("Remix Banner", { action: "dismiss" });
      hideRemixBanner();
    });
    elements.saveProjectBtn.addEventListener("click", saveProject);
    elements.loadProjectBtn.addEventListener("click", openProjectsDialog);
    elements.clearProjectBtn.addEventListener("click", newProject);
    elements.projectsDialogClose.addEventListener("click", closeProjectsDialog);
    elements.projectsDialog.addEventListener("click", (event) => {
      if (event.target === elements.projectsDialog) closeProjectsDialog();
    });
    elements.copyAllBtn.addEventListener("click", copyFullBlueprint);
    elements.regenerateChapterTitlesBtn.addEventListener("click", regenerateChapterTitlesOnly);
    elements.shareLinkBtn.addEventListener("click", shareBlueprintLink);
    elements.shareCardBtn.addEventListener("click", downloadShareCard);
    elements.exportPdfBtn.addEventListener("click", exportPdf);

    elements.exportMdBtn.addEventListener("click", () => {
      if (!blueprint.length) { toast("Generate a blueprint first.", "error"); return; }
      const input = collectInput();
      const filename = makeExportFilename(input, "md");
      recordExport("Markdown", filename);
      renderProjectMemory();
      downloadFile(filename, blueprintToMarkdown(blueprint, input), "text/markdown");
      track("Export", { format: "md" });
      toast("Markdown exported.", "success");
    });

    elements.exportTxtBtn.addEventListener("click", () => {
      if (!blueprint.length) { toast("Generate a blueprint first.", "error"); return; }
      const input = collectInput();
      const filename = makeExportFilename(input, "txt");
      recordExport("TXT", filename);
      renderProjectMemory();
      downloadFile(filename, blueprintToText(blueprint, input), "text/plain");
      track("Export", { format: "txt" });
      toast("Text file exported.", "success");
    });

    renderProjectMemory();
    SHARE_TEXT_FIELDS.forEach((field) => { if (elements[field]) elements[field].maxLength = SHARE_FIELD_MAX; });
    initSignup();
    initPricing();
    readProjectStore();
    markClean();
    window.addEventListener("beforeunload", (event) => {
      if (isDirty()) {
        event.preventDefault();
        event.returnValue = "";
      }
    });
    // Reopen the last project unless a shared link takes priority.
    const resumeId = projectStore.activeId;
    if (!loadFromShareHash() && resumeId) {
      const project = projectStore.projects[resumeId];
      applyProjectState(project.state);
      if (blueprint.length) showPlanSignup(normalizeBookType(project.state.input.bookType));
    }
    renderActiveProject();
    window.addEventListener("hashchange", loadFromShareHash);
  }

  init();
}
