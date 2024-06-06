// TaxCalculator.tsx
import React, { useState, useEffect } from 'react';
import { TextField, Typography, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

interface TaxCalculatorProps { }

interface Map {
    [key: string]: number
}
type FilingStatus = 'single' | 'married';

// Define the TaxBracket interface
interface TaxBracket {
    rate: number;
    amount: number;
}

// Define the TaxBracketsByStatus type
interface TaxBracketsByStatus {
    single: TaxBracket[];
    married: TaxBracket[];
}

const TaxCalculator: React.FC<TaxCalculatorProps> = () => {
    const [income, setIncome] = useState<number>(100000);
    const [deductions, setDeductions] = useState<number>(27700);
    const [filingStatus, setFilingStatus] = useState<FilingStatus>('married');
    const [estimatedTax, setEstimatedTax] = useState<number>(0);


    const standardDeductions: Map = {
        single: 13850,
        married: 27700
    };

    const taxBrackets: TaxBracketsByStatus = {
        single: [
            { rate: 0.10, amount: 11000 },
            { rate: 0.12, amount: 44725 - 11000 },
            { rate: 0.22, amount: 95375 - 44725 },
            { rate: 0.24, amount: 182100 - 95375 },
            { rate: 0.32, amount: 231250 - 182100 },
            { rate: 0.35, amount: 578125 - 231250 },
            { rate: 0.37, amount: Infinity },
        ],
        married: [
            { rate: 0.10, amount: 22000 },
            { rate: 0.12, amount: 89450 - 22000 },
            { rate: 0.22, amount: 190750 - 89450 },
            { rate: 0.24, amount: 364200 - 190750 },
            { rate: 0.32, amount: 462500 - 364200 },
            { rate: 0.35, amount: 693750 - 462500 },
            { rate: 0.37, amount: Infinity },
        ]
    };

    const calculateTax = (income: number, deductions: number, status: FilingStatus) => {
        const totalDeductions = Math.max(deductions, standardDeductions[status]);
        const taxableIncome = Math.max(0, income - totalDeductions);
        const brackets = taxBrackets[status];

        let tax = 0;
        let remainingIncome = taxableIncome;

        for (const bracket of brackets) {
            if (remainingIncome > bracket.amount) {
                tax += bracket.amount * bracket.rate;
                remainingIncome -= bracket.amount;
            } else {
                tax += remainingIncome * bracket.rate;
                break;
            }
        }

        return tax;
    };

    useEffect(() => {
        const tax = calculateTax(income, deductions, filingStatus);
        setEstimatedTax(tax);
    }, [income, deductions, filingStatus])

    return (
        <div className='calc-div'>
            <Box my={4}>
                <h2>
                    Simple Tax Estimate Calculator 2024
                </h2>
                <Box mb={2}>
                    <TextField
                        label="Annual Income ($)"
                        variant="outlined"
                        type="number"
                        value={income}
                        onChange={(e) => setIncome(parseInt(e.target.value))}
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="Additional Deductions ($). Standard deduction:"
                        variant="outlined"
                        type="number"
                        value={deductions}
                        onChange={(e) => setDeductions(parseInt(e.target.value.toLocaleString()))}
                    />
                </Box>
                <Box mb={2}>
                    <FormControl variant="outlined">
                        <InputLabel>Filing Status</InputLabel>
                        <Select
                            value={filingStatus}
                            onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
                            label="Filing Status"
                        >
                            <MenuItem value="single">Single</MenuItem>
                            <MenuItem value="married">Married Couple</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Typography variant="h5" component="h5" gutterBottom>
                    Standard deductions:${filingStatus === 'single' ? standardDeductions['single'].toLocaleString() : standardDeductions['married'].toLocaleString()}
                </Typography>
                {estimatedTax !== null && (
                    <Box mt={2}>
                        <Typography variant="h5">
                            Estimated Tax: ${Math.round(estimatedTax).toLocaleString()}
                        </Typography>
                    </Box>
                )}
            </Box>
            <PieChart
        height={300}
        series={[
          {
            data: [
              { id: 0, value: income, label: 'Income' },
              { id: 1, value: deductions, label: 'Deductions' },
              { id: 2, value: estimatedTax, label: 'Estimated Tax' },
            ],
          },
        ]}
      />
        </div>
    );
};

export default TaxCalculator;
