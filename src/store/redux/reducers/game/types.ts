import { Players } from 'containers/Game/Game';
import { GameMap } from 'containers/Game/types';
import * as constants from './constants';

const { KEY, DEFAULT_VALUES, ...actionTypes } = constants;

type GameState = {
	players: Players;
	gameMap: GameMap;
};

type GameAction = {
	type: ValuesOf<typeof actionTypes>;
	payload?: GameState;
};

type GameActionFn = (payload?: GameState) => GameAction;

export type { GameState, GameAction, GameActionFn };
