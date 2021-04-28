import { FirebaseReducer } from 'react-redux-firebase';
import { FirebaseProfile, FirebaseSchema } from 'store/firebase/types';

type FirebaseState = FirebaseReducer.Reducer<FirebaseProfile, FirebaseSchema>;

export type { FirebaseState };
