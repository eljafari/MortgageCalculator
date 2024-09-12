const calculateMortgage= require('../models/mortgageModel.js')
function post_calculateMortgage(req,res){
    try {

        //Todo: validate request

        var inputParams = {
            propertyPrice: req.body.property_price,
            downPaymentPercent: req.body.down_payment_percent,
            annualInterestRate: req.body.annual_interest_rate,
            amortizationYears: req.body.amortization_years,
            paySchedule: req.body.pay_schedule
        }

        let result= calculateMortgage(inputParams);
        console.log(result);

        if(!result.success){
            var errResponse = {
                code: result.errorCode,
                messge: result.message
            }
            res.json(errResponse).status(400).send();
        }

        var response ={
            "mortgage_parameters": req.body,
            "insurance_amount": result.data.insuranceAmount,
            "total_mortgage": result.data.totalMortgage,
            "payment_per_schedule": result.data.paymentPerSchedule,
            "currency": "CAD"
        }
        res.json(response).status(200).send();

    } catch (err) {
       console.error(err);
       res.json(req.body).status(500).send();
    }
}
module.exports = post_calculateMortgage;
