# Restaurant Business Plan Calculator - Design Guidelines & UI/UX Plan

## Design Philosophy
**"Professional Simplicity with Delightful Details"**
- Clean, modern interface that feels professional yet approachable
- Focus on clarity and usability over decorative elements
- Subtle animations and micro-interactions for engagement
- Data visualization as the hero element

## Visual Design System

### 1. Color Palette
```css
/* Primary Colors */
--primary-blue: #2563EB;      /* Main actions, links */
--primary-dark: #1E40AF;      /* Hover states */
--primary-light: #60A5FA;     /* Accents, highlights */

/* Secondary Colors */
--success-green: #10B981;     /* Positive values, profits */
--warning-amber: #F59E0B;     /* Warnings, attention */
--danger-red: #EF4444;        /* Negative values, alerts */

/* Neutral Colors */
--gray-900: #111827;          /* Main text */
--gray-700: #374151;          /* Secondary text */
--gray-500: #6B7280;          /* Disabled, hints */
--gray-200: #E5E7EB;          /* Borders */
--gray-100: #F3F4F6;          /* Backgrounds */
--white: #FFFFFF;             /* Cards, inputs */

/* Chart Colors */
--chart-1: #3B82F6;           /* Primary data */
--chart-2: #10B981;           /* Secondary data */
--chart-3: #F59E0B;           /* Tertiary data */
--chart-4: #8B5CF6;           /* Additional data */
```

### 2. Typography
```css
/* Font Stack */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'Fira Code', 'Consolas', monospace;

/* Font Sizes */
--text-xs: 0.75rem;     /* 12px - Hints, labels */
--text-sm: 0.875rem;    /* 14px - Secondary text */
--text-base: 1rem;      /* 16px - Body text */
--text-lg: 1.125rem;    /* 18px - Subheadings */
--text-xl: 1.25rem;     /* 20px - Section titles */
--text-2xl: 1.5rem;     /* 24px - Page headings */
--text-3xl: 2rem;       /* 32px - Hero numbers */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 3. Spacing System
```css
/* Base unit: 4px */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### 4. Component Styles

#### Input Fields
- Clean white background with subtle border
- Focus state with blue outline
- Hover state with darker border
- Error state with red border and message
- Success state with green check icon
- Currency inputs with proper formatting
- Number inputs with increment/decrement buttons

#### Buttons
```css
/* Primary Button */
.btn-primary {
  background: var(--primary-blue);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
}

/* Secondary Button */
.btn-secondary {
  background: white;
  color: var(--primary-blue);
  border: 2px solid var(--primary-blue);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--gray-700);
  border: 1px solid var(--gray-200);
}
```

#### Cards
- White background with subtle shadow
- 12px border radius
- 24px padding
- Hover state with elevated shadow
- Click state with pressed effect

### 5. Layout Principles

#### Grid System
- 12-column grid for desktop
- 4-column grid for tablet
- Single column for mobile
- 24px gutters
- Max content width: 1200px

#### Responsive Breakpoints
```css
--mobile: 640px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1280px;
```

### 6. Micro-interactions & Animations

#### Loading States
- Skeleton screens for data loading
- Smooth fade-in for content appearance
- Progress indicators for calculations

#### Transitions
```css
/* Standard timing */
--transition-fast: 150ms ease-in-out;
--transition-base: 200ms ease-in-out;
--transition-slow: 300ms ease-in-out;

/* Spring animation for delightful feedback */
@keyframes spring-bounce {
  0% { transform: scale(1); }
  30% { transform: scale(1.1); }
  60% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
```

#### Interactive Feedback
- Hover states on all interactive elements
- Active states with subtle press effect
- Focus indicators for accessibility
- Success animations on save/calculate
- Smooth number transitions when values change

### 7. Data Visualization

#### Chart Design
- Clean, minimal chart styling
- Interactive tooltips on hover
- Smooth animations on data updates
- Consistent color coding across charts
- Legend with interactive filtering
- Grid lines subtle but visible

#### Dashboard Metrics
- Large, bold numbers for key metrics
- Trend indicators (up/down arrows)
- Progress bars for targets
- Mini sparkline charts
- Color-coded status indicators

### 8. Mobile-First Design

#### Touch Targets
- Minimum 44x44px touch targets
- Adequate spacing between buttons
- Swipe gestures for tab navigation
- Pull-to-refresh for data sync

#### Mobile Layout
- Stacked layout for forms
- Collapsible sections
- Bottom sheet for actions
- Floating action buttons

### 9. Accessibility

#### WCAG 2.1 AA Compliance
- Color contrast ratios (4.5:1 minimum)
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators
- Alt text for icons
- ARIA labels

### 10. User Experience Patterns

#### Progressive Disclosure
- Start with essential fields
- Expand for advanced options
- Contextual help tooltips
- "Learn more" expandable sections

#### Error Prevention
- Input validation on blur
- Format hints (e.g., "$0,000.00")
- Confirmation dialogs for destructive actions
- Auto-save with undo capability

#### Delightful Details
- Confetti animation on milestone achievements
- Smooth number counting animations
- Contextual tips based on input patterns
- Smart suggestions for common values
- Celebration when reaching profitability

### 11. Empty States

#### Design Approach
- Friendly illustrations
- Clear call-to-action
- Example data option
- Quick start templates

### 12. Navigation Patterns

#### Tab Navigation
- Clear active state
- Smooth sliding indicator
- Icons with labels
- Badge indicators for sections with data

#### Breadcrumbs
- Show current location
- Clickable path navigation
- Responsive abbreviation

### 13. Iconography

#### Icon Style
- Outlined style for consistency
- 24x24px base size
- Consistent stroke width (2px)
- Meaningful and recognizable
- Custom icons for key features

### 14. Performance Indicators

#### Visual Feedback
- Green for good performance
- Amber for caution
- Red for attention needed
- Trend arrows for changes
- Benchmark comparisons

### 15. Dark Mode (Future Enhancement)
- Automatic OS detection
- Manual toggle option
- Adjusted color palette
- Preserved contrast ratios
- Smooth transition animation