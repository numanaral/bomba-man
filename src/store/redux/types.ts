import { gameKey } from './reducers/game';
import { GameState } from './reducers/game/types';

type Store = {
	[gameKey]: GameState;
};

export type { Store };
