import {
	GameApi,
	KeyboardConfig,
	KeyboardEventCode,
	KeyMap,
	NonNullablePlayerRef,
	OnDropBomb,
	PlayerId,
	Players,
} from 'containers/Game/types';
import { GameType, PowerUp } from 'enums';
import { useEffect, useMemo, useRef } from 'react';
import {
	getMoveDirectionFromKeyMap,
	getPoweredUpValue,
	isPlayerDead,
	mapAllPossibleKeyboardKeysForAction,
} from 'utils/game';
import { npcAction } from 'utils/npc';
import useInterval from 'hooks/useInterval';
import usePrevious from 'hooks/usePrevious';
import { CODE_SPACE } from 'keycode-js';
import { GameConfig, OnTriggerMove } from '../reducers/game/types';

type HandleActionsFn = (playerId: PlayerId) => void;
type KeyDownAction = (playerId: PlayerId, keys: KeyboardConfig) => void;

type KeyAction = (keyEventCode: KeyboardEventCode) => void;

const usePlayerRefs = () => {
	const playerRefs = useRef<{ [key in PlayerId]?: HTMLElement | null }>({
		P1: document.getElementById('P1'),
		P2: document.getElementById('P2'),
		P3: document.getElementById('P3'),
		P4: document.getElementById('P4'),
	});

	const recalculate = () => {
		Object.keys(playerRefs.current).forEach(playerId => {
			playerRefs.current[playerId as PlayerId] = document.getElementById(
				playerId
			);
		});
	};

	return { playerRefs, recalculate };
};

const useEvents = ({
	triggerMove,
	players,
	timeOutRef,
	keyMap,
	is3D,
	powerUpConfig,
}: {
	triggerMove: OnTriggerMove;
	players: Players;
	keyMap: React.MutableRefObject<KeyMap>;
	timeOutRef: React.MutableRefObject<Record<PlayerId, number>>;
	is3D: boolean;
	powerUpConfig: GameConfig['powerUps'];
}) => {
	const { playerRefs, recalculate } = usePlayerRefs();
	const previousIs3D = usePrevious(is3D);

	useEffect(() => {
		if (previousIs3D === is3D) return;
		recalculate();
	}, [is3D, previousIs3D, recalculate]);

	const move: KeyDownAction = (playerId, playerKeyboardConfig) => {
		const directions = getMoveDirectionFromKeyMap(
			keyMap,
			playerKeyboardConfig
		);
		if (!directions.length) return;

		directions.forEach(direction => {
			triggerMove({
				playerId,
				direction,
				ref: playerRefs.current[playerId] as NonNullablePlayerRef,
			});
		});
	};

	const handleActions = (playerId: PlayerId) => {
		if (!keyMap.current) return;
		if (!timeOutRef.current) return;
		// don't do anything if no key is being pressed
		if (!Object.values(keyMap.current).filter(Boolean).length) return;

		const { keyboardConfig, state: playerState } = players[playerId]!;
		if (!keyboardConfig || !Object.keys(keyboardConfig).length) return;

		// we only want to take this action for non-NPC players
		const movementSpeed = getPoweredUpValue(
			playerState,
			PowerUp.MovementSpeed,
			powerUpConfig
		);

		const ref = playerRefs.current[playerId];
		if (!ref) {
			playerRefs.current[playerId] = document.getElementById(playerId);
		}

		if (ref) {
			const newTime = new Date().getTime();
			if (newTime - timeOutRef.current[playerId]! > movementSpeed) {
				timeOutRef.current[playerId] = newTime;
				move(playerId, keyboardConfig);
			}
		}
	};

	return { move, handleActions };
};

const useKeyboardEvent = ({
	onKeyDown,
	onKeyUp,
}: {
	onKeyDown?: KeyAction;
	onKeyUp?: KeyAction;
} = {}) => {
	const keyMap = useRef<KeyMap>({});

	useEffect(() => {
		const registerKeys = (e: KeyboardEvent, isKeyDown: boolean) => {
			/** @see https://stackoverflow.com/questions/5203407/how-to-detect-if-multiple-keys-are-pressed-at-once-using-javascript#answer-12444641 */
			keyMap.current[e.code as KeyboardEventCode] = isKeyDown;
		};

		const handleKeyEvent = (e: KeyboardEvent) => {
			if (!keyMap.current) return;

			const isKeyDown = e.type === 'keydown';
			if (e.code === CODE_SPACE) e.preventDefault();
			registerKeys(e, isKeyDown);
			if (isKeyDown) onKeyDown?.(e.code as KeyboardEventCode);
			else onKeyUp?.(e.code as KeyboardEventCode);
		};

		window.addEventListener('keyup', handleKeyEvent);
		window.addEventListener('keydown', handleKeyEvent);

		return () => {
			window.removeEventListener('keyup', handleKeyEvent);
			window.removeEventListener('keydown', handleKeyEvent);
		};
	}, [onKeyDown, onKeyUp]);

	return keyMap;
};

const useTimeOutRef = () => {
	const timeOutRef = useRef<Record<PlayerId, number>>({
		P1: new Date().getTime(),
		P2: new Date().getTime(),
		P3: new Date().getTime(),
		P4: new Date().getTime(),
	});

	return timeOutRef;
};

const usePlayerActionSpeed = (
	players: Players,
	playerId: PlayerId,
	powerUpConfig: GameConfig['powerUps']
) => {
	const movementSpeed = useMemo(() => {
		const playerState = players[playerId]?.state;
		// if there is no NPC, lets not call this often
		if (!playerState) return null;
		return getPoweredUpValue(
			playerState,
			PowerUp.MovementSpeed,
			powerUpConfig
		);
	}, [playerId, players, powerUpConfig]);

	return movementSpeed;
};

const canPlayerTakeAction = (
	players: Players,
	playerId: PlayerId,
	powerUpConfig: GameConfig['powerUps']
) => {
	const player = players[playerId];
	// player doesn't exist
	if (!player) return false;
	// player is dead
	if (isPlayerDead(player.state, powerUpConfig)) return false;

	return true;
};

const usePlayerInterval = (
	players: Players,
	playerId: PlayerId,
	powerUpConfig: GameConfig['powerUps'],
	cb: HandleActionsFn
) => {
	const playerActionSpeedOrNull = usePlayerActionSpeed(
		players,
		playerId,
		powerUpConfig
	);

	useInterval(
		() => {
			if (!canPlayerTakeAction(players, playerId, powerUpConfig)) return;
			cb(playerId);
		},
		playerActionSpeedOrNull || Number.MAX_SAFE_INTEGER,
		!playerActionSpeedOrNull
	);
};

const handleBombForPlayers = (
	players: Players,
	dropBomb: OnDropBomb,
	powerUpConfig: GameConfig['powerUps']
) => (keyEventCode: KeyboardEventCode) => {
	(Object.keys(players) as Array<PlayerId>).forEach(playerId => {
		if (canPlayerTakeAction(players, playerId, powerUpConfig)) {
			const { keyboardConfig } = players[playerId]!;
			if (keyboardConfig) {
				// let isKeyPressed = false;
				const bombKeys = mapAllPossibleKeyboardKeysForAction(
					keyboardConfig,
					'DropBomb'
				);
				if (bombKeys.includes(keyEventCode)) {
					dropBomb(playerId);
				}
			}
		}
	});
};

const IntervalWrapper = ({
	playerId,
	players,
	powerUpConfig,
	cb,
}: {
	playerId: PlayerId;
	players: Players;
	powerUpConfig: GameConfig['powerUps'];
	cb: HandleActionsFn;
}) => {
	usePlayerInterval(players, playerId, powerUpConfig, cb);
	return null;
};

const usePlayerEvents = ({
	state,
	provider,
	type: gameType,
	playerId,
}: GameApi) => {
	const { dropBomb, triggerMove } = provider;
	const {
		gameMap,
		bombs,
		players,
		is3D,
		config: {
			powerUps: powerUpConfig,
			sizes,
			duration: { bomb: bombDuration },
		},
	} = state;

	const { playerRefs } = usePlayerRefs();

	const _players = useMemo<Players>(() => {
		return gameType === GameType.Local
			? players
			: { [playerId!]: players[playerId!] };
		// none of the deps will affect this
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [players]);
	// }, [gameType, playerId, players]);

	const keyMap = useKeyboardEvent({
		onKeyDown: handleBombForPlayers(_players, dropBomb, powerUpConfig),
	});
	const timeOutRef = useTimeOutRef();
	const { handleActions } = useEvents({
		triggerMove,
		players: _players,
		timeOutRef,
		keyMap,
		is3D,
		powerUpConfig,
	});

	const handleNpcActions = (pId: PlayerId) => {
		npcAction({
			playerId: pId,
			dropBomb,
			gameMap,
			bombs,
			players: _players,
			triggerMove,
			ref: playerRefs.current[pId] as NonNullablePlayerRef,
			powerUpConfig,
			sizes,
			bombDuration,
		});
	};

	// URGENT: Since this triggers a move event, if the
	// player is on the same explosion fire, he dies
	// multiple times
	// TODO: In the next update, start these intervals
	// when the keys are pressed and not continuously
	return Object.keys(_players).map(pId => {
		// TODO: online game can also have NPCs, have a check for that
		const isNpc = gameType === GameType.Local && ['P3', 'P4'].includes(pId);
		return (
			<IntervalWrapper
				key={pId}
				playerId={pId as PlayerId}
				players={_players}
				powerUpConfig={powerUpConfig}
				cb={isNpc ? handleNpcActions : handleActions}
			/>
		);
	});
};

export default usePlayerEvents;
