import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Calculator.css'

const MortgageCalculator = () => {
    const [propertyPrice, setPropertyPrice] = useState('');
    const [downPaymentPercent, setDownPaymentPercent] = useState('');
    const [annualInterestRate, setAnnualInterestRate] = useState('');
    const [amortizationYears, setAmortizationYears] = useState('');
    const [paySchedule, setPaySchedule] = useState('monthly');
    const [infoVisible, setInfoVisible] = useState(false);
    const [infoText, setInfoText] = useState('If the purchase price is:$500,000 or less Your minimum down payment is 5% Between $500,000 and $999,999 Your minimum down payment is 5% of the first $500,000 PLUS 10% of the remaining portion of the home price $1,000,000 or more Your minimum down payment is');
    
    const [results, setResults] = useState({
        insuranceAmount: '',
        totalMortgage: '',
        
        paymentPerSchedule: '',
        downPaymentAmount: '',
        currency: 'CAD'
    });

    useEffect(() => {
        if (propertyPrice && downPaymentPercent && annualInterestRate && amortizationYears) {
            axios.post('http://localhost:3000/api/mortgage/calculate', {
                property_price: parseFloat(propertyPrice),
                down_payment_percent: parseFloat(downPaymentPercent),
                annual_interest_rate: parseFloat(annualInterestRate),
                amortization_years: parseInt(amortizationYears),
                pay_schedule: paySchedule
            })
            .then(response => {
                console.log(response);
                setResults({
                    insuranceAmount: response.data.insurance_amount,
                    totalMortgage: response.data.total_mortgage,
                    paymentPerSchedule: response.data.payment_per_schedule,
                    downPaymentAmount: response.data.down_payment_amount,
                    currency: response.data.currency
                });
                // console.log(results);
            })
            .catch(error => {
                if (error.response) {
                    // Server responded with a status other than 200 range
                    console.error('Error Response:', error.response.data);
                } else if (error.request) {
                    // No response received
                    console.error('No response:', error.request);
                } else {
                    // Something went wrong in setting up the request
                    console.error('Error:', error.message);
                }
            });
        }
    }, [propertyPrice, downPaymentPercent, annualInterestRate, amortizationYears, paySchedule]);

    const handleDownPayInfo = ()=>{
        setInfoVisible(!infoVisible);
    }

    return (
        <div className="calculator-container">
            <h2 className="calculator-heading">Mortgage Calculator</h2>
            <div className="form-group">
                <label className="form-label">Asking Price:</label>
                <input
                    type="number"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(e.target.value)}
                    className="form-input asking-input"
                />
            </div>
            <div className="form-group">
                <label className="form-label">Down Payment:  <button className='infoBtn' onClick={handleDownPayInfo}>?</button>
                {infoVisible && <span className= 'info'>{infoText}</span>}
                </label>
                <div className='downpayment'>
                    <input
                        placeholder='(%)'
                        type="number"
                        value={downPaymentPercent}
                        onChange={(e) => setDownPaymentPercent(e.target.value)}
                        className="form-input"
                    />
                    <div className="result-box">
                       {results.downPaymentAmount} {results.currency}
                    </div>
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">Annual Interest Rate (%):</label>
                <input
                    type="number"
                    value={annualInterestRate}
                    onChange={(e) => setAnnualInterestRate(e.target.value)}
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <label className="form-label">Amortization Years:</label>
                <select
                    value={amortizationYears}
                    onChange={(e) => setAmortizationYears(e.target.value)}
                    className="form-select"
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="25">25</option>
                    <option value="30">30</option>
                </select>
            </div>
            <div className="form-group">
                <label className="form-label">Pay Schedule:</label>
                <select
                    value={paySchedule}
                    onChange={(e) => setPaySchedule(e.target.value)}
                    className="form-select"
                >
                    <option value="monthly">Monthly</option>
                    <option value="bi-weekly">Bi-Weekly</option>
                    <option value="accelerated bi-weekly">Accelerated Bi-Weekly</option>
                </select>
            </div>
            <div className="results-container">
                <h3 className="results-heading">Results:</h3>
                <div className="result-box">
                    <strong>Insurance Amount:</strong> {results.insuranceAmount} {results.currency}
                </div>
                <div className="result-box">
                    <strong>Total Mortgage:</strong> {results.totalMortgage} {results.currency}
                </div>
                <div className="result-box">
                    <strong>Payment Per Schedule:</strong> {results.paymentPerSchedule} {results.currency}
                </div>
            </div>
        </div>
    );
};
export default MortgageCalculator;
