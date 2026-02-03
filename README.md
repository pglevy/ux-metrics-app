# UX Metrics Capture & Review

> A comprehensive tool for capturing, analyzing, and reporting on usability study metrics.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)

**[Live Demo](https://YOUR-USERNAME.github.io/ux-metrics-app/)** | **[Documentation](#documentation)**

---

## Overview

UX Metrics is a web application designed for product teams and UX researchers to systematically capture, analyze, and report on usability study data. It supports multiple assessment types including task success rates, time on task, task efficiency, error rates, and Single Ease Question (SEQ) ratings.

### Key Capabilities

- **Study Management** - Organize evaluation sessions by product and feature
- **Session Tracking** - Record participant sessions with facilitators and observers
- **Multiple Assessment Types** - Capture five standard usability metrics
- **Real-time Calculations** - Automatic metric computation during data entry
- **Analytics Dashboard** - Explore aggregated metrics with filtering
- **Report Generation** - Create shareable reports with visualizations
- **Data Portability** - Export/import all data as JSON

---

## Features

### Assessment Types

- **Task Success Rate** - Percentage of users completing tasks correctly
- **Time on Task** - Duration to complete specific tasks (median aggregation)
- **Task Efficiency** - Ratio of optimal steps to actual steps taken
- **Error Rate** - Percentage of errors during task completion
- **SEQ (Single Ease Question)** - 1-7 rating scale for perceived task difficulty

### Analytics & Reporting

- Aggregated metrics across sessions
- Filter by participant, task, or date range
- Interactive visualizations (bar charts, line charts)
- Exportable reports in JSON format
- Metrics comparison between studies

### Data Management

- People management (participants, facilitators, observers)
- Reusable assessment type templates
- Complete data backup and restore
- Seed data for demonstration

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/ux-metrics-app.git
cd ux-metrics-app

# Install dependencies
cd ui
npm install

# Start the development server
npm run dev
```

Visit http://localhost:5173 to access the application.

### First Use

The application loads with demonstration data on first launch. You can:

1. **Explore Studies** - View pre-populated usability studies
2. **Review Sessions** - See example participant sessions
3. **Check Metrics** - Explore the analytics dashboard
4. **Generate Reports** - Create sample reports

To start fresh, use Settings → Clear All Data.

---

## Usage

### Creating a Study

1. Navigate to Studies
2. Click "Create New Study"
3. Enter study name, product ID, and optional feature ID
4. Save to begin adding sessions

### Conducting a Session

1. Open a study and click "New Session"
2. Select participant and facilitator from people list
3. Optionally add observers
4. Administer assessments:
   - Choose assessment type
   - Enter task description
   - Capture metric data
   - System calculates results automatically
5. Mark session as complete when finished

### Analyzing Metrics

1. Navigate to Metrics Dashboard
2. Select a study
3. View aggregated metrics:
   - Task Success Rate (mean)
   - Time on Task (median)
   - Task Efficiency (mean)
   - Error Rate (mean)
   - SEQ Score (mean)
4. Apply filters to narrow analysis
5. Review visualizations

### Generating Reports

1. Navigate to Report Generator
2. Select a study
3. Review aggregated metrics and charts
4. Add optional commentary
5. Export as JSON for sharing

---

## Project Structure

```
ux-metrics-app/
├── ui/                          # React application
│   ├── src/
│   │   ├── pages/              # Main application pages
│   │   │   ├── home.tsx        # Dashboard
│   │   │   ├── studies.tsx     # Study list
│   │   │   ├── study-detail.tsx
│   │   │   ├── session-detail.tsx
│   │   │   ├── metrics.tsx     # Analytics dashboard
│   │   │   ├── report.tsx      # Report generator
│   │   │   ├── people.tsx      # People management
│   │   │   └── settings.tsx    # App settings
│   │   ├── components/         # Reusable components
│   │   ├── services/           # Business logic
│   │   └── data/               # Seed data
│   └── package.json
├── schema/                      # API contract (OpenAPI)
├── concept-model/               # Domain documentation
│   ├── domain-model.md         # Entities and business rules
│   ├── behavior-model.md       # Workflows and interactions
│   └── entity-relationship-diagram.md
└── README.md
```

---

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Sailwind** - Component library (SAIL-like design)
- **Recharts** - Data visualization
- **React Router** - Navigation
- **LocalStorage** - Client-side data persistence

---

## Data Model

### Core Entities

- **Study** - Collection of sessions for evaluating a product/feature
- **Session** - Single evaluation event with one participant
- **Person** - Individual (participant, facilitator, or observer)
- **AssessmentType** - Structured measurement instrument
- **AssessmentResponse** - Captured assessment data for a task
- **Report** - Generated analytics document

See [concept-model/domain-model.md](concept-model/domain-model.md) for complete details.

---

## Metrics Calculation

| Metric | Formula | Aggregation |
|--------|---------|-------------|
| Task Success Rate | (successful / total) × 100 | Mean |
| Time on Task | end_time - start_time | Median |
| Task Efficiency | (optimal_steps / actual_steps) × 100 | Mean |
| Error Rate | (errors / opportunities) × 100 | Mean |
| SEQ | Direct rating (1-7) | Mean |

**Note:** Time on Task uses median aggregation to reduce the impact of outliers.

---

## Development

### Running Locally

```bash
cd ui
npm run dev
```

### Building for Production

```bash
cd ui
npm run build
```

### Linting

```bash
cd ui
npm run lint
```

---

## Documentation

- **[Domain Model](concept-model/domain-model.md)** - Entities, relationships, and business rules
- **[Behavior Model](concept-model/behavior-model.md)** - Workflows and interaction patterns
- **[Entity Relationship Diagram](concept-model/entity-relationship-diagram.md)** - Visual data model
- **[API Contract](schema/api-contract.yaml)** - OpenAPI specification

---

## Roadmap

### Current Version (1.0)
- ✅ Five assessment types
- ✅ Analytics dashboard with filtering
- ✅ Report generation and export
- ✅ Data backup/restore
- ✅ Seed data for demonstration

### Planned Enhancements
- [ ] Multi-study comparison dashboard
- [ ] Advanced trend analysis
- [ ] Scheduled report generation
- [ ] Team/organization support (multi-tenant)
- [ ] Authentication and authorization
- [ ] Audit trail for compliance
- [ ] Additional assessment types
- [ ] CSV export option

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Acknowledgments

Built with:
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Sailwind](https://github.com/pglevy/sailwind)
- [Recharts](https://recharts.org/)

Design inspired by research lab aesthetics with a focus on data clarity and professional presentation.

---

## Support

For questions, issues, or feature requests, please open an issue on GitHub.
