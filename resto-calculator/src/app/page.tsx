'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InvestmentCalculator } from '@/components/calculators/InvestmentCalculator';
import { PremisesCalculator } from '@/components/calculators/PremisesCalculator';
import { CashFlowCalculator } from '@/components/calculators/CashFlowCalculator';
import { ResultsDashboard } from '@/components/calculators/ResultsDashboard';
import { useRestaurantStore } from '@/lib/store';
import { Calculator, Building, TrendingUp, BarChart3 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('investment');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calculator className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Restaurant Business Calculator</h1>
            </div>
            <p className="text-sm text-gray-600">Professional Restaurant Planning Tool</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm rounded-lg p-1">
            <TabsTrigger value="investment" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Investment
            </TabsTrigger>
            <TabsTrigger value="premises" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Premises
            </TabsTrigger>
            <TabsTrigger value="cashflow" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Cash Flow
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Results
            </TabsTrigger>
          </TabsList>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <TabsContent value="investment" className="space-y-6">
              <InvestmentCalculator />
            </TabsContent>
            <TabsContent value="premises" className="space-y-6">
              <PremisesCalculator />
            </TabsContent>
            <TabsContent value="cashflow" className="space-y-6">
              <CashFlowCalculator />
            </TabsContent>
            <TabsContent value="results" className="space-y-6">
              <ResultsDashboard />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}