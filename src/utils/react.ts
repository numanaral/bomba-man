import { isValidElement, createElement } from 'react';

export const getElementFromElementOrType = <T>(
	elementOrType?: React.ReactElement | React.ElementType
) => {
	return (
		(isValidElement(elementOrType) && elementOrType) ||
		createElement<T>(elementOrType as React.ElementType)
	);
};
