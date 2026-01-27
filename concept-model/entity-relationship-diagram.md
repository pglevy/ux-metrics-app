# Entity Relationship Diagram

This diagram visualizes the entities (nouns) and their relationships (verbs) in the UX Metrics Capture and Review Application.

---

## Current State

```mermaid
erDiagram
    Study {
        uuid id PK
        string name
        string productId
        string featureId
        datetime createdAt
        datetime updatedAt
        boolean archived
    }

    Session {
        uuid id PK
        uuid studyId FK
        uuid participantId FK
        uuid facilitatorId FK
        datetime createdAt
        datetime completedAt
        enum status
    }

    Person {
        uuid id PK
        string name
        enum role
        datetime createdAt
    }

    AssessmentType {
        uuid id PK
        string name
        enum type
    }

    Question {
        uuid id PK
        uuid assessmentTypeId FK
        string text
        enum responseType
    }

    AssessmentResponse {
        uuid id PK
        uuid sessionId FK
        uuid assessmentTypeId FK
        string taskDescription
        json responses
        json calculatedMetrics
        datetime createdAt
    }

    SessionObserver {
        uuid sessionId FK
        uuid personId FK
    }

    Study ||--o{ Session : "contains"
    Person ||--o{ Session : "participates in"
    Person ||--o{ Session : "facilitates"
    Person }o--o{ Session : "observes"
    Session ||--o{ AssessmentResponse : "has"
    AssessmentType ||--o{ AssessmentResponse : "defines"
    AssessmentType ||--o{ Question : "contains"
```

**Legend:**
- **PK**: Primary Key
- **FK**: Foreign Key
- **Solid entities**: Currently implemented in schema

---

## Relationship Details

### Study → Session
- **Cardinality**: One-to-many
- **Description**: A study contains zero or more sessions
- **Constraint**: Sessions cannot exist without a parent study

### Person → Session (Participant)
- **Cardinality**: One-to-many
- **Description**: A person (as participant) can be in many sessions; each session has exactly one participant
- **Constraint**: participantId is required

### Person → Session (Facilitator)
- **Cardinality**: One-to-many
- **Description**: A person (as facilitator) can conduct many sessions; each session has exactly one facilitator
- **Constraint**: facilitatorId is required

### Person → Session (Observer)
- **Cardinality**: Many-to-many
- **Description**: A person can observe many sessions; a session can have many observers
- **Constraint**: observerIds is optional (can be empty array)
- **Implementation**: Array of person IDs stored in session

### Session → AssessmentResponse
- **Cardinality**: One-to-many
- **Description**: A session contains zero or more assessment responses
- **Constraint**: Each response belongs to exactly one session

### AssessmentType → AssessmentResponse
- **Cardinality**: One-to-many
- **Description**: An assessment type can be used in many responses
- **Constraint**: Assessment types are reusable across sessions

### AssessmentType → Question
- **Cardinality**: One-to-many
- **Description**: An assessment type contains one or more questions
- **Constraint**: At least one question is required

---

## Cardinality Notation

| Symbol | Meaning |
|--------|---------|
| `\|\|` | Exactly one |
| `\|o` | Zero or one |
| `}{` | One or more |
| `}o` | Zero or more |

---

## Enumeration Values

### Session Status
```mermaid
stateDiagram-v2
    [*] --> in_progress: Create Session
    in_progress --> completed: Complete Session

    note right of in_progress
        Active session
        Assessments can be administered
    end note

    note right of completed
        Session finished
        All data captured
    end note
```

### Person Role
```mermaid
stateDiagram-v2
    state PersonRole {
        participant: Participant
        facilitator: Facilitator
        observer: Observer
    }

    note right of participant
        User being evaluated
    end note

    note right of facilitator
        Conducts the session
    end note

    note right of observer
        Watches without participating
    end note
```

### Assessment Type
```mermaid
stateDiagram-v2
    state AssessmentTypeEnum {
        task_success_rate: Task Success Rate
        time_on_task: Time on Task
        task_efficiency: Task Efficiency
        error_rate: Error Rate
        seq: SEQ (Single Ease Question)
    }
```

### Response Type
```mermaid
stateDiagram-v2
    state ResponseType {
        boolean: Boolean (Yes/No)
        number: Number (Integer/Decimal)
        text: Text (Free-form)
        rating: Rating (Scale)
    }
```

---

## Data Flow Diagram

```mermaid
flowchart TB
    subgraph "Study Management"
        S[Study]
    end

    subgraph "People Management"
        P[Person]
    end

    subgraph "Session Execution"
        SE[Session]
        AR[AssessmentResponse]
    end

    subgraph "Assessment Configuration"
        AT[AssessmentType]
        Q[Question]
    end

    subgraph "Analytics & Reporting"
        M[Metrics]
        R[Report]
    end

    S --> SE
    P --> SE
    SE --> AR
    AT --> AR
    Q --> AT
    AR --> M
    M --> R
    S --> R
```

---

## Simplified View (Core Entities Only)

```mermaid
erDiagram
    Study ||--o{ Session : "contains"
    Session ||--o{ AssessmentResponse : "has"
    AssessmentType ||--o{ AssessmentResponse : "defines"
    Person ||--o{ Session : "participates"
```

This simplified view shows the four main entity relationships:
1. Studies organize sessions
2. Sessions capture assessment responses
3. Assessment types define how responses are structured
4. People participate in sessions

---

## Evolution Notes

**2026-01-27**: Initial ERD created for UX Metrics Application
- Six core entities defined
- Relationships mapped including many-to-many for observers
- Enumeration values documented
- Data flow diagram added for context

**Future Enhancements:**
- Add Team/Organization entity for multi-tenant support
- Add User entity for authentication
- Add AuditLog entity for change tracking
- Add Tag entity for study categorization
- Add Comparison entity for cross-study analysis
