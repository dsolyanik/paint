const {COLOR_TYPE} = require('./utils/constants')


const getPreviousCustomers = (customers, currentIndex) => {
    return customers.slice(0, currentIndex);
};

const proposeSolution = (currentState, customer) => {
    let color;
    let colorType;
    let result;
    const proposal = [...currentState];

    result = customer.colorPreferences.find(preference => {
        return !customer.proposedColorPreferences[preference.color - 1] && preference.type === COLOR_TYPE.GLOSS
    });

    if (result) {
        color = result.color;
        colorType = result.type;
        proposal[color - 1] = colorType;
        customer.proposedColorPreferences[color - 1] = colorType;
    } else {
        result = customer.colorPreferences.find(preference => {
            return !customer.proposedColorPreferences[preference.color - 1] && preference.type === COLOR_TYPE.MATTE
        });

        if (result) {
            color = result.color;
            colorType = result.type;
            proposal[color - 1] = colorType;
            customer.proposedColorPreferences[color - 1] = colorType;
        } else {
            proposal.noSolutions = true;
        }
    }

    return proposal;
};

const validateProposal = (customers, proposal) => {
    return customers.every(customer => {
        if (proposal.noSolutions) {
            return false;
        }

        return customer.colorPreferences.some(colorPreference => {
            // return proposal[colorPreference.color - 1]
            //     ? proposal[colorPreference.color - 1] === colorPreference.type
            //     : colorPreference.type === COLOR_TYPE.GLOSS;
            return proposal[colorPreference.color - 1] === colorPreference.type;
        })
    })
};

const arrayCopyWithReference = (source, target) => {
    for (let i = 0; i < target.length; i++) {
        target[i] = source[i];
    }
}

const researchAlternative = (state, currentCustomer, previousCustomers) => {
    if (state.noSolutions) {
        return false;
    }

    const proposedSolution = proposeSolution(state, currentCustomer);
    if (validateProposal(previousCustomers, proposedSolution)) {
        arrayCopyWithReference(proposedSolution, state);
        return true;
    } else if (proposedSolution.noSolutions) {
        arrayCopyWithReference(proposedSolution, state);
        return false;
    } else {
        return (researchAlternative(state, currentCustomer, previousCustomers));
    }

};

const solveProblem = (data) => {
    let alternativeExists = false;
    let state = Array(data.colorsCount);
    const customers = data.customers;


    customers.some((currentCustomer, i) => {
        const previousCustomers = getPreviousCustomers(customers, i);
        const proposedSolution = proposeSolution(state, currentCustomer);
        const result = validateProposal(previousCustomers, proposedSolution);
        if (result) {
            state = [...proposedSolution];
            currentCustomer.isSatisfied = true;
        } else {
            alternativeExists = researchAlternative(state, currentCustomer, previousCustomers);
            if (!alternativeExists) {
                return true;
            } else {
                currentCustomer.isSatisfied = true;
            }
        }
    });

    const allSatisfied = data.customers.every(customer => {
        return customer.isSatisfied;
    });

    if (!allSatisfied) {
        state.noSolutions = true;
    }

    return state.noSolutions
        ? "No solution exists"
        : state.map(colorType => colorType ? colorType : COLOR_TYPE.GLOSS).join(" ");
};

module.exports = solveProblem;