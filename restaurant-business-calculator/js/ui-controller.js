// Restaurant Business Calculator - UI Controller

// UI Controller Object
const UIController = {
    // Initialize UI elements
    init: function() {
        this.setupNumberFormatting();
        this.setupValidation();
        this.setupTooltips();
        this.setupKeyboardShortcuts();
        this.setupProgressIndicators();
    },
    
    // Number formatting for inputs
    setupNumberFormatting: function() {
        // Format number inputs on blur
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value && !this.readOnly) {
                    const value = parseFloat(this.value);
                    if (!isNaN(value)) {
                        // Format based on input type
                        if (this.id.includes('cost') || this.id.includes('capital') || 
                            this.id.includes('marketing') || this.id.includes('deposits') || 
                            this.id.includes('insurance')) {
                            this.value = value.toFixed(0);
                        } else if (this.id.includes('ticket')) {
                            this.value = value.toFixed(2);
                        }
                    }
                }
            });
            
            // Select all text on focus
            input.addEventListener('focus', function() {
                this.select();
            });
        });
    },
    
    // Input validation
    setupValidation: function() {
        // Working days validation
        const workingDays = document.getElementById('working-days');
        workingDays.addEventListener('input', function() {
            const value = parseInt(this.value);
            if (value > 31) {
                this.value = 31;
                showToast('Maximum 31 working days per month', 'warning');
            } else if (value < 1) {
                this.value = 1;
            }
        });
        
        // Percentage validation for ratios
        const ratioInstore = document.getElementById('ratio-instore');
        ratioInstore.addEventListener('input', function() {
            const value = parseInt(this.value);
            if (value > 100) this.value = 100;
            if (value < 0) this.value = 0;
        });

        // Percentage validation for costs
        const cogsPercent = document.getElementById('cogs-percent');
        cogsPercent.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (value > 100) this.value = 100;
            if (value < 0) this.value = 0;
        });

        const deliveryCommission = document.getElementById('delivery-commission');
        deliveryCommission.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (value > 100) this.value = 100;
            if (value < 0) this.value = 0;
        });
        
        // Positive number validation
        document.querySelectorAll('input[type="number"]').forEach(input => {
            if (!input.id.includes('ratio')) {
                input.addEventListener('input', function() {
                    if (parseFloat(this.value) < 0) {
                        this.value = 0;
                        showToast('Please enter a positive value', 'warning');
                    }
                });
            }
        });
    },
    
    // Setup tooltips
    setupTooltips: function() {
        const tooltips = [
            { id: 'civil-works-qty', text: 'Number of locations or units' },
            { id: 'working-capital', text: 'Recommended: 3-6 months of operating expenses' },
            { id: 'working-days', text: 'Typical restaurant operates 20-26 days per month' },
            { id: 'avg-items', text: 'Average number of items per customer order' },
            { id: 'ratio-instore', text: 'Percentage of sales from dine-in customers' }
        ];
        
        tooltips.forEach(({ id, text }) => {
            const element = document.getElementById(id);
            if (element) {
                element.setAttribute('title', text);
            }
        });
    },
    
    // Keyboard shortcuts
    setupKeyboardShortcuts: function() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                DataManager.saveCurrentState();
                showToast('Progress saved!', 'success');
            }
            
            // Ctrl/Cmd + P to print
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                ExportManager.printReport();
            }
            
            // Ctrl/Cmd + E to export
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                ExportManager.exportToPDF();
            }
            
            // Tab navigation with arrow keys
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                const tabs = Array.from(document.querySelectorAll('.nav-tab'));
                const activeIndex = tabs.findIndex(tab => tab.classList.contains('active'));
                
                if (e.key === 'ArrowLeft' && activeIndex > 0) {
                    tabs[activeIndex - 1].click();
                } else if (e.key === 'ArrowRight' && activeIndex < tabs.length - 1) {
                    tabs[activeIndex + 1].click();
                }
            }
        });
    },
    
    // Progress indicators
    setupProgressIndicators: function() {
        // Calculate completion percentage
        const calculateProgress = () => {
            let filledFields = 0;
            let totalFields = 0;
            
            document.querySelectorAll('input[type="number"]').forEach(input => {
                if (!input.readOnly) {
                    totalFields++;
                    if (input.value && parseFloat(input.value) > 0) {
                        filledFields++;
                    }
                }
            });
            
            return Math.round((filledFields / totalFields) * 100);
        };
        
        // Update progress on input change
        document.addEventListener('input', () => {
            const progress = calculateProgress();
            this.updateProgressBar(progress);
        });
    },
    
    // Update progress bar
    updateProgressBar: function(percentage) {
        // Could add a visual progress bar to the UI
        console.log(`Form completion: ${percentage}%`);
        
        // Show encouragement messages at milestones
        if (percentage === 25) {
            showToast('Great start! Keep going 💪', 'success');
        } else if (percentage === 50) {
            showToast('Halfway there! 🎯', 'success');
        } else if (percentage === 75) {
            showToast('Almost done! 🚀', 'success');
        } else if (percentage === 100) {
            showToast('All set! Click Calculate to see results 🎉', 'success');
            triggerConfetti();
        }
    },
    
    // Animate value changes
    animateValue: function(element, start, end, duration = 1000) {
        const range = end - start;
        const increment = range / (duration / 16); // 60fps
        let current = start;
        
        element.classList.add('value-updating');
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
                element.classList.remove('value-updating');
            }
            
            // Format based on element type
            if (element.id.includes('revenue') || element.id.includes('investment')) {
                element.textContent = formatCurrency(Math.round(current));
            } else if (element.id.includes('margin') || element.id.includes('roi')) {
                element.textContent = current.toFixed(1) + '%';
            } else {
                element.textContent = Math.round(current).toLocaleString();
            }
        }, 16);
    },
    
    // Show/hide loading states
    showLoading: function(element) {
        element.classList.add('loading');
        element.disabled = true;
    },
    
    hideLoading: function(element) {
        element.classList.remove('loading');
        element.disabled = false;
    },
    
    // Update metric card styles based on value
    updateMetricCardStyle: function(card, value, threshold) {
        card.classList.remove('positive', 'negative', 'warning');
        
        if (value > threshold * 1.2) {
            card.classList.add('positive');
        } else if (value < threshold * 0.8) {
            card.classList.add('negative');
        } else {
            card.classList.add('warning');
        }
    },
    
    // Smooth scroll to section
    scrollToSection: function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },
    
    // Highlight changed fields
    highlightChanges: function() {
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', function() {
                this.classList.add('field-changed');
                setTimeout(() => {
                    this.classList.remove('field-changed');
                }, 2000);
            });
        });
    },
    
    // Create floating labels effect
    setupFloatingLabels: function() {
        document.querySelectorAll('.input-group').forEach(group => {
            const input = group.querySelector('input');
            const label = group.querySelector('label');
            
            if (input && label) {
                input.addEventListener('focus', () => {
                    label.classList.add('floating');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        label.classList.remove('floating');
                    }
                });
                
                // Check initial state
                if (input.value) {
                    label.classList.add('floating');
                }
            }
        });
    },
    
    // Tab completion indicator
    updateTabCompletionStatus: function() {
        const tabs = ['investment', 'premises', 'cashflow', 'results'];
        
        tabs.forEach(tabName => {
            const isComplete = this.isTabComplete(tabName);
            const tabButton = document.querySelector(`[data-tab="${tabName}"]`);
            
            if (tabButton) {
                if (isComplete) {
                    tabButton.classList.add('tab-complete');
                } else {
                    tabButton.classList.remove('tab-complete');
                }
            }
        });
    },
    
    // Check if tab data is complete
    isTabComplete: function(tabName) {
        switch(tabName) {
            case 'investment':
                const inv = AppState.data.investment;
                return inv.businessSetup.civilWorks.total > 0 &&
                       inv.businessSetup.equipment.total > 0 &&
                       inv.workingCapital > 0;
            
            case 'premises':
                const prem = AppState.data.premises;
                return prem.workingDays > 0 &&
                       prem.averageTicket.inStore > 0 &&
                       prem.monthlyTickets > 0;
            
            case 'cashflow':
                return AppState.data.cashFlow.year1.length > 0;
            
            case 'results':
                return AppState.data.results.roi > 0;
            
            default:
                return false;
        }
    },
    
    // Smart form navigation
    setupSmartNavigation: function() {
        const inputs = Array.from(document.querySelectorAll('input[type="number"]:not([readonly])'));
        
        inputs.forEach((input, index) => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    
                    // Move to next input
                    const nextIndex = index + 1;
                    if (nextIndex < inputs.length) {
                        inputs[nextIndex].focus();
                        inputs[nextIndex].select();
                    } else {
                        // Last input - trigger calculation
                        document.getElementById('calculate-btn').click();
                    }
                }
            });
        });
    }
};

// Initialize UI Controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    UIController.init();
});

// Add CSS for dynamic effects
const style = document.createElement('style');
style.textContent = `
    .field-changed {
        animation: fieldHighlight 2s ease-out;
    }
    
    @keyframes fieldHighlight {
        0% {
            background-color: rgba(59, 130, 246, 0.2);
            transform: scale(1.02);
        }
        100% {
            background-color: transparent;
            transform: scale(1);
        }
    }
    
    .floating {
        transform: translateY(-20px);
        font-size: 0.75rem;
        color: var(--primary-blue);
    }
    
    .tab-complete::after {
        content: '✓';
        position: absolute;
        top: 5px;
        right: 5px;
        color: var(--success-green);
        font-weight: bold;
    }
`;
document.head.appendChild(style);

// Export UI Controller
window.UIController = UIController;