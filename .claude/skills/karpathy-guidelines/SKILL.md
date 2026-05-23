---
name: karpathy-guidelines
description: |
  Behavioral guidelines based on Andrej Karpathy's principles to reduce common LLM coding mistakes.
  Enforces: Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution.
  Source: https://github.com/multica-ai/andrej-karpathy-skills
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Karpathy Guidelines — Reduce Common LLM Coding Mistakes

Behavioral guidelines to reduce common LLM coding mistakes. These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

Before implementing, surface assumptions explicitly. When uncertainty exists, ask rather than guess. If multiple interpretations arise, present them openly rather than choosing silently.

**Checklist before writing any code:**
- [ ] What exactly is being asked? State it back in one sentence.
- [ ] Are there ambiguities? Name them.
- [ ] Is there a simpler solution I'm overlooking?
- [ ] What could go wrong?

## 2. Simplicity First

Minimum code that solves the problem — nothing speculative. No unrequested features, abstractions, or flexibility. Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

**Anti-patterns to avoid:**
- Adding helper functions "for future use"
- Creating abstractions before 3+ use cases exist
- Building configuration options that nobody asked for
- Writing defensive code for impossible scenarios

## 3. Surgical Changes

Touch only what's necessary. When editing existing code, match the existing style without "improving" adjacent code. Remove imports/variables/functions that *your* changes made unused, but leave pre-existing dead code alone unless asked.

**The core test:** "Every changed line should trace directly to the user's request."

**Before committing any edit:**
- Map each changed line to a specific requirement
- Reject changes that are "nice to have" but not requested
- Preserve existing patterns even if you'd do it differently

## 4. Goal-Driven Execution

Transform tasks into verifiable goals:
- "Fix the bug" → reproduce it with a test, then make it pass
- "Refactor X" → confirm tests pass before and after
- "Add feature Y" → define what "done" looks like first

For multi-step tasks, state a brief plan with explicit verification steps at each stage.

**Verification template:**
```
Goal: [what done looks like]
Steps: [ordered list]
Verify each step: [how to confirm it worked]
```

---

**Success signal:** Clarifying questions come *before* implementation rather than after mistakes.
