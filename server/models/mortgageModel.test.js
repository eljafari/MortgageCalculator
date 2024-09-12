const mortgageModel = require('./mortgageModel.js')
const calculateMortgage = mortgageModel.calculateMortgage;
const validateInput = mortgageModel.validateInput;

describe('calculateMortgage', () => {
    describe('Input Validation', () => {
        it('returns success response when all inputs are valid', () => {
            //Arrange
            const input = {
                propertyPrice: 900000,
                downPaymentPercent: 7.2,
                annualInterestRate: 4.1,
                amortizationYears: 25,
                paySchedule: "bi-weekly"
            }

            //Act
            const result = validateInput(input);

            //Assert
            expect(result).toEqual({
                success: true
            });
            expect(result.errors).toBe(undefined);

        });


        it('returns error response when input parameters are invalid', () => {
            //Arrange
            const input = {
                propertyPrice: 0,
                downPaymentPercent: 120,
                annualInterestRate: -1,
                amortizationYears: 32,
                paySchedule: "some wrong value"
            }

            //Act
            const result = validateInput(input);

            //Assert
            expect(result).toEqual({
                success: false,
                "errors": [{
                        "errorCode": 101,
                        "message": "Property price should be greater than 0."
                    },
                    {
                        "errorCode": 103,
                        "message": "Enter a down payment percent less than 100%"
                    },
                    {
                        "errorCode": 103,
                        "message": "Annual interest rate should be between 0 and 100."
                    },
                    {
                        "errorCode": 104,
                        "message": "Amortization years should be equal or greater than 1 or less than or equal to 30."
                    },
                    {
                        "errorCode": 105,
                        "message": "Pay schedule should be one of 'accelerated bi-weekly', 'bi-weekly', 'monthly'."
                    }
                ]
            });
        });

        it('returns error response when downPaymentPercent is less than minimum', () => {
            //Arrange
            const input = {
                propertyPrice: 500000,
                downPaymentPercent: 4.5,
                annualInterestRate: 4.1,
                amortizationYears: 25,
                paySchedule: "bi-weekly"
            }

            //Act
            const result = validateInput(input);

            //Assert
            expect(result).toEqual({
                success: false,
                "errors": [{
                    "errorCode": 102,
                    "message": "A minimum down payment of (5%) is required for this purchase price."
                }]
            });
        });

        it('returns error response when annualInterestRate is greater than %100', () => {
            //Arrange
            const input = {
                propertyPrice: 500000,
                downPaymentPercent: 5,
                annualInterestRate: 101,
                amortizationYears: 25,
                paySchedule: "bi-weekly"
            }

            //Act
            const result = validateInput(input);

            //Assert
            expect(result).toEqual({
                success: false,
                "errors": [{
                    "errorCode": 103,
                    "message": "Annual interest rate should be between 0 and 100."
                }]
            });
        });

        it('returns error response when amortizationYears is less than 1 year', () => {
            //Arrange
            const input = {
                propertyPrice: 500000,
                downPaymentPercent: 5,
                annualInterestRate: 4.1,
                amortizationYears: 0,
                paySchedule: "bi-weekly"
            }

            //Act
            const result = validateInput(input);

            //Assert
            expect(result).toEqual({
                success: false,
                "errors": [{
                    "errorCode": 104,
                    "message": "Amortization years should be equal or greater than 1 or less than or equal to 30."
                }]
            });
        });
    });
});

describe('Calculation Logic', () => {
    it('returns success with accurate paymentPerSchedule and related data when input is as expected', () => {
        const input = {
            propertyPrice: 900000,
            downPaymentPercent: 7.2,
            annualInterestRate: 4.1,
            amortizationYears: 25,
            paySchedule: "bi-weekly"
        }

        const result = calculateMortgage(input);

        expect(result.success).toBe(true);
        expect(result.data.paymentPerSchedule).toBeCloseTo(2055);
        expect(result.data.insuranceAmount).toBeCloseTo(33408);
        expect(result.data.totalMortgage).toBeCloseTo(868608);
        expect(result.data.currency).toEqual("CAD");
        expect(result.data.mortgageParameters).toEqual(input);
    });

    it('returns failure response when input has invalid value', () => {
        const input = {
            propertyPrice: 900000,
            downPaymentPercent: 3.1, //Invalid 
            annualInterestRate: 4.1,
            amortizationYears: 25,
            paySchedule: "bi-weekly"
        }

        const result = calculateMortgage(input);

        expect(result.success).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });
});

// describe('validateInput', () => {
//     test('Should return an error when propertyPrice is less than or equal to 0', () => {
//         const input = {
//             propertyPrice: 0
//         };
//         const result = validateInput(input);
//         expect(result).toEqual({
//             success: false,
//             errorCode: 101,
//             message: "Property price should be greater than 0!"
//         });
//     });

//     test('should return success when propertyPrice is greater than 0', () => {
//         const input = {
//             propertyPrice: 500000
//         };
//         const result = validateInput(input);
//         expect(result).toEqual({
//             success: true,
//             data: {
//                 mortgageParameters: input,
//                 insuranceAmount: 0,
//                 totalMortgage: 0,
//                 paymentPerSchedule: 0,
//                 currency: "CAD"
//             }
//         });
//     });
// });