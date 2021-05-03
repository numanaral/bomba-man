import { doesNotExist } from 'utils';

const getLocalStorageItem = <T>(key: string) => {
	return JSON.parse(window.localStorage.getItem(key) || '') as T;
};

const clearLocalStorageItem = (key: string) => {
	try {
		localStorage.removeItem(key);
	} catch (ex) {
		console.warn(
			`Error clearing the local storage value for key "${key}".`,
			ex
		);
	}
};

/** @see https://usehooks.com/useLocalStorage/ */
const setLocalStorageItem = <T>(
	key: string,
	value: React.SetStateAction<T>,
	storedValue?: any
) => {
	try {
		// Allow value to be a function so we have same API as useState
		const valueToStore =
			value instanceof Function ? value(storedValue) : value;
		// Save to local storage
		window.localStorage.setItem(key, JSON.stringify(valueToStore));

		return value as T;
	} catch (ex) {
		console.warn(
			`Error setting the local storage value for key "${key}".`,
			value,
			ex
		);
		return value as T;
	}
};

// Only updates, does not set
const updateLocalStorageItem = <T>(key: string, value: T) => {
	const lastValue = getLocalStorageItem(key);
	if (doesNotExist(lastValue)) {
		console.warn(
			`Error setting the local storage value for key "${key}". The key doesn't exist in the local storage..`
		);
		return;
	}
	if (lastValue) setLocalStorageItem(key, value);
};

const getOrSetLocalStorageItem = <T>(key: string, value: T) => {
	try {
		const storedValue = getLocalStorageItem(key);
		if (doesNotExist(storedValue)) {
			return setLocalStorageItem<T>(key, value);
		}

		return storedValue as T;
	} catch (ex) {
		console.warn(
			`Error getting the local storage value for key "${key}". Will try re-setting it.`,
			ex
		);

		return setLocalStorageItem(key, value);
	}
};

export {
	getLocalStorageItem,
	clearLocalStorageItem,
	setLocalStorageItem,
	updateLocalStorageItem,
	getOrSetLocalStorageItem,
};
