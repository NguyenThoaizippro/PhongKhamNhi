---
name: strategic-compact
description: |
  Prevents context disruption by triggering /compact at strategic intervals rather than
  letting auto-compaction interrupt mid-task. Use for long sessions exceeding 100k tokens.
  Monitors context usage and recommends optimal compact timing.
  Triggers: "/strategic-compact", "kiểm tra context", "nên compact không"
allowed-tools: Bash
---

# /strategic-compact — Smart Context Compaction Timing

Prevents auto-compaction from interrupting you mid-task by surfacing the right moment to compact manually.

## When to Compact (Optimal Windows)

**Green light — compact now:**
- Between major phases (research done, about to implement)
- After completing a milestone (feature X done, moving to Y)
- Before starting a complex multi-file operation
- After resolving a difficult bug
- Context is 60-75% full and no active task is half-done

**Red light — do NOT compact:**
- Mid-way through writing a file
- While debugging an active error
- After asking a question but before getting the answer
- When you have unsaved decisions in the conversation

## Context Health Check

Run this to see current context status:

```bash
# Check conversation length proxy (message count)
# In Claude Code, use /status or observe the context bar
```

**Rule of thumb by session length:**
| Session size | Action |
|-------------|--------|
| < 50k tokens | Continue normally |
| 50-100k tokens | Watch for natural break points |
| 100-150k tokens | Compact at next milestone |
| > 150k tokens | Compact immediately at first pause |

## Strategic Compact Protocol

### Step 1: Assess
Before recommending compact, answer:
- Is there an active half-completed task? (If yes → finish it first)
- Are there unsaved decisions? (If yes → note them in CLAUDE.md first)
- What phase are we in? (Research / Planning / Implementation / Testing)

### Step 2: Pre-compact Checklist
Before running `/compact`:
```
[ ] Current file edits are saved
[ ] No pending tool calls
[ ] Key decisions written to CLAUDE.md or memory
[ ] Note the "next task" clearly so compact summary includes it
```

### Step 3: Compact with Context
Instead of bare `/compact`, frame it:
```
/compact
Note: We just finished [X]. Next task is [Y]. Key decision: [Z].
```

This guides the compaction summary to preserve what matters.

### Step 4: Post-compact Verify
After compacting, confirm:
- The summary mentions the current task
- Key file paths are preserved
- The "next task" is clear

## Usage

```
/strategic-compact
```

Claude will assess context health and either:
- Recommend compacting now (with pre-compact checklist)
- Recommend waiting (and tell you when to check again)
- Execute the compact if you confirm
