# Behavior Model

This document describes the key interactions, workflows, and behavioral patterns in the UX Metrics Capture and Review Application.

---

## Primary Workflows

### 1. Study Lifecycle Workflow

**Actor**: Product team member

**Purpose**: Manage usability studies from creation through archival

**States:**
```
┌────────┐     ┌────────────────┐     ┌──────────┐
│ Create │ ──▶ │ Conduct        │ ──▶ │ Archive  │
│        │     │ Sessions       │     │          │
└────────┘     └────────────────┘     └──────────┘
```

**Steps:**
1. User creates a new study with name, product ID, and optional feature ID
2. System generates unique ID and timestamps
3. System sets archived = false
4. User conducts sessions within the study (see Session Workflow)
5. User views aggregated metrics and generates reports
6. When evaluation is complete, user archives the study
7. System sets archived = true

**Business Logic:**
- Name and product ID are required
- Feature ID is optional for feature-specific evaluations
- Archived studies remain viewable but cannot have new sessions added
- Archiving is reversible (can unarchive if needed)

**Validation:**
- Name must be 1-200 characters
- Product ID cannot be empty

---

### 2. Session Workflow

**Actor**: Facilitator

**Purpose**: Conduct evaluation sessions and capture usability data

**States:**
```
┌────────┐     ┌─────────────┐     ┌───────────┐
│ Create │ ──▶ │ Administer  │ ──▶ │ Complete  │
│        │     │ Assessments │     │           │
└────────┘     └─────────────┘     └───────────┘
```

**Steps:**
1. Facilitator creates a new session within a study
2. Facilitator selects participant from people list
3. Facilitator is automatically assigned (or selected)
4. Facilitator optionally adds observers
5. System generates unique ID, timestamp, and sets status = "in_progress"
6. Facilitator administers one or more assessments (see Assessment Workflow)
7. Each assessment is saved incrementally
8. When all assessments are complete, facilitator marks session as complete
9. System sets status = "completed" and records completedAt timestamp

**Business Logic:**
- Study ID, participant ID, and facilitator ID are required
- Observer IDs are optional
- Assessments can be administered in any order
- Data is saved incrementally to prevent loss
- Session cannot be modified after completion

**Error Cases:**
- Study not found → 404 response
- Missing required fields → 400 response with field list
- Referenced person not found → 404 response

---

### 3. Assessment Administration Workflow

**Actor**: Facilitator

**Purpose**: Capture specific usability metrics during a session

**Steps:**
1. Facilitator selects an assessment type to administer
2. System displays the appropriate form based on assessment type
3. Facilitator enters task description
4. Facilitator captures response data:
   - **Task Success Rate**: Record success/failure for each attempt
   - **Time on Task**: Start/stop timer or enter manual duration
   - **Task Efficiency**: Enter optimal steps and actual steps
   - **Error Rate**: Enter error count, opportunities, and error types
   - **SEQ**: Select rating from 1-7 scale
5. System calculates metrics automatically
6. System displays calculated results immediately
7. System saves assessment response

**Business Logic:**
- Task description is required for all assessments
- Calculated metrics are computed based on assessment type
- SEQ ratings must be between 1 and 7
- Only one SEQ rating allowed per task per session

**Calculation Rules:**
| Assessment Type | Formula |
|-----------------|---------|
| Task Success Rate | (successful completions / total attempts) × 100 |
| Time on Task | end_time - start_time (in seconds) |
| Task Efficiency | (optimal steps / actual steps) × 100 |
| Error Rate | (errors / opportunities) × 100 |
| SEQ | Direct rating value (1-7) |

**Error Cases:**
- Invalid SEQ rating (outside 1-7) → 400 response
- Duplicate SEQ for same task/session → 409 conflict response
- Division by zero in calculations → Return 0 or null

---

### 4. Report Generation Workflow

**Actor**: Product team member

**Purpose**: Generate shareable reports with aggregated metrics and visualizations

**Steps:**
1. User navigates to Report Generator
2. User selects a study to generate a report for
3. System retrieves all sessions and assessment responses for the study
4. System calculates aggregated metrics:
   - Mean for Task Success Rate, Task Efficiency, Error Rate, SEQ
   - Median for Time on Task
5. System counts unique participants and total sessions
6. System generates visualizations:
   - Success Rate by Task (bar chart)
   - Time on Task Trends (line chart)
7. User optionally adds commentary or notes
8. User exports report as JSON for sharing
9. System includes all data: metrics, charts, commentary, metadata

**Business Logic:**
- Reports include all sessions in the study by default
- Filtering by date range, participant, or task is supported
- Empty data sets return null metrics (not errors)
- Commentary is optional and included in export
- Reports are generated on-demand (not stored)
- JSON export includes complete data for reproducibility

**Report Contents:**
- Study metadata (name, product, feature, dates)
- Session count and participant count
- Aggregated metrics with calculation methods
- Visualization data (chart datasets)
- Optional commentary
- Generation timestamp
- Schema version for compatibility

**Aggregation Rules:**
| Metric | Aggregation Method |
|--------|-------------------|
| Task Success Rate | Mean (average) |
| Time on Task | Median (middle value) |
| Task Efficiency | Mean (average) |
| Error Rate | Mean (average) |
| SEQ | Mean (average) |

**Export Format:**
- JSON structure matching Report schema
- Human-readable formatting
- Includes all raw data for re-analysis
- Compatible with import/restore functionality

---

### 5. People Management Workflow

**Actor**: Product team member

**Purpose**: Maintain a list of participants, facilitators, and observers

**Steps:**
1. User creates a new person with name and role
2. System generates unique ID and timestamp
3. Person appears in dropdown selectors for session creation
4. User can update person details (name, role)
5. User can delete person if not referenced by any session

**Business Logic:**
- Name and role are required
- Role must be: participant, facilitator, or observer
- People referenced by sessions cannot be deleted
- People are presented in dropdowns when creating/editing sessions

**Error Cases:**
- Missing required fields → 400 response
- Delete referenced person → 409 conflict response

---

### 6. Data Backup and Restore Workflow

**Actor**: System administrator / Product team member

**Purpose**: Backup and restore all application data

**Backup Steps:**
1. User requests data export
2. System collects all studies, sessions, people, assessment types, and responses
3. System generates JSON file with all data
4. User downloads JSON file

**Restore Steps:**
1. User uploads previously exported JSON file
2. System validates JSON structure
3. System imports all data, replacing existing data
4. System confirms successful import

**Business Logic:**
- Export includes all data in the system
- Import replaces all existing data (not merge)
- Invalid JSON format returns error
- Data integrity is maintained across import

---

## State Transitions

### Session Status

```
     ┌─────────────┐
     │ in_progress │
     └──────┬──────┘
            │
            │ Complete Session
            ▼
     ┌─────────────┐
     │  completed  │
     └─────────────┘
```

**Current Rules:**
- Sessions start in "in_progress" status
- Facilitator explicitly marks session as complete
- Completion sets completedAt timestamp
- Status transition is one-way (cannot reopen completed session)

### Study Archive Status

```
     ┌────────┐
     │ Active │ (archived = false)
     └───┬────┘
         │
         │ Archive Study
         ▼
     ┌──────────┐
     │ Archived │ (archived = true)
     └──────────┘
```

**Current Rules:**
- Studies start as active (archived = false)
- User can archive a study when evaluation is complete
- Archived studies are viewable but cannot have new sessions
- Archiving is reversible (can update archived = false)

---

### 7. Analytics and Metrics Exploration Workflow

**Actor**: Product team member / UX Researcher

**Purpose**: Explore and analyze aggregated metrics across sessions with filtering

**Steps:**
1. User navigates to Metrics Dashboard
2. User selects a study from dropdown
3. System displays aggregated metrics:
   - Task Success Rate (mean)
   - Time on Task (median)
   - Task Efficiency (mean)
   - Error Rate (mean)
   - SEQ Score (mean)
4. User optionally applies filters:
   - Participant: Filter by specific participant
   - Task: Filter by task description
   - Date Range: Filter by start/end dates
5. System recalculates metrics based on filters
6. System displays visualizations:
   - Success Rate by Task (bar chart)
   - Time on Task Trends (line chart)
7. User can clear filters to return to full dataset
8. User can navigate to Report Generator for shareable output

**Business Logic:**
- Metrics are calculated in real-time based on assessment responses
- Time on Task uses median (middle value) to reduce outlier impact
- All other metrics use mean (average) for aggregation
- Filters are cumulative (all active filters apply simultaneously)
- Empty result sets display "N/A" rather than errors
- Charts update dynamically when filters change

**Aggregation Rules:**
| Metric | Calculation Method | Rationale |
|--------|-------------------|-----------|
| Task Success Rate | Mean (average) | Represents overall success across attempts |
| Time on Task | Median (middle value) | Reduces impact of extreme outliers |
| Task Efficiency | Mean (average) | Represents average efficiency across tasks |
| Error Rate | Mean (average) | Represents average error frequency |
| SEQ | Mean (average) | Represents average perceived ease |

**Filter Behavior:**
- **Participant Filter**: Shows metrics for selected participant only
- **Task Filter**: Shows metrics for tasks matching description (partial match)
- **Date Range**: Filters sessions by creation date (inclusive)
- **Combined Filters**: All active filters apply together (AND logic)

---

### 8. Metrics Comparison Workflow

**Actor**: Product team member / UX Researcher

**Purpose**: Compare metrics between studies or time periods to identify trends

**Steps:**
1. User selects baseline study or time period
2. User selects comparison study or time period
3. System calculates metrics for both datasets
4. System computes differences (comparison - baseline)
5. System computes percentage changes
6. System displays comparison results with indicators:
   - Positive changes (improvements) highlighted in green
   - Negative changes (regressions) highlighted in red
   - Neutral changes shown in gray

**Business Logic:**
- Comparisons can be between different studies
- Comparisons can be between time periods within same study
- Percentage change calculated as: ((comparison - baseline) / baseline) × 100
- Division by zero returns null (not error)
- Missing data in either set returns null for that metric

**Use Cases:**
- Compare before/after design changes
- Compare different product features
- Track improvement over time
- Identify regression in usability

---

## Business Rules & Invariants

### Invariants (Always True)
- Every entity has a unique ID (UUID)
- Every study has a name and product ID
- Every session has a study, participant, and facilitator
- Every assessment response has a session and assessment type
- createdAt ≤ updatedAt for all entities with both timestamps
- SEQ ratings are always between 1 and 7 (inclusive)

### Current Business Rules
- Participants, facilitators, and observers are selected from a managed people list
- Assessment types are reusable across sessions
- Metrics are calculated automatically based on assessment type
- Data is saved incrementally during session administration
- Reports aggregate metrics using mean (except Time on Task uses median)

### Validation Rules
| Entity | Field | Rule |
|--------|-------|------|
| Study | name | Required, 1-200 characters |
| Study | productId | Required, non-empty |
| Session | studyId | Required, must exist |
| Session | participantId | Required, must exist |
| Session | facilitatorId | Required, must exist |
| Person | name | Required, 1-200 characters |
| Person | role | Required, enum: participant/facilitator/observer |
| AssessmentType | name | Required, 1-200 characters |
| AssessmentType | type | Required, enum: 5 assessment types |
| AssessmentType | questions | Required, at least one |
| AssessmentResponse | taskDescription | Required |
| SEQ | rating | Required, integer 1-7 |

### Analytics & Reporting Rules
- Time on Task aggregates using median (not mean) to reduce outlier impact
- All other metrics aggregate using mean (average)
- Filters apply cumulatively (AND logic, not OR)
- Empty result sets return null metrics (not errors or zeros)
- Percentage changes handle division by zero gracefully (return null)
- Reports are generated on-demand and not persisted
- Visualizations update dynamically when filters change
- Date range filters are inclusive of both start and end dates

### Error Handling Rules
| Scenario | Response |
|----------|----------|
| Missing required field | 400 Bad Request with field list |
| Entity not found | 404 Not Found |
| Duplicate SEQ for task/session | 409 Conflict |
| Delete referenced person | 409 Conflict |
| Division by zero in calculation | Return 0 or null |
| Empty data set for aggregation | Return null metrics |
| Storage failure | 500 Internal Server Error, retain in memory |

---

## Evolution Notes

**2026-01-27**: Initial behavior model created
- Six primary workflows documented
- State transitions for Session and Study
- Business rules and validation rules defined
- Error handling patterns established

**2026-01-28**: Analytics and reporting workflows added
- Analytics and Metrics Exploration workflow documented
- Metrics Comparison workflow documented
- Enhanced Report Generation workflow with visualizations
- Analytics-specific business rules added
- Aggregation methods and filter behavior documented

**Future Considerations:**
- Status transition rules (e.g., require assessments before completion)
- Authorization (who can create/modify what)
- Notification on session completion
- Automatic archival after inactivity period
- Advanced trend analysis with predictive insights
- Multi-study comparison dashboards
