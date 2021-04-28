import {
	Coordinates,
	NonNullablePlayer,
	PlayerConfig,
	PlayerId,
	Square,
	SquareCoordinates,
} from 'containers/Game/types';
import produce, { castDraft } from 'immer';
import { Reducer } from 'redux';
import {
	generateBomb,
	generatePowerUpOrNull,
	getExplosionResults,
	getPoweredUpValue,
	getSquareCoordinatesFromSquareOrTopLeftCoordinates,
	handleMove,
	isPowerUp,
	squareCoordinatesToTopLeftCoordinates,
	topLeftCoordinatesToSquareCoordinates,
} from 'utils/game';
import { updateImmerDraft } from 'utils/immer';
import { Explosive, FIRE_VALUES, Player, PowerUp, Tile } from 'enums';
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
	ON_EXPLOSION_COMPLETE,
	TRIGGER_MOVE,
	TRIGGER_EXPLOSION,
} from './constants';
import {
	AnimatableGameMap,
	BombId,
	GameAction,
	GameState,
	OnMoveProps,
	OnPrepareMoveProps,
} from './types';

const gameReducer: Reducer<GameState, GameAction> = (
	state = DEFAULT_VALUES,
	action
) => {
	return produce(state, draft => {
		// #region UTILITIES
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

		const getPowerUpOrNull = (coordinates: Coordinates) => {
			const {
				xSquare,
				ySquare,
			} = getSquareCoordinatesFromSquareOrTopLeftCoordinates(coordinates);

			try {
				const currentSquare = state.gameMap[ySquare][xSquare];
				if (currentSquare !== Tile.Breaking) return null;
				const powerUpOrNull = generatePowerUpOrNull();
				if (!powerUpOrNull) return null;
				return currentSquare === Tile.Breaking
					? {
							square: powerUpOrNull,
							coordinates: { ySquare, xSquare },
					  }
					: null;
			} catch (err) {
				console.error('Square being set is out of boundaries', {
					gameMap: state.gameMap,
					xSquare,
					ySquare,
				});
				return null;
			}
		};

		const populatePowerUps = (coordinates: Coordinates) => {
			const powerUpOrNull = getPowerUpOrNull(coordinates);
			if (!powerUpOrNull) return;

			const {
				square,
				coordinates: { xSquare, ySquare },
			} = powerUpOrNull;
			if (!draft.powerUps[ySquare]) {
				draft.powerUps[ySquare] = {};
			}
			// we know for sure it's a power
			draft.powerUps[ySquare][xSquare] = square as PowerUp;
		};

		const getPlayerState = (playerId: PlayerId) => {
			return state.players[playerId]!.state;
		};

		const getBombCountForPlayer = (playerId: PlayerId) => {
			return getPoweredUpValue(
				getPlayerState(playerId),
				PowerUp.BombCount
			);
		};

		const getBombSizeForPlayer = (playerId: PlayerId) => {
			return getPoweredUpValue(
				getPlayerState(playerId),
				PowerUp.BombSize
			);
		};

		const getMovementSpeedForPlayer = (playerId: PlayerId) => {
			return getPoweredUpValue(
				getPlayerState(playerId),
				PowerUp.MovementSpeed
			);
		};

		const isPlayerDead = (playerId: PlayerId) => {
			const playerState = getPlayerState(playerId);
			const { deathCount } = playerState;
			// < 1 to prevent instant double explosion
			return deathCount >= getPoweredUpValue(playerState, PowerUp.Life);
		};

		const subtractLifeFromPlayerAndHandleDeath = (playerId: PlayerId) => {
			draft.players[playerId]!.state.deathCount++;
		};

		const handlePlayerExplosionHit = (
			currentFireCoordinates: SquareCoordinates
		) => {
			const { xSquare, ySquare } = currentFireCoordinates;
			Object.values<PlayerConfig>(state.players).forEach(
				({ id, coordinates }) => {
					const {
						xSquare: playerXSquare,
						ySquare: playerYSquare,
					} = topLeftCoordinatesToSquareCoordinates(coordinates);
					if (
						playerXSquare === xSquare &&
						playerYSquare === ySquare
					) {
						subtractLifeFromPlayerAndHandleDeath(id);
					}
				}
			);
		};

		const getBombToTriggerFromExplosion = (
			coordinates: SquareCoordinates,
			currentBombId: BombId
		) => {
			const { ySquare, xSquare } = coordinates;
			// if there is a bomb by where the explosion hits,
			// trigger that bomb as well
			if (state.gameMap[ySquare][xSquare] !== Explosive.Bomb) return null;
			const { top, left } = squareCoordinatesToTopLeftCoordinates(
				coordinates
			);
			const bombToTrigger = state.bombs.find(
				({ top: t, left: l }) => top === t && left === l
			);
			// there is no bomb there
			if (!bombToTrigger) return null;
			// don't recurse on the same bomb that's triggering
			// the explosion
			if (bombToTrigger.id === currentBombId) return null;

			return bombToTrigger;
		};

		const onExplosionComplete = (bombId: BombId) => {
			const currentBomb = state.bombs.find(({ id }) => id === bombId);

			// If we recursively triggered it
			if (!currentBomb) return;

			const bombCoordinates = {
				top: currentBomb.top,
				left: currentBomb.left,
			};

			const bombSize = getBombSizeForPlayer(currentBomb.playerId);

			// remove bomb
			draft.bombs = draft.bombs.filter(({ id }) => id !== bombId);
			const { coordinatesToSetOnFire } = getExplosionResults(
				state.gameMap,
				state.players,
				bombCoordinates,
				bombSize,
				true
			);

			// clear fire
			Object.values(coordinatesToSetOnFire)
				.flat()
				.forEach(coordinates => {
					const {
						xSquare,
						ySquare,
					} = getSquareCoordinatesFromSquareOrTopLeftCoordinates(
						coordinates
					);
					// if there is a powerUp, put it on the map
					const powerUpOrNull = state.powerUps[ySquare]?.[xSquare];
					if (powerUpOrNull) {
						setSquare(coordinates, powerUpOrNull);
						// empty the powerUp from the state
						draft.powerUps[ySquare][xSquare] = null;
					} else {
						setSquare(coordinates, Tile.Empty);
					}
				});
		};

		const triggerExplosion = (
			bombId: BombId,
			bombsToSkip: Array<BombId>
		) => {
			const explosionToComplete: Set<BombId> = new Set();
			// allows us to not re-trigger explosion due to
			// two adjacent explosions
			if (bombsToSkip.includes(bombId)) return explosionToComplete;
			const currentBomb = state.bombs.find(({ id }) => id === bombId);

			// If we recursively triggered it
			if (!currentBomb) return explosionToComplete;

			const bombCoordinates = {
				top: currentBomb.top,
				left: currentBomb.left,
			};

			const bombSize = getBombSizeForPlayer(currentBomb.playerId);

			// find surrounding objects to modify
			const { coordinatesToSetOnFire } = getExplosionResults(
				state.gameMap,
				state.players,
				bombCoordinates,
				bombSize
			);

			const { horizontal, vertical, core } = coordinatesToSetOnFire;

			// set fire on all the coordinates
			// this automatically "breaks" the breakable tiles
			// URGENT: This will also contain two entity if Tile, Tile & Fire
			[
				{
					fireCoordinates: core,
					direction: Explosive.FireCore,
				},
				{
					fireCoordinates: horizontal,
					direction: Explosive.FireHorizontal,
				},
				{
					fireCoordinates: vertical,
					direction: Explosive.FireVertical,
				},
			].forEach(({ fireCoordinates, direction }) => {
				fireCoordinates.forEach(coordinates => {
					// check if there is a tile and get a random power up or null
					populatePowerUps(coordinates);
					setSquare(coordinates, direction);

					// subtract a life from the players if they are hit
					handlePlayerExplosionHit(coordinates);

					const currentBombId = currentBomb.id;
					// if there are bombs caught in fire, explode them
					const bombToTrigger = getBombToTriggerFromExplosion(
						coordinates,
						currentBombId
					);
					if (bombToTrigger) {
						const _explosionToComplete = triggerExplosion(
							bombToTrigger.id,
							[...bombsToSkip, currentBombId]
						);
						_explosionToComplete.forEach(bId =>
							explosionToComplete.add(bId)
						);
						explosionToComplete.add(bombToTrigger.id);
					}
				});
			});

			return explosionToComplete;
		};
		// #endregion

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
			case TRIGGER_MOVE: {
				const {
					playerId,
					direction,
					onComplete,
				} = action.payload as OnPrepareMoveProps;
				if (isPlayerDead(playerId)) return;

				const { is3D, players, gameMap } = state;
				const playerConfig = players[playerId] as NonNullablePlayer;

				handleMove(
					{
						playerConfig,
						direction,
						is3D,
						gameMap,
					},
					getMovementSpeedForPlayer(playerId),
					onComplete
				);
				break;
			}
			case MAKE_MOVE: {
				const {
					playerId,
					newCoordinates,
				} = action.payload as OnMoveProps;
				if (isPlayerDead(playerId)) return;

				// if there is a powerUp, assign it to the playerState
				const {
					ySquare: newCoordinateYSquare,
					xSquare: newCoordinateXSquare,
				} = topLeftCoordinatesToSquareCoordinates(newCoordinates);

				const newSquare =
					state.gameMap[newCoordinateYSquare][newCoordinateXSquare];

				// if a player steps on explosion fire, subtract a life
				// ??!!: This doesn't account for moving on the same bomb
				// explosion. If the player continues to move under the
				// same explosion fire, he will continuously lose a life
				if (FIRE_VALUES.includes(newSquare as Explosive)) {
					subtractLifeFromPlayerAndHandleDeath(playerId);

					// if he is dead, stop here
					if (isPlayerDead(playerId)) return;
					// URGENT: Pick Bomb over Player on map, this will also be
					// required by the NPC, but again, gotta handle multiple
					// Square types in one square inside gameMap
				} else {
					// set new player square
					setSquare(newCoordinates, playerId as Player);
				}

				const lastCoordinates = state.players[playerId]!.coordinates;

				const {
					ySquare: lastCoordinateYSquare,
					xSquare: lastCoordinateXSquare,
				} = topLeftCoordinatesToSquareCoordinates(lastCoordinates);
				// this can also be a bomb, we don't want to just clear it
				const lastSquare =
					state.gameMap[lastCoordinateYSquare][lastCoordinateXSquare];
				// clear lastSquare only if it was the player
				// (on a Tile.Empty)
				// otherwise we can leave whatever was there
				if (lastSquare === playerId) {
					setSquare(lastCoordinates, Tile.Empty);
				}
				const powerUpOrEmptyTile =
					state.gameMap[newCoordinateYSquare][newCoordinateXSquare];
				if (isPowerUp(powerUpOrEmptyTile)) {
					draft.players[playerId]!.state.powerUps[
						powerUpOrEmptyTile as PowerUp
					]++;
				}

				// update player's topLeft coordinates
				draft.players[playerId]!.coordinates = newCoordinates;
				break;
			}
			case DROP_BOMB: {
				const playerId = action.payload as PlayerId;
				if (isPlayerDead(playerId)) return;

				const playerConfig = state.players[playerId]!;
				const { coordinates } = playerConfig;
				const {
					xSquare,
					ySquare,
				} = getSquareCoordinatesFromSquareOrTopLeftCoordinates(
					coordinates
				);
				// prevent double bomb in one spot
				if (state.gameMap[ySquare][xSquare] === Explosive.Bomb) {
					return;
				}

				const playerBombCountOnMap = state.bombs.filter(
					({ playerId: pId }) => pId === playerId
				).length;
				// ??!!: is >= possible? will > suffice?
				// don't put more bombs than what you have
				if (playerBombCountOnMap >= getBombCountForPlayer(playerId)) {
					return;
				}
				const bomb = generateBomb(playerConfig);
				draft.bombs.push(bomb);

				// URGENT: This block will contain both the player and the bomb
				// TODO: Figure out a proper way to handle this for NPC
				setSquare(playerConfig.coordinates, Explosive.Bomb);
				break;
			}
			case TRIGGER_EXPLOSION: {
				const bombId = action.payload as BombId;
				const { cb } = action;
				// if current bomb already exploded, don't trigger it again
				// prevents: state update on an unmounted component
				if (!state.bombs.find(({ id }) => id === bombId)) {
					return;
				}
				const listOfExplosionsToComplete = triggerExplosion(bombId, []);

				cb?.(listOfExplosionsToComplete);
				break;
			}
			case ON_EXPLOSION_COMPLETE: {
				const bombId = action.payload as BombId;
				onExplosionComplete(bombId);
				break;
			}
			// #region GAME SETTINGS
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
			// #endregion
			default:
				// No default
				break;
		}
	});
};

export default gameReducer;
