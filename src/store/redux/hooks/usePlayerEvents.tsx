import {
	GameApi,
	KeyboardEventCode,
	KeyMap,
	OnDropBomb,
	PlayerId,
	PlayerKeyboardConfig,
	Players,
} from 'containers/Game/types';
import { PowerUp } from 'enums';
import { useEffect, useMemo, useRef } from 'react';
import {
	getMoveDirectionFromKeyMap,
	getPoweredUpValue,
	isPlayerDead,
} from 'utils/game';
import { npcAction } from 'utils/npc';
import useInterval from 'hooks/useInterval';
import { OnTriggerMove } from '../reducers/game/types';

type KeyDownAction = (id: PlayerId, keys: PlayerKeyboardConfig) => void;

type KeyAction = (keyEventCode: KeyboardEventCode) => void;

const usePlayerRefs = () => {
	const playerRefs = useRef<{ [key in PlayerId]?: HTMLElement | null }>({
		P1: document.getElementById('P1'),
		P2: document.getElementById('P2'),
		P3: document.getElementById('P3'),
		P4: document.getElementById('P4'),
	});

	return playerRefs;
};

const useEvents = ({
	triggerMove,
	players,
	timeOutRef,
	keyMap,
}: {
	triggerMove: OnTriggerMove;
	players: Players;
	keyMap: React.MutableRefObject<KeyMap>;
	timeOutRef: React.MutableRefObject<Record<PlayerId, number>>;
}) => {
	const playerRefs = usePlayerRefs();

	const move: KeyDownAction = (id, playerKeyboardConfig) => {
		const directions = getMoveDirectionFromKeyMap(
			keyMap,
			playerKeyboardConfig
		);
		if (!directions.length) return;

		directions.forEach(direction => {
			triggerMove({ playerId: id, direction });
		});
	};

	const handleActions = (playerId: PlayerId) => {
		if (!keyMap.current) return;
		if (!timeOutRef.current) return;

		const { keyboardConfig, state } = players[playerId]!;
		if (!keyboardConfig) return;

		// we only want to take this action for non-NPC players
		const movementSpeed = getPoweredUpValue(state, PowerUp.MovementSpeed);

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

const usePlayerActionSpeed = (players: Players, playerId: PlayerId) => {
	const npcMovementSpeed = useMemo(() => {
		const npcState = players[playerId]?.state;
		// if there is no NPC, lets not call this often
		if (!npcState) return Number.MAX_SAFE_INTEGER;
		return getPoweredUpValue(npcState, PowerUp.MovementSpeed);
	}, [playerId, players]);

	return npcMovementSpeed;
};

const canPlayerTakeAction = (players: Players, playerId: PlayerId) => {
	const player = players[playerId];
	// player doesn't exist
	if (!player) return false;
	// player is dead
	if (isPlayerDead(player.state)) return false;

	return true;
};

const usePlayerInterval = (
	players: Players,
	playerId: PlayerId,
	cb: (playerId: PlayerId) => void
) => {
	const player1ActionSpeed = usePlayerActionSpeed(players, playerId);

	useInterval(() => {
		if (!canPlayerTakeAction(players, playerId)) return;
		cb(playerId);
	}, player1ActionSpeed);
};

const handleBombForPlayers = (players: Players, dropBomb: OnDropBomb) => (
	keyEventCode: KeyboardEventCode
) => {
	(Object.keys(players) as Array<PlayerId>).forEach(playerId => {
		if (canPlayerTakeAction(players, playerId)) {
			const { DropBomb } = players[playerId]!.keyboardConfig;
			if (keyEventCode === DropBomb) {
				dropBomb(playerId);
			}
		}
	});
};

const usePlayerEvents = ({ state, provider }: GameApi) => {
	const { dropBomb, triggerMove } = provider;
	const { gameMap, players } = state;

	const keyMap = useKeyboardEvent({
		onKeyDown: handleBombForPlayers(players, dropBomb),
	});
	const timeOutRef = useTimeOutRef();
	const { handleActions } = useEvents({
		triggerMove,
		players,
		timeOutRef,
		keyMap,
	});

	// TODO: In the next update, start these intervals
	// when the keys are pressed and not continuously
	usePlayerInterval(players, 'P1', handleActions);
	usePlayerInterval(players, 'P2', handleActions);
	usePlayerInterval(players, 'P3', handleActions);
	usePlayerInterval(players, 'P4', () => {
		npcAction({ dropBomb, gameMap, players, triggerMove });
	});
};

export default usePlayerEvents;
