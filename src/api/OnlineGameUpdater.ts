// import useAuth from 'store/firebase/hooks/useAuth';
// TODO: react-router
// import LoadingIndicator from 'components/LoadingIndicator';
// import NoAccess from 'components/NoAccess';
// TODO: notification-provider
// import useNotificationProvider from 'store/redux/hooks/useNotificationProvider';
import {
	AnimatableGameMap,
	Bomb,
	BombId,
	GameState,
} from 'store/redux/reducers/game/types';
import {
	PlayerConfig,
	PlayerId,
	PlayerKeyboardConfig,
	Players,
	PlayerState,
	PowerUps,
	Square,
	SquareCoordinates,
	TopLeftCoordinates,
} from 'containers/Game/types';
import { PowerUp } from 'enums';
import GameUpdater from './GameUpdater';
import useFirebaseUtils from '../store/firebase/hooks/useFirebaseUtils';

const useFirebaseUtilsWrapper = () => useFirebaseUtils<GameState>('');
type FirebaseUtilsFns = ReturnType<typeof useFirebaseUtilsWrapper>;

class OnlineGameUpdater extends GameUpdater {
	constructor(public state: GameState, public updaters: FirebaseUtilsFns) {
		super();
	}

	// #region Utils
	getPlayerState = (playerId: PlayerId) => {
		return this.state.players[playerId]!.state;
	};
	// #endregion

	// #region GameState

	// #region 	GameState

	updateGameState = async (gameState: Partial<GameState>) => {
		this.updaters.update(gameState);
	};

	// #endregion

	// #region 	GameState.players

	// #region 		GameState.players
	updatePlayers = async (players: Partial<Players>) => {
		this.updaters.update<Players>({ ...players });
	};
	// #endregion

	// #region 		GameState.players.[*]

	addPlayer = async (playerConfig: PlayerConfig, playerId: PlayerId) => {
		this.updaters.create<PlayerConfig>(
			playerConfig,
			`/players/${playerId}`
		);
	};

	updatePlayer = async (
		playerConfig: Partial<PlayerConfig>,
		playerId: PlayerId
	) => {
		this.updaters.update<PlayerConfig>(
			{ [playerId]: playerConfig },
			`/players`
		);
	};

	removePlayer = async (playerId: PlayerId) => {
		this.updaters.remove(`/players/${playerId}`);
	};

	// #endregion

	// #region 			GameState.players.[*].[*PlayerConfig]

	// #region 			GameState.players.[*].[*PlayerConfig].id
	updatePlayerId = async (id: PlayerId, playerId: PlayerId) => {
		this.updaters.update<PlayerConfig>({ id }, `/players/${playerId}`);
	};
	// #endregion

	// #region 			GameState.players.[*].[*PlayerConfig].coordinates
	updatePlayerCoordinates = async (
		coordinates: TopLeftCoordinates,
		playerId: PlayerId
	) => {
		this.updaters.update<PlayerConfig>(
			{ coordinates },
			`/players/${playerId}`
		);
	};
	// #endregion

	// #region 			GameState.players.[*].[*PlayerConfig].state
	updatePlayerState = async (
		playerState: Partial<PlayerState>,
		playerId: PlayerId
	) => {
		this.updaters.update<PlayerState>(
			{ ...playerState },
			`/players/${playerId}`
		);
	};

	incrementPlayerDeathCount = async (playerId: PlayerId) => {
		this.updaters.update<PlayerState>(
			{ deathCount: this.getPlayerState(playerId).deathCount + 1 },
			`/players/${playerId}/state`
		);
	};

	// #region 			GameState.players.[*].[*PlayerConfig].state.powerUps
	incrementPlayerPowerUp = async (powerUp: PowerUp, playerId: PlayerId) => {
		debugger;
		this.updaters.update<PowerUps>(
			{ [powerUp]: this.getPlayerState(playerId).powerUps[powerUp] + 1 },
			`/players/${playerId}/state/powerUps`
		);
	};
	// #endregion
	// #endregion

	// #region 			GameState.players.[*].[*PlayerConfig].keyboardConfig
	updatePlayerPlayerKeyboardConfig = async (
		keyboardConfig: Partial<PlayerKeyboardConfig>,
		playerId: PlayerId
	) => {
		this.updaters.update<PlayerKeyboardConfig>(
			{ ...keyboardConfig },
			`/players/${playerId}`
		);
	};
	// #endregion

	// #endregion

	// #endregion

	// #region 	GameState.gameMap

	updateGameMap = async ({ gameMap, animate }: AnimatableGameMap) => {
		// NOTE: Should we do a diff here and only update what's necessary?
		// we aren't sending huge data but should check this out later
		this.updaters.update({ gameMap });
		if (animate) this.incrementAnimationCounter();
	};

	updateGameMapSquare = async (
		{ xSquare, ySquare }: SquareCoordinates,
		square: Square
	) => {
		this.updaters.update<Record<number, Square>>(
			{
				[xSquare]: square,
			},
			`/gameMap/${ySquare}`
		);
	};

	// #endregion

	// #region 	GameState.bombs

	addBomb = async (bomb: Bomb) => {
		// debugger;
		this.updaters.update<Record<string, Bomb>>(
			{ [bomb.id]: bomb },
			`/bombs`
		);
	};

	removeBomb = async (bombId: BombId) => {
		this.updaters.remove(`/bombs/${bombId}`);
	};

	// #endregion

	// #region 	GameState.powerUps

	addPowerUp = async (
		powerUp: PowerUp,
		{ ySquare, xSquare }: SquareCoordinates
	) => {
		this.updaters.update({
			powerUps: {
				[ySquare]: {
					[xSquare]: powerUp,
				},
			},
		});
	};

	removePowerUp = async ({ ySquare, xSquare }: SquareCoordinates) => {
		this.updaters.update({
			powerUps: {
				[ySquare]: {
					[xSquare]: null,
				},
			},
		});
	};

	// #endregion

	// #region 	GameState.gameConfig
	// TODO: editable-game-config
	// #endregion

	// #region 	GameState.[*primitives]

	toggleIs3D = async () => {
		this.updaters.update({
			is3D: !this.state.is3D,
		});
	};

	toggleIsSideView = async () => {
		this.updaters.update({
			isSideView: !this.state.isSideView,
		});
	};

	// TODO: rename to gameSize
	updateSize = async (size: RangeOf<15, 6>) => {
		this.updaters.update({
			size,
		});
	};

	incrementAnimationCounter = async () => {
		this.updaters.update({
			animationCounter: this.state.animationCounter + 1,
		});
	};

	// #endregion

	// #endregion
}

export default OnlineGameUpdater;
