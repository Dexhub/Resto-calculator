'use client';

import React, { useEffect } from 'react';
import { useRestaurantStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

export function CashFlowCalculator() {
  const { premises, cashFlow, updateCashFlow, calculateResults } = useRestaurantStore();

  useEffect(() => {
    // Auto-calculate cash flows based on premises data
    const monthlyRevenues = premises.monthlyRevenue;
    const growth = premises.yearlyGrowth;
    
    // Calculate sales for 48 months
    const inStoreSales: number[] = [];
    const deliverySales: number[] = [];
    
    for (let i = 0; i < 48; i++) {
      const yearIndex = Math.floor(i / 12);
      const monthIndex = i % 12;
      const growthFactor = Math.pow(1 + growth, yearIndex);
      const baseRevenue = monthlyRevenues[monthIndex] || monthlyRevenues[0];
      
      inStoreSales.push(baseRevenue * growthFactor * premises.inStorePercentage);
      deliverySales.push(baseRevenue * growthFactor * premises.deliveryPercentage);
    }
    
    // Calculate direct costs (23% of sales as per Excel)
    const foodCosts = inStoreSales.map((sale, i) => (sale + deliverySales[i]) * 0.15);
    const beverageCosts = inStoreSales.map((sale, i) => (sale + deliverySales[i]) * 0.035);
    const packagingCosts = deliverySales.map(sale => sale * 0.02);
    
    // Calculate fixed costs
    const rentCosts = new Array(48).fill(premises.rent);
    const salaryCosts = new Array(48).fill(
      Object.values(premises.staffData).reduce((sum, staff) => sum + staff.count * staff.salary, 0)
    );
    const marketingCosts = inStoreSales.map((sale, i) => (sale + deliverySales[i]) * 0.02);
    const utilityCosts = new Array(48).fill(premises.utilities);
    
    updateCashFlow({
      sales: {
        inStore: inStoreSales,
        delivery: deliverySales,
        takeAway: new Array(48).fill(0),
        other: new Array(48).fill(0),
      },
      directCosts: {
        food: foodCosts,
        beverages: beverageCosts,
        packaging: packagingCosts,
        delivery: deliverySales.map(sale => sale * 0.01),
        other: new Array(48).fill(0),
      },
      fixedCosts: {
        rent: rentCosts,
        salaries: salaryCosts,
        marketing: marketingCosts,
        utilities: utilityCosts,
        other: new Array(48).fill(premises.services + premises.others),
      },
    });
    
    calculateResults();
  }, [premises, updateCashFlow, calculateResults]);

  const getMonthlyData = (monthIndex: number) => {
    const totalSales = 
      cashFlow.sales.inStore[monthIndex] + 
      cashFlow.sales.delivery[monthIndex] + 
      cashFlow.sales.takeAway[monthIndex] + 
      cashFlow.sales.other[monthIndex];
    
    const totalDirectCosts = 
      cashFlow.directCosts.food[monthIndex] + 
      cashFlow.directCosts.beverages[monthIndex] + 
      cashFlow.directCosts.packaging[monthIndex] + 
      cashFlow.directCosts.delivery[monthIndex] + 
      cashFlow.directCosts.other[monthIndex];
    
    const totalFixedCosts = 
      cashFlow.fixedCosts.rent[monthIndex] + 
      cashFlow.fixedCosts.salaries[monthIndex] + 
      cashFlow.fixedCosts.marketing[monthIndex] + 
      cashFlow.fixedCosts.utilities[monthIndex] + 
      cashFlow.fixedCosts.other[monthIndex];
    
    const grossProfit = totalSales - totalDirectCosts;
    const netProfit = grossProfit - totalFixedCosts;
    
    return {
      totalSales,
      totalDirectCosts,
      totalFixedCosts,
      grossProfit,
      netProfit,
    };
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cash Flow Calculator</h2>
        <p className="text-gray-600">48-month cash flow projection based on your premises configuration</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Cash flows are automatically calculated based on your Premises configuration. 
          Adjust values in the Premises tab to see changes reflected here.
        </p>
      </div>

      <div className="space-y-8">
        {[0, 1, 2, 3].map((year) => (
          <div key={year} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Year {year + 1}
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Direct Costs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gross Profit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fixed Costs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Profit
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {months.map((month, monthIndex) => {
                    const dataIndex = year * 12 + monthIndex;
                    const data = getMonthlyData(dataIndex);
                    
                    return (
                      <tr key={monthIndex} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {month}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(data.totalSales)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(data.totalDirectCosts)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                          {formatCurrency(data.grossProfit)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(data.totalFixedCosts)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          data.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(data.netProfit)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(() => {
                const yearStart = year * 12;
                const yearEnd = (year + 1) * 12;
                let yearSales = 0;
                let yearDirectCosts = 0;
                let yearFixedCosts = 0;
                
                for (let i = yearStart; i < yearEnd; i++) {
                  const data = getMonthlyData(i);
                  yearSales += data.totalSales;
                  yearDirectCosts += data.totalDirectCosts;
                  yearFixedCosts += data.totalFixedCosts;
                }
                
                const yearGrossProfit = yearSales - yearDirectCosts;
                const yearNetProfit = yearGrossProfit - yearFixedCosts;
                
                return (
                  <>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-600 font-medium">Total Sales</p>
                      <p className="text-xl font-bold text-blue-900">{formatCurrency(yearSales)}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <p className="text-sm text-orange-600 font-medium">Total Direct Costs</p>
                      <p className="text-xl font-bold text-orange-900">{formatCurrency(yearDirectCosts)}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-purple-600 font-medium">Total Fixed Costs</p>
                      <p className="text-xl font-bold text-purple-900">{formatCurrency(yearFixedCosts)}</p>
                    </div>
                    <div className={`${yearNetProfit >= 0 ? 'bg-green-50' : 'bg-red-50'} rounded-lg p-4`}>
                      <p className={`text-sm ${yearNetProfit >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                        Net Profit
                      </p>
                      <p className={`text-xl font-bold ${yearNetProfit >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                        {formatCurrency(yearNetProfit)}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-white" />
            <div>
              <p className="text-green-100 text-sm">48-Month Total Net Profit</p>
              <p className="text-3xl font-bold text-white">
                {formatCurrency(
                  Array.from({ length: 48 }, (_, i) => getMonthlyData(i).netProfit).reduce((sum, profit) => sum + profit, 0)
                )}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-green-100 text-sm">Average Monthly Net Profit</p>
            <p className="text-xl font-semibold text-white">
              {formatCurrency(
                Array.from({ length: 48 }, (_, i) => getMonthlyData(i).netProfit).reduce((sum, profit) => sum + profit, 0) / 48
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}