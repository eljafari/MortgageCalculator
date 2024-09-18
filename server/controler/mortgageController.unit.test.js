const sinon = require('sinon');
const post_calculateMortgage = require('./mortgageController.js');
const mortgageModel = require('../models/mortgageModel.js')
const each = require("jest-each").default;

const mockRequest = (body) => {
    return {
        body,
    };
};

const mockResponse = () => {
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
};

describe('mortgageController - calculateMortgage', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should return 200 and the calculation result when input is valid', async () => {
        //Arrange
        const requestBody = {
            property_price: 850000,
            down_payment_percent: 10,
            annual_interest_rate: 4.1,
            amortization_years: 25,
            pay_schedule: "bi-weekly"
        };
        const req = mockRequest(requestBody);
        const res = mockResponse();
        const expectedResult = {
            success: true,
            data: {
                insuranceAmount: 23715,
                totalMortgage: 788715,
                paymentPerSchedule: 1883,
                downPaymentAmount: 85000,
                currency: "CAD"
            }
        };
        sinon.stub(mortgageModel, 'calculateMortgage').resolves(expectedResult);

        //Act
        await post_calculateMortgage(req, res);

        //Assert    
        expect(res.status.calledWith(200)).toBe(true);
        expect(res.json.calledWith({
            "mortgage_parameters": req.body,
            "insurance_amount": expectedResult.data.insuranceAmount,
            "total_mortgage": expectedResult.data.totalMortgage,
            "payment_per_schedule": expectedResult.data.paymentPerSchedule,
            "down_payment_amount": expectedResult.data.downPaymentAmount,
            "currency": "CAD"
        })).toBe(true);
    });

    each(["", {}]).it('should return 400 error response when request body is empty', async (body) => {
        //Arrange
        const requestBody = body;
        const req = mockRequest(requestBody);
        const res = mockResponse();

        //Act
        post_calculateMortgage(req, res);

        //Assert    
        expect(res.status.calledWith(400)).toBe(true);
        expect(res.json.calledWith({
            "message": "Request payload should not be empty!"
        })).toBe(true);
    });
});