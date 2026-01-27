# Schema-First Starter Template

**Keep your API contract and concept model synchronized with your prototypes.**

## The Problem

When building prototypes:
1. 🎨 **Product teams** build sophisticated, interactive prototypes
2. 📹 **Developers** receive videos and prototype code
3. 🔍 **Developers** must reverse-engineer the implied API contract
4. 📝 **Schema gets documented** after the fact (if at all)
5. ⚠️ **Misalignment** between prototype and implementation

Result: **Long translation time from prototype to production API**

## The Solution

**Maintain the contract layer as you prototype:**

```
┌─────────────────────────────────────────┐
│  UI Prototypes (React/etc)              │ ← Build here
├─────────────────────────────────────────┤
│  API Contract (OpenAPI)                 │ ← Skills maintain
├─────────────────────────────────────────┤
│  Concept Model (domain + behavior docs) │ ← Skills maintain
├─────────────────────────────────────────┤
│  Types & Mock API (generated)           │ ← Generated
└─────────────────────────────────────────┘
```

### How It Works

As your prototype evolves, **AI skills automatically keep your API schema and concept model in sync**:

1. **Build prototype**: Add features using regular React/TypeScript
2. **AI detects changes**: "I see you added a priority field"
3. **AI proposes schema update**: Shows exact OpenAPI changes needed
4. **You approve**: Quick review and approval
5. **AI updates artifacts**: Schema → concept docs → types all synchronized
6. **Keep prototyping**: Contract stays aligned automatically

### What Developers Receive

Instead of reverse-engineering your prototype, developers get:

- ✅ **Complete OpenAPI schema** defining the exact API contract
- ✅ **Domain model** explaining entities, relationships, and business rules
- ✅ **Behavior model** documenting workflows and state transitions
- ✅ **Evolution log** showing how requirements emerged and why
- ✅ **Working prototype** already using the real API shape

**Result:** Shorter time from prototype to production API.

---

## Quick Start

### Option A: Run the Ticketing Example (Recommended First Step)

See how the Schema-First workflow works with a complete example:

```bash
# Clone this repo
git clone <your-repo-url>
cd skills-first-starter

# Navigate to the ticketing example
cd examples/ticketing-system/ui

# Install and run
npm install
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to see the working ticketing system.

Explore the example artifacts:
- [examples/ticketing-system/schema/](./examples/ticketing-system/schema/) - Complete API contract
- [examples/ticketing-system/concept-model/](./examples/ticketing-system/concept-model/) - Domain and behavior docs
- [examples/ticketing-system/ui/](./examples/ticketing-system/ui/) - Working React prototype

See the [example README](./examples/ticketing-system/README.md) for more details.

---

### Option B: Start Your Own Project

Use the clean template for your domain:

```bash
# From the root of the repo
cd ui
npm install
npm run dev
```

The top-level folders are clean placeholders:
- `schema/` - Empty API contract (replace with your domain)
- `concept-model/` - Template docs (fill in your entities/workflows)
- `api/` - Empty types and mock server (generate from your schema)
- `ui/` - Clean React starter (build your prototype)

**Next Steps:**
1. Define your initial schema in [schema/api-contract.yaml](./schema/api-contract.yaml)
2. Start building your prototype in [ui/src/pages/](./ui/src/pages/)
3. Use the skills (schema-evolution, concept-sync, contract-validator) to keep artifacts aligned

---

### Try the Skills

Whether using the example or your own project, you can invoke the contract-maintenance skills:

```bash
# Detect schema needs and propose updates
/schema-evolution "Add priority field to tickets"

# Keep concept model synchronized
/concept-sync "Update docs for priority field"

# Validate consistency across artifacts
/contract-validator "Full contract validation"
```

See [docs/workflow-walkthrough.md](./docs/workflow-walkthrough.md) for a complete walkthrough with examples.

---

## Project Structure

```
skills-first-starter/
├── schema/                         # YOUR API contract (clean template)
│   ├── api-contract.yaml           # OpenAPI 3.1 schema
│   └── evolution-log.md            # Schema change history
├── concept-model/                  # YOUR domain docs (clean template)
│   ├── domain-model.md             # Entities, relationships, business rules
│   └── behavior-model.md           # Workflows, state transitions
├── api/                            # Generated artifacts (empty until you generate)
│   ├── types/                      # TypeScript types from schema
│   └── mock-server/                # Mock API implementation
├── ui/                             # YOUR prototype UI (clean starter)
│   └── src/
│       ├── pages/                  # React pages for your domain
│       └── ...                     # Vite + React + Sailwind setup
├── .claude/skills/                 # Contract-maintenance skills (ready to use)
│   ├── schema-evolution.md         # Detects changes, proposes schema updates
│   ├── concept-sync.md             # Keeps docs synchronized
│   └── contract-validator.md       # Validates consistency
├── examples/                       # Complete working examples
│   └── ticketing-system/           # Ticketing app example (run this first!)
│       ├── schema/                 # Example API contract
│       ├── concept-model/          # Example domain docs
│       ├── api/                    # Example types and mock API
│       └── ui/                     # Example React prototype
└── docs/                           # Documentation
    ├── workflow-walkthrough.md     # Step-by-step guide
    ├── comparison.md               # Schema-First vs Traditional
    └── writing-skills.md           # How to write contract-maintenance skills
```

**Key Distinction:**
- **Top-level folders** = Your project (clean placeholders)
- **examples/** = Working examples to learn from (ticketing system)

---

## Core Workflow

### The Contract-First Loop

```
1. Build Prototype
      ↓
2. AI Detects Schema Need
      ↓
3. Review & Approve Schema Change
      ↓
4. AI Updates Artifacts
      ↓
5. Validate Consistency
      ↓
   Continue Building
```

### Skills Reference

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| **schema-evolution** | Keeps API schema aligned with prototype | Prototype adds fields, endpoints, or filters |
| **concept-sync** | Keeps domain/behavior docs synchronized | After schema changes or workflow additions |
| **contract-validator** | Checks consistency across all artifacts | Before handoff or periodically during development |

### Typical Development Session

```bash
# 1. Start with validated contract
/contract-validator "Pre-session validation"

# 2. Build prototype features
# (Add priority filtering, comments, bulk updates, etc.)

# 3. Update schema as you go
/schema-evolution "Add priority filtering to tickets"

# 4. Sync concept model
/concept-sync "Update docs for priority filtering"

# 5. Validate before wrapping up
/contract-validator "Final validation"
```

---

## Learn More

### Documentation

- **[Workflow Walkthrough](./docs/workflow-walkthrough.md)** - Complete example with iterations
- **[Comparison: Schema-First vs Traditional](./docs/comparison.md)** - Why this approach works
- **[Writing Skills Guide](./docs/writing-skills.md)** - How to write contract-maintenance skills

### Example Use Cases

This approach works well for:
- **Internal tools**: Prototyping admin dashboards, management interfaces
- **API-driven apps**: When you need clear contracts between frontend and backend teams
- **Product validation**: Rapid prototyping with built-in documentation
- **Design systems**: Exploring interaction patterns while maintaining schema

### Adapting to Your Domain

1. **Replace the example**: Delete the ticketing example, start fresh
2. **Define initial schema**: Create minimal API contract for your domain
3. **Build prototype**: Use generated types, keep it simple
4. **Let skills help**: As you add features, schema-evolution keeps contract aligned
5. **Iterate**: Build → detect → approve → update → validate → repeat

---

## Why This Approach?

### Traditional: Prototype → Reverse Engineer

```
Week 1-2: Build prototype with mock data
Week 3: Document "what we built"
Week 4: Developers interpret prototype
Week 5+: Back-and-forth to clarify intent
```

### Schema-First: Prototype + Contract Together

```
Week 1-2: Build prototype (AI maintains schema in parallel)
Week 3: Handoff complete schema + concept model + working prototype
Week 4+: Developers implement (clear contract, fewer questions)
```

**Key Difference:** Contract maintenance happens **during** prototyping, not **after**.

---

## Technology Stack

### Prototype UI
- **React 19** + **TypeScript** + **Vite**
- **Sailwind Components** - SAIL-like component library
- **Aurora Color Palette** - Pre-configured design system

### Contract Layer
- **OpenAPI 3.1** - Industry-standard API schema
- **TypeScript Types** - Generated from schema
- **Mock Server** - Simple in-memory API for prototyping

### Skills (AI Automation)
- **schema-evolution** - Schema change detection and proposal
- **concept-sync** - Documentation synchronization
- **contract-validator** - Consistency checking

---

## Getting Help

- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Share your use cases and ask questions
- **Examples**: See `docs/workflow-walkthrough.md` for detailed examples

---

## Contributing

This template is designed to be adapted to your needs. Key customization points:

1. **Your domain schema**: Replace ticketing example with your entities
2. **Your UI patterns**: Adapt React components to your design system
3. **Your workflows**: Extend skills for domain-specific automation

---

## License

MIT - Use freely for prototyping and production projects.

---

## Quick Reference

### Common Commands

```bash
# Start prototype UI
cd ui && npm run dev

# Validate contract consistency
# In Claude Code: /contract-validator

# Update schema after prototype changes
# In Claude Code: /schema-evolution [description]

# Sync concept model with schema
# In Claude Code: /concept-sync [what changed]
```

### Key Files

- 📄 [schema/api-contract.yaml](./schema/api-contract.yaml) - Your API contract
- 📖 [concept-model/domain-model.md](./concept-model/domain-model.md) - Domain concepts
- 🔄 [concept-model/behavior-model.md](./concept-model/behavior-model.md) - Workflows
- 📝 [schema/evolution-log.md](./schema/evolution-log.md) - Change history

---

**Ready to prototype with confidence?** Start with the [workflow walkthrough](./docs/workflow-walkthrough.md) to see the full process in action.
