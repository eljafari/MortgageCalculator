const validateInput = require('./mortgageModel.js')



describe('validateInput', () => {
    test('Should return an error when propertyPrice is less than or equal to 0', () => {
        const input = {
            propertyPrice: 0
        };
        const result = validateInput(input);
        expect(result).toEqual({
            success: false,
            errorCode: 101,
            message: "Property price should be greater than 0!"
        });
    });

    test('should return success when propertyPrice is greater than 0', () => {
        const input = {
            propertyPrice: 500000
        };
        const result = validateInput(input);
        expect(result).toEqual({
            success: true,
            data: {
                mortgageParameters: input,
                insuranceAmount: 0,
                totalMortgage: 0,
                paymentPerSchedule: 0,
                currency: "CAD"
            }
        });
    });
});