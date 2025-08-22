# Restaurant Business Calculator

A professional web application for restaurant owners to calculate and plan their business finances, replicating the functionality of complex Excel spreadsheets in an intuitive, modern interface.

## Features

### 1. Investment Calculator
- Calculate initial setup costs including:
  - Civil works and renovations
  - Furniture and fixtures
  - Equipment and machinery
  - Licenses and permits
  - Marketing and recruitment costs
- Automatic 3-year investment amortization

### 2. Premises & Operations
- Configure operational parameters:
  - Working days per month
  - Average ticket prices (in-store and delivery)
  - Sales channel distribution
  - Monthly operating costs (rent, utilities, services)
  - Staff planning with salaries
- Revenue projections with growth rates

### 3. Cash Flow Projections
- 48-month detailed cash flow analysis
- Automatic calculation of:
  - Sales by channel
  - Direct costs (food, beverages, packaging)
  - Fixed costs (rent, salaries, utilities)
  - Monthly and yearly profit calculations
- Visual representation of cash flows

### 4. Results Dashboard
- Comprehensive financial analysis including:
  - 4-year revenue and profit trends
  - Profit margin analysis
  - Cost breakdown visualization
  - Interactive charts and graphs
  - Key performance indicators

## Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd resto-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. **Start with Investment**: Enter your initial investment costs in the Investment tab
2. **Configure Operations**: Set up your restaurant parameters in the Premises tab
3. **Review Cash Flows**: The Cash Flow tab automatically calculates based on your inputs
4. **Analyze Results**: View comprehensive financial projections in the Results dashboard

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Professional styling
- **Zustand** - State management with persistence
- **Recharts** - Data visualization
- **React Hook Form** - Form handling
- **Lucide React** - Modern icons

## Key Calculations

The application replicates professional restaurant financial planning calculations:

- **Direct Costs**: Calculated as 23% of sales (industry standard)
- **Growth Projections**: Configurable yearly growth rate
- **Cash Flow**: 48-month projections with monthly granularity
- **Profit Margins**: Gross and net margin calculations
- **ROI Analysis**: 4-year financial performance tracking

## Data Persistence

All data is automatically saved to browser local storage, ensuring your calculations persist between sessions.

## Contributing

Feel free to submit issues or pull requests to improve the calculator.

## License

MIT License
