import config from 'config';
import {
	KeyboardEventCode,
	KeyMap,
	PlayerId,
	PlayerKeyboardConfig,
} from 'containers/Game/types';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getMoveDirectionFromKeyMap } from 'utils/game';
import { npcAction } from 'utils/npc';
import useInterval from '../../../hooks/useInterval';
import {
	makeSelectGameIs3D,
	makeSelectGameMap,
	makeSelectGamePlayers,
} from '../reducers/game/selectors';
import useGameProvider from './useGameProvider';

type KeyDownAction = (id: PlayerId, keys: PlayerKeyboardConfig) => void;

const usePlayerEvents = () => {
	const { dropBomb, triggerMove } = useGameProvider();
	const gameMap = useSelector(makeSelectGameMap());
	const is3D = useSelector(makeSelectGameIs3D());
	const players = useSelector(makeSelectGamePlayers());

	const timeOutRef = useRef<{ [key in PlayerId]?: number }>({
		P1: new Date().getTime(),
		P2: new Date().getTime(),
		P3: new Date().getTime(),
		P4: new Date().getTime(),
	});
	const keyMap = useRef<KeyMap>({});

	useInterval(() => {
		if (!players.P4) return;
		npcAction({ players, gameMap, triggerMove, dropBomb });
	}, config.duration.movement);

	useEffect(() => {
		const move: KeyDownAction = (id, playerKeyboardConfig) => {
			// reset rotation to 0 so the animations are consistent
			// if (is3D) resetRotation(ref);
			const directions = getMoveDirectionFromKeyMap(
				keyMap,
				playerKeyboardConfig
			);
			if (!directions.length) return;

			directions.forEach(direction => {
				triggerMove({ playerId: id, direction });
			});
		};

		const bomb: KeyDownAction = (id, { DropBomb }) => {
			if (keyMap.current[DropBomb]) {
				dropBomb(id);
			}
		};

		const registerKeys = (e: KeyboardEvent, isKeyDown: boolean) => {
			/** @see https://stackoverflow.com/questions/5203407/how-to-detect-if-multiple-keys-are-pressed-at-once-using-javascript#answer-12444641 */
			keyMap.current[e.code as KeyboardEventCode] = isKeyDown;
		};

		const handleActions = () => {
			if (!keyMap.current) return;

			// TODO: Do not account for NPCs here
			// Instead of Array<PlayerId> it will be Array<PlayerConfig> ??
			// This will include player type, player options etc.
			(Object.keys(players) as Array<PlayerId>).forEach(id => {
				const { [id]: keys } = config.keyboardConfig.player;
				// we only want to take this action for non-NPC players
				if (keys) {
					const { ref } = players[id]!;

					if (ref) {
						const newTime = new Date().getTime();
						if (
							newTime - timeOutRef.current[id]! >
							config.duration.movement
						) {
							timeOutRef.current[id] = newTime;
							move(id, keys);
						}
					}
					bomb(id, keys);
				}
			});
		};

		const handleKeyEvent = (e: KeyboardEvent) => {
			if (!keyMap.current) return;
			if (!timeOutRef.current) return;

			const isKeyDown = e.type === 'keydown';
			registerKeys(e, isKeyDown);

			if (!isKeyDown) return;
			handleActions();
		};

		window.addEventListener('keyup', handleKeyEvent);
		window.addEventListener('keydown', handleKeyEvent);

		return () => {
			window.removeEventListener('keyup', handleKeyEvent);
			window.removeEventListener('keydown', handleKeyEvent);
		};
	}, [dropBomb, gameMap, is3D, players, triggerMove]);

	return {};
};

export default usePlayerEvents;
