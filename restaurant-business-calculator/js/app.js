// Restaurant Business Calculator - Main Application
'use strict';

// Application State
const AppState = {
    currentTab: 'investment',
    data: {
        investment: {
            businessSetup: {
                civilWorks: { quantity: 0, unitCost: 180000, total: 0 },
                equipment: { quantity: 0, unitCost: 30000, total: 0 },
                inventory: { quantity: 0, unitCost: 15000, total: 0 }
            },
            workingCapital: 45000,
            preOperational: {
                marketing: 5000,
                deposits: 8000,
                insurance: 3000
            }
        },
        premises: {
            workingDays: 20,
            averageTicket: {
                inStore: 15,
                delivery: 15
            },
            ticketRatio: {
                inStore: 0.5,
                delivery: 0.5
            },
            cogsPercent: 0.35,
            deliveryCommission: 0,
            itemsPerTicket: 6,
            monthlyTickets: 1333,
            dailyTickets: 67
        },
        cashFlow: {
            year1: [],
            year2: []
        },
        results: {
            year1: { sales: 0, costs: 0, profit: 0, margin: 0 },
            year2: { sales: 0, costs: 0, profit: 0, margin: 0 },
            roi: 0,
            breakEvenMonths: 0,
            breakEvenSales: 0,
            breakEvenTickets: 0,
            avgCostPerTicket: 0
        }
    },
    isCalculating: false,
    hasUnsavedChanges: false
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Restaurant Business Calculator Initialized');
    
    // Initialize modules
    initializeEventListeners();
    
    // Check for template parameter
    const urlParams = new URLSearchParams(window.location.search);
    const templateName = urlParams.get('template');
    
    if (templateName) {
        loadTemplate(templateName);
        showToast(`Loaded ${templateName.replace(/([A-Z])/g, ' $1').trim()} template! 🎯`, 'success');
    } else {
        loadSavedData();
        initializeDefaultValues();
    }
    
    updateAllCalculations();
    
    // Show welcome message
    if (!templateName) {
        showToast('Welcome to Restaurant Business Planner! 🍴', 'success');
    }
});

// Event Listeners
function initializeEventListeners() {
    // Tab Navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', handleTabSwitch);
    });
    
    // Investment Inputs
    setupInvestmentListeners();
    
    // Premises Inputs
    setupPremisesListeners();
    
    // Action Buttons
    document.getElementById('saveBtn').addEventListener('click', handleSave);
    document.getElementById('loadBtn').addEventListener('click', handleLoad);
    document.getElementById('exportBtn').addEventListener('click', handleExport);
    document.getElementById('helpBtn').addEventListener('click', handleHelp);
    document.getElementById('calculate-btn').addEventListener('click', handleCalculate);
    
    // Year Selection
    document.querySelectorAll('.year-btn').forEach(btn => {
        btn.addEventListener('click', handleYearSwitch);
    });
    
    // Auto-save on changes
    setupAutoSave();
}

// Tab Switching
function handleTabSwitch(e) {
    const targetTab = e.currentTarget.getAttribute('data-tab');
    
    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Update content tabs
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${targetTab}-tab`).classList.add('active');
    
    AppState.currentTab = targetTab;
    
    // Trigger calculations if needed
    if (targetTab === 'results') {
        updateResultsTab();
    }
}

// Investment Listeners
function setupInvestmentListeners() {
    // Civil Works
    const civilQty = document.getElementById('civil-works-qty');
    const civilCost = document.getElementById('civil-works-cost');
    
    civilQty.addEventListener('input', () => {
        updateInvestmentItem('civilWorks', 'quantity', parseFloat(civilQty.value) || 0);
    });
    
    civilCost.addEventListener('input', () => {
        updateInvestmentItem('civilWorks', 'unitCost', parseFloat(civilCost.value) || 0);
    });
    
    // Equipment
    const equipQty = document.getElementById('equipment-qty');
    const equipCost = document.getElementById('equipment-cost');
    
    equipQty.addEventListener('input', () => {
        updateInvestmentItem('equipment', 'quantity', parseFloat(equipQty.value) || 0);
    });
    
    equipCost.addEventListener('input', () => {
        updateInvestmentItem('equipment', 'unitCost', parseFloat(equipCost.value) || 0);
    });
    
    // Inventory
    const invQty = document.getElementById('inventory-qty');
    const invCost = document.getElementById('inventory-cost');
    
    invQty.addEventListener('input', () => {
        updateInvestmentItem('inventory', 'quantity', parseFloat(invQty.value) || 0);
    });
    
    invCost.addEventListener('input', () => {
        updateInvestmentItem('inventory', 'unitCost', parseFloat(invCost.value) || 0);
    });
    
    // Working Capital
    document.getElementById('working-capital').addEventListener('input', (e) => {
        AppState.data.investment.workingCapital = parseFloat(e.target.value) || 0;
        updateInvestmentSummary();
        markUnsavedChanges();
    });
    
    // Pre-operational
    document.getElementById('marketing').addEventListener('input', (e) => {
        AppState.data.investment.preOperational.marketing = parseFloat(e.target.value) || 0;
        updateInvestmentSummary();
        markUnsavedChanges();
    });
    
    document.getElementById('deposits').addEventListener('input', (e) => {
        AppState.data.investment.preOperational.deposits = parseFloat(e.target.value) || 0;
        updateInvestmentSummary();
        markUnsavedChanges();
    });
    
    document.getElementById('insurance').addEventListener('input', (e) => {
        AppState.data.investment.preOperational.insurance = parseFloat(e.target.value) || 0;
        updateInvestmentSummary();
        markUnsavedChanges();
    });
}

// Premises Listeners
function setupPremisesListeners() {
    // Working Days
    document.getElementById('working-days').addEventListener('input', (e) => {
        AppState.data.premises.workingDays = parseInt(e.target.value) || 20;
        updatePremisesCalculations();
        markUnsavedChanges();
    });
    
    // Average Items
    document.getElementById('avg-items').addEventListener('input', (e) => {
        AppState.data.premises.itemsPerTicket = parseInt(e.target.value) || 6;
        updatePremisesCalculations();
        markUnsavedChanges();
    });
    
    // Ticket Prices
    document.getElementById('ticket-instore').addEventListener('input', (e) => {
        AppState.data.premises.averageTicket.inStore = parseFloat(e.target.value) || 15;
        updatePremisesCalculations();
        markUnsavedChanges();
    });
    
    document.getElementById('ticket-delivery').addEventListener('input', (e) => {
        AppState.data.premises.averageTicket.delivery = parseFloat(e.target.value) || 15;
        updatePremisesCalculations();
        markUnsavedChanges();
    });

    // Cost percentages
    document.getElementById('cogs-percent').addEventListener('input', (e) => {
        AppState.data.premises.cogsPercent = (parseFloat(e.target.value) || 0) / 100;
        updatePremisesCalculations();
        markUnsavedChanges();
    });

    document.getElementById('delivery-commission').addEventListener('input', (e) => {
        AppState.data.premises.deliveryCommission = (parseFloat(e.target.value) || 0) / 100;
        updatePremisesCalculations();
        markUnsavedChanges();
    });
    
    // Sales Ratio
    const ratioInstore = document.getElementById('ratio-instore');
    ratioInstore.addEventListener('input', (e) => {
        const value = parseInt(e.target.value) || 50;
        AppState.data.premises.ticketRatio.inStore = value / 100;
        AppState.data.premises.ticketRatio.delivery = (100 - value) / 100;
        
        document.getElementById('ratio-instore-value').textContent = value + '%';
        document.getElementById('ratio-delivery-value').textContent = (100 - value) + '%';
        document.getElementById('ratio-delivery').value = 100 - value;
        
        updatePremisesCalculations();
        markUnsavedChanges();
    });
}

// Update Investment Item
function updateInvestmentItem(item, field, value) {
    AppState.data.investment.businessSetup[item][field] = value;
    
    // Calculate total
    const itemData = AppState.data.investment.businessSetup[item];
    itemData.total = itemData.quantity * itemData.unitCost;
    
    // Update UI
    document.getElementById(`${item.replace(/([A-Z])/g, '-$1').toLowerCase()}-total`).value = 
        formatCurrency(itemData.total);
    
    updateInvestmentSummary();
    markUnsavedChanges();
}

// Update Investment Summary
function updateInvestmentSummary() {
    const investment = AppState.data.investment;
    
    // Calculate subtotals
    const setupSubtotal = Object.values(investment.businessSetup)
        .reduce((sum, item) => sum + item.total, 0);
    
    const preopSubtotal = Object.values(investment.preOperational)
        .reduce((sum, cost) => sum + cost, 0);
    
    const totalInvestment = setupSubtotal + investment.workingCapital + preopSubtotal;
    
    // Update UI
    document.getElementById('setup-subtotal').textContent = formatCurrency(setupSubtotal);
    document.getElementById('preop-subtotal').textContent = formatCurrency(preopSubtotal);
    document.getElementById('summary-setup').textContent = formatCurrency(setupSubtotal);
    document.getElementById('summary-working').textContent = formatCurrency(investment.workingCapital);
    document.getElementById('summary-preop').textContent = formatCurrency(preopSubtotal);
    document.getElementById('total-investment').textContent = formatCurrency(totalInvestment);
    
    // Update chart
    updateInvestmentChart(setupSubtotal, investment.workingCapital, preopSubtotal);
}

// Update Premises Calculations
function updatePremisesCalculations() {
    const premises = AppState.data.premises;

    // Calculate average ticket values
    const avgTicketGross = (premises.averageTicket.inStore * premises.ticketRatio.inStore) +
                          (premises.averageTicket.delivery * premises.ticketRatio.delivery);
    const commissionPerTicket = premises.averageTicket.delivery * premises.deliveryCommission * premises.ticketRatio.delivery;
    const avgTicketNet = avgTicketGross - commissionPerTicket;

    // Assuming target monthly revenue (net) and calculating tickets needed
    const targetMonthlyRevenue = 20000; // Base assumption
    premises.monthlyTickets = Math.round(targetMonthlyRevenue / avgTicketNet);
    premises.dailyTickets = Math.round(premises.monthlyTickets / premises.workingDays);

    // Update UI
    document.getElementById('monthly-tickets').textContent =
        premises.monthlyTickets.toLocaleString();
    document.getElementById('daily-tickets').textContent =
        premises.dailyTickets.toLocaleString();
    document.getElementById('monthly-revenue').textContent =
        formatCurrency(premises.monthlyTickets * avgTicketNet);

    // Update chart
    updatePremisesChart();

    // Trigger cash flow recalculation
    generateCashFlow();
}

// Year Switch Handler
function handleYearSwitch(e) {
    document.querySelectorAll('.year-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    const year = e.target.getAttribute('data-year');
    displayCashFlowTable(year);
}

// Calculate Button Handler
function handleCalculate() {
    if (AppState.isCalculating) return;
    
    AppState.isCalculating = true;
    const btn = document.getElementById('calculate-btn');
    btn.classList.add('loading');
    
    // Show calculating animation
    showToast('Calculating projections...', 'info');
    
    setTimeout(() => {
        updateAllCalculations();
        AppState.isCalculating = false;
        btn.classList.remove('loading');
        showToast('Calculations completed! 📊', 'success');
        
        // Add celebration animation
        if (AppState.data.results.roi > 30) {
            triggerConfetti();
        }
    }, 1000);
}

// Update All Calculations
function updateAllCalculations() {
    updateInvestmentSummary();
    updatePremisesCalculations();
    generateCashFlow();
    calculateResults();
    updateAllCharts();
}

// Initialize Default Values
function initializeDefaultValues() {
    // Set default values in UI
    document.getElementById('civil-works-qty').value = 1;
    document.getElementById('civil-works-cost').value = 180000;
    document.getElementById('equipment-qty').value = 1;
    document.getElementById('equipment-cost').value = 30000;
    document.getElementById('inventory-qty').value = 1;
    document.getElementById('inventory-cost').value = 15000;
    
    document.getElementById('working-capital').value = 45000;
    document.getElementById('marketing').value = 5000;
    document.getElementById('deposits').value = 8000;
    document.getElementById('insurance').value = 3000;
    
    document.getElementById('working-days').value = 20;
    document.getElementById('avg-items').value = 6;
    document.getElementById('ticket-instore').value = 15;
    document.getElementById('ticket-delivery').value = 15;
    document.getElementById('cogs-percent').value = 35;
    document.getElementById('delivery-commission').value = 0;
    
    // Update state
    updateInvestmentItem('civilWorks', 'quantity', 1);
    updateInvestmentItem('equipment', 'quantity', 1);
    updateInvestmentItem('inventory', 'quantity', 1);
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Show Toast Notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            ${type === 'success' ? '<path d="M10 18a8 8 0 100-16 8 8 0 000 16z" fill="currentColor"/><path d="M14 7l-5 5-2-2" stroke="white" stroke-width="2"/>' :
              type === 'error' ? '<path d="M10 18a8 8 0 100-16 8 8 0 000 16z" fill="currentColor"/><path d="M13 7L7 13M7 7l6 6" stroke="white" stroke-width="2"/>' :
              '<path d="M10 18a8 8 0 100-16 8 8 0 000 16z" fill="currentColor"/><path d="M10 6v5M10 14v0" stroke="white" stroke-width="2"/>'}
        </svg>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Mark Unsaved Changes
function markUnsavedChanges() {
    AppState.hasUnsavedChanges = true;
    // Could add visual indicator here
}

// Auto-save Setup
function setupAutoSave() {
    let autoSaveTimer;
    
    document.addEventListener('input', () => {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(() => {
            if (AppState.hasUnsavedChanges) {
                saveToLocalStorage();
                AppState.hasUnsavedChanges = false;
                console.log('Auto-saved');
            }
        }, 2000);
    });
}

// Save to LocalStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('restaurantBusinessData', JSON.stringify(AppState.data));
        localStorage.setItem('restaurantBusinessDataTimestamp', new Date().toISOString());
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
}

// Load Saved Data
function loadSavedData() {
    try {
        const savedData = localStorage.getItem('restaurantBusinessData');
        if (savedData) {
            AppState.data = JSON.parse(savedData);
            console.log('Loaded saved data');
        }
    } catch (e) {
        console.error('Failed to load saved data:', e);
    }
}

// Trigger Confetti Animation
function triggerConfetti() {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Modal Handlers
function handleSave() {
    document.getElementById('save-modal').classList.add('active');
}

function handleLoad() {
    displaySavedPlans();
    document.getElementById('load-modal').classList.add('active');
}

function handleExport() {
    exportToPDF();
}

function handleHelp() {
    document.getElementById('help-modal').classList.add('active');
}

// Close Modal Functions
window.closeSaveModal = () => {
    document.getElementById('save-modal').classList.remove('active');
};

window.closeLoadModal = () => {
    document.getElementById('load-modal').classList.remove('active');
};

window.closeHelpModal = () => {
    document.getElementById('help-modal').classList.remove('active');
};

// Save Plan
window.savePlan = () => {
    const name = document.getElementById('save-name').value.trim();
    if (!name) {
        showToast('Please enter a plan name', 'error');
        return;
    }
    
    const plans = JSON.parse(localStorage.getItem('savedPlans') || '{}');
    plans[name] = {
        data: AppState.data,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('savedPlans', JSON.stringify(plans));
    showToast(`Plan "${name}" saved successfully!`, 'success');
    closeSaveModal();
    document.getElementById('save-name').value = '';
};

// Display Saved Plans
function displaySavedPlans() {
    const plans = JSON.parse(localStorage.getItem('savedPlans') || '{}');
    const container = document.getElementById('saved-plans');
    
    container.innerHTML = '';
    
    if (Object.keys(plans).length === 0) {
        container.innerHTML = '<p class="text-center">No saved plans found</p>';
        return;
    }
    
    Object.entries(plans).forEach(([name, plan]) => {
        const item = document.createElement('div');
        item.className = 'saved-plan-item';
        item.innerHTML = `
            <div class="plan-info">
                <div class="plan-name">${name}</div>
                <div class="plan-date">${new Date(plan.timestamp).toLocaleDateString()}</div>
            </div>
            <div class="plan-actions">
                <button class="btn-icon" onclick="loadPlan('${name}')">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M3 12V7a7 7 0 0114 0v5M10 10v8" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </button>
                <button class="btn-icon" onclick="deletePlan('${name}')">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

// Load Plan
window.loadPlan = (name) => {
    const plans = JSON.parse(localStorage.getItem('savedPlans') || '{}');
    if (plans[name]) {
        AppState.data = plans[name].data;
        updateUIFromState();
        updateAllCalculations();
        showToast(`Plan "${name}" loaded successfully!`, 'success');
        closeLoadModal();
    }
};

// Delete Plan
window.deletePlan = (name) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
        const plans = JSON.parse(localStorage.getItem('savedPlans') || '{}');
        delete plans[name];
        localStorage.setItem('savedPlans', JSON.stringify(plans));
        displaySavedPlans();
        showToast(`Plan "${name}" deleted`, 'info');
    }
};

// Update UI from State
function updateUIFromState() {
    // Update Investment fields
    const inv = AppState.data.investment;
    document.getElementById('civil-works-qty').value = inv.businessSetup.civilWorks.quantity;
    document.getElementById('civil-works-cost').value = inv.businessSetup.civilWorks.unitCost;
    document.getElementById('equipment-qty').value = inv.businessSetup.equipment.quantity;
    document.getElementById('equipment-cost').value = inv.businessSetup.equipment.unitCost;
    document.getElementById('inventory-qty').value = inv.businessSetup.inventory.quantity;
    document.getElementById('inventory-cost').value = inv.businessSetup.inventory.unitCost;
    
    document.getElementById('working-capital').value = inv.workingCapital;
    document.getElementById('marketing').value = inv.preOperational.marketing;
    document.getElementById('deposits').value = inv.preOperational.deposits;
    document.getElementById('insurance').value = inv.preOperational.insurance;
    
    // Update Premises fields
    const prem = AppState.data.premises;
    document.getElementById('working-days').value = prem.workingDays;
    document.getElementById('avg-items').value = prem.itemsPerTicket;
    document.getElementById('ticket-instore').value = prem.averageTicket.inStore;
    document.getElementById('ticket-delivery').value = prem.averageTicket.delivery;
    document.getElementById('cogs-percent').value = (prem.cogsPercent || 0) * 100;
    document.getElementById('delivery-commission').value = (prem.deliveryCommission || 0) * 100;
    document.getElementById('ratio-instore').value = prem.ticketRatio.inStore * 100;
    document.getElementById('ratio-instore-value').textContent = (prem.ticketRatio.inStore * 100) + '%';
    document.getElementById('ratio-delivery-value').textContent = (prem.ticketRatio.delivery * 100) + '%';
}

// Load Template
function loadTemplate(templateName) {
    // Template definitions
    const templates = {
        quickService: {
            investment: {
                businessSetup: {
                    civilWorks: { quantity: 1, unitCost: 120000, total: 120000 },
                    equipment: { quantity: 1, unitCost: 40000, total: 40000 },
                    inventory: { quantity: 1, unitCost: 10000, total: 10000 }
                },
                workingCapital: 30000,
                preOperational: {
                    marketing: 5000,
                    deposits: 10000,
                    insurance: 3000
                }
            },
            premises: {
                workingDays: 26,
                averageTicket: { inStore: 12, delivery: 15 },
                ticketRatio: { inStore: 0.7, delivery: 0.3 },
                cogsPercent: 0.35,
                deliveryCommission: 0,
                itemsPerTicket: 4,
                monthlyTickets: 1667,
                dailyTickets: 64
            }
        },
        casualDining: {
            investment: {
                businessSetup: {
                    civilWorks: { quantity: 1, unitCost: 200000, total: 200000 },
                    equipment: { quantity: 1, unitCost: 60000, total: 60000 },
                    inventory: { quantity: 1, unitCost: 20000, total: 20000 }
                },
                workingCapital: 60000,
                preOperational: {
                    marketing: 10000,
                    deposits: 15000,
                    insurance: 5000
                }
            },
            premises: {
                workingDays: 24,
                averageTicket: { inStore: 25, delivery: 30 },
                ticketRatio: { inStore: 0.85, delivery: 0.15 },
                cogsPercent: 0.35,
                deliveryCommission: 0,
                itemsPerTicket: 6,
                monthlyTickets: 800,
                dailyTickets: 33
            }
        },
        fineDining: {
            investment: {
                businessSetup: {
                    civilWorks: { quantity: 1, unitCost: 350000, total: 350000 },
                    equipment: { quantity: 1, unitCost: 100000, total: 100000 },
                    inventory: { quantity: 1, unitCost: 40000, total: 40000 }
                },
                workingCapital: 100000,
                preOperational: {
                    marketing: 20000,
                    deposits: 25000,
                    insurance: 8000
                }
            },
            premises: {
                workingDays: 22,
                averageTicket: { inStore: 75, delivery: 85 },
                ticketRatio: { inStore: 0.95, delivery: 0.05 },
                cogsPercent: 0.35,
                deliveryCommission: 0,
                itemsPerTicket: 8,
                monthlyTickets: 267,
                dailyTickets: 12
            }
        },
        foodTruck: {
            investment: {
                businessSetup: {
                    civilWorks: { quantity: 0, unitCost: 0, total: 0 },
                    equipment: { quantity: 1, unitCost: 80000, total: 80000 },
                    inventory: { quantity: 1, unitCost: 5000, total: 5000 }
                },
                workingCapital: 15000,
                preOperational: {
                    marketing: 3000,
                    deposits: 2000,
                    insurance: 4000
                }
            },
            premises: {
                workingDays: 20,
                averageTicket: { inStore: 10, delivery: 0 },
                ticketRatio: { inStore: 1.0, delivery: 0 },
                cogsPercent: 0.35,
                deliveryCommission: 0,
                itemsPerTicket: 3,
                monthlyTickets: 2000,
                dailyTickets: 100
            }
        },
        cafe: {
            investment: {
                businessSetup: {
                    civilWorks: { quantity: 1, unitCost: 80000, total: 80000 },
                    equipment: { quantity: 1, unitCost: 35000, total: 35000 },
                    inventory: { quantity: 1, unitCost: 8000, total: 8000 }
                },
                workingCapital: 25000,
                preOperational: {
                    marketing: 4000,
                    deposits: 8000,
                    insurance: 2500
                }
            },
            premises: {
                workingDays: 28,
                averageTicket: { inStore: 8, delivery: 10 },
                ticketRatio: { inStore: 0.8, delivery: 0.2 },
                cogsPercent: 0.35,
                deliveryCommission: 0,
                itemsPerTicket: 2.5,
                monthlyTickets: 2500,
                dailyTickets: 89
            }
        }
    };
    
    if (templates[templateName]) {
        // Update AppState with template data
        AppState.data.investment = templates[templateName].investment;
        AppState.data.premises = templates[templateName].premises;
        
        // Update UI
        updateUIFromState();
    }
}