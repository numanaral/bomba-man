import React, { useState } from 'react';
import {
	setLocalStorageItem,
	getOrSetLocalStorageItem,
} from 'utils/localStorage';

const useLocalStorage = <T,>(key: string, initialValue: T) => {
	// Pass initial state function to useState so logic is only executed once
	// https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
	const [storedValue, setStoredValue] = useState<T>(() => {
		return getOrSetLocalStorageItem<T>(key, initialValue);
	});

	// Wrap the useState's setter to trigger local storage update
	const setValue = (value: React.SetStateAction<T>) => {
		try {
			setStoredValue(setLocalStorageItem<T>(key, value, storedValue));
		} catch (ex) {
			console.error(
				`Error setting the state for local storage value for key "${key}"`,
				ex
			);
		}
	};

	return [storedValue, setValue] as [
		T,
		React.Dispatch<React.SetStateAction<T>>
	];
};

export default useLocalStorage;
