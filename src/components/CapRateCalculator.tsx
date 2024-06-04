// CapRateCalculator.tsx
import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import {TextField} from '@mui/material'

interface CapRateCalculatorProps {}

const CapRateCalculator: React.FC<CapRateCalculatorProps> = () => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000000);
  const [monthlyCash, setMonthlyCash] = useState<number>(4000);
  const [monthlyExpense, setMonthlyExpense] = useState<number>(1000);
  const [capRate, setCapRate] = useState<number | null>(null);

  const calculateCapRate = () => {
    const annualCashFlow = (monthlyCash - monthlyExpense) * 12;
    const capRate = (annualCashFlow / investmentAmount) * 100;
    setCapRate(capRate);
  };

  useEffect(()=>{
    calculateCapRate()
  }, [monthlyCash, monthlyExpense, investmentAmount])

  return (
    <div className='calc-div'>
      <h2>Investment Cap Rate Calculator</h2>
      <div>
          <TextField
            label='Investment Amount ($):'
            type="number"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
          />
      </div>
      <div>
          <TextField
            label='Monthly Cash Income ($):'
            type="number"
            value={monthlyCash}
            onChange={(e) => setMonthlyCash(Number(e.target.value))}
          />
      </div>
      <div>
  
          <TextField
            label='Monthly Expenses ($):'
            type="number"
            value={monthlyExpense}
            onChange={(e) => setMonthlyExpense(Number(e.target.value))}
          />
      </div>
      {capRate !== null && (
        <div>
          <h2>Cap Rate: {capRate.toFixed(2)}%</h2>
        </div>
      )}
      <div>
        <h2>Monthly Cash Flow Distribution</h2>
        <PieChart 
          width={300}
          height={300}
          series={[
            {
              data: [
                {id: 0,  label: 'Cash Income', value: monthlyCash },
                {id: 1, label: 'Expenses', value: monthlyExpense }
              ]
            }  
          ]}
        />
      </div>
    </div>
  );
};

export default CapRateCalculator;
