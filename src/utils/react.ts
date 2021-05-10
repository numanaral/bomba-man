import { isValidElement, createElement } from 'react';

export const getElementFromElementOrType = <T>(
	elementOrType: React.ReactElement | React.ElementType
) => {
	if (!elementOrType) {
		throw new Error('Element cannot be null or undefined.');
	}

	return (
		(isValidElement(elementOrType) && elementOrType) ||
		createElement<T>(elementOrType as React.ElementType)
	);
};
