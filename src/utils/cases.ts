export const caseStatusOrders = {
    'INITIALISED': 1,
    'CREATED': 2,
    'SETUP': 3,
    'UPDATED': 4,
    'FATES INDICES SET': 5,
    'CONFIGURED': 6,
    'BUILDING': 7,
    'BUILT': 8,
    'SUBMITTED': 9
};

export const renderVariableValue = (variables: CaseVariable[], variableConfig: CaseVariableConfig): VariableValue => {
    let value = variables.find((v) => v.name === variableConfig.name)?.value;
    if (!value && value !== 0 && value !== false) {
        value = variableConfig.default || '-';
    }
    if (Array.isArray(value)) {
        return value.join(', ');
    }
    return value.toString();
};
