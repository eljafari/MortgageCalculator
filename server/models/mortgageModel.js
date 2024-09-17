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

    let mortgageInsurancePercent = getMortgageInsurancePercent(downPaymentPercent);

    let downPaymentAmount = Math.round(propertyPrice * (downPaymentPercent / 100));
    let principal = propertyPrice - downPaymentAmount;

    let monthlyInterestRatePerPayment = ((annualInterestRate / 100) / 12);
    let monthlyTotalPayment = amortizationYears * 12;

    let insuranceAmount = Math.round(principal * mortgageInsurancePercent / 100);
    let totalMortgage = principal + insuranceAmount;

    let monthlyPayment = Math.round(principal * monthlyInterestRatePerPayment * Math.pow(1 + monthlyInterestRatePerPayment, monthlyTotalPayment) / (Math.pow(1 + monthlyInterestRatePerPayment, monthlyTotalPayment) - 1));

    let paymentPerSchedule = getPaymentPerSchedule(paySchedule, monthlyPayment);

    return {
        success: true,
        data: {
            mortgageParameters: mortgageParameters,
            insuranceAmount: insuranceAmount,
            totalMortgage: totalMortgage,
            paymentPerSchedule: paymentPerSchedule,
            downPaymentAmount:downPaymentAmount,
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
    var errors = [];

    if (propertyPrice <= 0) {
        errors.push({
            errorCode: 101,
            message: "Property price should be greater than 0."
        });
    }

    if (downPaymentPercent > 100) {
        errors.push({
            errorCode: 102,
            message: `Enter a down payment percent less than 100%`
        });
    } else {
        if (propertyPrice <= 500000) {
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
            errors.push({
                errorCode: 102,
                message: `A minimum down payment of (${minDownPaymentPercent}%) is required for this purchase price.`
            });
        }
    }

    if (annualInterestRate < 0 || annualInterestRate > 100) {
        errors.push({
            errorCode: 103,
            message: `Annual interest rate should be between 0 and 100.`
        });
    }

    if (amortizationYears > 30 || amortizationYears < 5 || amortizationYears % 5 !== 0) {
        errors.push({
            errorCode: 104,
            message: `Amortization years should be one of 5, 10, 15, 20, 25, or 30.`
        });
    }

    if (paySchedule !== 'bi-weekly' && paySchedule !== 'accelerated bi-weekly' && paySchedule !== 'monthly') {
        errors.push({
            errorCode: 105,
            message: `Pay schedule should be one of 'accelerated bi-weekly', 'bi-weekly', 'monthly'.`
        });
    }

    if (errors.length) {
        return {
            success: false,
            errors: errors
        }
    }

    return {
        success: true
    }
}

const getPaymentPerSchedule = (paySchedule, monthlyPayment) => {
    switch (paySchedule) {
        case 'monthly':
            return monthlyPayment;
        case 'bi-weekly':
            return Math.round(monthlyPayment * 12 / 26);
        case 'accelerated bi-weekly':
            return monthlyPayment / 2;
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
    }
}

module.exports = {
    calculateMortgage,
    validateInput
};