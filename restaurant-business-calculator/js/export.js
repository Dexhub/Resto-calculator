// Restaurant Business Calculator - Export Functionality

// Export to PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Document setup
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;
    
    // Helper functions
    const addText = (text, x, y, options = {}) => {
        doc.setFontSize(options.size || 12);
        doc.setFont(undefined, options.style || 'normal');
        doc.text(text, x, y, options);
    };
    
    const addLine = (y) => {
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
    };
    
    const checkPageBreak = (requiredSpace) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
            return true;
        }
        return false;
    };
    
    // Title Page
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    addText('Restaurant Business Plan', pageWidth / 2, 25, {
        size: 24,
        style: 'bold',
        align: 'center'
    });
    
    doc.setTextColor(0, 0, 0);
    yPosition = 70;
    
    // Executive Summary
    addText('Executive Summary', margin, yPosition, { size: 16, style: 'bold' });
    yPosition += 10;
    addLine(yPosition);
    yPosition += 10;
    
    const totalInvestment = getTotalInvestment(AppState.data.investment);
    const summaryData = [
        ['Total Investment Required', formatCurrency(totalInvestment)],
        ['Year 1 Projected Revenue', formatCurrency(AppState.data.results.year1.sales)],
        ['Year 2 Projected Revenue', formatCurrency(AppState.data.results.year2.sales)],
        ['Expected ROI', AppState.data.results.roi.toFixed(1) + '%'],
        ['Break-even Period', AppState.data.results.breakEvenMonths + ' months'],
        ['Monthly Break-even Sales', formatCurrency(AppState.data.results.breakEvenSales)],
        ['Break-even Tickets', AppState.data.results.breakEvenTickets.toLocaleString()],
        ['Average Cost per Ticket', formatCurrency(AppState.data.results.avgCostPerTicket)],
        ['Report Generated', new Date().toLocaleDateString()]
    ];
    
    summaryData.forEach(([label, value]) => {
        addText(label + ':', margin, yPosition);
        addText(value, pageWidth - margin - 50, yPosition);
        yPosition += 8;
    });
    
    // Investment Breakdown
    checkPageBreak(80);
    yPosition += 20;
    addText('Investment Breakdown', margin, yPosition, { size: 16, style: 'bold' });
    yPosition += 10;
    addLine(yPosition);
    yPosition += 10;
    
    const investment = AppState.data.investment;
    const investmentData = [
        ['Business Setup', ''],
        ['  - Civil Works', formatCurrency(investment.businessSetup.civilWorks.total)],
        ['  - Equipment & Furniture', formatCurrency(investment.businessSetup.equipment.total)],
        ['  - Initial Inventory', formatCurrency(investment.businessSetup.inventory.total)],
        ['Working Capital', formatCurrency(investment.workingCapital)],
        ['Pre-Operational Expenses', ''],
        ['  - Marketing', formatCurrency(investment.preOperational.marketing)],
        ['  - Deposits', formatCurrency(investment.preOperational.deposits)],
        ['  - Insurance', formatCurrency(investment.preOperational.insurance)]
    ];
    
    investmentData.forEach(([label, value]) => {
        if (value) {
            addText(label, margin, yPosition);
            addText(value, pageWidth - margin - 50, yPosition);
        } else {
            addText(label, margin, yPosition, { style: 'bold' });
        }
        yPosition += 8;
    });
    
    // Operational Assumptions
    checkPageBreak(60);
    yPosition += 20;
    addText('Operational Assumptions', margin, yPosition, { size: 16, style: 'bold' });
    yPosition += 10;
    addLine(yPosition);
    yPosition += 10;
    
    const premises = AppState.data.premises;
    const operationalData = [
        ['Working Days per Month', premises.workingDays + ' days'],
        ['Average Ticket - In Store', formatCurrency(premises.averageTicket.inStore)],
        ['Average Ticket - Delivery', formatCurrency(premises.averageTicket.delivery)],
        ['Sales Mix - In Store', (premises.ticketRatio.inStore * 100) + '%'],
        ['Sales Mix - Delivery', (premises.ticketRatio.delivery * 100) + '%'],
        ['Cost of Goods', (premises.cogsPercent * 100) + '%'],
        ['Delivery Commission', (premises.deliveryCommission * 100) + '%'],
        ['Monthly Ticket Projection', premises.monthlyTickets.toLocaleString()],
        ['Daily Ticket Average', premises.dailyTickets.toLocaleString()],
        ['Average Cost per Ticket', formatCurrency(AppState.data.results.avgCostPerTicket)],
        ['Break-even Tickets', AppState.data.results.breakEvenTickets.toLocaleString()]
    ];
    
    operationalData.forEach(([label, value]) => {
        addText(label + ':', margin, yPosition);
        addText(value, pageWidth - margin - 50, yPosition);
        yPosition += 8;
    });
    
    // Cash Flow Summary - Year 1
    doc.addPage();
    yPosition = margin;
    
    addText('Cash Flow Projection - Year 1', margin, yPosition, { size: 16, style: 'bold' });
    yPosition += 10;
    addLine(yPosition);
    yPosition += 10;
    
    // Table headers
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    const columns = ['Month', 'Revenue', 'Expenses', 'Net Cash Flow', 'Cumulative'];
    const columnWidths = [30, 35, 35, 35, 35];
    let xPos = margin;
    
    columns.forEach((col, i) => {
        addText(col, xPos, yPosition);
        xPos += columnWidths[i];
    });
    
    doc.setFont(undefined, 'normal');
    yPosition += 8;
    
    // Cash flow data
    AppState.data.cashFlow.year1.forEach((month, index) => {
        if (index % 3 === 0) { // Show quarterly data
            xPos = margin;
            addText(month.month.substring(0, 3), xPos, yPosition);
            xPos += columnWidths[0];
            addText(formatCurrency(month.revenue), xPos, yPosition);
            xPos += columnWidths[1];
            addText(formatCurrency(month.totalExpenses), xPos, yPosition);
            xPos += columnWidths[2];
            addText(formatCurrency(month.netCashFlow), xPos, yPosition);
            xPos += columnWidths[3];
            addText(formatCurrency(month.cumulativeCashFlow), xPos, yPosition);
            yPosition += 6;
        }
    });
    
    // Year 1 Totals
    yPosition += 5;
    const year1Totals = calculateCashFlowTotals(AppState.data.cashFlow.year1);
    doc.setFont(undefined, 'bold');
    xPos = margin;
    addText('TOTAL', xPos, yPosition);
    xPos += columnWidths[0];
    addText(formatCurrency(year1Totals.revenue), xPos, yPosition);
    xPos += columnWidths[1];
    addText(formatCurrency(year1Totals.totalExpenses), xPos, yPosition);
    xPos += columnWidths[2];
    addText(formatCurrency(year1Totals.netCashFlow), xPos, yPosition);
    
    // Financial Analysis
    checkPageBreak(80);
    yPosition += 20;
    doc.setFontSize(12);
    addText('Financial Analysis', margin, yPosition, { size: 16, style: 'bold' });
    yPosition += 10;
    addLine(yPosition);
    yPosition += 10;
    
    const analysisData = [
        ['Gross Margin Year 1', ((1 - 0.35) * 100).toFixed(1) + '%'],
        ['Net Margin Year 1', AppState.data.results.year1.margin.toFixed(1) + '%'],
        ['Revenue Growth Year 2', '25.7%'],
        ['2-Year Total Return', formatCurrency(AppState.data.results.year1.profit + AppState.data.results.year2.profit)],
        ['Return on Investment', AppState.data.results.roi.toFixed(1) + '%'],
        ['Payback Period', (totalInvestment / AppState.data.results.year1.profit).toFixed(1) + ' years']
    ];
    
    doc.setFont(undefined, 'normal');
    analysisData.forEach(([label, value]) => {
        addText(label + ':', margin, yPosition);
        addText(value, pageWidth - margin - 50, yPosition);
        yPosition += 8;
    });
    
    // Risk Assessment
    yPosition += 15;
    addText('Key Risks & Mitigation', margin, yPosition, { size: 14, style: 'bold' });
    yPosition += 8;
    
    const risks = [
        '• Market Competition: Differentiate through quality and service',
        '• Cost Inflation: Build 10% buffer in projections',
        '• Seasonal Variations: Maintain adequate working capital',
        '• Staff Turnover: Invest in training and retention programs'
    ];
    
    doc.setFontSize(11);
    risks.forEach(risk => {
        addText(risk, margin, yPosition);
        yPosition += 6;
    });
    
    // Recommendations
    yPosition += 10;
    addText('Recommendations', margin, yPosition, { size: 14, style: 'bold' });
    yPosition += 8;
    
    const recommendations = [
        '• Secure funding before lease signing',
        '• Start marketing 2 months before opening',
        '• Establish supplier relationships early',
        '• Consider phased opening approach'
    ];
    
    recommendations.forEach(rec => {
        addText(rec, margin, yPosition);
        yPosition += 6;
    });
    
    // Footer on each page
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        addText(
            'Restaurant Business Plan - Generated on ' + new Date().toLocaleDateString(), 
            pageWidth / 2, 
            pageHeight - 10, 
            { align: 'center' }
        );
        addText(
            'Page ' + i + ' of ' + totalPages,
            pageWidth - margin,
            pageHeight - 10,
            { align: 'right' }
        );
    }
    
    // Save the PDF
    doc.save(`restaurant-business-plan-${new Date().toISOString().split('T')[0]}.pdf`);
    showToast('PDF exported successfully! 📄', 'success');
}

// Export to Excel-compatible CSV
function exportToCSV() {
    const csvContent = [];
    
    // Title
    csvContent.push(['Restaurant Business Plan Export']);
    csvContent.push(['Generated on', new Date().toLocaleDateString()]);
    csvContent.push([]);
    
    // Investment Summary
    csvContent.push(['INVESTMENT SUMMARY']);
    csvContent.push(['Category', 'Item', 'Quantity', 'Unit Cost', 'Total']);
    
    const inv = AppState.data.investment;
    csvContent.push(['Business Setup', 'Civil Works', inv.businessSetup.civilWorks.quantity, 
                     inv.businessSetup.civilWorks.unitCost, inv.businessSetup.civilWorks.total]);
    csvContent.push(['Business Setup', 'Equipment', inv.businessSetup.equipment.quantity, 
                     inv.businessSetup.equipment.unitCost, inv.businessSetup.equipment.total]);
    csvContent.push(['Business Setup', 'Inventory', inv.businessSetup.inventory.quantity, 
                     inv.businessSetup.inventory.unitCost, inv.businessSetup.inventory.total]);
    csvContent.push(['Working Capital', '', '', '', inv.workingCapital]);
    csvContent.push(['Pre-Operational', 'Marketing', '', '', inv.preOperational.marketing]);
    csvContent.push(['Pre-Operational', 'Deposits', '', '', inv.preOperational.deposits]);
    csvContent.push(['Pre-Operational', 'Insurance', '', '', inv.preOperational.insurance]);
    csvContent.push([]);
    
    // Cash Flow Year 1
    csvContent.push(['CASH FLOW - YEAR 1']);
    csvContent.push(['Month', 'Revenue', 'COGS', 'Labor', 'Rent', 'Utilities', 
                     'Marketing', 'Other', 'Loan', 'Total Expenses', 'Net Cash Flow', 'Cumulative']);
    
    AppState.data.cashFlow.year1.forEach(month => {
        csvContent.push([
            month.month,
            month.revenue,
            month.cogs,
            month.labor,
            month.rent,
            month.utilities,
            month.marketing,
            month.other,
            month.loanPayment,
            month.totalExpenses,
            month.netCashFlow,
            month.cumulativeCashFlow
        ]);
    });
    
    // Convert to CSV string
    const csvString = csvContent.map(row => 
        row.map(cell => {
            // Escape quotes and wrap in quotes if contains comma
            const cellStr = String(cell);
            if (cellStr.includes(',') || cellStr.includes('"')) {
                return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
        }).join(',')
    ).join('\n');
    
    // Download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `restaurant-business-plan-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('CSV exported successfully! 📊', 'success');
}

// Print functionality
function printReport() {
    window.print();
    showToast('Print dialog opened 🖨️', 'info');
}

// Share functionality
async function shareReport() {
    const shareData = {
        title: 'Restaurant Business Plan',
        text: `Check out my restaurant business plan: ${AppState.data.results.roi.toFixed(1)}% ROI projected!`,
        url: window.location.href
    };
    
    try {
        if (navigator.share) {
            await navigator.share(shareData);
            showToast('Shared successfully! 🎉', 'success');
        } else {
            // Fallback: Copy to clipboard
            const text = `Restaurant Business Plan\n` +
                        `Total Investment: ${formatCurrency(getTotalInvestment(AppState.data.investment))}\n` +
                        `Projected ROI: ${AppState.data.results.roi.toFixed(1)}%\n` +
                        `Break-even: ${AppState.data.results.breakEvenMonths} months`;
            
            await navigator.clipboard.writeText(text);
            showToast('Summary copied to clipboard! 📋', 'success');
        }
    } catch (error) {
        console.error('Error sharing:', error);
        showToast('Failed to share', 'error');
    }
}

// Export functions
window.ExportManager = {
    exportToPDF,
    exportToCSV,
    printReport,
    shareReport
};