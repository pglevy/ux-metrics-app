# Schema-First vs Traditional Prototyping

## The Core Problem

When building prototypes for API-driven applications, there's always a gap between the prototype and the production API. The question is: when and how do you bridge that gap?

---

## Side-by-Side: Building a Ticketing System

### Traditional Prototyping

**Week 1-2: Build Prototype**
```typescript
// Quick prototype with mock data
const mockTickets = [
  {
    id: 1,
    title: "Fix login bug",
    priority: "high",
    status: "open",
    assignee: "Alice"
  }
]

// UI components with inline data
function TicketList() {
  const [tickets] = useState(mockTickets)
  // Rapid UI iteration, no API contract
}
```

**Week 3: Documentation Phase**
```
PM creates:
- Screenshots of prototype behavior
- Video walkthroughs
- Written requirements: "Users need to filter by priority"
- Notes: "Priority should be an enum: low, medium, high"
```

**Week 4: Developer Interpretation**
```
Developers receive:
- Videos of prototype
- Prototype code with mock data everywhere
- Written requirements (may conflict with code)

Developers must:
- Reverse-engineer implied API contract
- Guess data types from UI behavior
- Infer validation rules from form fields
- Ask clarifying questions (more meetings!)
```

**Week 5+: Implementation & Misalignment**
```
Developer creates:
GET /tickets?status=open

PM expected:
GET /tickets?priority=high&status=open

Result: Back-and-forth to align expectations
```

**Total Time to Clear API Contract: 5-6 weeks**

---

### Schema-First Prototyping

**Week 1: Prototype + Schema Together**
```yaml
# As you build prototype, AI maintains schema
paths:
  /tickets:
    get:
      summary: List tickets
      parameters:
        - name: status
          schema:
            type: string
            enum: [open, in_progress, closed]
```

```typescript
// Prototype uses generated types from schema
import type { Ticket, TicketStatus } from '../api/types'

function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  // Uses real API types, not inline mocks
}
```

**PM adds priority filter to UI:**
```typescript
<SelectField
  options={["low", "medium", "high"]}
  onChange={handlePriorityChange}
/>
```

**AI skill detects schema gap:**
```markdown
## Proposed Schema Change

**Trigger**: Prototype uses priority filter but schema doesn't support it

**Proposed Change**:
```yaml
- name: priority
  in: query
  schema:
    type: string
    enum: [low, medium, high]
```

**PM Reviews & Approves**: "Yes, add that"

**Artifacts Auto-Updated**:
- ✅ schema/api-contract.yaml
- ✅ concept-model/domain-model.md (priority documented)
- ✅ api/types/index.ts (types regenerated)
- ✅ schema/evolution-log.md (change tracked)

**Week 2: Continue Building**
```
Prototype evolves:
- Add comments feature → Schema updated
- Add bulk operations → Schema updated
- Add filtering → Schema updated

Contract stays synchronized automatically
```

**Week 3: Developer Handoff**
```
Developers receive:
- Complete OpenAPI schema
- Domain model explaining concepts
- Behavior model explaining workflows
- Evolution log showing decision rationale
- Working prototype using real API shape

Developers implement:
- No guessing needed
- Clear contract to follow
- Fewer clarifying questions
```

**Total Time to Clear API Contract: 3 weeks**
**(Contract evolves during prototyping, not after)**

---

## Key Differences

### Where Requirements Come From

| Aspect | Traditional | Schema-First |
|--------|------------|--------------|
| **Requirements Source** | Written docs, meetings | Prototype behavior + AI analysis |
| **Schema Definition** | After prototype is done | During prototype development |
| **Type Safety** | Mock data in prototype | Real types from contract |
| **Documentation** | Manual, often outdated | Auto-synchronized with schema |
| **Developer Input** | Interpret prototype videos | Implement clear contract |

### Adding a New Feature: "Priority Filter"

**Traditional Approach:**

```
1. PM adds priority dropdown to prototype (mock data)
2. PM documents: "Add priority query param to API"
3. Developer asks: "What are the allowed values?"
4. PM responds: "low, medium, high"
5. Developer asks: "Can you filter by multiple?"
6. PM responds: "No, just one"
7. Developer implements API
8. Developer asks: "Should it be case-sensitive?"
9. More back-and-forth...

Time: 3-5 days of scattered communication
```

**Schema-First Approach:**

```
1. PM adds priority dropdown to prototype
2. AI detects: "Prototype uses priority filter not in schema"
3. AI proposes: "Add priority query param (enum: low, medium, high)"
4. PM reviews: "Approved"
5. AI updates: Schema + docs + types
6. PM continues building prototype

Later, when developers implement:
7. Developer reads schema: "priority is a string enum, single value"
8. Developer implements API to match contract

Time: 15 minutes, no communication overhead
```

### Handling Changes

**Traditional:**
```
Change request: "Add priority field"

Steps:
1. Update prototype mockups
2. Update documentation
3. Update requirements
4. Notify developers
5. Developers update API design
6. Update API documentation
7. Update types/validation
8. Hope everything aligns

Artifacts often drift out of sync
```

**Schema-First:**
```
Change request: "Add priority field"

Steps:
1. Update prototype
2. Run schema-evolution skill
3. Approve changes
4. All artifacts updated automatically

Contract stays synchronized
```

---

## What Gets Handed to Developers

### Traditional Handoff

```
Prototype Package:
📹 Video walkthrough (12 minutes)
📸 Screenshots (23 images)
📝 Written requirements (15 pages)
💻 Prototype code (with mock data everywhere)
❓ Implied API contract (must be reverse-engineered)

Developer must:
- Watch videos
- Read requirements
- Study prototype code
- Infer API endpoints, data types, validation rules
- Ask clarifying questions
- Write API spec themselves
```

### Schema-First Handoff

```
Prototype Package:
📄 OpenAPI Schema (definitive API contract)
📖 Domain Model (entities, relationships, rules)
🔄 Behavior Model (workflows, state transitions)
📝 Evolution Log (how requirements emerged and why)
💻 Prototype code (using generated types from schema)

Developer can:
- Read schema to understand API contract
- Generate server stubs from schema
- Implement endpoints with clear specifications
- Validate against contract
- Minimal clarifying questions needed
```

---

## Time Comparison: 8-Week Project

### Traditional Prototyping

```
Week 1-2: Build prototype with mock data
Week 3: Document what was built (screenshots, videos, notes)
Week 4: Developers study prototype and ask questions
Week 5: Developers write API spec from interpretation
Week 6: PM reviews API spec, finds gaps
Week 7: Align on API contract
Week 8: Begin implementation

Time to Start Implementation: 8 weeks
Misalignments Discovered: Many (during implementation)
```

### Schema-First Prototyping

```
Week 1-2: Build prototype (schema evolves in parallel)
Week 3: Continue prototyping (contract stays aligned)
Week 4: Developers receive complete API contract
Week 5-8: Developers implement (clear contract, fewer questions)

Time to Start Implementation: 4 weeks
Misalignments Discovered: Few (caught during prototyping)
```

**Result: 4 weeks saved, fewer misalignments**

---

## Common Objections Answered

### "Our prototypes change constantly. Maintaining a schema will slow us down."

**Response:** Schema-First actually speeds up change:
- Change prototype → AI proposes schema update → Approve → Done
- No manual documentation lag
- Contract stays aligned automatically
- Developers always have latest contract

### "We don't know the API structure yet. How can we write a schema?"

**Response:** Start minimal, evolve incrementally:
- Week 1: Basic schema (just core entities)
- Week 2: Add fields as prototype needs them
- Week 3: Add filtering/sorting as UI requires it
- Schema grows with understanding, not ahead of it

### "Our developers prefer to design the API themselves."

**Response:** Developers still own the implementation:
- Schema defines **what** (contract)
- Developers decide **how** (implementation)
- Schema prevents misalignment
- Developers spend less time on requirements clarification

### "We already use Figma/design tools. Isn't that enough?"

**Response:** Figma shows UI, not API contract:
- Figma: visual design and interaction
- Schema: data structure, validation, endpoints
- Both are valuable, serve different purposes
- Schema ensures prototype and API align

---

## When to Use Schema-First

### Great Fit

- ✅ Building API-driven applications
- ✅ Frontend and backend teams work in parallel
- ✅ Prototypes need to evolve rapidly
- ✅ Handoff between product and engineering teams
- ✅ Need clear contracts between teams
- ✅ Product team can review and approve schema changes

### Not Needed

- ❌ Pure static websites (no API)
- ❌ Single developer building everything
- ❌ API is already well-defined (just building UI)
- ❌ Prototype is purely for visual design feedback

---

## Real-World Benefits

### Communication

**Traditional:**
- "The video shows filtering by priority"
- "What are the allowed priority values?"
- "How is it validated?"
- "Can you filter by multiple priorities?"
- *(More meetings to clarify)*

**Schema-First:**
- OpenAPI schema shows exact structure
- Enum values are explicit
- Validation rules are clear
- No ambiguity, fewer meetings

### Consistency

**Traditional:**
- Prototype uses "assignee"
- Docs say "assigned_to"
- API implements "assignedTo"
- Frontend expects "owner"
- *(Misalignment)*

**Schema-First:**
- Schema defines "assignee" as the field name
- Generated types use "assignee"
- Prototype uses "assignee"
- API implements "assignee"
- *(Alignment)*

### Evolution Tracking

**Traditional:**
- Change history: scattered in emails, meetings, Slack
- "Why did we add this field?" - no one remembers
- Decision rationale: lost

**Schema-First:**
- evolution-log.md tracks all changes
- Each change includes trigger and rationale
- "Why did we add priority?" - check the log
- Decision history: preserved

---

## The Bottom Line

### Traditional Prototyping
**Prototype first → Document later → Developers interpret → Implement → Discover misalignment**

### Schema-First Prototyping
**Prototype + Contract together → Developers implement → Alignment maintained**

Both approaches build prototypes. **Schema-First just maintains the contract as you go**, preventing the translation gap between prototype and production API.

**Time saved:** 2-4 weeks on a typical project
**Misalignments prevented:** Countless
**Developer questions reduced:** 60-80%
**Team confidence increased:** Significantly
