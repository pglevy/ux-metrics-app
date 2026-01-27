---
description: Identify underspecified areas in the current feature spec by asking up to 5 highly targeted clarification questions and encoding answers back into the spec.
inclusion: manual
---

## Goal

Detect and reduce ambiguity or missing decision points in the active feature specification and record the clarifications directly in the spec file.

This clarification workflow should run BEFORE creating a technical plan. If the user is doing an exploratory spike, you may skip this, but warn that downstream rework risk increases.

## Execution Steps

### 1. Locate the Spec File

Ask the user which spec file to analyze, or look for common patterns:
- `spec.md` in current directory
- `docs/spec.md`
- User-specified path

If no spec file exists, inform the user and stop.

### 2. Scan for Ambiguities

Load the spec and perform a structured ambiguity scan using this taxonomy. For each category, mark status: Clear / Partial / Missing.

**Functional Scope & Behavior:**
- Core user goals & success criteria
- Explicit out-of-scope declarations
- User roles / personas differentiation

**Domain & Data Model:**
- Entities, attributes, relationships
- Identity & uniqueness rules
- Lifecycle/state transitions
- Data volume / scale assumptions

**Interaction & UX Flow:**
- Critical user journeys / sequences
- Error/empty/loading states
- Accessibility or localization notes

**Non-Functional Quality Attributes:**
- Performance (latency, throughput targets)
- Scalability (horizontal/vertical, limits)
- Reliability & availability (uptime, recovery expectations)
- Observability (logging, metrics, tracing signals)
- Security & privacy (authN/Z, data protection, threat assumptions)
- Compliance / regulatory constraints (if any)

**Integration & External Dependencies:**
- External services/APIs and failure modes
- Data import/export formats
- Protocol/versioning assumptions

**Edge Cases & Failure Handling:**
- Negative scenarios
- Rate limiting / throttling
- Conflict resolution (e.g., concurrent edits)

**Constraints & Tradeoffs:**
- Technical constraints (language, storage, hosting)
- Explicit tradeoffs or rejected alternatives

**Terminology & Consistency:**
- Canonical glossary terms
- Avoided synonyms / deprecated terms

**Completion Signals:**
- Acceptance criteria testability
- Measurable Definition of Done indicators

**Misc / Placeholders:**
- TODO markers / unresolved decisions
- Ambiguous adjectives ("robust", "intuitive") lacking quantification

For each category with Partial or Missing status, add a candidate question unless:
- Clarification would not materially change implementation or validation strategy
- Information is better deferred to planning phase

### 3. Generate Clarification Questions

Create a prioritized queue of up to 5 clarification questions. Apply these constraints:

- Each question must be answerable with EITHER:
  - A short multiple-choice selection (2-5 distinct options), OR
  - A one-word / short-phrase answer (<=5 words)
- Only include questions whose answers materially impact architecture, data modeling, task decomposition, test design, UX behavior, operational readiness, or compliance validation
- Ensure category coverage balance: cover highest impact unresolved categories first
- Exclude questions already answered, trivial stylistic preferences, or plan-level execution details
- Favor clarifications that reduce downstream rework risk

### 4. Interactive Questioning Loop

Present EXACTLY ONE question at a time.

**For multiple-choice questions:**
- **Analyze all options** and determine the **most suitable option** based on:
  - Best practices for the project type
  - Common patterns in similar implementations
  - Risk reduction (security, performance, maintainability)
  - Alignment with any explicit project goals or constraints visible in the spec
- Present your **recommended option prominently** at the top with clear reasoning (1-2 sentences)
- Format as: `**Recommended:** Option [X] - <reasoning>`
- Then render all options as a Markdown table:

| Option | Description |
|--------|-------------|
| A | <Option A description> |
| B | <Option B description> |
| C | <Option C description> |

- After the table, add: `You can reply with the option letter (e.g., "A"), accept the recommendation by saying "yes" or "recommended", or provide your own short answer.`

**For short-answer questions:**
- Provide your **suggested answer** based on best practices and context
- Format as: `**Suggested:** <your proposed answer> - <brief reasoning>`
- Then output: `Format: Short answer (<=5 words). You can accept the suggestion by saying "yes" or "suggested", or provide your own answer.`

**After the user answers:**
- If the user replies with "yes", "recommended", or "suggested", use your previously stated recommendation/suggestion
- Otherwise, validate the answer maps to one option or fits the <=5 word constraint
- If ambiguous, ask for quick disambiguation (doesn't count as new question)
- Once satisfactory, record it and move to the next question

**Stop asking when:**
- All critical ambiguities resolved early, OR
- User signals completion ("done", "good", "no more"), OR
- You reach 5 asked questions

Never reveal future queued questions in advance.

### 5. Integrate Answers into Spec

After EACH accepted answer:

- For the first answer in this session:
  - Ensure a `## Clarifications` section exists (create it after the overview section if missing)
  - Under it, create a `### Session YYYY-MM-DD` subheading for today
- Append: `- Q: <question> → A: <final answer>`
- Then immediately apply the clarification to the most appropriate section(s):
  - Functional ambiguity → Update Functional Requirements
  - User interaction / actor distinction → Update User Stories or Actors subsection
  - Data shape / entities → Update Data Model (add fields, types, relationships)
  - Non-functional constraint → Add/modify measurable criteria in Non-Functional / Quality Attributes
  - Edge case / negative flow → Add to Edge Cases / Error Handling section
  - Terminology conflict → Normalize term across spec
- If the clarification invalidates an earlier ambiguous statement, replace it instead of duplicating
- Save the spec file AFTER each integration
- Preserve formatting: don't reorder unrelated sections; keep heading hierarchy intact
- Keep each inserted clarification minimal and testable

### 6. Validation

After EACH write plus final pass:
- Clarifications session contains exactly one bullet per accepted answer (no duplicates)
- Total asked questions ≤ 5
- Updated sections contain no lingering vague placeholders
- No contradictory earlier statement remains
- Markdown structure valid
- Terminology consistency: same canonical term used across all updated sections

### 7. Report Completion

After questioning loop ends:
- Number of questions asked & answered
- Path to updated spec
- Sections touched (list names)
- Coverage summary table listing each taxonomy category with Status:
  - **Resolved** (was Partial/Missing and addressed)
  - **Deferred** (exceeds question quota or better suited for planning)
  - **Clear** (already sufficient)
  - **Outstanding** (still Partial/Missing but low impact)
- If any Outstanding or Deferred remain, recommend whether to proceed to planning or run clarification again
- Suggested next steps

## Behavior Rules

- If no meaningful ambiguities found, respond: "No critical ambiguities detected worth formal clarification." and suggest proceeding
- If spec file missing, inform user and stop
- Never exceed 5 total asked questions (clarification retries for a single question don't count as new questions)
- Avoid speculative tech stack questions unless the absence blocks functional clarity
- Respect user early termination signals ("stop", "done", "proceed")
- If no questions asked due to full coverage, output a compact coverage summary then suggest advancing
- If quota reached with unresolved high-impact categories remaining, explicitly flag them under Deferred with rationale
