import firebase from 'firebase/app';
import {
	FirebaseGenericObject,
	FirebaseObjectKeys,
	FirebaseSortableObject,
	FirebaseSortType,
} from './types';

/**
 * Sort firebase objects by their `second`s.
 *
 * @param sort Ascending/Descending
 * @returns Sorter result
 */
const sortByFirebaseDate = (sort: FirebaseSortType = 'desc') => (
	a: FirebaseSortableObject,
	b: FirebaseSortableObject
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
const toFirestore = (props: FirebaseGenericObject) => {
	return Object.keys(props).reduce((acc: FirebaseGenericObject, key) => {
		const value = props[key];
		// eslint-disable-next-line no-param-reassign
		acc[key] =
			(typeof value === 'object' &&
				!(value instanceof Date) &&
				JSON.stringify(value)) ||
			value;
		return acc;
	}, {});
};

/**
 * Parses stringified objects before passing them to the client.
 *
 * @param props Properties returned from the firebase request.
 * @param keys List of keys that need their value string parsed as JSON object.
 * @returns Firebase object with parsed props.
 */
const fromFirestore = (
	props: FirebaseGenericObject,
	keys: FirebaseObjectKeys = []
) => {
	return Object.keys(props).reduce((acc: FirebaseGenericObject, key) => {
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
const mapFromFireStore = (keys: FirebaseObjectKeys = []) => (
	props: FirebaseGenericObject
) => fromFirestore(props, keys);

export { sortByFirebaseDate, toFirestore, fromFirestore, mapFromFireStore };
