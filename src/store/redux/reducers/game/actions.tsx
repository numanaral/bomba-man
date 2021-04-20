import {
	DROP_BOMB,
	MAKE_MOVE,
	ON_EXPLOSION_COMPLETE,
	REMOVE_BOMB,
	SET_GAME_MAP,
	SET_GAME_STATE,
	SET_PLAYER_REF,
	TOGGLE_GAME_DIMENSION,
	TOGGLE_GAME_NPC,
	TOGGLE_GAME_PERSPECTIVE,
	TOGGLE_GAME_TWO_PLAYER,
	TRIGGER_GAME_ANIMATION,
} from './constants';
import { GameActionFn } from './types';

const setGameState: GameActionFn = payload => ({
	type: SET_GAME_STATE,
	payload,
});

const setGameMap: GameActionFn = payload => ({
	type: SET_GAME_MAP,
	payload,
});

const setPlayerRefInGame: GameActionFn = payload => ({
	type: SET_PLAYER_REF,
	payload,
});

// #region GAME ACTIONS
const makeMoveInGame: GameActionFn = payload => ({
	type: MAKE_MOVE,
	payload,
});

const dropBombInGame: GameActionFn = payload => ({
	type: DROP_BOMB,
	payload,
});

const removeBombFromGame: GameActionFn = payload => ({
	type: REMOVE_BOMB,
	payload,
});

const onExplosionComplete: GameActionFn = payload => ({
	type: ON_EXPLOSION_COMPLETE,
	payload,
});
// #endregion

// #region GAME SETTINGS
const triggerGameAnimation: GameActionFn = () => ({
	type: TRIGGER_GAME_ANIMATION,
});

const toggleGameDimension: GameActionFn = () => ({
	type: TOGGLE_GAME_DIMENSION,
});

const toggleGamePerspective: GameActionFn = () => ({
	type: TOGGLE_GAME_PERSPECTIVE,
});

const toggleGameTwoPlayer: GameActionFn = () => ({
	type: TOGGLE_GAME_TWO_PLAYER,
});

const toggleGameNPC: GameActionFn = () => ({
	type: TOGGLE_GAME_NPC,
});
// #endregion

export {
	setGameState,
	setGameMap,
	setPlayerRefInGame,
	// GAME ACTIONS
	makeMoveInGame,
	dropBombInGame,
	removeBombFromGame,
	onExplosionComplete,
	// GAME SETTINGS
	triggerGameAnimation,
	toggleGameDimension,
	toggleGamePerspective,
	toggleGameTwoPlayer,
	toggleGameNPC,
};
