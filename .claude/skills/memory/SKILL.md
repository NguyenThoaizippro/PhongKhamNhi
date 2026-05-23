---
name: memory
description: |
  Unified project memory management: update, prune, reflect, and maintain knowledge.
  Combines conversation scanning, deduplication, contradiction detection,
  confidence scoring, and consistency checks in a single skill.

  Usage:
    /memory update [topic]   — scan conversation, persist learnings
    /memory prune [type]     — find duplicates, contradictions, stale entries
    /memory reflect          — focused correction capture from conversation
    /memory status           — show memory layout, sizes, health

  Triggers: "/memory", "update memory", "clean memory",
  "remember this", "memory update", "memory prune", "memory status"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
disable-model-invocation: true
---

# /memory — Unified Project Memory Management

You are a knowledge engineer managing a project's persistent memory system. You update, clean, and maintain knowledge across all memory layers.

## Language Rule

Reply in the same language the user writes. Default to English if unclear.

## Auto-Discovered Project Layout

Dynamic Context Injection: these shell commands run BEFORE you see the prompt.
They auto-discover the project's memory layout — no hardcoded paths needed.

### Project root:
!`git rev-parse --show-toplevel 2>/dev/null || pwd`

### CLAUDE.md files:
!`find . -name "CLAUDE.md" -o -name "CLAUDE.local.md" 2>/dev/null | grep -v node_modules | grep -v .git | grep -v .venv | head -10`

### Claude rules (if present):
!`if [ -d ".claude/rules" ]; then ls .claude/rules/*.md 2>/dev/null; else echo "No .claude/rules/ found"; fi`

### Auto-memory (Claude Code native):
!`project_hash=$(echo "$PWD" | sed 's|/|-|g; s|^-||'); dir="$HOME/.claude/projects/$project_hash/memory"; if [ -d "$dir" ]; then echo "AUTO_MEMORY=true"; echo "Dir: $dir"; ls -la "$dir"/*.md 2>/dev/null | awk '{print $NF, $5"b"}'; else echo "AUTO_MEMORY=false"; fi`

### Other memory locations:
!`ls docs/project_notes/*.md 2>/dev/null; ls memory-bank/*.md 2>/dev/null; echo "---"`

---

## Memory Architecture

Based on the auto-discovered layout above, use ALL detected memory locations. The standard layers are:

### Layer 1: CLAUDE.md (project root)
- **Purpose**: Critical rules read EVERY session. First thing Claude sees.
- **Rules**: Max ~120 lines. Only rules that prevent bugs or major time waste. 1-2 line summaries, details go to deeper layers.
- **If multiple CLAUDE.md exist**: Root = project rules, subdirectory = scope-specific rules.

### Layer 2: Deep Memory (.claude/rules/ OR docs/project_notes/ OR custom)
- **Purpose**: Detailed context organized by topic.
- **Rules**: One topic per file. Cross-reference, don't duplicate.

### Layer 3: Auto-Memory (~/.claude/projects/.../memory/)
- **Purpose**: Claude Code's native per-project persistent memory. `MEMORY.md` is loaded into system prompt every session.
- **Auto-discovered**: Path derived from project directory hash.
- **Rules**: Concise, max ~200 lines (truncated after that). Good for cross-session patterns, user preferences, recurring mistakes.
- **Updates**: Use `Write` / `Edit` tools directly on the file.
- **Relationship to CLAUDE.md**: CLAUDE.md = project rules (checked into git). Auto-memory = personal learnings (local, not in git).

### Layer 4: Conditional Rules (.claude/rules/)
- **Purpose**: File-pattern-specific coding rules (activated by glob paths in YAML frontmatter).
- **Rules**: Only update if a new file-specific coding pattern was discovered.

---

## Meta-Rules: How to Write Memory Entries

EVERY entry you write to ANY memory file MUST follow these rules.

### Format Rules
- Start rules with directives: "ALWAYS", "NEVER", "MUST", "REQUIRED"
- One idea per entry. If it has sub-parts, use bullets
- Explain the PROBLEM before the solution (1-3 bullets max)
- Include a code example ONLY for subtle/non-obvious patterns
- Entries in CLAUDE.md: max 2 lines, move details to deeper layers

### Anti-Bloat Rules
- NEVER add something obvious from the code itself
- NEVER duplicate info that exists in another memory file — use cross-references: "See [file] #[section]"
- NEVER add one-time task instructions as permanent rules
- NEVER add generic knowledge (e.g., "use async/await") — only project-specific learnings
- If CLAUDE.md exceeds its line limit after edits -> compress: merge entries, move details down

### Quality Gate (3 Questions Before Writing)
1. **Would forgetting this cause a bug or wasted time?** If no -> don't write
2. **Is this specific to THIS project?** If no -> don't write
3. **Does this already exist in memory?** If yes -> update existing entry, don't create new

---

## Canonical Location Map

Each topic has ONE source of truth. All other files reference it.

**How to build the map**: Read the headers/structure of all discovered memory files. Identify which file "owns" each topic. When a topic appears in multiple files, the most detailed version is canonical.

**Cross-reference format**: Instead of duplicating, write: "See [filename] #[section-header]"

**CLAUDE.md rule**: CLAUDE.md contains 1-line summaries + cross-references. Never full details.

---

## MODE: update

**Trigger**: `/memory update [topic]`, `/memory`, "update memory", "remember this"

### Purpose
Scan the current conversation, extract valuable learnings, persist to all memory layers.

### Process

#### Step 1: Scan Conversation
Extract learnings in these categories:

| Category | What to look for | Priority |
|----------|------------------|----------|
| **User Correction** | "no, do X instead", "actually...", "that's wrong" | HIGHEST |
| **Bug Fix** | Symptom -> Root cause -> Fix -> Prevention | HIGH |
| **Architecture Decision** | Decision -> Alternatives -> Why this choice | HIGH |
| **API/Library Quirk** | Unexpected behavior from any external service | HIGH |
| **Config Change** | New files, settings, dependencies added | MEDIUM |
| **Code Convention** | New project pattern or anti-pattern | MEDIUM |
| **Skill/Workflow** | New skill created, hook added, tool configured | MEDIUM |

**Priority signal**: User corrections are the highest-value learnings. ALWAYS capture these.

#### Step 2: Read Current Memory
Read ALL detected memory files before making changes. This prevents duplicates and contradictions.

#### Step 3: Classify & Assign Confidence

| Level | Criteria | Where to write |
|-------|----------|---------------|
| **CRITICAL** | Causes crash/total failure if missed | CLAUDE.md + deep memory |
| **HIGH** | Causes wrong behavior, hard to debug | CLAUDE.md (1-line) + deep memory |
| **MEDIUM** | Saves significant time | Deep memory only |
| **LOW** | Nice-to-know, easily rediscovered | Consider skipping |
| **SKIP** | One-time, generic, or obvious | Don't write |

#### Step 4: Deduplication Check (REQUIRED)

Before writing ANY new entry:
1. **Grep all memory files** for 2-3 key terms from the learning
2. **Exact match** -> SKIP (note: "Already in [file] [section]")
3. **Partial overlap** -> UPDATE existing entry in its canonical location
4. **Contradicts existing** -> Determine which is correct (current session = fresher). Update canonical, fix cross-references
5. **Truly new** -> Write in canonical location

#### Step 5: Apply Updates

- Use `Edit` for surgical changes, not `Write` for full rewrites
- Replace outdated info — update, don't append a second version
- Keep format consistent with existing file style
- Cross-reference, don't duplicate
- Add date for new entries: "Added: YYYY-MM-DD"
- NEVER add secrets (tokens, keys, passwords)

#### Step 6: Consistency Sweep (REQUIRED)

After all edits:
1. For each modified file, grep its key topics in ALL other memory files
2. If another file has the same topic, verify agreement
3. Fix non-canonical files to match canonical if they disagree
4. Verify CLAUDE.md is under line limit and valid Markdown
5. Verify no secrets were accidentally added

### Update Output Format
```
Memory Update

### Extracted Learnings
| # | Learning | Level | File |
|---|---------|-------|------|
| 1 | [what] | CRITICAL/HIGH/MEDIUM | [where written] |

### Changes
- **CLAUDE.md**: [changes] or "no changes"
- **[deep memory files]**: [changes per file]
- **Auto-memory**: [changes] or "no changes"
- **Rules**: [changes] or "no changes"

### Deduplication
- Skipped (already exists): [list]
- Updated (merged with existing): [list]
- Contradictions found & resolved: [count]

Stats: +X new | ~Y updated | -Z removed stale

/memory update complete
```

---

## MODE: prune

**Trigger**: `/memory prune [type]`, "clean memory", "remove duplicates"

### Purpose
Scan ALL memory files for duplicates, contradictions, stale entries, and bloat. Report findings. Apply fixes only after user confirmation.

### Process

#### Step 1: Read Everything
Read ALL detected memory files. Parse entries by headers.

#### Step 2: Duplication Scan
For each entry, search for its key terms in ALL other files.
- Same fact in 2+ files = duplication
- Same code example in multiple files = duplication
- **Action**: Keep FULL version in canonical file. Replace others with cross-references.

#### Step 3: Contradiction Scan
Extract factual claims and cross-reference:
- Version numbers (dependency files vs memory)
- "We use X" claims (memory vs actual imports in code)
- Config values (memory vs config files)
- File paths (memory vs filesystem — does the file exist?)
- **Action**: If code is truth -> update memory. If unclear -> flag for user.

#### Step 4: Staleness Scan
Flag entries that may be outdated:
- References to files that no longer exist
- Dependencies not in requirements/package.json
- Entries > 90 days old without recent validation

#### Step 5: Compaction Candidates
Find groups of 3+ related entries that could merge into one principle.
Only compact if it genuinely reduces size without losing important detail.

#### Step 6: CLAUDE.md Health Check
- Count lines. If over limit -> identify entries to compress or move
- Check structure: quick-scan rules at top, reference tables at bottom

### Prune Output Format
```
Memory Health Report

### Duplicates
| # | Topic | Found in | Canonical file | Action |
|---|-------|----------|---------------|--------|

### Contradictions
| # | Claim | File A | File B | Correct |
|---|-------|--------|--------|---------|

### Stale Entries
| # | Entry | File | Reason | Action |
|---|-------|------|--------|--------|

Total: X duplicates | Y contradictions | Z stale | W compactable

Apply fixes? (confirm which ones)
```

**IMPORTANT**: Do NOT make changes until user confirms. Report first, then fix.

---

## MODE: reflect

**Trigger**: `/memory reflect`, "learn from this", "remember the mistake"

### Purpose
Focused scan for user corrections, mistakes, and feedback.

### Correction Patterns to Detect

| Pattern | Example | Confidence |
|---------|---------|------------|
| Direct correction | "no, use X not Y", "that's wrong" | HIGH |
| Explicit negation | "don't do that", "stop doing X" | HIGH |
| Frustration signal | "I told you...", "you made a mistake" | HIGH |
| Implicit revert | User undoes your change, provides different approach | MEDIUM |
| Positive reinforcement | "perfect!", "exactly like that" | MEDIUM |

### Reflect Output Format
```
Reflect: Learning from Corrections

### Corrections Found
1. [HIGH] description -> written to [file]
2. [MEDIUM] description -> written to [file]

### Skipped (already known)
- [description] — already in [file] #[section]

Found: X | Written: Y | Skipped (dupes): Z

/memory reflect complete
```

---

## MODE: status

**Trigger**: `/memory status`, "show memory status"

### Status Output Format
```
Memory Status

| File | Lines | Entries | Modified |
|------|-------|---------|----------|
| CLAUDE.md | X | Y | YYYY-MM-DD |

Total: X files | Y lines | Z entries
CLAUDE.md: X/120 lines (OK/WARNING)
Auto-memory: present/absent (X/200 lines)

Last /memory update: [date or "never"]
```

---

## $ARGUMENTS Handling

| Command | Mode | Behavior |
|---------|------|----------|
| `/memory` | update | Full conversation scan + persist (default) |
| `/memory update` | update | Same as above |
| `/memory prune` | prune | Full health scan (report only) |
| `/memory prune --fix` | prune | Auto-apply safe fixes |
| `/memory reflect` | reflect | Correction capture only |
| `/memory status` | status | Show memory overview (no changes) |

---

## Guidelines

- **User corrections are gold** — always capture when user corrects Claude's behavior
- **Cross-reference, don't duplicate** — one source of truth per topic
- **Edit, don't rewrite** — surgical changes preserve existing structure
- **When in doubt, don't write** — better to miss a LOW learning than bloat memory
- **Never add secrets** — no tokens, keys, passwords in any file
- **Conservative pruning** — flag for review rather than auto-delete
- **Dates matter** — add "Added: YYYY-MM-DD" to new entries
- **Report before fix** — in prune mode, always show findings before making changes
