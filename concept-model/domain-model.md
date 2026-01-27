# Domain Model

This document describes the core entities, relationships, and business rules of the UX Metrics Capture and Review Application. It evolves alongside the API schema but focuses on conceptual understanding rather than technical implementation.

---

## Core Entities

### Study
A collection of sessions focused on evaluating a specific product or feature.

**Attributes:**
- **Identity**: Unique identifier (UUID)
- **Name**: Descriptive name for the study (1-200 characters)
- **Product ID**: Identifier for the product being evaluated
- **Feature ID**: Optional identifier for a specific feature within the product
- **Timeline**: Creation and last update timestamps
- **Archived**: Whether the study is no longer active

**Lifecycle States:**
1. **Active**: Study is open for new sessions and data collection
2. **Archived**: Study is complete, no new sessions can be added

**Business Rules:**
- Name is required and must be 1-200 characters
- Product ID is required
- Feature ID is optional
- Archived defaults to false when created
- Timestamps are automatically managed

---

### Session
A single evaluation event with one participant, conducted by a facilitator, optionally observed by others.

**Attributes:**
- **Identity**: Unique identifier (UUID)
- **Study Reference**: Link to the parent study
- **Participant**: Reference to the person being evaluated
- **Facilitator**: Reference to the person conducting the session
- **Observers**: List of references to people observing (optional)
- **Timeline**: Creation timestamp and optional completion timestamp
- **Status**: Current state in the session lifecycle

**Lifecycle States:**
1. **In Progress**: Session is active, assessments can be administered
2. **Completed**: Session is finished, all data captured

**Business Rules:**
- Study ID, Participant ID, and Facilitator ID are required
- Observer IDs are optional (can be empty array)
- Status starts as "in_progress" when created
- Completion timestamp is set when status changes to "completed"
- Sessions cannot be modified after completion (future consideration)

---

### Person
An individual who participates in sessions as a participant, facilitator, or observer.

**Attributes:**
- **Identity**: Unique identifier (UUID)
- **Name**: Person's name (1-200 characters)
- **Role**: The person's role in sessions
- **Timeline**: Creation timestamp

**Role Types:**
1. **Participant**: The user being evaluated during sessions
2. **Facilitator**: The team member conducting moderated sessions
3. **Observer**: A team member watching sessions without direct participation

**Business Rules:**
- Name is required and must be 1-200 characters
- Role is required and must be one of: participant, facilitator, observer
- A person cannot be deleted if referenced by any session
- A person can have only one role (simplification for prototype)

---

### AssessmentType
A structured measurement instrument defining how to capture specific usability metrics.

**Attributes:**
- **Identity**: Unique identifier (UUID)
- **Name**: Descriptive name for the assessment type (1-200 characters)
- **Type**: The category of assessment (enum)
- **Questions**: List of question definitions

**Assessment Type Categories:**
1. **Task Success Rate**: Measures percentage of users who complete tasks correctly
2. **Time on Task**: Measures duration to complete specific tasks
3. **Task Efficiency**: Measures ratio of optimal steps to actual steps taken
4. **Error Rate**: Measures number or percentage of errors during task completion
5. **SEQ (Single Ease Question)**: Captures 1-7 rating of task difficulty

**Business Rules:**
- Name, type, and at least one question are required
- Assessment types can be reused across multiple sessions
- Questions define the data collection structure for each type
- Each question has a response type (boolean, number, text, rating)

---

### Question
A single data collection point within an assessment type.

**Attributes:**
- **Identity**: Unique identifier (UUID)
- **Text**: The question text to display
- **Response Type**: Type of answer expected (boolean, number, text, rating)
- **Validation Rules**: Optional rules for validating responses

**Response Types:**
1. **Boolean**: Yes/No or True/False responses
2. **Number**: Numeric values (integers or decimals)
3. **Text**: Free-form text responses
4. **Rating**: Numeric rating on a scale (e.g., 1-7 for SEQ)

**Validation Rule Types:**
- **min/max**: Numeric range constraints
- **minLength/maxLength**: Text length constraints
- **pattern**: Regex pattern matching
- **required**: Field must have a value

---

### AssessmentResponse
Captured assessment data for a specific task within a session.

**Attributes:**
- **Identity**: Unique identifier (UUID)
- **Session Reference**: Link to the parent session
- **Assessment Type Reference**: Link to the assessment type used
- **Task Description**: Description of the task being assessed
- **Responses**: Key-value pairs of question IDs to response values
- **Calculated Metrics**: Automatically computed metrics based on responses
- **Timeline**: Creation timestamp

**Business Rules:**
- Session ID and Assessment Type ID are required
- Task description is required
- Responses are stored as flexible key-value pairs
- Calculated metrics are computed automatically based on assessment type:
  - Task Success Rate: (successful / total) × 100
  - Time on Task: end time - start time (in seconds)
  - Task Efficiency: (optimal steps / actual steps) × 100
  - Error Rate: (errors / opportunities) × 100
  - SEQ: Direct rating value (1-7)
- Only one SEQ rating allowed per task per session

---

## Relationships

```
Study ──────────────────────────────────────────────────────────────────────────
  │
  │ 1:N (one study has many sessions)
  ▼
Session ────────────────────────────────────────────────────────────────────────
  │                    │                    │
  │ N:1                │ N:1                │ N:N
  │ (participant)      │ (facilitator)      │ (observers)
  ▼                    ▼                    ▼
Person ─────────────────────────────────────────────────────────────────────────

Session ────────────────────────────────────────────────────────────────────────
  │
  │ 1:N (one session has many assessment responses)
  ▼
AssessmentResponse ─────────────────────────────────────────────────────────────
  │
  │ N:1 (many responses use one assessment type)
  ▼
AssessmentType ─────────────────────────────────────────────────────────────────
  │
  │ 1:N (one assessment type has many questions)
  ▼
Question ───────────────────────────────────────────────────────────────────────
```

**Key Relationships:**
- **Study → Session**: One-to-many; a study contains multiple sessions
- **Session → Person (participant)**: Many-to-one; each session has one participant
- **Session → Person (facilitator)**: Many-to-one; each session has one facilitator
- **Session → Person (observers)**: Many-to-many; sessions can have multiple observers
- **Session → AssessmentResponse**: One-to-many; a session contains multiple assessment responses
- **AssessmentResponse → AssessmentType**: Many-to-one; responses reference a reusable assessment type
- **AssessmentType → Question**: One-to-many; assessment types contain multiple questions

---

## Domain Vocabulary

| Term | Definition | Notes |
|------|------------|-------|
| Study | A collection of sessions for evaluating a product/feature | Primary organizing entity |
| Session | A single evaluation event with one participant | Contains assessment data |
| Person | An individual involved in sessions | Can be participant, facilitator, or observer |
| Participant | A user being evaluated during a session | Role type for Person |
| Facilitator | A team member conducting a moderated session | Role type for Person |
| Observer | A team member watching a session | Role type for Person |
| Assessment Type | A structured measurement instrument | Defines how to capture metrics |
| Assessment Response | Captured data for a specific task | Contains responses and calculated metrics |
| Task Success Rate | Percentage of users completing tasks correctly | (successful / total) × 100 |
| Time on Task | Duration to complete a task | Measured in seconds |
| Task Efficiency | Ratio of optimal to actual steps | (optimal / actual) × 100 |
| Error Rate | Percentage of errors during task completion | (errors / opportunities) × 100 |
| SEQ | Single Ease Question rating | 1-7 scale (1=very difficult, 7=very easy) |

---

## Visual Representations

- [Entity Relationship Diagram](./entity-relationship-diagram.md) - Visual model of entities and relationships
- [Behavior Model](./behavior-model.md) - Detailed interaction patterns and workflows

---

## Evolution Notes

**2026-01-27**: Initial domain model created for UX Metrics Application
- Five core entities: Study, Session, Person, AssessmentType, AssessmentResponse
- Support for five assessment types: Task Success Rate, Time on Task, Task Efficiency, Error Rate, SEQ
- Person entity supports three roles: participant, facilitator, observer
- Automatic metric calculations based on assessment type

**Future Considerations:**
- May need team/organization entities for multi-tenant support
- May need authentication and authorization
- May need audit trail/history for compliance
- May need comparison metrics between studies
- May need tagging/categorization for studies
