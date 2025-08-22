// Restaurant Business Calculator - Data Management

// Local Storage Keys
const STORAGE_KEYS = {
    CURRENT_DATA: 'restaurantBusinessData',
    SAVED_PLANS: 'savedPlans',
    PREFERENCES: 'userPreferences',
    LAST_SAVE: 'lastSaveTimestamp'
};

// Data Manager Object
const DataManager = {
    // Save current state to local storage
    saveCurrentState: function() {
        try {
            const dataToSave = {
                data: AppState.data,
                metadata: {
                    version: '1.0.0',
                    lastModified: new Date().toISOString(),
                    currentTab: AppState.currentTab
                }
            };
            
            localStorage.setItem(STORAGE_KEYS.CURRENT_DATA, JSON.stringify(dataToSave));
            localStorage.setItem(STORAGE_KEYS.LAST_SAVE, new Date().toISOString());
            
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            showToast('Failed to save data', 'error');
            return false;
        }
    },
    
    // Load saved state from local storage
    loadSavedState: function() {
        try {
            const savedData = localStorage.getItem(STORAGE_KEYS.CURRENT_DATA);
            if (savedData) {
                const parsed = JSON.parse(savedData);
                
                // Version compatibility check
                if (parsed.metadata && parsed.metadata.version) {
                    AppState.data = parsed.data;
                    if (parsed.metadata.currentTab) {
                        AppState.currentTab = parsed.metadata.currentTab;
                    }
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error loading saved data:', error);
            return false;
        }
    },
    
    // Save named plan
    savePlan: function(name, description = '') {
        try {
            const plans = this.getSavedPlans();
            
            plans[name] = {
                data: JSON.parse(JSON.stringify(AppState.data)), // Deep clone
                metadata: {
                    name: name,
                    description: description,
                    createdAt: new Date().toISOString(),
                    modifiedAt: new Date().toISOString()
                }
            };
            
            localStorage.setItem(STORAGE_KEYS.SAVED_PLANS, JSON.stringify(plans));
            return true;
        } catch (error) {
            console.error('Error saving plan:', error);
            showToast('Failed to save plan', 'error');
            return false;
        }
    },
    
    // Get all saved plans
    getSavedPlans: function() {
        try {
            const plans = localStorage.getItem(STORAGE_KEYS.SAVED_PLANS);
            return plans ? JSON.parse(plans) : {};
        } catch (error) {
            console.error('Error retrieving saved plans:', error);
            return {};
        }
    },
    
    // Load specific plan
    loadPlan: function(planName) {
        try {
            const plans = this.getSavedPlans();
            if (plans[planName]) {
                AppState.data = JSON.parse(JSON.stringify(plans[planName].data));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error loading plan:', error);
            return false;
        }
    },
    
    // Delete plan
    deletePlan: function(planName) {
        try {
            const plans = this.getSavedPlans();
            delete plans[planName];
            localStorage.setItem(STORAGE_KEYS.SAVED_PLANS, JSON.stringify(plans));
            return true;
        } catch (error) {
            console.error('Error deleting plan:', error);
            return false;
        }
    },
    
    // Export data to JSON
    exportToJSON: function() {
        const exportData = {
            version: '1.0.0',
            exportDate: new Date().toISOString(),
            data: AppState.data,
            calculations: {
                totalInvestment: getTotalInvestment(AppState.data.investment),
                year1Revenue: AppState.data.results.year1.sales,
                year2Revenue: AppState.data.results.year2.sales,
                roi: AppState.data.results.roi
            }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `restaurant-business-plan-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    
    // Import data from JSON
    importFromJSON: function(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    
                    // Validate imported data
                    if (importedData.version && importedData.data) {
                        AppState.data = importedData.data;
                        updateUIFromState();
                        updateAllCalculations();
                        resolve(true);
                    } else {
                        reject(new Error('Invalid file format'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = function() {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file);
        });
    },
    
    // Clear all data
    clearAllData: function() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_DATA);
            localStorage.removeItem(STORAGE_KEYS.SAVED_PLANS);
            localStorage.removeItem(STORAGE_KEYS.LAST_SAVE);
            
            // Reset to defaults
            location.reload();
        }
    },
    
    // Get storage usage
    getStorageInfo: function() {
        let totalSize = 0;
        
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length + key.length;
            }
        }
        
        return {
            usedBytes: totalSize,
            usedKB: (totalSize / 1024).toFixed(2),
            usedMB: (totalSize / 1024 / 1024).toFixed(2),
            itemCount: localStorage.length
        };
    },
    
    // Auto-save functionality
    enableAutoSave: function(intervalMinutes = 5) {
        setInterval(() => {
            if (AppState.hasUnsavedChanges) {
                this.saveCurrentState();
                AppState.hasUnsavedChanges = false;
                console.log('Auto-saved at', new Date().toLocaleTimeString());
            }
        }, intervalMinutes * 60 * 1000);
    },
    
    // Create backup
    createBackup: function() {
        const backup = {
            version: '1.0.0',
            backupDate: new Date().toISOString(),
            currentData: AppState.data,
            savedPlans: this.getSavedPlans(),
            preferences: this.getPreferences()
        };
        
        return backup;
    },
    
    // Restore from backup
    restoreFromBackup: function(backupData) {
        try {
            if (backupData.version && backupData.currentData) {
                AppState.data = backupData.currentData;
                
                if (backupData.savedPlans) {
                    localStorage.setItem(STORAGE_KEYS.SAVED_PLANS, JSON.stringify(backupData.savedPlans));
                }
                
                if (backupData.preferences) {
                    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(backupData.preferences));
                }
                
                updateUIFromState();
                updateAllCalculations();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error restoring backup:', error);
            return false;
        }
    },
    
    // User preferences
    savePreferences: function(preferences) {
        localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    },
    
    getPreferences: function() {
        const prefs = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
        return prefs ? JSON.parse(prefs) : {
            currency: 'USD',
            dateFormat: 'MM/DD/YYYY',
            numberFormat: 'en-US',
            autoSave: true,
            showTips: true
        };
    }
};

// Initialize data manager
document.addEventListener('DOMContentLoaded', function() {
    // Enable auto-save
    DataManager.enableAutoSave(5);
    
    // Add beforeunload handler
    window.addEventListener('beforeunload', function(e) {
        if (AppState.hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    });
});

// Export DataManager
window.DataManager = DataManager;