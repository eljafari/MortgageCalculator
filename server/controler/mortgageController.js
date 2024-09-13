const mortgageModel = require('../models/mortgageModel.js')
const calculateMortgage = mortgageModel.calculateMortgage;

function post_calculateMortgage(req, res) {
    try {
        if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
            var badRequest = {
                message: "Request payload should not be empty!"
            }
            res.status(400).json(badRequest);
        }

        var inputParams = {
            propertyPrice: req.body.property_price,
            downPaymentPercent: req.body.down_payment_percent,
            annualInterestRate: req.body.annual_interest_rate,
            amortizationYears: req.body.amortization_years,
            paySchedule: req.body.pay_schedule
        }

        let result = calculateMortgage(inputParams);

        if (!result.success) {
            var errResponse = {
                message: "Mortgage calculation faild! for details see the list of errors",
                errors: result.errors
            }
            res.status(400).json(errResponse);
        }

        var response = {
            "mortgage_parameters": req.body,
            "insurance_amount": result.data.insuranceAmount,
            "total_mortgage": result.data.totalMortgage,
            "payment_per_schedule": result.data.paymentPerSchedule,
            "down_payment_amount":result.data.downPaymentAmount,
            "currency": "CAD"
        }
        res.status(200).json(response);

    } catch (err) {
        console.error(err);
        res.json({
            message: "Internal Server Error!"
        }).status(500).send();
    }
}
module.exports = post_calculateMortgage;