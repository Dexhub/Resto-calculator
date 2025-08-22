export interface InvestmentData {
  businessSetup: {
    civilWorks: number;
    furnitureFixtures: number;
    equipmentMachinery: number;
    kiosks: number;
    licenses: number;
    transportation: number;
  };
  otherExpenses: {
    staffRecruitment: number;
    advertising: number;
    otherExpenses: number;
  };
}

export interface PremisesData {
  workDays: number;
  averageTicketInStore: number;
  averageTicketDelivery: number;
  inStorePercentage: number;
  deliveryPercentage: number;
  monthlyRevenue: number[];
  yearlyGrowth: number;
  rent: number;
  utilities: number;
  services: number;
  others: number;
  staffData: {
    chefs: { count: number; salary: number };
    assistants: { count: number; salary: number };
    waiters: { count: number; salary: number };
  };
}

export interface CashFlowData {
  sales: {
    inStore: number[];
    delivery: number[];
    takeAway: number[];
    other: number[];
  };
  directCosts: {
    food: number[];
    beverages: number[];
    packaging: number[];
    delivery: number[];
    other: number[];
  };
  fixedCosts: {
    rent: number[];
    salaries: number[];
    marketing: number[];
    utilities: number[];
    other: number[];
  };
}

export interface ResultsData {
  firstYear: {
    sales: number;
    directCosts: number;
    grossProfit: number;
    fixedCosts: number;
    operatingExpenses: number;
    netIncome: number;
  };
  secondYear: {
    sales: number;
    directCosts: number;
    grossProfit: number;
    fixedCosts: number;
    operatingExpenses: number;
    netIncome: number;
  };
  thirdYear: {
    sales: number;
    directCosts: number;
    grossProfit: number;
    fixedCosts: number;
    operatingExpenses: number;
    netIncome: number;
  };
  fourthYear: {
    sales: number;
    directCosts: number;
    grossProfit: number;
    fixedCosts: number;
    operatingExpenses: number;
    netIncome: number;
  };
}

export interface RestaurantData {
  investment: InvestmentData;
  premises: PremisesData;
  cashFlow: CashFlowData;
  results: ResultsData;
}