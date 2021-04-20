import { TopLeftCoordinates } from 'containers/Game/types';
import produce, { castDraft } from 'immer';
import config from 'config';
import { Reducer } from 'redux';
import { handleExplosionOnGameMap } from 'utils/game';
import { updateImmerDraft } from 'utils/immer';
import {
	DEFAULT_VALUES,
	SET_GAME_STATE,
	START_GAME,
	SET_GAME_MAP,
	TRIGGER_GAME_ANIMATION,
	TOGGLE_GAME_DIMENSION,
	TOGGLE_GAME_PERSPECTIVE,
	TOGGLE_GAME_TWO_PLAYER,
	TOGGLE_GAME_NPC,
	PLAYERS,
	MAKE_MOVE,
	DROP_BOMB,
	REMOVE_BOMB,
	SET_PLAYER_REF,
	ON_EXPLOSION_COMPLETE,
} from './constants';
import {
	AnimatableGameMap,
	Bomb,
	GameAction,
	GameState,
	OnExplosionProps,
	OnMoveProps,
	PlayerWithNewRef,
} from './types';

const gameReducer: Reducer<GameState, GameAction> = (
	state = DEFAULT_VALUES,
	action
) =>
	produce(state, draft => {
		switch (action.type) {
			case SET_GAME_STATE:
				updateImmerDraft(draft, action.payload as GameState);
				break;
			case START_GAME:
				draft.players.P1 = castDraft(PLAYERS.P1);
				break;
			case SET_GAME_MAP: {
				const {
					animate,
					gameMap,
				} = action.payload as AnimatableGameMap;
				draft.gameMap = gameMap;
				if (animate) draft.animationCounter++;
				// draft.gameMap = action.payload;
				break;
			}
			// GAME ACTIONS
			case SET_PLAYER_REF: {
				const { playerId, newRef } = action.payload as PlayerWithNewRef;
				if (!newRef) break;
				draft.players[playerId]!.ref = castDraft(newRef);
				break;
			}
			case MAKE_MOVE: {
				const {
					playerId,
					newCoordinates,
				} = action.payload as OnMoveProps;
				draft.players[playerId]!.coordinates = newCoordinates;
				break;
			}
			case DROP_BOMB: {
				const topLeft = action.payload as TopLeftCoordinates;
				const bomb: Bomb = {
					...topLeft,
					id: new Date().toJSON(),
				};
				draft.bombs.push(bomb);
				break;
			}
			case REMOVE_BOMB: {
				const bombId = action.payload as string;
				draft.bombs = draft.bombs.filter(({ id }) => id !== bombId);
				break;
			}
			case ON_EXPLOSION_COMPLETE: {
				const {
					bombId,
					bombCoordinates,
				} = action.payload as OnExplosionProps;
				// remove bomb
				draft.bombs = draft.bombs.filter(({ id }) => id !== bombId);
				const newMap = handleExplosionOnGameMap(
					state.gameMap,
					bombCoordinates,
					config.size.explosion
				);
				draft.gameMap = newMap;
				break;
			}
			// GAME SETTINGS
			case TRIGGER_GAME_ANIMATION:
				draft.animationCounter++;
				break;
			case TOGGLE_GAME_DIMENSION:
				draft.is3D = !draft.is3D;
				break;
			case TOGGLE_GAME_PERSPECTIVE:
				draft.isSideView = !draft.isSideView;
				break;
			case TOGGLE_GAME_TWO_PLAYER:
				if (draft.players.P2) {
					delete draft.players.P2;
					break;
				}
				draft.players.P2 = castDraft(PLAYERS.P2);
				break;
			case TOGGLE_GAME_NPC:
				if (draft.players.P3) {
					delete draft.players.P3;
					break;
				}
				// draft.players = { ...draft.players, ...PLAYERS.P3 };
				draft.players.P3 = castDraft(PLAYERS.P3);
				break;
			default:
				// No default
				break;
		}
	});

export default gameReducer;
