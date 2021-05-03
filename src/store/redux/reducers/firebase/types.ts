import { FirebaseReducer } from 'react-redux-firebase';
import { FirebaseSchema } from 'store/firebase/types';

type FirebaseState = FirebaseReducer.Reducer<
	FirebaseSchema.FirebaseProfile,
	FirebaseSchema.FirebaseSchema
>;

export type { FirebaseState };
