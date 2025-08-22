'use client';

import React, { useEffect } from 'react';
import { useRestaurantStore } from '@/lib/store';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Building, Users, DollarSign } from 'lucide-react';

export function PremisesCalculator() {
  const { premises, updatePremises, calculateResults } = useRestaurantStore();

  useEffect(() => {
    calculateResults();
  }, [premises, calculateResults]);

  const handleInputChange = (field: string, value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    updatePremises({ [field]: numValue });
  };

  const handleStaffChange = (role: 'chefs' | 'assistants' | 'waiters', field: 'count' | 'salary', value: string) => {
    const numValue = parseFloat(value) || 0;
    updatePremises({
      staffData: {
        ...premises.staffData,
        [role]: {
          ...premises.staffData[role],
          [field]: numValue,
        },
      },
    });
  };

  const handleMonthlyRevenueChange = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newRevenues = [...premises.monthlyRevenue];
    newRevenues[index] = numValue;
    updatePremises({ monthlyRevenue: newRevenues });
  };

  const calculateMonthlyRevenue = () => {
    const dailyInStore = premises.workDays * premises.averageTicketInStore * premises.inStorePercentage * 85; // 85 customers/day estimate
    const dailyDelivery = premises.workDays * premises.averageTicketDelivery * premises.deliveryPercentage * 85;
    return dailyInStore + dailyDelivery;
  };

  const monthlyOperatingCosts = premises.rent + premises.utilities + premises.services + premises.others;
  const totalStaffSalary = Object.values(premises.staffData).reduce(
    (sum, staff) => sum + staff.count * staff.salary,
    0
  );
  const yearlyRevenue = premises.monthlyRevenue.reduce((sum, rev) => sum + rev, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Premises & Operations Calculator</h2>
        <p className="text-gray-600">Configure your restaurant operations and staff planning</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Revenue Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Working Days per Month
                </label>
                <input
                  type="number"
                  value={premises.workDays}
                  onChange={(e) => handleInputChange('workDays', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Average Ticket In-Store
                  </label>
                  <input
                    type="number"
                    value={premises.averageTicketInStore}
                    onChange={(e) => handleInputChange('averageTicketInStore', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Average Ticket Delivery
                  </label>
                  <input
                    type="number"
                    value={premises.averageTicketDelivery}
                    onChange={(e) => handleInputChange('averageTicketDelivery', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    In-Store Sales %
                  </label>
                  <input
                    type="number"
                    value={premises.inStorePercentage * 100}
                    onChange={(e) => handleInputChange('inStorePercentage', parseFloat(e.target.value) / 100)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Sales %
                  </label>
                  <input
                    type="number"
                    value={premises.deliveryPercentage * 100}
                    onChange={(e) => handleInputChange('deliveryPercentage', parseFloat(e.target.value) / 100)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yearly Growth Rate %
                </label>
                <input
                  type="number"
                  value={premises.yearlyGrowth * 100}
                  onChange={(e) => handleInputChange('yearlyGrowth', parseFloat(e.target.value) / 100)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="p-4 bg-green-50 rounded-md">
                <p className="text-sm font-medium text-green-900">
                  Estimated Monthly Revenue: {formatCurrency(calculateMonthlyRevenue())}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5" />
              Monthly Operating Costs
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rent</label>
                <input
                  type="number"
                  value={premises.rent}
                  onChange={(e) => handleInputChange('rent', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Utilities</label>
                <input
                  type="number"
                  value={premises.utilities}
                  onChange={(e) => handleInputChange('utilities', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
                <input
                  type="number"
                  value={premises.services}
                  onChange={(e) => handleInputChange('services', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Others</label>
                <input
                  type="number"
                  value={premises.others}
                  onChange={(e) => handleInputChange('others', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="p-4 bg-red-50 rounded-md">
                <p className="text-sm font-medium text-red-900">
                  Total Monthly Operating Costs: {formatCurrency(monthlyOperatingCosts)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Staff Configuration
            </h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-md p-4 space-y-3">
                <h4 className="font-medium text-gray-700">Chefs</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Count</label>
                    <input
                      type="number"
                      value={premises.staffData.chefs.count}
                      onChange={(e) => handleStaffChange('chefs', 'count', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Monthly Salary</label>
                    <input
                      type="number"
                      value={premises.staffData.chefs.salary}
                      onChange={(e) => handleStaffChange('chefs', 'salary', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-md p-4 space-y-3">
                <h4 className="font-medium text-gray-700">Kitchen Assistants</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Count</label>
                    <input
                      type="number"
                      value={premises.staffData.assistants.count}
                      onChange={(e) => handleStaffChange('assistants', 'count', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Monthly Salary</label>
                    <input
                      type="number"
                      value={premises.staffData.assistants.salary}
                      onChange={(e) => handleStaffChange('assistants', 'salary', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-md p-4 space-y-3">
                <h4 className="font-medium text-gray-700">Waiters</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Count</label>
                    <input
                      type="number"
                      value={premises.staffData.waiters.count}
                      onChange={(e) => handleStaffChange('waiters', 'count', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Monthly Salary</label>
                    <input
                      type="number"
                      value={premises.staffData.waiters.salary}
                      onChange={(e) => handleStaffChange('waiters', 'salary', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-md">
                <p className="text-sm font-medium text-orange-900">
                  Total Monthly Staff Cost: {formatCurrency(totalStaffSalary)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue Projections</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {premises.monthlyRevenue.slice(0, 12).map((revenue, index) => (
                <div key={index}>
                  <label className="block text-xs text-gray-600 mb-1">Month {index + 1}</label>
                  <input
                    type="number"
                    value={revenue}
                    onChange={(e) => handleMonthlyRevenueChange(index, e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <p className="text-sm font-medium text-blue-900">
                Year 1 Total Revenue: {formatCurrency(yearlyRevenue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
          <div>
            <p className="text-purple-100 text-sm">Monthly Revenue</p>
            <p className="text-2xl font-bold">{formatCurrency(yearlyRevenue / 12)}</p>
          </div>
          <div>
            <p className="text-purple-100 text-sm">Monthly Costs</p>
            <p className="text-2xl font-bold">{formatCurrency(monthlyOperatingCosts + totalStaffSalary)}</p>
          </div>
          <div>
            <p className="text-purple-100 text-sm">Monthly Profit Margin</p>
            <p className="text-2xl font-bold">
              {formatPercent((yearlyRevenue / 12 - (monthlyOperatingCosts + totalStaffSalary)) / (yearlyRevenue / 12))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}