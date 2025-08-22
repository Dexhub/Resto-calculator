'use client';

import React from 'react';
import { useRestaurantStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { Calculator } from 'lucide-react';

export function InvestmentCalculator() {
  const { investment, updateInvestment } = useRestaurantStore();

  const handleBusinessSetupChange = (field: keyof typeof investment.businessSetup, value: string) => {
    const numValue = parseFloat(value) || 0;
    updateInvestment({
      businessSetup: {
        ...investment.businessSetup,
        [field]: numValue,
      },
    });
  };

  const handleOtherExpensesChange = (field: keyof typeof investment.otherExpenses, value: string) => {
    const numValue = parseFloat(value) || 0;
    updateInvestment({
      otherExpenses: {
        ...investment.otherExpenses,
        [field]: numValue,
      },
    });
  };

  const businessSetupTotal = Object.values(investment.businessSetup).reduce((sum, val) => sum + val, 0);
  const otherExpensesTotal = Object.values(investment.otherExpenses).reduce((sum, val) => sum + val, 0);
  const totalInvestment = businessSetupTotal + otherExpensesTotal;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Investment Calculator</h2>
        <p className="text-gray-600">Calculate your initial restaurant investment requirements</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">1. Business Setup</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Basic Civil Works for Location Adaptation
              </label>
              <input
                type="number"
                value={investment.businessSetup.civilWorks}
                onChange={(e) => handleBusinessSetupChange('civilWorks', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Furniture & Fixtures
              </label>
              <input
                type="number"
                value={investment.businessSetup.furnitureFixtures}
                onChange={(e) => handleBusinessSetupChange('furnitureFixtures', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment & Machinery
              </label>
              <input
                type="number"
                value={investment.businessSetup.equipmentMachinery}
                onChange={(e) => handleBusinessSetupChange('equipmentMachinery', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kiosks & Signage
              </label>
              <input
                type="number"
                value={investment.businessSetup.kiosks}
                onChange={(e) => handleBusinessSetupChange('kiosks', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Licenses & Permits
              </label>
              <input
                type="number"
                value={investment.businessSetup.licenses}
                onChange={(e) => handleBusinessSetupChange('licenses', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transportation & Delivery Setup
              </label>
              <input
                type="number"
                value={investment.businessSetup.transportation}
                onChange={(e) => handleBusinessSetupChange('transportation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <p className="text-sm font-medium text-blue-900">
              Business Setup Subtotal: {formatCurrency(businessSetupTotal)}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">2. Other Initial Expenses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Staff Recruitment & Training
              </label>
              <input
                type="number"
                value={investment.otherExpenses.staffRecruitment}
                onChange={(e) => handleOtherExpensesChange('staffRecruitment', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Advertising & Marketing
              </label>
              <input
                type="number"
                value={investment.otherExpenses.advertising}
                onChange={(e) => handleOtherExpensesChange('advertising', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Other Expenses
              </label>
              <input
                type="number"
                value={investment.otherExpenses.otherExpenses}
                onChange={(e) => handleOtherExpensesChange('otherExpenses', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <p className="text-sm font-medium text-blue-900">
              Other Expenses Subtotal: {formatCurrency(otherExpensesTotal)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calculator className="w-8 h-8 text-white" />
            <div>
              <p className="text-blue-100 text-sm">Total Initial Investment</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(totalInvestment)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Investment per Year (3 years)</p>
            <p className="text-xl font-semibold text-white">{formatCurrency(totalInvestment / 3)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}