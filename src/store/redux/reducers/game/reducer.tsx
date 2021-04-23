import { NonNullablePlayer, PlayerId } from 'containers/Game/types';
import produce, { castDraft } from 'immer';
import config from 'config';
import { Reducer } from 'redux';
import {
	generateBomb,
	getExplosionResults,
	handleMove,
	topLeftCoordinatesToSquareCoordinates,
} from 'utils/game';
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
	TRIGGER_MOVE,
} from './constants';
import {
	AnimatableGameMap,
	GameAction,
	GameState,
	OnExplosionProps,
	OnMoveProps,
	OnPrepareMoveProps,
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
			case TRIGGER_MOVE: {
				const {
					playerId,
					direction,
					onComplete,
				} = action.payload as OnPrepareMoveProps;
				const { is3D, players, gameMap } = state;
				const playerConfig = players[playerId] as NonNullablePlayer;
				handleMove(
					{
						playerConfig,
						direction,
						is3D,
						gameMap,
					},
					onComplete
				);
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
				const playerId = action.payload as PlayerId;
				const bomb = generateBomb(state.players[playerId]!);
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
				const { tilesToBreak, playersToKill } = getExplosionResults(
					state.gameMap,
					state.players,
					bombCoordinates,
					config.size.explosion
				);
				// clear breakable tiles
				tilesToBreak.forEach(({ xSquare, ySquare }) => {
					draft.gameMap[ySquare][xSquare] = Tile.Empty;
				});
				// clear the bomb
				const {
					xSquare: bombXSquare,
					ySquare: bombYSquare,
				} = topLeftCoordinatesToSquareCoordinates(bombCoordinates);
				draft.gameMap[bombYSquare][bombXSquare] = Tile.Empty;
				// clear the players
				playersToKill.forEach(id => {
					delete draft.players[id];
					const {
						xSquare: playerXSquare,
						ySquare: playerYSquare,
					} = getPlayerSquareCoordinates(id);
					draft.gameMap[playerYSquare][playerXSquare] = Tile.Empty;
				});
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
				if (draft.players.P4) {
					delete draft.players.P4;
					break;
				}
				// draft.players = { ...draft.players, ...PLAYERS.P4 };
				draft.players.P4 = castDraft(PLAYERS.P4);
				break;
			default:
				// No default
				break;
		}
	});

export default gameReducer;
