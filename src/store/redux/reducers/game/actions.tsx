import {
	DROP_BOMB,
	MAKE_MOVE,
	ON_EXPLOSION_COMPLETE,
	SET_GAME_MAP,
	SET_GAME_STATE,
	TOGGLE_GAME_DIMENSION,
	TOGGLE_GAME_NPC,
	TOGGLE_GAME_PERSPECTIVE,
	TOGGLE_GAME_TWO_PLAYER,
	TRIGGER_EXPLOSION,
	TRIGGER_GAME_ANIMATION,
	TRIGGER_MOVE,
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

// #region GAME ACTIONS
const makeMoveInGame: GameActionFn = payload => ({
	type: MAKE_MOVE,
	payload,
});

const triggerMoveInGame: GameActionFn = payload => ({
	type: TRIGGER_MOVE,
	payload,
});

const dropBombInGame: GameActionFn = payload => ({
	type: DROP_BOMB,
	payload,
});

const triggerExplosionInGame: GameActionFn = (payload, cb) => ({
	type: TRIGGER_EXPLOSION,
	payload,
	cb,
});

const onExplosionCompleteInGame: GameActionFn = payload => ({
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
	// GAME ACTIONS
	makeMoveInGame,
	triggerMoveInGame,
	dropBombInGame,
	triggerExplosionInGame,
	onExplosionCompleteInGame,
	// GAME SETTINGS
	triggerGameAnimation,
	toggleGameDimension,
	toggleGamePerspective,
	toggleGameTwoPlayer,
	toggleGameNPC,
};
