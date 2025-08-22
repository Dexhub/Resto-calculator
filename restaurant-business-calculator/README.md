# Restaurant Business Plan Calculator

A comprehensive web-based financial planning tool for restaurant entrepreneurs. This application helps calculate initial investments, project cash flows, and analyze the financial viability of restaurant businesses.

## Features

- **Investment Calculator**: Track startup costs including equipment, renovations, and working capital
- **Premises Planning**: Define operational parameters and revenue projections
- **Cash Flow Projections**: Monthly cash flow analysis for multiple years
- **Financial Analysis**: ROI calculations, break-even analysis, and profitability metrics
- **Data Persistence**: Auto-save functionality with local storage
- **Export Options**: Generate PDF reports and CSV exports
- **Industry Templates**: Pre-configured templates for different restaurant types
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or backend required - runs entirely in the browser

### Installation

1. Download or clone the repository
2. Open `index.html` in your web browser
3. That's it! The application runs entirely client-side

### Running Locally

```bash
# Option 1: Direct file access
# Simply open index.html in your browser

# Option 2: Using a local server (recommended for best experience)
# If you have Python installed:
python -m http.server 8000
# Then navigate to http://localhost:8000

# If you have Node.js installed:
npx http-server
# Then navigate to http://localhost:8080
```

## Usage Guide

### Step 1: Investment Planning
1. Navigate to the **Investment** tab
2. Enter your startup costs:
   - Business setup (civil works, equipment, inventory)
   - Working capital requirements
   - Pre-operational expenses
3. The total investment is calculated automatically

### Step 2: Premises Configuration
1. Switch to the **Premises** tab
2. Set your operational parameters:
   - Working days per month
   - Average ticket prices
   - Sales distribution (in-store vs delivery)
3. Review the monthly projections

### Step 3: Cash Flow Analysis
1. Go to the **Cash Flow** tab
2. Review monthly projections for Year 1 and Year 2
3. Analyze revenue, expenses, and cumulative cash flow
4. Switch between years using the year selector

### Step 4: Results & Analysis
1. Navigate to the **Results** tab
2. Review key metrics:
   - Revenue projections
   - ROI calculation
   - Break-even analysis
   - Profitability margins
3. Export your business plan as PDF

## Key Features Explained

### Auto-Save
- Your data is automatically saved to browser local storage
- Progress is preserved between sessions
- No account or login required

### Templates
- Quick Service Restaurant
- Casual Dining
- Fine Dining
- Food Truck
- Cafe/Coffee Shop

### Export Options
- **PDF**: Professional business plan document
- **CSV**: Excel-compatible data export
- **JSON**: Full data backup

### Calculations
- Based on industry-standard ratios
- Seasonal adjustments included
- Conservative growth projections
- Customizable cost structures

## Keyboard Shortcuts

- `Ctrl/Cmd + S`: Save progress
- `Ctrl/Cmd + P`: Print report
- `Ctrl/Cmd + E`: Export to PDF
- `Arrow Keys`: Navigate between tabs
- `Enter`: Move to next input field

## Tips for Best Results

1. **Be Conservative**: Use realistic estimates for costs and revenue
2. **Include Buffers**: Add 10-20% buffer to cost projections
3. **Seasonal Planning**: Consider seasonal variations in your market
4. **Regular Updates**: Revisit and update projections quarterly
5. **Scenario Planning**: Save multiple versions to compare scenarios

## Technical Details

### Technologies Used
- Pure HTML5, CSS3, JavaScript (ES6+)
- Chart.js for data visualization
- jsPDF for PDF generation
- LocalStorage for data persistence
- No frameworks or build tools required

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Data Privacy
- All calculations performed client-side
- No data sent to external servers
- Data stored locally in your browser
- You control all your information

## Troubleshooting

### Common Issues

**Q: My data disappeared**
- Check if you're using the same browser
- Ensure cookies/local storage aren't disabled
- Use the backup/restore feature regularly

**Q: Charts not displaying**
- Ensure JavaScript is enabled
- Check for browser console errors
- Try refreshing the page

**Q: PDF export not working**
- Ensure pop-ups are allowed
- Try a different browser
- Check available disk space

## Contributing

This is a standalone project, but suggestions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Share industry insights
- Provide feedback on calculations

## License

This project is provided as-is for educational and business planning purposes.

## Acknowledgments

- Based on restaurant industry best practices
- Incorporates standard financial planning methodologies
- Designed with restaurant entrepreneurs in mind

---

**Happy Planning!** 🍴📊

For questions or support, please refer to the built-in help guide (? icon in the app).