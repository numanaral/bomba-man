import { FirebaseState } from './reducers/firebase/types';
import { FirestoreState } from './reducers/firestore/types';
import { gameKey } from './reducers/game';
import { GameState } from './reducers/game/types';

type Store = {
	firebase: FirebaseState;
	firestore: FirestoreState;
	[gameKey]: GameState;
};

export type { Store };
