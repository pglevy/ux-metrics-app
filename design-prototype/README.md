# UX Metrics Design Prototype

## Design Vision: "Research Lab Refined"

This design prototype represents a polished, professional visual direction for the UX Metrics application. The aesthetic combines **data-forward thinking** with **refined minimalism** to create an interface that feels both sophisticated and highly functional.

## Core Design Principles

### 1. **Typography as Foundation**
- **Primary**: IBM Plex Sans (technical precision, excellent readability)
- **Data/Metrics**: IBM Plex Mono (monospace for numerical data consistency)
- **Hierarchy**: Clear size progression (56px → 32px → 18px → 15px → 13px)
- **Weights**: Strategic use from light (300) to bold (700)

### 2. **Color Strategy**
- **Neutrals First**: Warm gray backgrounds (#FAFAFA, #F5F5F5) create a calm, professional canvas
- **Aurora Palette**: Strategic accent colors from the existing Aurora design system
- **Semantic Colors**:
  - Success/Positive: Green gradients (#1CC101 → #56ADC0)
  - Primary/Focus: Blue gradients (#2322F0 → #3F8EEE)
  - Warning: Orange gradients (#FAA92F → #D97706)
  - Info: Purple gradients (#B561FF → #962FEA)

### 3. **Layout Philosophy**
- **Sidebar Navigation**: Fixed 240px sidebar with clean iconography
- **Generous Whitespace**: 32px-40px padding creates breathing room
- **Card-Based Layouts**: Elevated cards with subtle shadows (0-25px range)
- **Grid Systems**: Responsive auto-fit grids for metrics and content

### 4. **Visual Hierarchy**
- **Large Metric Values**: 56px monospace numerals dominate primary metrics
- **Gradient Accents**: 3-4px top borders on cards using gradients
- **Elevation Layers**: sm → md → lg → xl shadow progression
- **Status Indicators**: Pills/badges with semantic colors

### 5. **Micro-Interactions**
- **Hover States**: translateY(-2px) lift + shadow increase
- **Transitions**: 150-350ms cubic-bezier easing
- **Entry Animations**: Staggered scaleIn (0.05s delays)
- **Sparklines**: Subtle trend indicators on key metrics
- **Icon Animations**: scale(1.1) + rotate(5deg) on hover

## Key Components

### Home Page (`index.html`)
- **Hero Section**: Clear value proposition with quick action CTA
- **Stats Grid**: 4 key metrics with icon gradients and trend indicators
- **Recent Studies**: Interactive list with inline metrics preview
- **Quick Actions**: Card-based navigation with gradient icons
- **Getting Started Guide**: Horizontal stepper with connectors

### Metrics Dashboard (`metrics.html`)
- **Filter Bar**: Compact multi-select filters with clear affordances
- **Primary Metrics**: Large format cards with sparklines and trend badges
- **Secondary Metrics**: Compact 4-column grid
- **Charts**:
  - Horizontal bar chart with gradient fills
  - Line chart with data points and hover states
- **Data Table**: Clean tabular view with monospace IDs and badge statuses

## Design Tokens

### Spacing Scale
```
--spacing: 4px, 8px, 12px, 16px, 20px, 24px, 28px, 32px, 40px
```

### Border Radius
```
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
```

### Shadows
```
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
--shadow-md: 0 4px 6px rgba(0,0,0,0.08)
--shadow-lg: 0 10px 15px rgba(0,0,0,0.08)
--shadow-xl: 0 20px 25px rgba(0,0,0,0.08)
```

### Transitions
```
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1)
```

## Implementation Strategy

### Phase 1: Foundation
1. Update global styles with new color palette and typography
2. Create shared component styles (buttons, cards, badges)
3. Implement layout structure (sidebar, main content area)

### Phase 2: Components
1. Metric card components with gradient variations
2. Chart components (bar, line, sparkline)
3. Table components with proper hierarchy
4. Filter/control components

### Phase 3: Pages
1. Update Home page with new card layouts
2. Redesign Study List/Detail pages
3. Enhance Metrics Dashboard with new visualizations
4. Refine Session Detail page

### Phase 4: Interactions
1. Add entry animations with stagger delays
2. Implement hover states across all interactive elements
3. Add micro-interactions for data points
4. Polish transition timing

## Sailwind Integration

This design can be implemented with Sailwind components as the foundation:

### Use Sailwind For:
- **HeadingField**: Maintain for semantic headings (override styles as needed)
- **CardLayout**: Use as base, override with new elevation styles
- **ButtonWidget**: Extend with new styles for primary/secondary variants
- **TextField/DropdownField**: Augment filter components
- **RichTextDisplayField**: Use for body content

### Augment With Custom CSS:
- **Metric Cards**: Custom component with gradient accents
- **Charts**: Custom SVG-based visualizations
- **Data Tables**: Custom table styling with proper hierarchy
- **Sparklines**: Lightweight SVG trend indicators
- **Status Badges**: Custom pills with semantic colors

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox for layouts
- CSS Custom Properties (variables)
- CSS Animations and Transitions

## Accessibility Considerations
- Semantic HTML structure maintained
- Color contrast ratios meet WCAG AA standards
- Focus states clearly visible
- Keyboard navigation support
- ARIA labels for interactive elements

## Next Steps for Implementation
1. Review design direction with stakeholders
2. Create reusable component library
3. Integrate with Sailwind base components
4. Update React components with new styles
5. Test responsive behavior across breakpoints
6. Validate accessibility compliance
7. Performance optimization for animations

---

**Design Philosophy**: Data deserves beautiful, functional interfaces. This design elevates metrics visualization while maintaining the professional rigor expected of research tools.
