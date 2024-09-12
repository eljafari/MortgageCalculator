const post_calculateMortgage = require('./mortgageController.js');
const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());
app.post('/api/mortgage/calculate', post_calculateMortgage);

describe('post_calculateMortgage', () => {
    it('returns bad request when requset body is empty', async () => {
        const response = await request(app)
            .post('/api/mortgage/calculate')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "message": "Request payload should not be empty!"
        });
    });

    it('returns failiour message when inputes are not valid and response is not success.', async () => {
        const response = await request(app)
            .post('/api/mortgage/calculate')
            .send({
                property_price: 500000,
                down_payment_percent: 3,
                annual_interest_rate: 4.1,
                amortization_years: 32,
                pay_schedule: "bi-wieekly"
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "Mortgage calculation faild! for details see the list of errors",
            errors: [{
                    errorCode: 102,
                    message: "A minimum down payment of (5%) is required for this purchase price."
                },
                {
                    errorCode: 104,
                    message: "Amortization years should be one of 5, 10, 15, 20, 25, or 30."
                },
                {
                    errorCode: 105,
                    message: "Pay schedule should be one of 'accelerated bi-weekly', 'bi-weekly', 'monthly'."
                }
            ]
        });
    });

    it('returns success response when all inputs are valid', async () => {
        response = await request(app)
            .post('/api/mortgage/calculate')
            .send({
                property_price: 850000,
                down_payment_percent: 10,
                annual_interest_rate: 4.1,
                amortization_years: 25,
                pay_schedule: "bi-weekly"
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            mortgage_parameters: {
                property_price: 850000,
                down_payment_percent: 10,
                annual_interest_rate: 4.1,
                amortization_years: 25,
                pay_schedule: "bi-weekly"
            },
            insurance_amount: 23715,
            total_mortgage: 788715,
            payment_per_schedule: 1883,
            currency: "CAD"
        });
    });
});