import { GameState } from 'store/redux/reducers/game/types';

type FirebaseSortType = 'desc' | 'asc';
type FirebaseSortableObject = {
	updatedOn: {
		seconds: number;
		[key: string]: any;
	};
	[key: string]: any;
};
type FirebaseGenericObject = Record<string, any>;
type FirebaseObjectKeys = Array<string>;
// TODO: Once we have react-router and auth/roles setup, update this
type FirebaseProfile = {
	roles: Array<string>;
};
type FirebaseSchema = {
	online: GameState;
};
// TODO: Once we have are collecting data, update this
type FirestoreSchema = FirebaseGenericObject;

export type {
	FirebaseSortType,
	FirebaseSortableObject,
	FirebaseGenericObject,
	FirebaseObjectKeys,
	FirebaseProfile,
	FirebaseSchema,
	FirestoreSchema,
};
