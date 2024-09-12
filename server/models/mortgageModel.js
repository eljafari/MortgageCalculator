const calculateMortgage = (mortgageParameters) => {
    const {
        propertyPrice,
        downPaymentPercent,
        annualInterestRate,
        amortizationYears,
        paySchedule
    } = mortgageParameters;


    var validationResult = validateInput(mortgageParameters);
    if (!validationResult.success) {
        return validationResult;
    }

    let paymentPerYear = getPaymentPerYear(paySchedule);
    console.log(paymentPerYear);

    let mortgageInsurancePercent = getMortgageInsurancePercent(downPaymentPercent);

    let downPaymentAmount = propertyPrice * (downPaymentPercent / 100);
    let principal = propertyPrice - downPaymentAmount;
    let interestRatePerPayment = (annualInterestRate / 100) / paymentPerYear;
    let totalPayment = amortizationYears * paymentPerYear;
    let insuranceAmount = principal * mortgageInsurancePercent / 100;
    let totalMortgage = principal + insuranceAmount;

    let mortgagePayment = Math.round(principal * interestRatePerPayment * Math.pow(1 + interestRatePerPayment, totalPayment) / (Math.pow(1 + interestRatePerPayment, totalPayment) - 1));

    return {
        success: true,
        data: {
            mortgageParameters: mortgageParameters,
            insuranceAmount: insuranceAmount,
            totalMortgage: totalMortgage,
            paymentPerSchedule: mortgagePayment,
            currency: "CAD"
        }
    }
}

const validateInput = (mortgageParameters) => {
    const {
        propertyPrice,
        downPaymentPercent,
        annualInterestRate,
        amortizationYears,
        paySchedule
    } = mortgageParameters
    let minDownPaymentPercent;

    if (propertyPrice <= 0) {
        return {
            success: false,
            errorCode: 101,
            message: "Property price should be greater than 0!"
        }
    } else if (propertyPrice <= 500000) {
        minDownPaymentPercent = 5;
    } else if (propertyPrice < 1000000) {
        const firstPortion = 500000 * 0.05;
        const remainingPortion = (propertyPrice - 500000) * 0.10;
        const totalDownPayment = firstPortion + remainingPortion;
        minDownPaymentPercent = ((totalDownPayment / propertyPrice) * 100).toFixed(1);
    } else {
        minDownPaymentPercent = 20;
    }
    if (downPaymentPercent < minDownPaymentPercent) {
        return {
            success: false,
            errorCode: 102,
            message: `A minimum down payment of $55,000 (${minDownPaymentPercent}%) is required for this purchase price`
        }
    }
    if (downPaymentPercent > 100) {
        return {
            success: false,
            errorCode: 103,
            message: `Enter a down payment percent less than 100%`
        }
    }
    if (annualInterestRate < 0) {
        return {
            success: false,
            errorCode: 103,
            message: `Annual interest rate should be equal or greater than 0!`
        }
    }
    if (amortizationYears > 30 || amortizationYears < 1) {
        return {
            success: false,
            errorCode: 104,
            message: `Amortization years should be equal or greater than 1 or less than 30!`
        }
    }
    if (paySchedule !== 'bi-weekly' && paySchedule !== 'accelerated bi-weekly' && paySchedule !== 'monthly)') {
        return {
            success: false,
            errorCode: 105,
            message: `Pay schedule should be 'accelerated bi-weekly' or 'bi-weekly' or 'monthly'!`
        }
    }
    return {
        success: true
    }
}

const getPaymentPerYear = (paySchedule) => {
    switch (paySchedule) {
        case 'monthly':
            return 12;
        case 'bi-weekly':
        case 'accelerated bi-weekly':
            return 26;
        default:
            throw new Error('Invalid Payment Schadule');
    }
}

const getMortgageInsurancePercent = (downPaymentPercent) => {
    if (downPaymentPercent >= 5 && downPaymentPercent < 10) {
        return 4;
    } else if (downPaymentPercent >= 10 && downPaymentPercent < 15) {
        return 3.10;
    } else if (downPaymentPercent >= 15 && downPaymentPercent < 20) {
        return 2.80;
    } else if (downPaymentPercent >= 20) {
        return 0;
    } else {
        throw new Error(`Invalid downpayment percentage: %${downPaymentPercent}`);
    }

}
module.exports = calculateMortgage;