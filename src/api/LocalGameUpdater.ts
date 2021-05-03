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
	Square,
	SquareCoordinates,
	TopLeftCoordinates,
} from 'containers/Game/types';
import { PowerUp } from 'enums';
// eslint-disable-next-line import/no-unresolved
import { WritableDraft } from 'immer/dist/internal';
import { updateImmerDraft } from 'utils/immer';
import GameUpdater from './GameUpdater';

class LocalGameUpdater extends GameUpdater {
	constructor(
		public state: GameState,
		public draft: WritableDraft<GameState>
	) {
		super();
	}

	// #region GameState

	// #region 	GameState

	updateGameState = async (gameState: Partial<GameState>) => {
		updateImmerDraft(this.draft, gameState);
	};

	// #endregion

	// #region 	GameState.players

	// #region 		GameState.players
	updatePlayers = async (players: Partial<Players>) => {
		this.draft.players = players;
	};
	// #endregion

	// #region 		GameState.players.[*]

	addPlayer = async (playerConfig: PlayerConfig, playerId: PlayerId) => {
		this.draft.players[playerId] = playerConfig;
	};

	updatePlayer = async (
		playerConfig: Partial<PlayerConfig>,
		playerId: PlayerId
	) => {
		updateImmerDraft(this.draft.players[playerId]!, playerConfig);
	};

	removePlayer = async (playerId: PlayerId) => {
		delete this.draft.players[playerId];
	};

	// #endregion

	// #region 			GameState.players.[*].[*PlayerConfig]

	// #region 			GameState.players.[*].[*PlayerConfig].id
	updatePlayerId = async (id: PlayerId, playerId: PlayerId) => {
		this.draft.players[playerId]!.id = id;
	};
	// #endregion

	// #region 			GameState.players.[*].[*PlayerConfig].coordinates
	updatePlayerCoordinates = async (
		coordinates: TopLeftCoordinates,
		playerId: PlayerId
	) => {
		this.draft.players[playerId]!.coordinates = coordinates;
	};
	// #endregion

	// #region 			GameState.players.[*].[*PlayerConfig].state
	updatePlayerState = async (
		playerState: Partial<PlayerState>,
		playerId: PlayerId
	) => {
		updateImmerDraft(this.draft.players[playerId]!.state, playerState);
	};

	incrementPlayerPowerUp = async (powerUp: PowerUp, playerId: PlayerId) => {
		this.draft.players[playerId]!.state.powerUps[powerUp]++;
	};

	incrementPlayerDeathCount = async (playerId: PlayerId) => {
		this.draft.players[playerId]!.state.deathCount++;
	};
	// #endregion

	// #region 			GameState.players.[*].[*PlayerConfig].keyboardConfig
	updatePlayerPlayerKeyboardConfig = async (
		keyboardConfig: Partial<PlayerKeyboardConfig>,
		playerId: PlayerId
	) => {
		updateImmerDraft(
			this.draft.players[playerId]!.keyboardConfig || {},
			keyboardConfig
		);
	};
	// #endregion

	// #endregion

	// #endregion

	// #region 	GameState.gameMap

	updateGameMap = async ({ gameMap, animate = false }: AnimatableGameMap) => {
		this.draft.gameMap = gameMap;
		if (animate) this.incrementAnimationCounter();
	};

	updateGameMapSquare = async (
		{ xSquare, ySquare }: SquareCoordinates,
		square: Square
	) => {
		this.draft.gameMap[ySquare][xSquare] = square;
	};

	// #endregion

	// #region 	GameState.bombs

	addBomb = async (bomb: Bomb) => {
		this.draft.bombs[bomb.id] = bomb;
	};

	removeBomb = async (bombId: BombId) => {
		delete this.draft.bombs[bombId];
	};

	// #endregion

	// #region 	GameState.powerUps

	addPowerUp = async (
		powerUp: PowerUp,
		{ ySquare, xSquare }: SquareCoordinates
	) => {
		if (!this.draft.powerUps[ySquare]) {
			this.draft.powerUps[ySquare] = {};
		}
		this.draft.powerUps[ySquare][xSquare] = powerUp;
	};

	removePowerUp = async ({ ySquare, xSquare }: SquareCoordinates) => {
		this.draft.powerUps[ySquare][xSquare] = null;
	};

	// #endregion

	// #region 	GameState.gameConfig
	// TODO: editable-game-config
	// #endregion

	// #region 	GameState.[*primitives]

	toggleIs3D = async () => {
		this.draft.is3D = !this.state.is3D;
	};

	toggleIsSideView = async () => {
		this.draft.isSideView = !this.state.isSideView;
	};

	incrementAnimationCounter = async () => {
		this.draft.animationCounter++;
	};

	// #endregion

	// #endregion
}

export default LocalGameUpdater;
