import {
	CharacterKeyboardConfig,
	KeyboardEventCode,
	KeyMap,
	PlayerId,
	TopLeftCoordinates,
} from 'containers/Game/types';
import config from 'config';
import { useRef, useEffect } from 'react';
import { getMoveDirectionFromKeyMap, npcAction } from 'utils/game';
import { useSelector } from 'react-redux';
import useInterval from '../../../hooks/useInterval';
import useGameProvider from './useGameProvider';
import {
	makeSelectGameMap,
	makeSelectGameIs3D,
	makeSelectGamePlayers,
} from '../reducers/game/selectors';

type ActionBaseProps = [
	coordinates: TopLeftCoordinates,
	keys: CharacterKeyboardConfig
];

type MoveAction = (keys: CharacterKeyboardConfig, id: PlayerId) => void;

type BombAction = (...args: ActionBaseProps) => void;

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
		if (!players.P3) return;
		npcAction(players, gameMap);
	}, config.duration.movement);

	useEffect(() => {
		const move: MoveAction = (characterKeyboardConfig, id) => {
			// reset rotation to 0 so the animations are consistent
			// if (is3D) resetRotation(ref);
			const direction = getMoveDirectionFromKeyMap(
				keyMap,
				characterKeyboardConfig
			);
			if (!direction) return;

			triggerMove({ playerId: id, direction });
		};

		const bomb: BombAction = ({ top, left }, { DropBomb }) => {
			if (keyMap.current[DropBomb]) {
				dropBomb({
					top,
					left,
				});
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
				const { coordinates } = players[id]!;
				const { [id]: keys } = config.keyboardConfig.player;
				const { ref } = players[id]!;

				if (ref) {
					const newTime = new Date().getTime();
					if (
						newTime - timeOutRef.current[id]! >
						config.duration.movement
					) {
						timeOutRef.current[id] = newTime;
						move(keys, id);
					}
				}
				bomb(coordinates, keys);
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
