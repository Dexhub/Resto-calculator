# Restaurant Business Plan Calculator - Comprehensive Understanding

## Overview
This Excel workbook is a sophisticated financial planning tool designed for restaurant entrepreneurs. It helps calculate initial investments, project cash flows, and analyze the financial viability of a restaurant business over multiple years.

## Purpose & Problem Solved
- **Problem**: Restaurant entrepreneurs need a comprehensive tool to plan their business finances, from initial investment to multi-year cash flow projections
- **Solution**: This calculator provides detailed financial modeling with interconnected calculations across investment, operations, and financial projections

## Core Components

### 1. Investment Sheet
- **Purpose**: Calculate initial business setup costs
- **Categories**:
  - Business Setup (Civil works, Management systems, Equipment, Initial inventory)
  - Working Capital requirements
  - Pre-operational expenses (Marketing, HR, Deposits, Insurance)
- **Key Features**:
  - Item-based cost calculation with quantity and unit cost
  - USD values with conversion capability
  - Total investment calculation

### 2. Premises Sheet
- **Purpose**: Define operational parameters and assumptions
- **Key Metrics**:
  - Working days per month (20 days)
  - Average ticket prices (in-store and delivery): $15
  - Ticket distribution ratios (50% in-store, 50% delivery)
  - Monthly/daily ticket projections: ~1,333 monthly, ~67 daily
  - Average items per ticket: 6
- **Calculations**: Basis for revenue projections

### 3. Cash Flow Sheet (FDO CF)
- **Purpose**: Project monthly cash flows for 2+ years
- **Structure**:
  - Monthly breakdown (Month 1-12 for Year 1, Month 13+ for Year 2)
  - Revenue projections based on premises assumptions
  - Operating expenses (COGS, Labor, Rent, Utilities, etc.)
  - Net cash flow calculations
- **Key Features**:
  - Seasonal variations consideration
  - Growth projections for Year 2

### 4. Results Sheet (FDO Results)
- **Purpose**: Summarize financial performance and key metrics
- **Metrics**:
  - Year 1 Sales: $266,700
  - Year 2 Sales: $335,280 (25.7% growth)
  - Profitability analysis
  - ROI calculations
  - Break-even analysis

## Data Flow & Relationships
1. **Premises** → defines operational assumptions
2. **Investment** → calculates initial capital requirements
3. **Premises + Investment** → feed into **Cash Flow** projections
4. **Cash Flow** → aggregates into **Results** summary

## Key Calculations

### Revenue Calculation
```
Monthly Revenue = Working Days × Daily Tickets × Average Ticket Price
Year 1 Revenue = Monthly Revenue × 12 months
Year 2 Revenue = Year 1 Revenue × Growth Factor
```

### Cash Flow Components
- **Inflows**: Sales revenue
- **Outflows**: 
  - Cost of Goods Sold (COGS)
  - Labor costs
  - Rent & utilities
  - Marketing & operational expenses
  - Loan payments (if applicable)

### Profitability Metrics
- Gross Margin = (Revenue - COGS) / Revenue
- Net Margin = Net Profit / Revenue
- ROI = (Net Profit / Initial Investment) × 100

## Critical Success Factors
1. Accurate premises assumptions (ticket price, volume)
2. Realistic cost projections
3. Proper working capital allocation
4. Seasonal adjustment factors
5. Growth rate assumptions

## Improvements Needed
1. Dynamic scenario planning (best/worst case)
2. Visual dashboards for quick insights
3. Sensitivity analysis tools
4. Benchmarking against industry standards
5. Multi-location scalability
6. Integration with real-time data
7. Mobile-responsive design
8. Export capabilities (PDF reports)
9. Save/load functionality for multiple scenarios
10. Collaboration features for team planning