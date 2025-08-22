'use client';

import React, { useEffect } from 'react';
import { useRestaurantStore } from '@/lib/store';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { BarChart3, TrendingUp, DollarSign, PieChart } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function ResultsDashboard() {
  const { results, calculateResults } = useRestaurantStore();

  useEffect(() => {
    calculateResults();
  }, [calculateResults]);

  const yearlyData = [
    {
      year: 'Year 1',
      sales: results.firstYear.sales,
      grossProfit: results.firstYear.grossProfit,
      netIncome: results.firstYear.netIncome,
    },
    {
      year: 'Year 2',
      sales: results.secondYear.sales,
      grossProfit: results.secondYear.grossProfit,
      netIncome: results.secondYear.netIncome,
    },
    {
      year: 'Year 3',
      sales: results.thirdYear.sales,
      grossProfit: results.thirdYear.grossProfit,
      netIncome: results.thirdYear.netIncome,
    },
    {
      year: 'Year 4',
      sales: results.fourthYear.sales,
      grossProfit: results.fourthYear.grossProfit,
      netIncome: results.fourthYear.netIncome,
    },
  ];

  const profitMarginData = [
    {
      year: 'Year 1',
      grossMargin: results.firstYear.sales > 0 ? (results.firstYear.grossProfit / results.firstYear.sales) * 100 : 0,
      netMargin: results.firstYear.sales > 0 ? (results.firstYear.netIncome / results.firstYear.sales) * 100 : 0,
    },
    {
      year: 'Year 2',
      grossMargin: results.secondYear.sales > 0 ? (results.secondYear.grossProfit / results.secondYear.sales) * 100 : 0,
      netMargin: results.secondYear.sales > 0 ? (results.secondYear.netIncome / results.secondYear.sales) * 100 : 0,
    },
    {
      year: 'Year 3',
      grossMargin: results.thirdYear.sales > 0 ? (results.thirdYear.grossProfit / results.thirdYear.sales) * 100 : 0,
      netMargin: results.thirdYear.sales > 0 ? (results.thirdYear.netIncome / results.thirdYear.sales) * 100 : 0,
    },
    {
      year: 'Year 4',
      grossMargin: results.fourthYear.sales > 0 ? (results.fourthYear.grossProfit / results.fourthYear.sales) * 100 : 0,
      netMargin: results.fourthYear.sales > 0 ? (results.fourthYear.netIncome / results.fourthYear.sales) * 100 : 0,
    },
  ];

  const costBreakdownYear1 = [
    { name: 'Direct Costs', value: results.firstYear.directCosts, color: '#EF4444' },
    { name: 'Fixed Costs', value: results.firstYear.fixedCosts, color: '#F59E0B' },
    { name: 'Operating Expenses', value: results.firstYear.operatingExpenses, color: '#6B7280' },
    { name: 'Net Income', value: Math.max(0, results.firstYear.netIncome), color: '#10B981' },
  ];

  const COLORS = ['#EF4444', '#F59E0B', '#6B7280', '#10B981'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Results Dashboard</h2>
        <p className="text-gray-600">Comprehensive financial analysis and projections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">Year 1</span>
          </div>
          <p className="text-sm text-blue-600 font-medium">Total Sales</p>
          <p className="text-2xl font-bold text-blue-900">{formatCurrency(results.firstYear.sales)}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-xs text-green-600 font-medium">Year 1</span>
          </div>
          <p className="text-sm text-green-600 font-medium">Gross Profit</p>
          <p className="text-2xl font-bold text-green-900">{formatCurrency(results.firstYear.grossProfit)}</p>
        </div>

        <div className={`${results.firstYear.netIncome >= 0 ? 'bg-emerald-50' : 'bg-red-50'} rounded-lg p-6`}>
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className={`w-8 h-8 ${results.firstYear.netIncome >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
            <span className={`text-xs ${results.firstYear.netIncome >= 0 ? 'text-emerald-600' : 'text-red-600'} font-medium`}>Year 1</span>
          </div>
          <p className={`text-sm ${results.firstYear.netIncome >= 0 ? 'text-emerald-600' : 'text-red-600'} font-medium`}>Net Income</p>
          <p className={`text-2xl font-bold ${results.firstYear.netIncome >= 0 ? 'text-emerald-900' : 'text-red-900'}`}>
            {formatCurrency(results.firstYear.netIncome)}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <PieChart className="w-8 h-8 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Year 1</span>
          </div>
          <p className="text-sm text-purple-600 font-medium">Net Margin</p>
          <p className="text-2xl font-bold text-purple-900">
            {results.firstYear.sales > 0 ? formatPercent(results.firstYear.netIncome / results.firstYear.sales) : '0%'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue & Profit Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="sales" fill="#3B82F6" name="Sales" />
              <Bar dataKey="grossProfit" fill="#10B981" name="Gross Profit" />
              <Bar dataKey="netIncome" fill="#6366F1" name="Net Income" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Profit Margin Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={profitMarginData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
              <Legend />
              <Line type="monotone" dataKey="grossMargin" stroke="#10B981" strokeWidth={2} name="Gross Margin %" />
              <Line type="monotone" dataKey="netMargin" stroke="#6366F1" strokeWidth={2} name="Net Margin %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Year 1 Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={costBreakdownYear1}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name}: ${formatCurrency(entry.value || 0)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {costBreakdownYear1.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value || 0))} />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">4-Year Financial Summary</h3>
          <div className="space-y-4">
            {[
              { label: 'Year 1', data: results.firstYear },
              { label: 'Year 2', data: results.secondYear },
              { label: 'Year 3', data: results.thirdYear },
              { label: 'Year 4', data: results.fourthYear },
            ].map((year, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                <h4 className="font-medium text-gray-700 mb-2">{year.label}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Sales:</span>
                    <span className="ml-2 font-medium">{formatCurrency(year.data.sales)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Net Income:</span>
                    <span className={`ml-2 font-medium ${year.data.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(year.data.netIncome)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Gross Margin:</span>
                    <span className="ml-2 font-medium">
                      {year.data.sales > 0 ? formatPercent(year.data.grossProfit / year.data.sales) : '0%'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Net Margin:</span>
                    <span className="ml-2 font-medium">
                      {year.data.sales > 0 ? formatPercent(year.data.netIncome / year.data.sales) : '0%'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
          <div>
            <p className="text-indigo-100 text-sm">4-Year Total Revenue</p>
            <p className="text-3xl font-bold">
              {formatCurrency(
                results.firstYear.sales + results.secondYear.sales + results.thirdYear.sales + results.fourthYear.sales
              )}
            </p>
          </div>
          <div>
            <p className="text-indigo-100 text-sm">4-Year Total Net Income</p>
            <p className="text-3xl font-bold">
              {formatCurrency(
                results.firstYear.netIncome + results.secondYear.netIncome + results.thirdYear.netIncome + results.fourthYear.netIncome
              )}
            </p>
          </div>
          <div>
            <p className="text-indigo-100 text-sm">Average Annual Growth</p>
            <p className="text-3xl font-bold">
              {results.firstYear.sales > 0
                ? formatPercent(
                    Math.pow(results.fourthYear.sales / results.firstYear.sales, 1 / 3) - 1
                  )
                : '0%'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}