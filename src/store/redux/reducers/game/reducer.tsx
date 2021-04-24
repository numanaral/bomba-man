import {
	Coordinates,
	NonNullablePlayer,
	PlayerId,
	Square,
} from 'containers/Game/types';
import produce, { castDraft } from 'immer';
import config from 'config';
import { Reducer } from 'redux';
import {
	generateBomb,
	getExplosionResults,
	getSquareCoordinatesFromSquareOrTopLeftCoordinates,
	handleMove,
	topLeftCoordinatesToSquareCoordinates,
} from 'utils/game';
import { updateImmerDraft } from 'utils/immer';
import { Explosive, Player, Tile } from 'enums';
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
	TRIGGER_EXPLOSION,
} from './constants';
import {
	AnimatableGameMap,
	Bomb,
	BombId,
	GameAction,
	GameState,
	OnMoveProps,
	OnPrepareMoveProps,
	PlayerWithNewRef,
} from './types';

const gameReducer: Reducer<GameState, GameAction> = (
	state = DEFAULT_VALUES,
	action
) => {
	return produce(state, draft => {
		const setSquare = (coordinates: Coordinates, newSquare: Square) => {
			const {
				xSquare,
				ySquare,
			} = getSquareCoordinatesFromSquareOrTopLeftCoordinates(coordinates);

			try {
				draft.gameMap[ySquare][xSquare] = newSquare;
			} catch (err) {
				console.error('Square being set is out of boundaries', {
					gameMap: state.gameMap,
					xSquare,
					ySquare,
				});
			}
		};

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
				setSquare(
					state.players[playerId]!.coordinates,
					playerId as Player
				);
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

				const lastCoordinates = state.players[playerId]!.coordinates;

				const {
					ySquare,
					xSquare,
				} = topLeftCoordinatesToSquareCoordinates(lastCoordinates);
				// this can also be a bomb, we don't want to just clear it
				const lastSquare = state.gameMap[ySquare][xSquare];
				// clear lastSquare only if it was the player
				// (on a Tile.Empty)
				// otherwise we can leave whatever was there
				if (lastSquare === playerId) {
					setSquare(lastCoordinates, Tile.Empty);
				}
				// set new player square
				setSquare(newCoordinates, playerId as Player);
				// update player's topLeft coordinates
				draft.players[playerId]!.coordinates = newCoordinates;
				break;
			}
			case DROP_BOMB: {
				const playerId = action.payload as PlayerId;
				const playerConfig = state.players[playerId]!;
				const bomb = generateBomb(playerConfig);
				draft.bombs.push(bomb);
				// URGENT: This block will contain both the player and the bomb
				// TODO: Figure out a proper way to handle this for NPC
				setSquare(playerConfig.coordinates, Explosive.Bomb);
				break;
			}
			case REMOVE_BOMB: {
				const bombId = action.payload as string;
				draft.bombs = draft.bombs.filter(({ id }) => id !== bombId);
				break;
			}
			case TRIGGER_EXPLOSION: {
				const bombId = action.payload as BombId;
				const currentBomb = state.bombs.find(
					({ id }) => id === bombId
				) as NonNullable<Bomb>;
				const bombCoordinates = {
					top: currentBomb.top,
					left: currentBomb!.left,
				};

				// find surrounding objects to modify
				const {
					coordinatesToSetOnFire,
					playersToKill,
				} = getExplosionResults(
					state.gameMap,
					state.players,
					bombCoordinates,
					config.size.explosion
				);

				console.log(
					'coordinatesToSetOnFireTRIGGER: ',
					coordinatesToSetOnFire
				);

				const { horizontal, vertical } = coordinatesToSetOnFire;

				// set fire on all the coordinates
				// this automatically "breaks" the breakable tiles
				// URGENT: This will also contain two entity if Tile, Tile & Fire
				horizontal.forEach(coordinates => {
					setSquare(coordinates, Explosive.FireHorizontal);
				});
				vertical.forEach(coordinates => {
					setSquare(coordinates, Explosive.FireVertical);
				});
				// Core will not have an explosion direction
				setSquare(horizontal[0], Explosive.FireCore);

				// clear the players
				playersToKill.forEach(playerId => {
					delete draft.players[playerId];
					setSquare(state.players[playerId]!.coordinates, Tile.Empty);
				});
				break;
			}
			case ON_EXPLOSION_COMPLETE: {
				const bombId = action.payload as BombId;
				const currentBomb = state.bombs.find(
					({ id }) => id === bombId
				) as NonNullable<Bomb>;
				const bombCoordinates = {
					top: currentBomb.top,
					left: currentBomb!.left,
				};

				// remove bomb
				draft.bombs = draft.bombs.filter(({ id }) => id !== bombId);
				const { coordinatesToSetOnFire } = getExplosionResults(
					state.gameMap,
					state.players,
					bombCoordinates,
					config.size.explosion,
					true
				);

				console.log(
					'coordinatesToSetOnFireCOMPLETE: ',
					coordinatesToSetOnFire
				);

				// clear fire
				const { horizontal, vertical } = coordinatesToSetOnFire;
				[...horizontal, ...vertical].forEach(coordinates => {
					setSquare(coordinates, Tile.Empty);
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
};

export default gameReducer;
