// Restaurant Business Calculator - Calculation Engine

// Cash Flow Generation
function generateCashFlow() {
    const premises = AppState.data.premises;
    const investment = AppState.data.investment;
    
    // Calculate monthly revenue (net of delivery commission)
    const avgTicketGross = (premises.averageTicket.inStore * premises.ticketRatio.inStore) +
                          (premises.averageTicket.delivery * premises.ticketRatio.delivery);
    const commissionPerTicket = premises.averageTicket.delivery * premises.deliveryCommission * premises.ticketRatio.delivery;
    const avgTicketNet = avgTicketGross - commissionPerTicket;
    const monthlyRevenue = premises.monthlyTickets * avgTicketNet;
    
    // Year 1 Cash Flow
    const year1CashFlow = generateYearCashFlow(monthlyRevenue, 1, investment);
    AppState.data.cashFlow.year1 = year1CashFlow;
    
    // Year 2 Cash Flow (with 25.7% growth)
    const year2Revenue = monthlyRevenue * 1.257;
    const year2CashFlow = generateYearCashFlow(year2Revenue, 2, investment);
    AppState.data.cashFlow.year2 = year2CashFlow;
    
    // Display current year
    const activeYear = document.querySelector('.year-btn.active').getAttribute('data-year');
    displayCashFlowTable(activeYear);
}

// Generate Year Cash Flow
function generateYearCashFlow(baseMonthlyRevenue, year, investment) {
    const cashFlow = [];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Seasonal factors (restaurant business typically has variations)
    const seasonalFactors = [0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 
                            1.15, 1.15, 1.1, 1.05, 1.0, 1.2]; // December boost
    
    let cumulativeCashFlow = year === 1 ? -getTotalInvestment(investment) : 0;
    
    for (let i = 0; i < 12; i++) {
        const month = months[i];
        const seasonalFactor = seasonalFactors[i];
        
        // Revenue with seasonal adjustment
        const revenue = baseMonthlyRevenue * seasonalFactor;
        
        // Cost calculations (percentages based on industry standards)
        const cogs = revenue * AppState.data.premises.cogsPercent; // Cost of goods sold
        const labor = revenue * 0.30; // 30% labor costs
        const rent = 5000; // Fixed rent
        const utilities = revenue * 0.05; // 5% utilities
        const marketing = revenue * 0.03; // 3% marketing
        const other = revenue * 0.05; // 5% other expenses
        
        // Loan payment (if applicable)
        const loanPayment = year === 1 ? 2000 : 1500; // Decreasing loan payments
        
        const totalExpenses = cogs + labor + rent + utilities + marketing + other + loanPayment;
        const netCashFlow = revenue - totalExpenses;
        cumulativeCashFlow += netCashFlow;
        
        cashFlow.push({
            month: month,
            revenue: revenue,
            cogs: cogs,
            labor: labor,
            rent: rent,
            utilities: utilities,
            marketing: marketing,
            other: other,
            loanPayment: loanPayment,
            totalExpenses: totalExpenses,
            netCashFlow: netCashFlow,
            cumulativeCashFlow: cumulativeCashFlow
        });
    }
    
    return cashFlow;
}

// Get Total Investment
function getTotalInvestment(investment) {
    const setupTotal = Object.values(investment.businessSetup)
        .reduce((sum, item) => sum + item.total, 0);
    const preopTotal = Object.values(investment.preOperational)
        .reduce((sum, cost) => sum + cost, 0);
    return setupTotal + investment.workingCapital + preopTotal;
}

// Display Cash Flow Table
function displayCashFlowTable(year) {
    const cashFlow = year === '1' ? AppState.data.cashFlow.year1 : AppState.data.cashFlow.year2;
    const table = document.getElementById('cashflow-table');
    
    // Create table HTML
    let html = `
        <thead>
            <tr>
                <th>Month</th>
                <th>Revenue</th>
                <th>COGS</th>
                <th>Labor</th>
                <th>Rent</th>
                <th>Utilities</th>
                <th>Marketing</th>
                <th>Other</th>
                <th>Loan</th>
                <th>Total Expenses</th>
                <th>Net Cash Flow</th>
                <th>Cumulative</th>
            </tr>
        </thead>
        <tbody>
    `;
    
    cashFlow.forEach((month, index) => {
        html += `
            <tr>
                <td>${month.month}</td>
                <td>${formatCurrency(month.revenue)}</td>
                <td>${formatCurrency(month.cogs)}</td>
                <td>${formatCurrency(month.labor)}</td>
                <td>${formatCurrency(month.rent)}</td>
                <td>${formatCurrency(month.utilities)}</td>
                <td>${formatCurrency(month.marketing)}</td>
                <td>${formatCurrency(month.other)}</td>
                <td>${formatCurrency(month.loanPayment)}</td>
                <td>${formatCurrency(month.totalExpenses)}</td>
                <td class="${month.netCashFlow >= 0 ? 'positive' : 'negative'}">
                    ${formatCurrency(month.netCashFlow)}
                </td>
                <td class="${month.cumulativeCashFlow >= 0 ? 'positive' : 'negative'}">
                    ${formatCurrency(month.cumulativeCashFlow)}
                </td>
            </tr>
        `;
    });
    
    // Add totals row
    const totals = calculateCashFlowTotals(cashFlow);
    html += `
        <tr class="totals-row">
            <td><strong>TOTAL</strong></td>
            <td><strong>${formatCurrency(totals.revenue)}</strong></td>
            <td><strong>${formatCurrency(totals.cogs)}</strong></td>
            <td><strong>${formatCurrency(totals.labor)}</strong></td>
            <td><strong>${formatCurrency(totals.rent)}</strong></td>
            <td><strong>${formatCurrency(totals.utilities)}</strong></td>
            <td><strong>${formatCurrency(totals.marketing)}</strong></td>
            <td><strong>${formatCurrency(totals.other)}</strong></td>
            <td><strong>${formatCurrency(totals.loanPayment)}</strong></td>
            <td><strong>${formatCurrency(totals.totalExpenses)}</strong></td>
            <td class="${totals.netCashFlow >= 0 ? 'positive' : 'negative'}">
                <strong>${formatCurrency(totals.netCashFlow)}</strong>
            </td>
            <td class="${totals.cumulativeCashFlow >= 0 ? 'positive' : 'negative'}">
                <strong>${formatCurrency(totals.cumulativeCashFlow)}</strong>
            </td>
        </tr>
    `;
    
    html += '</tbody>';
    table.innerHTML = html;
    
    // Update cash flow chart
    updateCashFlowChart();
}

// Calculate Cash Flow Totals
function calculateCashFlowTotals(cashFlow) {
    return cashFlow.reduce((totals, month) => {
        totals.revenue += month.revenue;
        totals.cogs += month.cogs;
        totals.labor += month.labor;
        totals.rent += month.rent;
        totals.utilities += month.utilities;
        totals.marketing += month.marketing;
        totals.other += month.other;
        totals.loanPayment += month.loanPayment;
        totals.totalExpenses += month.totalExpenses;
        totals.netCashFlow += month.netCashFlow;
        totals.cumulativeCashFlow = month.cumulativeCashFlow; // Last month's cumulative
        return totals;
    }, {
        revenue: 0,
        cogs: 0,
        labor: 0,
        rent: 0,
        utilities: 0,
        marketing: 0,
        other: 0,
        loanPayment: 0,
        totalExpenses: 0,
        netCashFlow: 0,
        cumulativeCashFlow: 0
    });
}

// Calculate Results
function calculateResults() {
    const year1Totals = calculateCashFlowTotals(AppState.data.cashFlow.year1);
    const year2Totals = calculateCashFlowTotals(AppState.data.cashFlow.year2);
    const totalInvestment = getTotalInvestment(AppState.data.investment);
    
    // Year 1 Results
    AppState.data.results.year1 = {
        sales: year1Totals.revenue,
        costs: year1Totals.totalExpenses,
        profit: year1Totals.netCashFlow,
        margin: (year1Totals.netCashFlow / year1Totals.revenue) * 100
    };
    
    // Year 2 Results
    AppState.data.results.year2 = {
        sales: year2Totals.revenue,
        costs: year2Totals.totalExpenses,
        profit: year2Totals.netCashFlow,
        margin: (year2Totals.netCashFlow / year2Totals.revenue) * 100
    };
    
    // ROI Calculation
    const totalReturn = year1Totals.netCashFlow + year2Totals.netCashFlow;
    AppState.data.results.roi = (totalReturn / totalInvestment) * 100;
    
    // Break-even Analysis
    const premises = AppState.data.premises;
    const monthlyFixedCosts = 5000 + 2000; // Rent + base loan
    const avgTicketGross = (premises.averageTicket.inStore * premises.ticketRatio.inStore) +
                           (premises.averageTicket.delivery * premises.ticketRatio.delivery);
    const commissionRatio = (premises.averageTicket.delivery * premises.deliveryCommission * premises.ticketRatio.delivery) / avgTicketGross;
    const variableCostRatio = premises.cogsPercent + commissionRatio;
    const contributionMargin = 1 - variableCostRatio;
    AppState.data.results.breakEvenSales = monthlyFixedCosts / contributionMargin;
    const avgVariableCostPerTicket = avgTicketGross * variableCostRatio;
    AppState.data.results.breakEvenTickets = Math.ceil(AppState.data.results.breakEvenSales / avgTicketGross);
    AppState.data.results.avgCostPerTicket = avgVariableCostPerTicket;
    
    // Find break-even month
    let breakEvenMonth = 0;
    for (let i = 0; i < AppState.data.cashFlow.year1.length; i++) {
        if (AppState.data.cashFlow.year1[i].cumulativeCashFlow >= 0) {
            breakEvenMonth = i + 1;
            break;
        }
    }
    AppState.data.results.breakEvenMonths = breakEvenMonth || 24; // If not in year 1, estimate
}

// Update Results Tab
function updateResultsTab() {
    const results = AppState.data.results;
    
    // Update metric cards
    document.getElementById('year1-revenue').textContent = formatCurrency(results.year1.sales);
    document.getElementById('year2-revenue').textContent = formatCurrency(results.year2.sales);
    document.getElementById('profit-margin').textContent = results.year1.margin.toFixed(1) + '%';
    document.getElementById('roi').textContent = results.roi.toFixed(1) + '%';
    
    // Update break-even info
    document.getElementById('breakeven-months').textContent = results.breakEvenMonths + ' months';
    document.getElementById('breakeven-sales').textContent = formatCurrency(results.breakEvenSales);
    document.getElementById('breakeven-tickets').textContent = results.breakEvenTickets.toLocaleString();
    document.getElementById('avg-cost-ticket').textContent = formatCurrency(results.avgCostPerTicket);
    
    // Update financial summary
    const totalInvestment = getTotalInvestment(AppState.data.investment);
    document.getElementById('results-investment').textContent = formatCurrency(totalInvestment);
    document.getElementById('results-year1-net').textContent = formatCurrency(results.year1.profit);
    document.getElementById('results-year2-net').textContent = formatCurrency(results.year2.profit);
    document.getElementById('results-total-return').textContent = 
        formatCurrency(results.year1.profit + results.year2.profit);
    
    // Update all results charts
    updateProfitabilityChart();
    updateBreakEvenChart();
}

// Financial Metrics Calculations
function calculateGrossMargin(revenue, cogs) {
    return ((revenue - cogs) / revenue) * 100;
}

function calculateNetMargin(revenue, netProfit) {
    return (netProfit / revenue) * 100;
}

function calculatePaybackPeriod(investment, annualCashFlow) {
    return investment / annualCashFlow;
}

// Sensitivity Analysis
function performSensitivityAnalysis() {
    const baseCase = { ...AppState.data };
    const scenarios = {
        'Best Case': { revenueMultiplier: 1.2, costMultiplier: 0.9 },
        'Base Case': { revenueMultiplier: 1.0, costMultiplier: 1.0 },
        'Worst Case': { revenueMultiplier: 0.8, costMultiplier: 1.1 }
    };
    
    const results = {};
    
    Object.entries(scenarios).forEach(([name, scenario]) => {
        // Apply scenario multipliers
        const scenarioRevenue = baseCase.results.year1.sales * scenario.revenueMultiplier;
        const scenarioCosts = baseCase.results.year1.costs * scenario.costMultiplier;
        const scenarioProfit = scenarioRevenue - scenarioCosts;
        const scenarioROI = (scenarioProfit / getTotalInvestment(baseCase.investment)) * 100;
        
        results[name] = {
            revenue: scenarioRevenue,
            costs: scenarioCosts,
            profit: scenarioProfit,
            roi: scenarioROI
        };
    });
    
    return results;
}

// Industry Benchmarks
function compareToIndustryBenchmarks() {
    const benchmarks = {
        'Food Cost %': { value: 35, industry: 28-35 },
        'Labor Cost %': { value: 30, industry: 25-35 },
        'Prime Cost %': { value: 65, industry: 55-65 },
        'Net Profit Margin %': { value: AppState.data.results.year1.margin, industry: 3-10 },
        'ROI %': { value: AppState.data.results.roi, industry: 15-25 }
    };
    
    return benchmarks;
}

// Export calculations for other modules
window.RestaurantCalculator = {
    generateCashFlow,
    calculateResults,
    updateResultsTab,
    getTotalInvestment,
    performSensitivityAnalysis,
    compareToIndustryBenchmarks
};