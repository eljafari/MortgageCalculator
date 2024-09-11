import {calculateMortgage} from "../models/mortgageModel.js";

export default function post_calculateMortgage(req,res){
    try {

        //Todo: validate request

        var inputParams = {
            propertyPrice: req.body.property_price,
            downPaymentPercent: req.body.down_payment_percent,
            interestRate: req.body.interest_rate,
            amortizationYears: req.body.amortization_years,
            paySchadule: req.body.pay_schadule
        }

        const result= calculateMortgage(inputParams);
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
