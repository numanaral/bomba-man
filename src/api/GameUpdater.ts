import {
	PlayerId,
	Players,
	PlayerConfig,
	TopLeftCoordinates,
	PlayerState,
	// KeyboardConfig,
	SquareCoordinates,
	Square,
} from 'containers/Game/types';
import { PowerUp } from 'enums';
import {
	GameState,
	AnimatableGameMap,
	BombId,
	Bomb,
} from 'store/redux/reducers/game/types';

abstract class GameUpdater {
	// #region GameState

	// #region 	GameState
	abstract updateGameState(gameState: Partial<GameState>): void;
	// #endregion

	// #region 	GameState.players

	// #region 		GameState.players
	abstract updatePlayers(players: Partial<Players>): void;
	// #endregion

	// #region 		GameState.players.[*]
	abstract addPlayer(
		playerConfig: Partial<PlayerConfig>,
		playerId: PlayerId
	): void;

	abstract updatePlayer(
		playerConfig: Partial<PlayerConfig>,
		playerId: PlayerId
	): void;

	abstract removePlayer(playerId: PlayerId): void;

	// #endregion

	// #region 			GameState.players.[*].[*PlayerConfig]

	// #region 			GameState.players.[*].[*PlayerConfig].id
	abstract updatePlayerId(id: PlayerId, playerId: PlayerId): void;
	// #endregion

	// #region 			GameState.players.[*].[*PlayerConfig].coordinates
	abstract updatePlayerCoordinates(
		coordinates: TopLeftCoordinates,
		playerId: PlayerId
	): void;
	// #endregion

	// #region 			GameState.players.[*].[*PlayerConfig].state
	abstract updatePlayerState(
		playerState: Partial<PlayerState>,
		playerId: PlayerId
	): void;

	abstract incrementPlayerPowerUp(powerUp: PowerUp, playerId: PlayerId): void;

	abstract incrementPlayerDeathCount(playerId: PlayerId): void;
	// #endregion

	// #region 			GameState.players.[*].[*PlayerConfig].keyboardConfig
	// ??!!: Remove this option for now
	// abstract updatePlayerPlayerKeyboardConfig(
	// 	keyboardConfig: Partial<KeyboardConfig>,
	// 	playerId: PlayerId
	// ): void;
	// #endregion

	// #endregion

	// #endregion

	// #region 	GameState.gameMap
	abstract updateGameMap(animatableGameMap: AnimatableGameMap): void;

	abstract updateGameMapSquare(
		squareCoordinates: SquareCoordinates,
		square: Square
	): void;
	// #endregion

	// #region 	GameState.bombs
	abstract addBomb(bomb: Bomb): void;

	abstract removeBomb(bombId: BombId): void;
	// #endregion

	// #region 	GameState.powerUps
	abstract addPowerUp(
		powerUp: PowerUp,
		squareCoordinates: SquareCoordinates
	): void;

	abstract removePowerUp({ ySquare, xSquare }: SquareCoordinates): void;
	// #endregion

	// #region 	GameState.gameConfig
	// TODO: editable-game-config
	// #endregion

	// #region 	GameState.[*primitives]

	abstract toggleIs3D(): void;

	abstract toggleIsSideView(): void;

	abstract incrementAnimationCounter(): void;

	// #endregion

	// #endregion
}

export default GameUpdater;
