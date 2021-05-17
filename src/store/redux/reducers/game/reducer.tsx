import { PlayerId } from 'containers/Game/types';
import produce from 'immer';
import { Reducer } from 'redux';
import LocalGameUpdater from 'api/LocalGameUpdater';
import GameUtils from 'api/GameUtils';
import {
	SET_GAME_STATE,
	START_GAME,
	END_GAME,
	SET_GAME_MAP,
	TRIGGER_GAME_ANIMATION,
	TOGGLE_GAME_DIMENSION,
	TOGGLE_GAME_PERSPECTIVE,
	TOGGLE_GAME_TWO_PLAYER,
	TOGGLE_GAME_NPC,
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

const gameReducer: Reducer<GameState, GameAction> = (state, action) => {
	if (!state) return {} as GameState;
	return produce(state!, draft => {
		const gameUpdater = new LocalGameUpdater(state!, draft!);
		const gameUtils = new GameUtils(state!, gameUpdater);

		switch (action.type) {
			case SET_GAME_STATE:
				gameUtils.setGameState(action.payload as GameState);
				break;
			case START_GAME:
				gameUtils.startGame();
				break;
			case END_GAME:
				gameUtils.endGame();
				break;
			case SET_GAME_MAP: {
				gameUtils.setGameMap(action.payload as AnimatableGameMap);
				break;
			}
			// GAME ACTIONS
			case TRIGGER_MOVE: {
				gameUtils.triggerMove(action.payload as OnPrepareMoveProps);
				break;
			}
			case MAKE_MOVE: {
				gameUtils.makeMove(action.payload as OnMoveProps);
				break;
			}
			case DROP_BOMB: {
				gameUtils.dropBomb(action.payload as PlayerId);
				break;
			}
			case TRIGGER_EXPLOSION: {
				gameUtils.triggerExplosion(action.payload as BombId, action.cb);
				break;
			}
			case ON_EXPLOSION_COMPLETE: {
				gameUtils.onExplosionComplete(action.payload as BombId);
				break;
			}
			// #region GAME SETTINGS
			case TRIGGER_GAME_ANIMATION:
				gameUtils.triggerGameAnimation();
				break;
			case TOGGLE_GAME_DIMENSION:
				gameUtils.toggleGameDimension();
				break;
			case TOGGLE_GAME_PERSPECTIVE:
				gameUtils.toggleGamePerspective();
				break;
			case TOGGLE_GAME_TWO_PLAYER:
				gameUtils.toggleGameTwoPlayer();
				break;
			case TOGGLE_GAME_NPC:
				gameUtils.toggleGameNpc();
				break;
			// #endregion
			default:
				// No default
				break;
		}
	});
};

export default gameReducer;
