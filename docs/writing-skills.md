# Writing Contract-Maintenance Skills

## What Are Contract-Maintenance Skills?

In the Schema-First approach, skills don't implement business logic—they **maintain the contract layer** between your prototypes and the API. There are three types:

1. **schema-evolution** - Detects prototype changes, proposes schema updates
2. **concept-sync** - Keeps domain/behavior docs aligned with schema
3. **contract-validator** - Checks consistency across all artifacts

## Anatomy of a Contract-Maintenance Skill

### 1. Clear Purpose Statement

```markdown
# Schema Evolution Skill

You are an API contract specialist helping product teams keep their OpenAPI schema synchronized with UI prototype changes.
```

**Key:** State exactly what the skill does and who it helps.

### 2. Input Context

```markdown
## Input
You'll receive one or more of:
- **Prototype code changes**: New UI components or API calls
- **Explicit requests**: "Add priority field to tickets"
- **Prototype issues**: "Filter by assignee isn't working"
- **Current schema**: The existing api-contract.yaml
```

**Key:** Be explicit about what information the skill has access to.

### 3. Analysis Process

```markdown
## Analysis Process

1. **Detect the Need**
   - What is the prototype trying to do?
   - What API capability does it require?

2. **Review Current Schema**
   - Read schema/api-contract.yaml
   - Does this capability already exist?

3. **Design the Change**
   - Propose minimal schema change
   - Follow existing patterns
```

**Key:** Break down the thinking process into clear steps.

### 4. Output Format

```markdown
## Output Format

Return a proposal in this structure:

```markdown
## Proposed Schema Change

**Trigger**: [What prompted this]
**Analysis**: [What you found]
**Proposed Change**:
```yaml
[Exact YAML to add/modify]
```
**Impact**: [What needs updating]
```

**Key:** Make output actionable and easy to review/approve.

### 5. Guidelines and Principles

```markdown
## Schema Design Principles
- **Start simple**: Add fields as optional when unsure
- **Use standard types**: string, number, boolean, array
- **Enum when bounded**: Status, priority use enums
```

**Key:** Provide guardrails for decision-making.

### 6. Examples

```markdown
## Example 1: Adding a New Field

**Scenario**: Prototype adds priority dropdown

**Your Response**:
[Show complete example output]
```

**Key:** Concrete examples show the skill "in action".

---

## The Three Core Skills

### Schema Evolution Skill

**Purpose**: Detect when prototypes need schema changes and propose updates

**Key Sections**:
- Input context (prototype changes, current schema)
- Analysis process (detect → review → design → document)
- Output format (proposal with YAML changes)
- Guidelines (schema design principles)
- Examples (adding fields, endpoints, filters)

**When It Runs**:
- PM adds new feature to prototype
- PM explicitly requests schema update
- Automated detection finds gap between prototype and schema

**Good Output**:
```markdown
## Proposed Schema Change

**Trigger**: Prototype added priority field

**Proposed Change**:
```yaml
priority:
  type: string
  enum: [low, medium, high, critical]
```

**Impact**:
- Update schema/api-contract.yaml
- Regenerate types
- Update concept model
```

---

### Concept Sync Skill

**Purpose**: Keep domain/behavior documentation aligned with schema changes

**Key Sections**:
- Input context (schema changes, current docs)
- Analysis process (determine impact on domain/behavior model)
- Output format (doc updates with exact markdown)
- Guidelines (documentation style, when to update)
- Examples (new fields, new workflows, state changes)

**When It Runs**:
- After schema-evolution makes changes
- New workflows discovered in prototype
- Explicit request to update concept model

**Good Output**:
```markdown
## Proposed Concept Model Updates

**Trigger**: Priority field added to schema

**Proposed Changes**:

### domain-model.md
Add to Ticket attributes:
- **Priority**: Urgency level (low, medium, high, critical)

Add business rule:
- Priority defaults to "medium" when not specified
```

---

### Contract Validator Skill

**Purpose**: Validate consistency across schema, docs, types, and prototypes

**Key Sections**:
- Input context (all artifacts to validate)
- Validation checks (schema ↔ docs, schema ↔ prototype, etc.)
- Output format (structured report with issues)
- Severity levels (critical, warning, suggestion)
- Examples (full validation, post-change validation)

**When It Runs**:
- After major changes
- Before handoff to developers
- Regular checkpoints during development
- On-demand validation

**Good Output**:
```markdown
# Contract Validation Report

## Critical Issues
**0 critical issues found**

## Warnings
### 1. Domain Model Not Updated
**Problem**: Priority field in schema but not in domain-model.md
**Recommendation**: Run concept-sync skill

## Summary
Contract is 95% consistent. Only gap is priority documentation.
```

---

## Writing a Custom Contract-Maintenance Skill

You might want to add custom skills for your specific domain. Here's how:

### Example: Type Generator Skill

**Purpose**: Automatically regenerate TypeScript types when schema changes

```markdown
# Type Generator Skill

You are a TypeScript type generation specialist.

## Your Purpose

When the OpenAPI schema changes, regenerate TypeScript types to match.

## Input
- schema/api-contract.yaml (current OpenAPI schema)
- api/types/index.ts (existing types file)

## Process

1. Read the schema
2. For each component/schema, generate TypeScript interface
3. For each enum, generate TypeScript union type
4. Preserve any custom code comments
5. Write updated types file

## Output Format

```typescript
// Generated types (do not edit manually)
// Last generated: [timestamp]
// From: schema/api-contract.yaml

[Generated TypeScript code]
```

## Example

Input schema:
```yaml
components:
  schemas:
    Ticket:
      type: object
      properties:
        priority:
          type: string
          enum: [low, medium, high]
```

Output types:
```typescript
export type TicketPriority = 'low' | 'medium' | 'high'

export interface Ticket {
  priority: TicketPriority
}
```
```

### Example: Mock API Generator Skill

**Purpose**: Update mock API when schema changes

```markdown
# Mock API Generator Skill

Generate mock API implementation from OpenAPI schema.

## Input
- schema/api-contract.yaml
- api/mock-server/[entity].ts (existing mock)

## Process

1. Read schema endpoints and operations
2. Generate endpoint handlers matching the contract
3. Use reasonable mock data following schema types
4. Implement filtering/sorting from query params

## Output

Updated mock API file with implementations for all endpoints.
```

---

## Best Practices

### Keep Skills Focused

**Good**: One skill per maintenance task
```
✅ schema-evolution.md - Proposes schema changes
✅ concept-sync.md - Updates documentation
✅ contract-validator.md - Validates consistency
```

**Bad**: One mega-skill for everything
```
❌ contract-manager.md - Does everything
```

### Make Output Actionable

**Good**: Exact changes to make
```markdown
**Proposed Change**:
```yaml
# In components/schemas/Ticket, add:
priority:
  type: string
  enum: [low, medium, high]
```

**Bad**: Vague suggestions
```markdown
"You should probably add a priority field somewhere"
```

### Provide Context

**Good**: Explain why
```markdown
**Trigger**: Prototype added priority field to ticket form
**Rationale**: Users need to indicate urgency
```

**Bad**: Just state what
```markdown
"Add priority field"
```

### Use Consistent Terminology

**Across all skills:**
- "Schema" = OpenAPI YAML file
- "Contract" = API schema + concept model
- "Prototype" = UI code being built
- "Domain model" = Entity descriptions and business rules
- "Behavior model" = Workflow and interaction descriptions

### Include Validation

**Good**: Check before proposing
```markdown
2. **Review Current Schema**
   - Read schema/api-contract.yaml
   - Does this capability already exist?
   - If yes, note it and don't duplicate
```

**Bad**: Propose blindly
```markdown
"Add the field"
(Might already exist!)
```

---

## Testing Your Skills

### Manual Testing

```bash
# In Claude Code, invoke a skill
/schema-evolution "Add priority field to tickets"

# Review the output
# Does it propose the right changes?
# Is the YAML correct?
# Is the impact checklist complete?
```

### Validation Testing

```bash
# Make a change to schema
# Run concept-sync
# Then run contract-validator
# Does it catch any issues?
```

### Iteration Testing

```bash
# Simulate a complete workflow:
1. Update prototype code
2. Run schema-evolution
3. Run concept-sync
4. Run contract-validator
5. Check all artifacts are consistent
```

---

## Skill Evolution

Skills themselves evolve. Here's how:

### Version 1: Basic Schema Evolution

```markdown
# Schema Evolution Skill

Detect prototype changes and propose schema updates.

[Basic instructions]
```

### Version 2: Add Evolution Tracking

```markdown
# Schema Evolution Skill

...existing content...

## Document the Evolution
- Add entry to schema/evolution-log.md
- Include trigger, change, rationale, impact
```

### Version 3: Add Proactive Detection

```markdown
# Schema Evolution Skill

...existing content...

## When to Be Proactive
- You see prototype code making API calls not in schema
- You see form fields that don't map to schema properties
```

**Key**: Skills get better with use. Update them based on real usage patterns.

---

## Common Patterns

### Pattern: Change Detection

Many skills need to detect changes. Common approach:

```markdown
1. Read current state (schema, docs, code)
2. Identify what's different or missing
3. Propose specific changes
4. List impact on other artifacts
```

### Pattern: Consistency Checking

Validation skills share this pattern:

```markdown
1. Read all relevant artifacts
2. Check cross-references
3. Identify mismatches
4. Report severity and fix recommendations
```

### Pattern: Documentation Updates

Doc-updating skills share this pattern:

```markdown
1. Identify what changed in source of truth (schema)
2. Find corresponding sections in docs
3. Propose exact markdown updates
4. Maintain doc structure and style
```

---

## Key Takeaways

1. **Contract-maintenance skills are different** - They maintain artifacts, not business logic
2. **Output must be actionable** - Exact changes, not vague suggestions
3. **Always provide context** - Why is this change needed?
4. **Check before proposing** - Don't duplicate existing functionality
5. **Maintain consistency** - Use same terminology across all skills
6. **Test the workflow** - Skills should work together smoothly

---

## Next Steps

- Study the three core skills in [.claude/skills/](./.claude/skills/)
- Try invoking them on the example ticketing system
- Customize them for your domain if needed
- Create additional skills for your specific automation needs

The goal is **automated contract maintenance** so you can focus on building great prototypes while keeping the API contract aligned.
