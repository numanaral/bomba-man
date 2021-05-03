import {
	Coordinates,
	Square,
	PlayerId,
	SquareCoordinates,
	PlayerConfig,
} from 'containers/Game/types';
import { Tile, PowerUp, Explosive, FIRE_VALUES, Player } from 'enums';
import {
	AnimatableGameMap,
	BombId,
	GameState,
	OnMoveProps,
	OnPrepareMoveProps,
} from 'store/redux/reducers/game/types';
import {
	getSquareCoordinatesFromSquareOrTopLeftCoordinates,
	generatePowerUpOrNull,
	getPoweredUpValue,
	topLeftCoordinatesToSquareCoordinates,
	squareCoordinatesToTopLeftCoordinates,
	getExplosionResults,
	handleMove,
	isPowerUp,
	generateBomb,
	generatePlayer,
} from 'utils/game';
import LocalGameUpdater from './LocalGameUpdater';
import OnlineGameUpdater from './OnlineGameUpdater';

class GameUtils {
	constructor(
		public state: GameState,
		public updaters: OnlineGameUpdater | LocalGameUpdater
	) {}

	// #region STATE UTILITIES
	getPlayerState = (playerId: PlayerId) => {
		return this.state.players[playerId]!.state;
	};

	isPlayerDead = (playerId: PlayerId) => {
		const playerState = this.getPlayerState(playerId);
		const { deathCount } = playerState;
		// < 1 to prevent instant double explosion
		return (
			deathCount >=
			getPoweredUpValue(
				playerState,
				PowerUp.Life,
				this.state.config.powerUps
			)
		);
	};

	getPowerUpOrNull = (coordinates: Coordinates) => {
		const {
			xSquare,
			ySquare,
		} = getSquareCoordinatesFromSquareOrTopLeftCoordinates(
			coordinates,
			this.state.config.sizes.movement
		);

		try {
			const currentSquare = this.state.gameMap[ySquare][xSquare];
			if (currentSquare !== Tile.Breaking) return null;
			const powerUpOrNull = generatePowerUpOrNull(
				this.state.config.powerUps.chance
			);
			if (!powerUpOrNull) return null;
			return currentSquare === Tile.Breaking
				? {
						square: powerUpOrNull,
						coordinates: { ySquare, xSquare },
				  }
				: null;
		} catch (err) {
			console.error('Square being set is out of boundaries', {
				gameMap: this.state.gameMap,
				xSquare,
				ySquare,
			});
			return null;
		}
	};

	getBombCountForPlayer = (playerId: PlayerId) => {
		return getPoweredUpValue(
			this.getPlayerState(playerId),
			PowerUp.BombCount,
			this.state.config.powerUps
		);
	};

	getBombSizeForPlayer = (playerId: PlayerId) => {
		return getPoweredUpValue(
			this.getPlayerState(playerId),
			PowerUp.BombSize,
			this.state.config.powerUps
		);
	};

	getMovementSpeedForPlayer = (playerId: PlayerId) => {
		return getPoweredUpValue(
			this.getPlayerState(playerId),
			PowerUp.MovementSpeed,
			this.state.config.powerUps
		);
	};

	getBombToTriggerFromExplosion = (
		coordinates: SquareCoordinates,
		currentBombId: BombId
	) => {
		const { ySquare, xSquare } = coordinates;
		// if there is a bomb by where the explosion hits,
		// trigger that bomb as well
		if (this.state.gameMap[ySquare][xSquare] !== Explosive.Bomb)
			return null;
		const { top, left } = squareCoordinatesToTopLeftCoordinates(
			coordinates,
			this.state.config.sizes.movement
		);
		const bombToTrigger = Object.values(this.state.bombs).find(
			({ top: t, left: l }) => top === t && left === l
		);
		// there is no bomb there
		if (!bombToTrigger) return null;
		// don't recurse on the same bomb that's triggering
		// the explosion
		if (bombToTrigger.id === currentBombId) return null;

		return bombToTrigger;
	};
	// #endregion

	// #region DRAFT UTILITIES
	setSquare = (coordinates: Coordinates, newSquare: Square) => {
		// eslint-disable-next-line max-len
		const squareCoordinates = getSquareCoordinatesFromSquareOrTopLeftCoordinates(
			coordinates,
			this.state.config.sizes.movement
		);

		try {
			this.updaters.updateGameMapSquare(squareCoordinates, newSquare);
		} catch (err) {
			console.error('Square being set is out of boundaries', {
				gameMap: this.state.gameMap,
				squareCoordinates,
			});
		}
	};

	populatePowerUps = (coordinates: Coordinates) => {
		const powerUpOrNull = this.getPowerUpOrNull(coordinates);
		if (!powerUpOrNull) return;

		const { square, coordinates: powerUpCoordinates } = powerUpOrNull;
		this.updaters.addPowerUp(square as PowerUp, powerUpCoordinates);
	};

	handlePlayerExplosionHit = (currentFireCoordinates: SquareCoordinates) => {
		const { xSquare, ySquare } = currentFireCoordinates;
		Object.values<PlayerConfig>(this.state.players).forEach(
			({ id: playerId, coordinates }) => {
				const {
					xSquare: playerXSquare,
					ySquare: playerYSquare,
				} = topLeftCoordinatesToSquareCoordinates(
					coordinates,
					this.state.config.sizes.movement
				);
				if (playerXSquare === xSquare && playerYSquare === ySquare) {
					this.updaters.incrementPlayerDeathCount(playerId);
				}
			}
		);
	};

	triggerChainExplosion = (bombId: BombId, bombsToSkip: Array<BombId>) => {
		const explosionToComplete: Set<BombId> = new Set();
		// allows us to not re-trigger explosion due to
		// two adjacent explosions
		if (bombsToSkip.includes(bombId)) return explosionToComplete;
		const currentBomb = this.state.bombs[bombId];

		// If we recursively triggered it
		if (!currentBomb) return explosionToComplete;

		const bombCoordinates = {
			top: currentBomb.top,
			left: currentBomb.left,
		};

		const bombSize = this.getBombSizeForPlayer(currentBomb.playerId);

		// find surrounding objects to modify
		const { coordinatesToSetOnFire } = getExplosionResults(
			this.state.gameMap,
			this.state.players,
			bombCoordinates,
			bombSize,
			this.state.config.sizes
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
				this.populatePowerUps(coordinates);
				this.setSquare(coordinates, direction);

				// subtract a life from the players if they are hit
				// URGENT: We want this to happen only once
				this.handlePlayerExplosionHit(coordinates);

				const currentBombId = currentBomb.id;
				// if there are bombs caught in fire, explode them
				const bombToTrigger = this.getBombToTriggerFromExplosion(
					coordinates,
					currentBombId
				);
				if (bombToTrigger) {
					const _explosionToComplete = this.triggerChainExplosion(
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

	// #region API
	setGameState = (gameState: GameState) => {
		this.updaters.updateGameState(gameState);
	};

	startGame = () => {
		// this.updaters.
	};

	endGame = () => {
		// this.updaters.
	};

	setGameMap = (animatableGameMap: AnimatableGameMap) => {
		this.updaters.updateGameMap(animatableGameMap);
	};

	triggerMove = ({
		playerId,
		direction,
		onComplete,
		ref,
	}: OnPrepareMoveProps) => {
		if (this.isPlayerDead(playerId)) return;

		const { is3D, players, gameMap } = this.state;
		const playerConfig = players[playerId] as PlayerConfig;

		handleMove(
			{
				playerConfig,
				direction,
				is3D,
				gameMap,
			},
			this.getMovementSpeedForPlayer(playerId),
			onComplete,
			ref,
			this.state.config.sizes
		);
	};

	makeMove = ({ playerId, newCoordinates }: OnMoveProps) => {
		if (this.isPlayerDead(playerId)) return;
		// if there is a powerUp, assign it to the playerState
		const {
			ySquare: newCoordinateYSquare,
			xSquare: newCoordinateXSquare,
		} = topLeftCoordinatesToSquareCoordinates(
			newCoordinates,
			this.state.config.sizes.movement
		);

		const newSquare = this.state.gameMap[newCoordinateYSquare][
			newCoordinateXSquare
		];

		// if a player steps on explosion fire, subtract a life
		// ??!!: This doesn't account for moving on the same bomb
		// explosion. If the player continues to move under the
		// same explosion fire, he will continuously lose a life
		if (FIRE_VALUES.includes(newSquare as Explosive)) {
			this.updaters.incrementPlayerDeathCount(playerId);

			// if he is dead, stop here
			if (this.isPlayerDead(playerId)) return;
			// URGENT: Pick Bomb over Player on map, this will also be
			// required by the NPC, but again, gotta handle multiple
			// Square types in one square inside gameMap
		} else {
			// set new player square
			this.setSquare(
				{
					ySquare: newCoordinateYSquare,
					xSquare: newCoordinateXSquare,
				},
				playerId as Player
			);
		}

		const lastCoordinates = this.state.players[playerId]!.coordinates;

		const {
			ySquare: lastCoordinateYSquare,
			xSquare: lastCoordinateXSquare,
		} = topLeftCoordinatesToSquareCoordinates(
			lastCoordinates,
			this.state.config.sizes.movement
		);
		// this can also be a bomb, we don't want to just clear it
		const lastSquare = this.state.gameMap[lastCoordinateYSquare][
			lastCoordinateXSquare
		];
		// clear lastSquare only if it was the player
		// (on a Tile.Empty)
		// otherwise we can leave whatever was there
		if (lastSquare === playerId) {
			this.setSquare(
				{
					ySquare: lastCoordinateYSquare,
					xSquare: lastCoordinateXSquare,
				},
				Tile.Empty
			);
		}
		const powerUpOrEmptyTile = this.state.gameMap[newCoordinateYSquare][
			newCoordinateXSquare
		] as PowerUp;
		if (isPowerUp(powerUpOrEmptyTile)) {
			this.updaters.incrementPlayerPowerUp(powerUpOrEmptyTile, playerId);
		}

		// update player's topLeft coordinates
		this.updaters.updatePlayerCoordinates(newCoordinates, playerId);
	};

	dropBomb = (playerId: PlayerId) => {
		if (this.isPlayerDead(playerId)) return;

		const playerConfig = this.state.players[playerId]!;
		const { coordinates } = playerConfig;
		const {
			xSquare,
			ySquare,
		} = getSquareCoordinatesFromSquareOrTopLeftCoordinates(
			coordinates,
			this.state.config.sizes.movement
		);
		// prevent double bomb in one spot
		if (this.state.gameMap[ySquare][xSquare] === Explosive.Bomb) {
			return;
		}

		const playerBombCountOnMap = Object.values(this.state.bombs).filter(
			({ playerId: pId }) => pId === playerId
		).length;
		// ??!!: is >= possible? will > suffice?
		// don't put more bombs than what you have
		if (playerBombCountOnMap >= this.getBombCountForPlayer(playerId)) {
			return;
		}
		const bomb = generateBomb(playerConfig, this.state.config.powerUps);
		this.updaters.addBomb(bomb);

		// URGENT: This block will contain both the player and the bomb
		// TODO: Figure out a proper way to handle this for NPC
		this.setSquare(playerConfig.coordinates, Explosive.Bomb);
	};

	triggerExplosion = (bombId: BombId, cb?: CallableFunction) => {
		// if current bomb already exploded, don't trigger it again
		// prevents: state update on an unmounted component
		if (!this.state.bombs[bombId]) {
			return;
		}
		const explosionsToComplete = this.triggerChainExplosion(bombId, []);
		cb?.(explosionsToComplete);
	};

	onExplosionComplete = (bombId: BombId) => {
		const currentBomb = this.state.bombs[bombId];

		// If we recursively triggered it
		if (!currentBomb) return;

		const bombCoordinates = {
			top: currentBomb.top,
			left: currentBomb.left,
		};

		const bombSize = this.getBombSizeForPlayer(currentBomb.playerId);

		// remove bomb
		this.updaters.removeBomb(bombId);
		const { coordinatesToSetOnFire } = getExplosionResults(
			this.state.gameMap,
			this.state.players,
			bombCoordinates,
			bombSize,
			this.state.config.sizes,
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
					coordinates,
					this.state.config.sizes.movement
				);
				// if there is a powerUp, put it on the map
				const powerUpOrNull = this.state.powerUps[ySquare]?.[xSquare];
				if (powerUpOrNull) {
					this.setSquare(coordinates, powerUpOrNull);
					// empty the powerUp from the state
					this.updaters.removePowerUp({ xSquare, ySquare });
				} else {
					this.setSquare(coordinates, Tile.Empty);
				}
			});
	};

	triggerGameAnimation = () => {
		this.updaters.incrementAnimationCounter();
	};

	toggleGameDimension = () => {
		this.updaters.toggleIs3D();
	};

	toggleGamePerspective = () => {
		this.updaters.toggleIsSideView();
	};

	toggleGameTwoPlayer = () => {
		if (this.state.players.P2) {
			this.updaters.removePlayer(Player.P2);
			return;
		}

		this.updaters.addPlayer(
			generatePlayer(Player.P2, this.state.config),
			Player.P2
		);
	};

	toggleGameNpc = () => {
		if (this.state.players.P4) {
			this.updaters.removePlayer(Player.P4);
			return;
		}

		this.updaters.addPlayer(
			generatePlayer(Player.P4, this.state.config),
			Player.P4
		);
	};
	// #endregion
}

export default GameUtils;
