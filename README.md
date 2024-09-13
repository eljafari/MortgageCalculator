# Mortgage Calculator API

## 📝 Introduction
This mortgage calculator project calculates key mortgage details based on the asking price, down payment percentage, interest rate, amortization period, and payment schedule. It provides the insurance amount, total mortgage, down payment amount, and payment per schedule.

## 🛠 Technologies Used
- **Backend:** Node.js, Express.js
- **Frontend:** React.js
- **Testing Frameworks:** Sinon, Jest

## ⚙️ Installation

### Prerequisites
Make sure the following tools are installed on your machine:
- [Node.js](https://nodejs.org/en/download/) 
- [npm](https://www.npmjs.com/get-npm) or [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

### Clone the Repository
git clone https://github.com/eljafari/MortgageCalculator.git

Navigate into the project directory:
``cd MortgageCalculator``

🚀 Running the Backend

cd server
``npm install``
``then start the server``
``npm start``

🌐 Running the Frontend

``cd client``
``npm install``
``npm start``

🧪 Running Tests

Run all tests
``npm test``
Run unit tests only
``npm run testUnit``
Run integration test
``npm run testInt``

# Project Requirements
## Inputs 
- **Property Price**
- **Down Payment**  
  If the purchase price is:
  - $500,000 or less – Your minimum down payment is 5%
  - Between $500,000 and $999,999 – Your minimum down payment is 5% of the first $500,000 PLUS 10% of the remaining portion of the home price
  - $1,000,000 or more – Your minimum down payment is 20%
- **Annual Interest Rate**  
  - Monthly: Divide the annual interest rate by 12.
  - Bi-weekly: Divide the annual interest rate by 26.
  - Accelerated Bi-weekly: Treat as regular bi-weekly but account for a shorter amortization period since more payments are made.
- **Amortization Period**  
  (5 year increments between 5 and 30 years)
- **Payment Schedule**  
  (Accelerated Bi-weekly, Bi-weekly, Monthly)

## Expected Output
- Payment per payment schedule
- An error if the inputs are not valid. This includes cases where the down payment is not large enough.

## Mortgage Payment Formula

The formula for calculating mortgage payments is:

\[ M = \frac{P \cdot r(1+r)^n}{(1+r)^n - 1} \]

Where:
- **M** = Payment per payment schedule
- **P** = Principal
- **r** = Per payment schedule interest rate, calculated by dividing the annual interest rate by the number of payments per year
- **n** = Total number of payments over the amortization period


