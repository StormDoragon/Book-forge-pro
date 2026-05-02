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

const STORAGE_KEY = "bookforge-pro-project-v2";

const GENRE_BANKS = {
  fantasy: {
    nouns: [
      "empire",
      "oath",
      "archive",
      "oracle",
      "tide",
      "throne",
      "map",
      "crown",
      "ruin",
      "spirit",
      "god",
      "kingdom",
      "gate"
    ],
    chapterPhrases: [
      "The Map That Should Not Exist",
      "The Archive of False Coastlines",
      "Ink Beneath the Tide",
      "The Island's First Lie",
      "The Spirit Witness",
      "The God Below the Harbor",
      "A Kingdom Built on Silence"
    ]
  },
  business: {
    chapterPhrases: [
      "The Hidden Cost of the Old System",
      "The New Operating Model",
      "Building the Repeatable Engine",
      "Removing Friction from Execution",
      "The Metrics That Actually Matter"
    ]
  },
  spiritual: {
    chapterPhrases: [
      "The Question Beneath the Noise",
      "The Discipline of Stillness",
      "The Weight of Intention",
      "The Door Within the Self"
    ]
  },
  default: {
    chapterPhrases: [
      "The Problem You Can No Longer Ignore",
      "The Hidden Pattern",
      "The Turning Point",
      "What Must Change",
      "The New Path Forward"
    ]
  }
};

const FICTION_BEATS = [
  "Opening Image",
  "Ordinary World",
  "Strange Discovery",
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

const FICTION_BEAT_LOGIC = {
  "Opening Image": {
    purpose: "Show the protagonist's normal world before the central lie cracks.",
    conflict: "A routine map correction reveals a detail that should not exist.",
    scene: "In the royal archive, the protagonist compares official maps as tidewater stains reveal a forbidden coastline.",
    hook: "The impossible coastline matches a place erased from every record."
  },
  "Ordinary World": {
    purpose: "Ground the reader in the kingdom's rules, taboos, and accepted history.",
    conflict: "Everyone treats the false geography as truth, making doubt socially dangerous.",
    scene: "At a public map ceremony, the protagonist notices elders avoiding one blank region of the sea.",
    hook: "A child names the blank region aloud and the room goes silent."
  },
  "Strange Discovery": {
    purpose: "Reveal the first undeniable proof that the official story is engineered.",
    conflict: "The protagonist finds evidence that the altered maps were changed by royal command.",
    scene: "A hidden layer appears beneath a state map in ink that only reveals itself under saltwater.",
    hook: "The hidden layer contains the protagonist's family name."
  },
  "Refusal / Pressure": {
    purpose: "Force hesitation while external pressure punishes further investigation.",
    conflict: "Advisers demand silence as rumor frames the protagonist as unstable.",
    scene: "During a council review, every correction she proposes is rejected before being read.",
    hook: "A private warning arrives: stop now or lose your commission."
  },
  "First Doorway": {
    purpose: "Commit the protagonist to irreversible risk.",
    conflict: "Crossing into restricted records turns curiosity into treason.",
    scene: "She breaks protocol and enters a sealed chart vault beneath the harbor chapel.",
    hook: "Inside the vault, one map is still wet with fresh ink."
  },
  "New World Rules": {
    purpose: "Define what is true, dangerous, and costly in the new information landscape.",
    conflict: "Every ally has divided motives and every map now behaves unpredictably.",
    scene: "She tests three trusted maps and each redraws the same island differently at night.",
    hook: "One version shows an army route no kingdom has announced."
  },
  "First Major Cost": {
    purpose: "Show visible consequences for pursuing truth.",
    conflict: "Protecting evidence costs the protagonist status and trusted support.",
    scene: "A mentor burns a key document to keep it from royal seizure.",
    hook: "The ashes expose a second hidden watermark before they fade."
  },
  "Midpoint Revelation": {
    purpose: "Deliver a truth that changes the meaning of the entire story.",
    conflict: "The buried empire was not destroyed; it was intentionally hidden and maintained.",
    scene: "A spirit witness confirms the maps were engineered to direct future war.",
    hook: "The witness names a living architect behind the deception."
  },
  "Betrayal or Collapse": {
    purpose: "Break trust and remove fallback options.",
    conflict: "A close ally trades evidence for protection.",
    scene: "At the handoff point, the protagonist finds her own notes already delivered to the regime.",
    hook: "The traitor leaves a symbol that points to someone even higher."
  },
  "Dark Night Choice": {
    purpose: "Reduce the story to a values-based choice with no safe path.",
    conflict: "Silence protects loved ones; truth endangers everyone immediately.",
    scene: "She drafts two letters, one confession and one lie, and can only send one.",
    hook: "Before she chooses, the harbor bells ring a war alarm."
  },
  "Final Confrontation": {
    purpose: "Force payment of the truth's highest cost.",
    conflict: "To expose the lie, the protagonist must destroy the institution that gave her identity.",
    scene: "She presents the living map before the court and triggers a public fracture in authority.",
    hook: "As order collapses, the hidden coastline rises above the tide in plain sight."
  },
  "New Order": {
    purpose: "Show what was rebuilt, what was lost, and who pays for the future.",
    conflict: "Truth ends one regime but opens a harder era of accountability.",
    scene: "The protagonist redraws the national atlas with contested borders and witness names.",
    hook: "The final map leaves one region deliberately blank, waiting for the next truth."
  }
};

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
  copyAllBtn: document.getElementById("copyAllBtn"),
  exportMdBtn: document.getElementById("exportMdBtn"),
  exportTxtBtn: document.getElementById("exportTxtBtn"),
  regenerateChapterTitlesBtn: document.getElementById("regenerateChapterTitlesBtn"),
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
let projectMemory = {
  favoriteTitles: [],
  chapterNotes: {},
  draftProgress: 0,
  exportHistory: []
};

function populateSelect(selectEl, options) {
  options.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    selectEl.appendChild(option);
  });
}

function sanitize(text) {
  return (text || "").trim();
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

function normalizeBookType(bookType) {
  const normalized = (bookType || "").toLowerCase();
  if (normalized === "memoir") return "memoir";
  if (["nonfiction", "business", "self-help", "educational", "spiritual"].includes(normalized)) {
    return "nonfiction";
  }
  return "fiction";
}

function toTitleCase(text) {
  if (!text) return "";
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function uniqueList(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function choose(arr, seed = 0) {
  if (!arr || !arr.length) return "";
  const idx = Math.abs(seed) % arr.length;
  return arr[idx];
}

function extractProtagonist(idea) {
  const actorPattern = /(mapmaker|cartographer|detective|founder|leader|mother|father|teacher|student|engineer|healer|monk|warrior|scientist|writer)/i;
  const actorMatch = idea.match(actorPattern);
  if (actorMatch) return `A ${actorMatch[1].toLowerCase()} with unusual responsibility`;

  const phraseMatch = idea.match(/(?:about|where|when)\s+([^,.]{10,80})/i);
  if (phraseMatch) return toTitleCase(phraseMatch[1].split(" ").slice(0, 7).join(" "));

  return "A lead character forced to choose between comfort and truth";
}

function extractStakes(idea) {
  const lower = idea.toLowerCase();
  const stakesMatches = [];
  if (/war|battle|invasion|rebellion|collapse/.test(lower)) stakesMatches.push("escalating large-scale conflict");
  if (/love|relationship|marriage|family|child/.test(lower)) stakesMatches.push("irreversible personal loss");
  if (/secret|hidden|truth|erased|forgotten/.test(lower)) stakesMatches.push("danger triggered by revelation");
  if (/empire|kingdom|nation|city|company/.test(lower)) stakesMatches.push("system-level consequences");

  if (!stakesMatches.length) {
    return "the cost of staying the same versus the risk of change";
  }
  return uniqueList(stakesMatches).join(" + ");
}

function extractConceptElements(idea) {
  const lower = idea.toLowerCase();
  const patterns = [
    { label: "Hidden civilization", test: /hidden civilization|lost civilization|forgotten civilization|buried city|ancient city/ },
    { label: "Mapmaker protagonist", test: /mapmaker|cartographer|atlas maker|map/ },
    { label: "Altered maps", test: /altered maps|erased maps|false map|map changes|map that changes/ },
    { label: "Ancient force", test: /ancient empire|ancient god|old kingdom|forgotten dynasty/ },
    { label: "War risk", test: /war|invasion|rebellion|battle|civil war/ },
    { label: "Spirits or divine powers", test: /spirit|ghost|god|gods|divine|oracle|curse/ },
    { label: "Knowledge-driven lead", test: /scholar|librarian|historian|mapmaker|researcher|archive/ },
    { label: "Sea-world setting", test: /sea|ocean|island|harbor|tide|beneath the sea/ },
    { label: "Mystery signal", test: /secret|hidden|mystery|erased|forgotten|truth/ }
  ];

  return patterns.filter((entry) => entry.test.test(lower)).map((entry) => entry.label);
}

function analyzeConcept(idea) {
  const lower = idea.toLowerCase();
  return {
    hasMagic: /magic|spell|curse|spirit|god|gods|divine/.test(lower),
    hasMystery: /secret|hidden|forgotten|erased|mystery|ancient|truth/.test(lower),
    hasWar: /war|battle|empire|kingdom|invasion|rebellion/.test(lower),
    hasSea: /sea|ocean|island|tide|beneath the sea|harbor/.test(lower),
    hasMap: /map|mapmaker|cartographer|atlas/.test(lower),
    hasSciFi: /ai|robot|space|planet|ship|galaxy|simulation|quantum/.test(lower),
    hasRomance: /love|marriage|heartbreak|relationship/.test(lower),
    protagonistHint: extractProtagonist(idea),
    stakesHint: extractStakes(idea),
    detectedElements: extractConceptElements(idea)
  };
}

function genreKey(input) {
  const g = (input.genre || "").toLowerCase();
  if (g.includes("fantasy")) return "fantasy";
  if (g.includes("business")) return "business";
  if (g.includes("spiritual")) return "spiritual";
  return "default";
}

function buildCoreAnchors(input, concept) {
  const anchors = [];
  if (concept.protagonistHint) anchors.push(concept.protagonistHint);
  if (concept.stakesHint) anchors.push(`Stakes: ${concept.stakesHint}`);
  if (concept.detectedElements.length) anchors.push(`Signals: ${concept.detectedElements.join(", ")}`);
  anchors.push(`Reader: ${input.targetReader}`);
  anchors.push(`Positioning: ${input.positioning}`);
  return anchors;
}

function naturalizeSignals(analysis, input) {
  const lead = analysis.hasMap
    ? "A knowledge-driven mapmaker"
    : analysis.protagonistHint || "A reluctant protagonist";

  const discovery = analysis.hasMystery
    ? "uncovers evidence that official history was deliberately altered"
    : "stumbles into a truth no one wanted found";

  const force = analysis.hasMagic
    ? "an ancient spirit-bound force"
    : analysis.hasWar
      ? "a political machine preparing conflict"
      : "a buried system built on silence";

  const setting = analysis.hasSea
    ? "across a sea-locked kingdom"
    : `inside the world of ${input.genre.toLowerCase()}`;

  const outcome = analysis.hasWar
    ? "dragging the realm into open war"
    : "triggering irreversible collapse";

  return `${lead} ${discovery}, awakening ${force} ${setting} and risking ${outcome}.`;
}

function makeProtagonistProfile(analysis) {
  const role = analysis.hasMap ? "a royal cartographer tasked with certifying state maps" : "an institutional insider trained to preserve official history";
  const competency = analysis.hasMystery
    ? "She notices pattern drift in records others treat as noise."
    : "She can detect inconsistencies in testimony and archives with forensic precision.";
  const privateFear = analysis.hasWar
    ? "She carries a private fear that one public correction could trigger war across rival ports."
    : "She fears that naming the truth will collapse the order that gave her identity.";
  const pressure = analysis.hasMagic
    ? "As spirit phenomena begin matching her map anomalies, she is cornered between political loyalty and supernatural evidence."
    : "As evidence accumulates, she is cornered between political loyalty and factual integrity.";

  return `Protagonist: ${role}. ${competency} ${privateFear} ${pressure}`;
}

function makeDramaticQuestion(analysis) {
  const truthAct = analysis.hasMap ? "publish what the altered maps are hiding" : "speak the truth the regime erased";
  const cost = analysis.hasWar ? "ignite a conflict she cannot contain" : "shatter the order protecting her people";
  return `If she tells the truth, can she prevent disaster, or will that truth itself become the spark that ${cost}?`;
}

function getSpecificityTokens(analysis, chapterIndex) {
  const defaultLocations = [
    "royal archive",
    "state cartography hall",
    "harbor records chamber",
    "council map court",
    "restricted chart vault",
    "old lighthouse annex",
    "customs ledger office",
    "under-chapel catacombs",
    "flooded survey tunnel",
    "war planning gallery",
    "public map ceremony dais",
    "new atlas chamber"
  ];

  const fantasyLocations = [
    "royal archive",
    "public map ceremony",
    "forbidden harbor vault",
    "salt chapel beneath the quay",
    "drowned observatory",
    "altar of royal records",
    "storm-break lighthouse",
    "erased empire memorial vault",
    "spirit witness shrine",
    "treason inquiry hall",
    "tidal throne court",
    "new atlas tribunal"
  ];

  const objects = analysis.hasMap
    ? [
      "false coastline overlay",
      "saltwater ink layer",
      "altered royal records",
      "forbidden harbor chart",
      "erased empire route",
      "sleeping god seal",
      "spirit witness ledger",
      "treason warrant draft",
      "tide-reactive atlas page",
      "redacted naval map",
      "court map standard",
      "rewritten kingdom atlas"
    ]
    : [
      "sealed state record",
      "missing testimony",
      "coded directive",
      "forbidden index"
    ];

  const pressures = [
    "a censor arrives before she can copy the evidence",
    "the map council demands immediate recertification",
    "a spirit sign appears and witnesses panic",
    "an ally warns that the harbor guard is coming",
    "the record begins to dissolve in seawater",
    "the court frames her correction as treason",
    "the only witness retracts under threat",
    "the king's envoys seal the chamber",
    "war orders are drafted from false coordinates",
    "the archive floodgates are opened",
    "a public audience demands a verdict",
    "an execution order is attached to her findings"
  ];

  const choices = [
    "hide the proof and survive",
    "submit a false revision",
    "smuggle the chart to an outlaw scholar",
    "challenge the official map in public",
    "burn the evidence to protect her family",
    "name the royal office that forged the record",
    "trust a spirit witness no one else can hear",
    "leak the map to rival captains",
    "delay war by falsifying one final chart",
    "break protocol and open the sealed vault",
    "accuse an ally during ceremony",
    "publish the truth and accept the sentence"
  ];

  const hooks = [
    "The false coastline aligns with a city erased from law.",
    "A child at the ceremony identifies the forbidden harbor by name.",
    "Saltwater ink reveals a royal signature thought long dead.",
    "The harbor bells ring before she leaves the chamber.",
    "A spirit witness writes one word onto the map: Return.",
    "The altered royal record lists her family among the conspirators.",
    "A tribunal stamp marks her findings as high treason.",
    "The erased empire route points beneath the palace foundation.",
    "The sleeping god seal fractures as the tide rises.",
    "War fleets mobilize using the forged coordinates.",
    "The court accepts her proof, then orders her arrest.",
    "The new atlas leaves one coastline intentionally blank."
  ];

  const locations = analysis.hasSea || analysis.hasMap || analysis.hasMagic ? fantasyLocations : defaultLocations;
  const idx = chapterIndex % 12;
  return {
    location: locations[idx],
    object: objects[idx % objects.length],
    pressure: pressures[idx],
    choice: choices[idx],
    hook: hooks[idx]
  };
}

function makeChapterPurpose(beat, analysis, chapterIndex) {
  const base = FICTION_BEAT_LOGIC[beat]?.purpose || "Escalate stakes and narrow options.";
  const variations = [
    "Frame the chapter around institutional control of truth.",
    "Advance the protagonist from observer to participant.",
    "Increase cost while reducing plausible deniability.",
    "Force a moral compromise with visible consequences.",
    "Shift the power balance between archive and court.",
    "Reframe prior evidence through a new threat context.",
    "Expose how private fear distorts strategic choices.",
    "Turn hidden information into public risk.",
    "Break trust and remove an old safety net.",
    "Convert despair into a decisive action path.",
    "Pay off long-buried clues with irreversible action.",
    "Establish the terms of the new order."
  ];
  return `${base} ${variations[chapterIndex % variations.length]}`;
}

function makeChapterConflict(beat, analysis, chapterIndex) {
  const base = FICTION_BEAT_LOGIC[beat]?.conflict || "A new pressure point exposes an old lie.";
  const tokens = getSpecificityTokens(analysis, chapterIndex);
  const conflictModes = [
    `A disputed ${tokens.object} makes official geography legally unstable.`,
    `The discovery in ${tokens.location} can be dismissed as fraud unless she risks public exposure.`,
    `A treason inquiry reframes her evidence as sedition before she can verify it.`,
    `Competing factions weaponize the record to justify opposite military actions.`,
    `A spirit-linked anomaly validates the map but undermines her credibility.`,
    `The same evidence that can stop war can also trigger it if released unframed.`
  ];
  return `${base} ${conflictModes[chapterIndex % conflictModes.length]}`;
}

function makeScenePrompt(beat, analysis, chapterTitle) {
  const chapterMatch = chapterTitle.match(/^(\d+)\./);
  const chapterIndex = chapterMatch ? Number(chapterMatch[1]) - 1 : 0;
  const tokens = getSpecificityTokens(analysis, chapterIndex);
  return `Location: ${tokens.location}. Discovery: ${tokens.object}. Pressure: ${tokens.pressure}. Choice: She must ${tokens.choice}.`;
}

function makeEndingHook(beat, analysis, chapterIndex) {
  const beatHook = FICTION_BEAT_LOGIC[beat]?.hook;
  const tokenHook = getSpecificityTokens(analysis, chapterIndex).hook;
  const hookPatterns = [
    `${tokenHook}`,
    `${beatHook || "A final detail reframes the chapter."}`,
    `As the scene closes, ${tokenHook.toLowerCase()}`,
    `Before anyone can respond, ${tokenHook.toLowerCase()}`
  ];
  return hookPatterns[chapterIndex % hookPatterns.length];
}

function generateFictionLogline(input, concept) {
  return naturalizeSignals(concept, input);
}

function generateDramaticQuestion(input, concept) {
  return makeDramaticQuestion(concept);
}

function generateNaturalStakes(input, concept) {
  const publicStake = concept.hasWar
    ? "If she is right, kingdoms move toward war based on a manufactured lie."
    : "If she is right, institutions built on false history begin to fracture.";
  const personalStake = "If she is wrong or silent, she loses credibility, allies, and the chance to prevent catastrophe.";
  const moralStake = "Every chapter should force a choice between comfort, loyalty, and truth.";
  return [publicStake, personalStake, moralStake].join("\n");
}

function buildFictionTitles(input, concept) {
  const noun = choose(GENRE_BANKS.fantasy.nouns, input.projectName.length);
  const place = concept.hasSea ? "Tide" : concept.hasMystery ? "Archive" : "Kingdom";
  const person = concept.hasMap ? "Cartographer" : "Witness";
  const object = concept.hasMap ? "Map" : noun;

  return uniqueList([
    `The ${object} of ${place}`,
    `The ${person}'s Oath`,
    `${place} Beneath the ${concept.hasSea ? "Sea" : "Crown"}`,
    `The Silent ${concept.hasWar ? "Kingdom" : "Archive"}`,
    `A ${object} for ${concept.hasMagic ? "Gods" : "Kings"}`
  ]);
}

function buildNonfictionTitles(input) {
  const audience = input.targetReader.split(" ").slice(0, 2).join(" ") || "Leader";
  const outcome = input.positioning.split(" ").slice(0, 2).join(" ") || "Execution";
  return uniqueList([
    `The ${outcome} Method`,
    `The ${outcome} Blueprint`,
    `From Overwhelm to ${toTitleCase(outcome)}`,
    `The ${toTitleCase(audience)} Operating System`,
    `Build ${toTitleCase(outcome)} Without Burnout`
  ]);
}

function buildMemoirTitles(input, concept) {
  const place = concept.hasSea ? "Tide" : "Silence";
  return uniqueList([
    `Beneath the ${place}`,
    `The Question I Could Not Ignore`,
    `When the Old Life Broke`,
    `A Map Back to Myself`,
    `${toTitleCase(input.projectName)}: A Memoir`
  ]);
}

function makeTitleIdeas(input, concept, engineType) {
  if (engineType === "fiction") return buildFictionTitles(input, concept);
  if (engineType === "memoir") return buildMemoirTitles(input, concept);
  return buildNonfictionTitles(input);
}

function chapterCountFromLength(length, depthLevel) {
  if (depthLevel === "Quick Blueprint") return 10;
  if (depthLevel === "Publisher-Level Blueprint") return 14;
  if (length <= 45000) return 10;
  if (length <= 80000) return 12;
  return 14;
}

function buildFictionChapterIntelligence(input, concept, chapterCount) {
  const bank = GENRE_BANKS[genreKey(input)].chapterPhrases;
  const chapterLines = [];

  const emotionalTurns = [
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

  for (let i = 0; i < chapterCount; i += 1) {
    const beat = FICTION_BEATS[i] || `Escalation ${i + 1}`;
    const chapterTitle = choose(bank, i + input.projectName.length) || `Chapter ${i + 1}: New Pressure`;
    const purpose = makeChapterPurpose(beat, concept, i);
    const conflict = makeChapterConflict(beat, concept, i);
    const turn = emotionalTurns[i % emotionalTurns.length];
    const scenePrompt = makeScenePrompt(beat, concept, chapterTitle);
    const hook = makeEndingHook(beat, concept, i);

    chapterLines.push([
      `${i + 1}. ${chapterTitle}`,
      "",
      "Story Beat:",
      beat,
      "",
      "Purpose:",
      purpose,
      "",
      "Conflict:",
      conflict,
      "",
      "Emotional Turn:",
      turn,
      "",
      "Scene Prompt:",
      scenePrompt,
      "",
      "Ending Hook:",
      hook
    ].join("\n"));
  }

  return chapterLines.join("\n\n");
}

function buildNonfictionChapterIntelligence(input, chapterCount) {
  const flow = [
    "Name the Pain",
    "Break the Old Belief",
    "Introduce the Framework",
    "Teach Step One",
    "Teach Step Two",
    "Case Study",
    "Implementation Plan",
    "Obstacles",
    "Scale / Sustain",
    "Final Transformation"
  ];

  const bank = GENRE_BANKS[genreKey(input)].chapterPhrases;
  const lines = [];
  for (let i = 0; i < chapterCount; i += 1) {
    const chapterName = flow[i] || `Advanced Module ${i - flow.length + 1}`;
    const phrase = choose(bank, i + input.length) || "Practical Shift";
    lines.push(
      `${i + 1}. ${chapterName}: ${phrase}\nPurpose: Move the reader from confusion to capability.\nAction Step: Add one implementation sprint that ${input.targetReader.toLowerCase()} can run this week.`
    );
  }
  return lines.join("\n\n");
}

function buildMemoirChapterIntelligence(input, concept, chapterCount) {
  const flow = [
    "Before the Break",
    "The Inciting Life Event",
    "First Denial",
    "The Hidden Wound",
    "A Dangerous Choice",
    "The Turning Point",
    "What Was Lost",
    "What Was Named",
    "The New Voice",
    "The New Life"
  ];
  const lines = [];
  for (let i = 0; i < chapterCount; i += 1) {
    const name = flow[i] || `Memory Thread ${i - flow.length + 1}`;
    lines.push(
      `${i + 1}. ${name}\nTheme: ${concept.detectedElements[i % Math.max(1, concept.detectedElements.length)] || "Identity under pressure"}.\nReflective move: Connect the past scene to a present-day insight for the reader.`
    );
  }
  return lines.join("\n\n");
}

function buildActStructure(concept) {
  return [
    `Act 1: Setup and fracture point. Establish ${concept.protagonistHint.toLowerCase()} and the world lie.`,
    "Act 2A: Pursuit and false wins. The protagonist learns rules but pays in trust.",
    "Midpoint: Irreversible revelation that reframes ally versus enemy.",
    "Act 2B: Collapse and moral pressure. The flaw creates maximum damage.",
    "Act 3: Final choice under full stakes and a value-based resolution."
  ].join("\n");
}

function buildFictionEngine(input, concept, chapterCount, titleIdeas) {
  const elementsList = concept.detectedElements.length ? concept.detectedElements.join(", ") : "hidden tension, risky truth, and emotional cost";
  const naturalSignal = naturalizeSignals(concept, input);
  const worldRules = [
    concept.hasMagic ? "Magic follows debt: each use requires a visible cost." : "Power follows scarcity and hidden leverage.",
    concept.hasMap ? "Maps or records can be altered, but never without a trace." : "Institutions preserve false narratives by design.",
    concept.hasSea ? "The sea/archive/terrain itself behaves as a witness." : "Setting mirrors the internal stakes."
  ].join("\n");

  return [
    { title: "Logline", body: generateFictionLogline(input, concept) },
    { title: "Core Dramatic Question", body: generateDramaticQuestion(input, concept) },
    { title: "Protagonist", body: makeProtagonistProfile(concept) },
    { title: "Protagonist Flaw", body: "Over-control: believes competence can replace vulnerability." },
    { title: "Protagonist Desire", body: "To restore order and protect what matters without losing identity." },
    { title: "Protagonist Need", body: "To trust others and accept that truth demands sacrifice." },
    { title: "Antagonistic Force", body: concept.hasWar ? "A regime preparing conflict while burying historical truth." : "A system that rewards silence and punishes witnesses." },
    { title: "Stakes", body: generateNaturalStakes(input, concept) },
    { title: "World Rules", body: worldRules },
    { title: "Theme", body: "Truth has a cost, but silence has a higher one." },
    { title: "Act 1 / Act 2A / Midpoint / Act 2B / Act 3", body: buildActStructure(concept) },
    { title: "Chapter Outline", body: buildFictionChapterIntelligence(input, concept, chapterCount) },
    { title: "Scene Prompts", body: `Use detected elements in every scene: ${elementsList}.\nAnchor prose in this core signal: ${naturalSignal}\nOpen with pressure, reveal one contradiction, end with consequence.` },
    { title: "Character Arcs", body: "Lead: certainty -> fracture -> earned conviction.\nMentor: guarded truth -> costly disclosure.\nAntagonist: control -> desperation." },
    { title: "Back Cover Blurb", body: `${titleIdeas[0]} follows a protagonist who discovers that the kingdom's official history was engineered. ${naturalSignal} Each discovery redraws the line between inherited myth and engineered power.` },
    { title: "Comparable Reader Promise", body: `Positioning: ${input.positioning}.\nReader promise: high-concept ${input.genre.toLowerCase()} with character-led mystery, escalating geopolitical risk, and emotionally costly truth.` }
  ];
}

function buildNonfictionEngine(input, concept, chapterCount, titleIdeas) {
  const frameworkName = `${toTitleCase(input.positioning.split(" ").slice(0, 3).join(" "))} Framework`;
  return [
    { title: "Reader Problem", body: `${input.targetReader} are dealing with scattered effort, unclear priorities, and inconsistent execution.` },
    { title: "Reader Promise", body: `This book helps ${input.targetReader} move from confusion to a repeatable system with measurable progress.` },
    { title: "Transformation Path", body: "Diagnose -> Reframe -> Build system -> Execute -> Measure -> Sustain." },
    { title: "Core Framework", body: `${frameworkName}\n1) Clarity Layer\n2) Design Layer\n3) Execution Layer\n4) Optimization Layer` },
    { title: "Chapter-by-Chapter Learning Path", body: buildNonfictionChapterIntelligence(input, chapterCount) },
    { title: "Examples / Case Studies", body: "Case 1: Early adopter with quick wins.\nCase 2: Team-level implementation under constraints.\nCase 3: Long-term optimization after initial success." },
    { title: "Exercises / Action Steps", body: "Each chapter ends with one 20-minute exercise, one weekly sprint, and one checkpoint metric." },
    { title: "Credibility Angle", body: `Credibility lane: ${input.positioning}.\nSupport with lived results, practical examples, and transparent logic.` },
    { title: "Revision Checklist", body: "[ ] Is each chapter tied to a measurable reader outcome?\n[ ] Is every concept paired with a practical action?\n[ ] Does the structure avoid jargon drift?" },
    { title: "Back Cover Blurb", body: `${titleIdeas[0]} gives ${input.targetReader} a practical, chapter-by-chapter operating system for results that actually compound.` },
    { title: "SEO / Amazon Keywords", body: `${input.genre.toLowerCase()} strategy\n${input.bookType.toLowerCase()} framework\n${input.targetReader.toLowerCase()} guide\nimplementation blueprint\nactionable playbook` }
  ];
}

function buildMemoirEngine(input, concept, chapterCount, titleIdeas) {
  return [
    { title: "Life Question", body: "Who did I become while surviving, and who am I willing to become now?" },
    { title: "Before State", body: "Life looked functional on the surface but was emotionally fragmented underneath." },
    { title: "Inciting Life Event", body: `A rupture exposed the hidden truth: ${concept.detectedElements.join(", ") || "the old life could not hold"}.` },
    { title: "Emotional Wound", body: "A belief that love must be earned through performance and silence." },
    { title: "Turning Points", body: "Turning Point 1: Naming the wound.\nTurning Point 2: Refusing the old script.\nTurning Point 3: Choosing a new voice in public." },
    { title: "Inner Transformation", body: "From protection and image-management to agency and integrated identity." },
    { title: "Memory Map", body: buildMemoirChapterIntelligence(input, concept, chapterCount) },
    { title: "Chapter Themes", body: "Loss, witness, responsibility, repair, meaning, and chosen future." },
    { title: "Reflective Takeaway", body: "Readers leave with language for their own turning points and the courage to narrate honestly." },
    { title: "Back Cover Blurb", body: `${titleIdeas[0]} is a memoir about rupture, memory, and the difficult grace of becoming whole.` }
  ];
}

function buildPublisherExtras(input, engineType, titleIdeas) {
  const base = [
    {
      title: "Market Positioning",
      body: `Audience promise: ${input.targetReader} gain clear outcomes through a structured, voice-led approach.\nCategory lane: ${input.genre} / ${input.bookType}.`
    },
    {
      title: "Comparable Titles",
      body: `Comp 1: Category leader in ${input.genre}.\nComp 2: A practical framework book with strong implementation.\nComp 3: Voice-driven title with high reader retention.`
    },
    {
      title: "Series Potential",
      body: engineType === "fiction" ? "Potential trilogy arc: discovery, war, reconstruction." : "Potential follow-ups: workbook, field guide, advanced implementation volume."
    },
    {
      title: "Amazon Categories",
      body: `${input.genre} > Strategy\n${input.bookType} > Writing and Publishing\n${input.genre} > Applied Practice`
    },
    {
      title: "Launch Assets",
      body: "Lead magnet chapter, pre-order bonus checklist, 10-post social sequence, and author pitch angle."
    },
    {
      title: "Query Letter Angle",
      body: `Core hook: ${titleIdeas[0]} addresses ${input.targetReader.toLowerCase()} with a differentiated ${input.positioning.toLowerCase()} lens.`
    }
  ];
  return base;
}

function applyDepthLevel(modules, input, concept, engineType, titleIdeas) {
  if (input.depthLevel === "Quick Blueprint") {
    return modules.slice(0, Math.min(10, modules.length));
  }
  if (input.depthLevel === "Publisher-Level Blueprint") {
    return modules.concat(buildPublisherExtras(input, engineType, titleIdeas));
  }
  return modules;
}

function qualitySuggestions(score, engineType) {
  const fixes = [];
  if (score < 6) fixes.push("Increase concept specificity with named places, risks, and constraints.");
  if (engineType === "fiction") {
    fixes.push("Antagonist needs a clear face, role, or institutional identity.");
    fixes.push("Increase ending-hook variety across chapters to avoid pattern fatigue.");
    fixes.push("Comparable positioning should state exact reader expectation in one line.");
  }
  if (engineType === "nonfiction") {
    fixes.push("Tighten the promise with one measurable before/after statement.");
    fixes.push("Add one concrete metric-backed case outcome per major module.");
  }
  if (engineType === "memoir") {
    fixes.push("Deepen reflective bridge lines after memory-heavy chapters.");
  }
  return uniqueList(fixes).slice(0, 3);
}

function qualityStrengths(modules, input, engineType) {
  const text = modules.map((mod) => `${mod.title}\n${mod.body}`).join("\n").toLowerCase();
  const strengths = [];
  if (new RegExp(input.genre.toLowerCase()).test(text) || /map|spirit|kingdom|framework|transformation/.test(text)) {
    strengths.push("Genre match is clear and sustained.");
  }
  if (/stakes|conflict|war|catastrophe/.test(text)) {
    strengths.push("Stakes are visible and escalating.");
  }
  if (engineType === "fiction" && /protagonist flaw|protagonist need/.test(text)) {
    strengths.push("Protagonist internal arc is explicitly defined.");
  }
  if (engineType === "fiction" && /world rules/.test(text)) {
    strengths.push("World rules are concrete enough to shape plot decisions.");
  }
  if (engineType !== "fiction" && /framework|action step/.test(text)) {
    strengths.push("Practical execution path is chapter-linked.");
  }
  return strengths.slice(0, 4);
}

function scoreBlueprint(modules, bookType, genre) {
  let score = 0;
  const text = modules.map((mod) => mod.body.toLowerCase()).join("\n");

  if (!text.includes("orientation")) score += 1;
  if (!text.includes("foundation")) score += 1;
  if (/chapter\s+[0-9]+/.test(text)) score += 1;
  if (/stakes|conflict|transformation|promise/.test(text)) score += 2;
  if (/reader|audience/.test(text)) score += 1;
  if (/blurb|amazon|seo|positioning|comparable/.test(text)) score += 1;

  const g = (genre || "").toLowerCase();
  if (g.includes("fantasy") && /map|kingdom|magic|spirit|god|empire|tide/.test(text)) score += 2;

  const normalizedType = normalizeBookType(bookType);
  if (normalizedType === "fiction" && /protagonist|theme|arc|act 1|midpoint/.test(text)) score += 2;
  if (normalizedType !== "fiction" && /framework|reader|problem|promise|action/.test(text)) score += 2;

  return Math.min(10, Number((score / 1.3).toFixed(1)));
}

function buildQualityReport(modules, input, engineType) {
  const score = scoreBlueprint(modules, input.bookType, input.genre);
  return {
    score,
    strengths: qualityStrengths(modules, input, engineType),
    suggestions: qualitySuggestions(score, engineType)
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
      : ["- No strong pattern detected. Add more concrete nouns and stakes for richer output."]),
    `Protagonist hint: ${concept.protagonistHint}`,
    `Stakes hint: ${concept.stakesHint}`
  ];
  elements.conceptPanel.textContent = lines.join("\n");
}

function ensureUniqueModuleTitles(modules) {
  const seen = {};
  return modules.map((mod) => {
    const key = mod.title.trim();
    seen[key] = (seen[key] || 0) + 1;
    if (seen[key] === 1) return mod;
    return {
      ...mod,
      title: `${key} (${seen[key]})`
    };
  });
}

function generateBlueprint(input) {
  if (!input.bookIdea) {
    alert("Please enter your core book idea first.");
    return [];
  }

  const concept = analyzeConcept(input.bookIdea);
  const engineType = normalizeBookType(input.bookType);
  const chapterCount = chapterCountFromLength(input.length, input.depthLevel);
  const titleIdeas = makeTitleIdeas(input, concept, engineType);

  let modules = [];
  if (engineType === "fiction") {
    modules = buildFictionEngine(input, concept, chapterCount, titleIdeas);
  } else if (engineType === "memoir") {
    modules = buildMemoirEngine(input, concept, chapterCount, titleIdeas);
  } else {
    modules = buildNonfictionEngine(input, concept, chapterCount, titleIdeas);
  }

  modules = [{ title: "Concept Analyzer", body: buildCoreAnchors(input, concept).join("\n") }].concat(modules);
  modules = [{ title: "Title Ideas", body: titleIdeas.map((item, idx) => `${idx + 1}. ${item}`).join("\n") }].concat(modules);

  modules = applyDepthLevel(modules, input, concept, engineType, titleIdeas);
  modules = ensureUniqueModuleTitles(modules);
  const quality = buildQualityReport(modules, input, engineType);

  lastConcept = concept;
  lastScore = quality;
  projectMemory.favoriteTitles = uniqueList(
    projectMemory.favoriteTitles.concat(titleIdeas.slice(0, 3))
  ).slice(0, 15);

  return modules;
}

function rewriteText(text, mode) {
  if (!text) return "";

  if (mode === "professional") {
    return text
      .replace(/\bthing\b/gi, "strategic element")
      .replace(/\bbig\b/gi, "high-impact")
      .replace(/\bsmall\b/gi, "targeted")
      .replace(/\n/g, "\n");
  }

  if (mode === "cinematic") {
    return `Frame this in motion and consequence.\n${text}\nAdd sensory signal, escalation, and irreversible choice.`;
  }

  if (mode === "shorter") {
    return text
      .split("\n")
      .filter(Boolean)
      .slice(0, 4)
      .join("\n");
  }

  if (mode === "specific") {
    const details = lastConcept && lastConcept.detectedElements.length
      ? lastConcept.detectedElements.join(", ")
      : "named places, named actors, and measurable outcomes";
    return `${text}\n\nSpecificity upgrade: explicitly weave in ${details}.`;
  }

  return text;
}

function regenerateSection(moduleTitle) {
  if (!lastInput) return null;
  const fresh = generateBlueprint(lastInput);
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
      await navigator.clipboard.writeText(`${mod.title}\n\n${mod.body}`);
      copyBtn.textContent = "Copied";
      setTimeout(() => {
        copyBtn.textContent = "Copy";
      }, 1000);
    });

    regenBtn.addEventListener("click", () => {
      const refreshed = regenerateSection(mod.title);
      if (!refreshed) return;
      blueprint[idx] = refreshed;
      renderBlueprint(blueprint);
    });

    rewriteBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.mode;
        blueprint[idx].body = rewriteText(blueprint[idx].body, mode);
        renderBlueprint(blueprint);
      });
    });

    if (applyMobileRefineBtn && mobileRefineMode) {
      applyMobileRefineBtn.addEventListener("click", () => {
        const mode = mobileRefineMode.value;
        blueprint[idx].body = rewriteText(blueprint[idx].body, mode);
        renderBlueprint(blueprint);
      });
    }

    elements.outputContainer.appendChild(fragment);
  });
}

function blueprintToMarkdown(modules, input) {
  const sections = modules
    .map((mod) => `## ${mod.title}\n\n${mod.body}`)
    .join("\n\n");
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
  const y = String(date.getFullYear());
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${y}${m}${d}-${h}${min}${s}`;
}

function makeExportFilename(input, extension) {
  const slug = slugifyProjectName(input.projectName);
  return `${slug}-${formatExportTimestamp()}.${extension}`;
}

function detectChapterModule(modules) {
  return modules.find((mod) => /chapter outline|chapter-by-chapter learning path|memory map/i.test(mod.title));
}

function extractChapterTitleLines(text) {
  return text
    .split("\n")
    .filter((line) => /^\d+\.\s+/.test(line));
}

function generateChapterTitleLine(input, concept, engineType, chapterNumber) {
  const bank = GENRE_BANKS[genreKey(input)].chapterPhrases;
  const seed = input.projectName.length + variationNonce + chapterNumber;

  if (engineType === "fiction") {
    return `${chapterNumber}. ${choose(bank, seed) || `Chapter ${chapterNumber}: Rising Cost`}`;
  }

  if (engineType === "memoir") {
    const memoirFlow = [
      "Before the Break",
      "The Inciting Life Event",
      "First Denial",
      "The Hidden Wound",
      "A Dangerous Choice",
      "The Turning Point",
      "What Was Lost",
      "What Was Named",
      "The New Voice",
      "The New Life"
    ];
    const chapterLabel = memoirFlow[chapterNumber - 1] || `Memory Thread ${chapterNumber - memoirFlow.length}`;
    return `${chapterNumber}. ${chapterLabel}`;
  }

  const nonfictionFlow = [
    "Name the Pain",
    "Break the Old Belief",
    "Introduce the Framework",
    "Teach Step One",
    "Teach Step Two",
    "Case Study",
    "Implementation Plan",
    "Obstacles",
    "Scale / Sustain",
    "Final Transformation"
  ];
  const chapterLabel = nonfictionFlow[chapterNumber - 1] || `Advanced Module ${chapterNumber - nonfictionFlow.length}`;
  return `${chapterNumber}. ${chapterLabel}: ${choose(bank, seed) || "Practical Shift"}`;
}

function regenerateChapterTitlesOnly() {
  if (!blueprint.length || !lastInput || !lastConcept) {
    alert("Generate a blueprint first.");
    return;
  }

  const engineType = normalizeBookType(lastInput.bookType);
  const chapterModuleIndex = blueprint.findIndex((mod) => /chapter outline|chapter-by-chapter learning path|memory map/i.test(mod.title));
  if (chapterModuleIndex === -1) {
    alert("No chapter module found to regenerate.");
    return;
  }

  variationNonce += 1;
  const module = blueprint[chapterModuleIndex];
  const lines = module.body.split("\n");

  const updatedLines = lines.map((line) => {
    if (!/^\d+\.\s+/.test(line)) return line;
    const match = line.match(/^(\d+)\./);
    if (!match) return line;
    const chapterNumber = Number(match[1]);
    return generateChapterTitleLine(lastInput, lastConcept, engineType, chapterNumber);
  });

  blueprint[chapterModuleIndex] = {
    ...module,
    body: updatedLines.join("\n")
  };

  updateProjectMemoryAfterGeneration();
  renderProjectMemory();
  renderBlueprint(blueprint);
}

function renderProjectMemory() {
  if (!elements.projectMemoryPanel) return;

  elements.memoryProgress.textContent = `Draft progress: ${projectMemory.draftProgress}% | Favorite titles: ${projectMemory.favoriteTitles.length} | Exports: ${projectMemory.exportHistory.length}`;

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
  const chapterEntries = Object.entries(projectMemory.chapterNotes).slice(0, 12);
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

    const input = document.createElement("textarea");
    input.className = "chapter-note-input";
    input.value = note;
    input.placeholder = "Add chapter-specific writing notes...";
    input.addEventListener("input", () => {
      projectMemory.chapterNotes[label] = input.value;
    });

    wrapper.appendChild(title);
    wrapper.appendChild(input);
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

function saveProject() {
  const state = {
    input: collectInput(),
    blueprint,
    concept: lastConcept,
    quality: lastScore,
    projectMemory
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  alert("Project saved locally.");
}

function loadProject() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    alert("No saved draft found.");
    return;
  }

  const state = JSON.parse(raw);
  if (!state || !state.input) {
    alert("Saved draft format is invalid.");
    return;
  }

  applyInputState(state.input);
  blueprint = Array.isArray(state.blueprint) ? state.blueprint : [];
  lastInput = state.input;
  lastConcept = state.concept || null;
  lastScore = state.quality || null;
  projectMemory = state.projectMemory || projectMemory;

  renderConcept(lastConcept);
  renderQuality(lastScore);
  renderProjectMemory();
  if (blueprint.length) {
    renderBlueprint(blueprint);
  }
  alert("Saved draft loaded.");
}

function clearProject() {
  if (!confirm("Clear the current workspace and outputs?")) {
    return;
  }
  [
    elements.projectName,
    elements.bookIdea,
    elements.targetReader,
    elements.positioning
  ].forEach((el) => {
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
  projectMemory = {
    favoriteTitles: [],
    chapterNotes: {},
    draftProgress: 0,
    exportHistory: []
  };
  localStorage.removeItem(STORAGE_KEY);
  renderProjectMemory();
}

function copyFullBlueprint() {
  if (!blueprint.length) {
    alert("Generate a blueprint first.");
    return;
  }
  const input = collectInput();
  const text = blueprintToMarkdown(blueprint, input);
  navigator.clipboard.writeText(text);
}

function updateProjectMemoryAfterGeneration() {
  const chapterModule = detectChapterModule(blueprint);
  if (chapterModule) {
    const lines = extractChapterTitleLines(chapterModule.body).slice(0, 20);

    const notes = {};
    lines.forEach((line) => {
      notes[line] = projectMemory.chapterNotes[line] || "";
    });
    projectMemory.chapterNotes = notes;
  }

  projectMemory.draftProgress = Math.min(100, Math.round((blueprint.length / 20) * 100));
}

function recordExport(format, filename) {
  projectMemory.exportHistory.unshift(`${formatExportTimestamp()} | ${format} | ${filename}`);
  projectMemory.exportHistory = projectMemory.exportHistory.slice(0, 20);
}

function init() {
  populateSelect(elements.genre, GENRES);
  populateSelect(elements.bookType, BOOK_TYPES);
  populateSelect(elements.tone, TONES);

  elements.generateBtn.addEventListener("click", () => {
    const input = collectInput();
    const modules = generateBlueprint(input);
    if (modules.length) {
      blueprint = modules;
      lastInput = input;
      updateProjectMemoryAfterGeneration();
      renderConcept(lastConcept);
      renderQuality(lastScore);
      renderProjectMemory();
      renderBlueprint(blueprint);
    }
  });

  elements.saveProjectBtn.addEventListener("click", saveProject);
  elements.loadProjectBtn.addEventListener("click", loadProject);
  elements.clearProjectBtn.addEventListener("click", clearProject);

  elements.copyAllBtn.addEventListener("click", copyFullBlueprint);

  elements.regenerateChapterTitlesBtn.addEventListener("click", regenerateChapterTitlesOnly);

  elements.exportMdBtn.addEventListener("click", () => {
    if (!blueprint.length) {
      alert("Generate a blueprint first.");
      return;
    }
    const input = collectInput();
    const filename = makeExportFilename(input, "md");
    recordExport("Markdown", filename);
    renderProjectMemory();
    downloadFile(filename, blueprintToMarkdown(blueprint, input), "text/markdown");
  });

  elements.exportTxtBtn.addEventListener("click", () => {
    if (!blueprint.length) {
      alert("Generate a blueprint first.");
      return;
    }
    const input = collectInput();
    const filename = makeExportFilename(input, "txt");
    recordExport("TXT", filename);
    renderProjectMemory();
    downloadFile(filename, blueprintToText(blueprint, input), "text/plain");
  });

  renderProjectMemory();
}

init();
