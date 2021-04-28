import { FirestoreReducer } from 'redux-firestore';
import { FirebaseSchema } from 'store/firebase/types';

type FirestoreState = FirestoreReducer.Reducer<FirebaseSchema.FirestoreSchema>;

export type { FirestoreState };
