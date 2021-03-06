import firebase from 'firebase/app';
import { FirebaseObjects } from './types';

/**
 * Sort firebase objects by their `second`s.
 *
 * @param sort Ascending/Descending
 * @returns Sorter result
 */
const sortByFirebaseDate = (sort: 'desc' | 'asc' = 'desc') => (
	a: FirebaseObjects.Sortable,
	b: FirebaseObjects.Sortable
) => {
	return (
		((sort === 'desc' && -1) || 1) *
		(a.updatedOn.seconds - b.updatedOn.seconds)
	);
};

/**
 * Stringifies objects before sending them to firebase.
 *
 * @param props Properties to be passed into the firebase request.
 * @returns Firebase object with stringified props.
 */
const toFirestore = <
	T extends FirebaseObjects.Generic = FirebaseObjects.Generic
>(
	props: Partial<T>
) => {
	return Object.keys(props).reduce<Record<string, string>>((acc, key) => {
		const value = props[key] as any;
		// eslint-disable-next-line no-param-reassign
		acc[key] =
			(typeof value === 'object' &&
				!(value instanceof Date) &&
				JSON.stringify(value)) ||
			value;
		return acc;
	}, {}) as T;
};

/**
 * Parses stringified objects before passing them to the client.
 *
 * @param props Properties returned from the firebase request.
 * @param keys List of keys that need their value string parsed as JSON object.
 * @returns Firebase object with parsed props.
 */
const fromFirestore = (
	props: FirebaseObjects.Generic,
	keys: Array<string> = []
) => {
	return Object.keys(props).reduce((acc: FirebaseObjects.Generic, key) => {
		const value = props[key];
		// eslint-disable-next-line no-param-reassign
		acc[key] =
			(keys.includes(key) && JSON.parse(value)) ||
			(value instanceof firebase.firestore.Timestamp && value.toDate()) ||
			value;
		return acc;
	}, {});
};

/**
 * Map `fromFirestore` over the elements;
 *
 * @param keys List of keys that need their value string parsed as JSON object.
 * @returns Mapped result
 */
const mapFromFireStore = (keys: Array<string> = []) => (
	props: FirebaseObjects.Generic
) => fromFirestore(props, keys);

export { sortByFirebaseDate, toFirestore, fromFirestore, mapFromFireStore };
