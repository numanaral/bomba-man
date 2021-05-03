import { FirebaseState } from './reducers/firebase/types';
import { FirestoreState } from './reducers/firestore/types';
import { GameState } from './reducers/game/types';
import { gameKey } from './reducers/game';

type Store = {
	firebase: FirebaseState;
	firestore: FirestoreState;
	[gameKey]: GameState;
};

export type { Store };
