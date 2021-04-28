import { FirestoreReducer } from 'redux-firestore';
import { FirestoreSchema } from 'store/firebase/types';

type FirestoreState = FirestoreReducer.Reducer<FirestoreSchema>;

export type { FirestoreState };
