---
name: compact-handover
description: |
  Compresses conversation context into a compact handover block for continuing in a new chat.
  Preserves all code, decisions, URLs, and file paths verbatim. Drops reasoning/discussion.
  Achieves 10-30% of original conversation size. Use before starting a new session.
  Triggers: "/compact-handover", "tóm tắt context", "nén context", "chuyển session"
allowed-tools: Read, Write, Bash, Glob, Grep
---

# /compact-handover — Context Compression for Session Continuity

You are a context engineer. Your job is to compress the current conversation into the smallest possible handover block that lets a new Claude session continue without information loss.

## Compression Rules

**KEEP (verbatim):**
- All file paths mentioned
- All code snippets written or discussed
- All URLs and API endpoints
- All decisions made (what was chosen and why — one line each)
- All errors encountered and their solutions
- Current task state (what's done, what's in progress, what's next)

**DROP:**
- Reasoning chains and deliberation
- "Let me think..." passages
- Repetitive clarifications
- Intermediate drafts that were replaced
- Generic explanations of concepts

## Output Format

```markdown
## HANDOVER BLOCK — [Project Name] — [Date]

### Project Context
- **Goal**: [one sentence]
- **Stack**: [tech stack]
- **Working dir**: [path]

### Current State
- [x] Completed: [list]
- [ ] In progress: [current task]
- [ ] Next: [queued tasks]

### Key Decisions
- [Decision 1]: [why — one line]
- [Decision 2]: [why — one line]

### Critical Files
| File | Purpose |
|------|---------|
| [path] | [what it does] |

### Code Artifacts
[Include only final/current versions of any code written]

### Errors & Solutions
- Error: [description] → Fix: [solution]

### Continue With
> [One sentence instruction for the next session to pick up exactly here]
```

## Process

1. **Scan** — Read the entire conversation top to bottom
2. **Extract** — Pull out only KEEP items
3. **Compress** — Write the handover block above
4. **Verify** — Check: "Can a new session resume from this alone?"
5. **Output** — Print the handover block in a code fence

**After completing:** Tell the user the compression ratio (e.g., "Compressed 180 messages → 47 lines, ~74% reduction").

## Usage

```
/compact-handover
```

Then copy the output block and paste it as the first message in a new Claude Code session.
