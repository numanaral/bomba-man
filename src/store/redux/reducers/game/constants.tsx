// import { Immutable, castDraft } from 'immer';
import config from 'config';
import { generateRandomGameMap, playerGenerator } from 'utils/game';
import { GameState } from './types';

const BOUNDARY_MIN = 0;
const BOUNDARY_MAX = config.size.game - 1;
const P1 = playerGenerator('P1', BOUNDARY_MIN, BOUNDARY_MIN);
// const P1 = playerGenerator('P1', BOUNDARY_MAX, 7);
const P2 = playerGenerator('P2', BOUNDARY_MIN, BOUNDARY_MAX);
const P3 = playerGenerator('P3', BOUNDARY_MAX, BOUNDARY_MAX);
const P4 = playerGenerator('P4', BOUNDARY_MAX, BOUNDARY_MIN);

// Defaults
const KEY = 'Game';
const DEFAULT_VALUES: GameState = {
	players: {
		P1,
	},
	bombs: [],
	gameMap: generateRandomGameMap(config.size.game),
	is3D: false,
	isSideView: false,
	size: config.size.game,
	animationCounter: 0,
};
const PLAYERS = {
	P1,
	P2,
	P3,
	P4,
};

// Types
const SET_GAME_STATE = `${KEY}/SET_GAME_STATE`;
const START_GAME = `${KEY}/START_GAME`;
const SET_GAME_MAP = `${KEY}/SET_GAME_MAP`;
const SET_PLAYER_REF = `${KEY}/SET_PLAYER_REF`;
// GAME ACTIONS
const MAKE_MOVE = `${KEY}/MAKE_MOVE`;
const TRIGGER_MOVE = `${KEY}/TRIGGER_MOVE`;
const DROP_BOMB = `${KEY}/DROP_BOMB`;
const REMOVE_BOMB = `${KEY}/REMOVE_BOMB`;
const ON_EXPLOSION_COMPLETE = `${KEY}/ON_EXPLOSION_COMPLETE`;
// GAME SETTINGS
const TRIGGER_GAME_ANIMATION = `${KEY}/TRIGGER_ANIMATION`;
const TOGGLE_GAME_DIMENSION = `${KEY}/TOGGLE_GAME_DIMENSION`;
const TOGGLE_GAME_PERSPECTIVE = `${KEY}/TOGGLE_GAME_PERSPECTIVE`;
const TOGGLE_GAME_TWO_PLAYER = `${KEY}/TOGGLE_GAME_TWO_PLAYER`;
const TOGGLE_GAME_NPC = `${KEY}/TOGGLE_GAME_NPC`;

export {
	PLAYERS,
	KEY,
	DEFAULT_VALUES,
	SET_GAME_STATE,
	START_GAME,
	SET_GAME_MAP,
	SET_PLAYER_REF,
	ON_EXPLOSION_COMPLETE,
	// GAME ACTIONS
	MAKE_MOVE,
	TRIGGER_MOVE,
	DROP_BOMB,
	REMOVE_BOMB,
	// GAME SETTINGS
	TRIGGER_GAME_ANIMATION,
	TOGGLE_GAME_DIMENSION,
	TOGGLE_GAME_PERSPECTIVE,
	TOGGLE_GAME_TWO_PLAYER,
	TOGGLE_GAME_NPC,
};
