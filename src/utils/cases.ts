export const valueExists = (value: unknown): boolean => value !== undefined && value !== null && value !== '';

export const renderVariableValue = (variables: CaseVariable[], variableConfig: CaseVariableConfig): VariableValue => {
    let value = variables.find((v) => v.name === variableConfig.name)?.value;
    if (!valueExists(value)) {
        value = variableConfig.default || '-';
    }
    if (Array.isArray(value)) {
        return value.join(', ');
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return value.toString();
};

export const isCaseRunning = (caseInfo: CaseWithTaskInfo): boolean => {
    const running_statuses = ['PENDING', 'STARTED', 'RECEIVED', 'RETRY'];
    return (
        running_statuses.includes(caseInfo.create_task.status || '') ||
        running_statuses.includes(caseInfo.run_task.status || '')
    );
};
