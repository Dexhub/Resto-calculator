// Restaurant Business Calculator - Charts & Visualizations

// Chart instances storage
const chartInstances = {
    investment: null,
    premises: null,
    cashFlow: null,
    profitability: null,
    breakEven: null
};

// Chart.js default configuration
Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
Chart.defaults.color = '#374151';
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(17, 24, 39, 0.9)';
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.displayColors = false;

// Update Investment Chart
function updateInvestmentChart(setup, working, preop) {
    const ctx = document.getElementById('investment-chart').getContext('2d');
    
    // Destroy existing chart
    if (chartInstances.investment) {
        chartInstances.investment.destroy();
    }
    
    chartInstances.investment = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Business Setup', 'Working Capital', 'Pre-Operational'],
            datasets: [{
                data: [setup, working, preop],
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            size: 12,
                            weight: 500
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = formatCurrency(context.parsed);
                            const percentage = ((context.parsed / (setup + working + preop)) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true
            }
        }
    });
}

// Update Premises Chart
function updatePremisesChart() {
    const ctx = document.getElementById('premises-chart').getContext('2d');
    const premises = AppState.data.premises;
    
    // Destroy existing chart
    if (chartInstances.premises) {
        chartInstances.premises.destroy();
    }
    
    // Calculate data for visualization
    const inStoreRevenue = premises.monthlyTickets * premises.ticketRatio.inStore * premises.averageTicket.inStore;
    const deliveryRevenue = premises.monthlyTickets * premises.ticketRatio.delivery * premises.averageTicket.delivery;
    
    chartInstances.premises = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['In-Store', 'Delivery'],
            datasets: [
                {
                    label: 'Monthly Revenue',
                    data: [inStoreRevenue, deliveryRevenue],
                    backgroundColor: ['#3B82F6', '#10B981'],
                    borderRadius: 8,
                    barThickness: 60
                },
                {
                    label: 'Ticket Count',
                    data: [
                        premises.monthlyTickets * premises.ticketRatio.inStore,
                        premises.monthlyTickets * premises.ticketRatio.delivery
                    ],
                    backgroundColor: ['rgba(59, 130, 246, 0.3)', 'rgba(16, 185, 129, 0.3)'],
                    borderRadius: 8,
                    barThickness: 60,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    },
                    title: {
                        display: true,
                        text: 'Revenue ($)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    title: {
                        display: true,
                        text: 'Ticket Count'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            weight: 500
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                            } else {
                                return `${context.dataset.label}: ${Math.round(context.parsed.y).toLocaleString()}`;
                            }
                        }
                    }
                }
            }
        }
    });
}

// Update Cash Flow Chart
function updateCashFlowChart() {
    const ctx = document.getElementById('cashflow-chart').getContext('2d');
    const activeYear = document.querySelector('.year-btn.active').getAttribute('data-year');
    const cashFlow = activeYear === '1' ? AppState.data.cashFlow.year1 : AppState.data.cashFlow.year2;
    
    // Destroy existing chart
    if (chartInstances.cashFlow) {
        chartInstances.cashFlow.destroy();
    }
    
    const months = cashFlow.map(m => m.month.substring(0, 3));
    const revenues = cashFlow.map(m => m.revenue);
    const expenses = cashFlow.map(m => m.totalExpenses);
    const netCashFlows = cashFlow.map(m => m.netCashFlow);
    const cumulative = cashFlow.map(m => m.cumulativeCashFlow);
    
    chartInstances.cashFlow = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Revenue',
                    data: revenues,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Expenses',
                    data: expenses,
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Net Cash Flow',
                    data: netCashFlows,
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Cumulative',
                    data: cumulative,
                    borderColor: '#8B5CF6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    },
                    title: {
                        display: true,
                        text: 'Monthly Amount ($)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    },
                    title: {
                        display: true,
                        text: 'Cumulative ($)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            weight: 500
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                        }
                    }
                }
            }
        }
    });
}

// Update Profitability Chart
function updateProfitabilityChart() {
    const ctx = document.getElementById('profitability-chart').getContext('2d');
    const results = AppState.data.results;
    
    // Destroy existing chart
    if (chartInstances.profitability) {
        chartInstances.profitability.destroy();
    }
    
    chartInstances.profitability = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Year 1', 'Year 2'],
            datasets: [
                {
                    label: 'Revenue',
                    data: [results.year1.sales, results.year2.sales],
                    backgroundColor: '#3B82F6',
                    borderRadius: 8,
                    barThickness: 40
                },
                {
                    label: 'Costs',
                    data: [results.year1.costs, results.year2.costs],
                    backgroundColor: '#EF4444',
                    borderRadius: 8,
                    barThickness: 40
                },
                {
                    label: 'Net Profit',
                    data: [results.year1.profit, results.year2.profit],
                    backgroundColor: '#10B981',
                    borderRadius: 8,
                    barThickness: 40
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            weight: 500
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = formatCurrency(context.parsed.y);
                            const percentage = context.datasetIndex === 2 ? 
                                ` (${results[context.label.toLowerCase().replace(' ', '')].margin.toFixed(1)}% margin)` : '';
                            return `${context.dataset.label}: ${value}${percentage}`;
                        }
                    }
                }
            }
        }
    });
}

// Update Break-Even Chart
function updateBreakEvenChart() {
    const ctx = document.getElementById('breakeven-chart').getContext('2d');
    
    // Destroy existing chart
    if (chartInstances.breakEven) {
        chartInstances.breakEven.destroy();
    }
    
    // Generate break-even data points
    const months = Array.from({length: 24}, (_, i) => `Month ${i + 1}`);
    const fixedCosts = Array(24).fill(7000); // Rent + base expenses
    const totalCosts = [];
    const revenues = [];
    const monthlyRevenue = AppState.data.results.year1.sales / 12;
    const variableCostRatio = 0.65; // 65% variable costs
    
    for (let i = 0; i < 24; i++) {
        const revenue = monthlyRevenue * (i + 1);
        revenues.push(revenue);
        totalCosts.push(fixedCosts[0] * (i + 1) + (revenue * variableCostRatio));
    }
    
    chartInstances.breakEven = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Total Revenue',
                    data: revenues,
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    tension: 0
                },
                {
                    label: 'Total Costs',
                    data: totalCosts,
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    tension: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            weight: 500
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                        },
                        afterLabel: function(context) {
                            if (context.dataIndex === AppState.data.results.breakEvenMonths - 1) {
                                return '🎯 Break-even point!';
                            }
                        }
                    }
                },
                annotation: {
                    annotations: {
                        breakEvenLine: {
                            type: 'line',
                            xMin: AppState.data.results.breakEvenMonths - 1,
                            xMax: AppState.data.results.breakEvenMonths - 1,
                            borderColor: 'rgba(139, 92, 246, 0.8)',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            label: {
                                content: 'Break-even',
                                enabled: true,
                                position: 'top'
                            }
                        }
                    }
                }
            }
        }
    });
}

// Update All Charts
function updateAllCharts() {
    // Get current values for investment chart
    const investment = AppState.data.investment;
    const setupTotal = Object.values(investment.businessSetup)
        .reduce((sum, item) => sum + item.total, 0);
    const preopTotal = Object.values(investment.preOperational)
        .reduce((sum, cost) => sum + cost, 0);
    
    updateInvestmentChart(setupTotal, investment.workingCapital, preopTotal);
    updatePremisesChart();
    updateCashFlowChart();
    
    if (AppState.currentTab === 'results') {
        updateProfitabilityChart();
        updateBreakEvenChart();
    }
}

// Export chart update functions
window.ChartUpdater = {
    updateInvestmentChart,
    updatePremisesChart,
    updateCashFlowChart,
    updateProfitabilityChart,
    updateBreakEvenChart,
    updateAllCharts
};