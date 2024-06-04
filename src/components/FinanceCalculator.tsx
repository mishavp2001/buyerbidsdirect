import React, { useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';



interface LoanCalculatorChartProps {}

const LoanCalculatorChart: React.FC<LoanCalculatorChartProps> = () => {
  const [propertyPrice, setPropertyPrice] = useState<number>(450000);
  const [buyerDownPayment, setBuyerDownPayment] = useState<number>(90000);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [loanTerm, setLoanTerm] = useState<number>(30);

  const loanAmount = propertyPrice - buyerDownPayment;
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  const monthlyPayment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
  const startingMonthlyInterest = loanAmount * monthlyInterestRate;
  const startingMonthlyPrincipal = Math.round(monthlyPayment - startingMonthlyInterest);

  return (
    <div className="loan-calculator-container">
      <h2>Loan Calculator</h2>
      <table className="input-table">
        <tbody>
          <tr>
            <td>
              <label>Property Price:</label>
            </td>
            <td>
              <input
                type="number"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Buyer Down Payment:</label>
            </td>
            <td>
              <input
                type="number"
                value={buyerDownPayment}
                onChange={(e) => setBuyerDownPayment(Number(e.target.value))}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Financed Interest Rate (%):</label>
            </td>
            <td>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Seller Financed Loan Term (years):</label>
            </td>
            <td>
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <h3>MonthlyPayment: ${Math.round(monthlyPayment).toLocaleString()}</h3>
      <h3>Principal: ${Math.round(startingMonthlyPrincipal).toLocaleString()}</h3>
      <h3>Interest: ${(startingMonthlyInterest.toLocaleString())}</h3>
      <PieChart
        height={300}
      series={[
        {
          data: [
            { id: 0, value: startingMonthlyInterest, label: 'Interest' },
            { id: 1, value: startingMonthlyPrincipal, label: 'Principal' },
            { id: 2, value: monthlyPayment, label: 'MonthlyPayment' },
          ],
        },
      ]}
    />
    </div>
  );
};

export default LoanCalculatorChart;
