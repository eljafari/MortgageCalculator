export const calculateMortgage = (mortgageParameters={propertyPrice, downPaymentPercent, interestRate, amortizationYears, paySchadule})=>{
    /*
    1- Todo: validate input and error handeling
      - Fail-Fast -> If it's invalid, return error response
   */
    var validationResult = validateInput(mortgageParameters);
    if(!validationResult.success){
        return validationResult;
    }
/*
    2- Todo: calculate mortgage
        - calculate insurance
        - calculate loan amount (price-down)
        - calculate total mortgage (loan+insurance)
        - calculate mortgage payment per schadule (interest rate apply on top of total mortgage based on amortization period)
    */
        var totalMortgage = 0;
        var payPerSchedule = 0;
        var insuranceAmount = 0;

        return {
            success:true,
            data :{
                mortgageParameters: mortgageParameters,
                insuranceAmount: insuranceAmount,
                totalMortgage: totalMortgage,
                paymentPerSchedule: payPerSchedule,
                currency: "CAD"
            }
        }

}

export const validateInput= (mortgageParameters) =>{
    if(mortgageParameters.propertyPrice <=0)
    return {
        success : false,
        errorCode: 101,
        message : "Property price should be greater than 0!"
    }

    return {
        success : true
    } 
}

