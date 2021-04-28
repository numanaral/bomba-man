import config from 'config';
import {
	GameApi,
	KeyboardEventCode,
	KeyMap,
	PlayerId,
	PlayerKeyboardConfig,
} from 'containers/Game/types';
import { PowerUp } from 'enums';
import { useEffect, useMemo, useRef } from 'react';
import { getMoveDirectionFromKeyMap, getPoweredUpValue } from 'utils/game';
import { npcAction } from 'utils/npc';
import useInterval from 'hooks/useInterval';

type KeyDownAction = (id: PlayerId, keys: PlayerKeyboardConfig) => void;

const usePlayerEvents = ({ state, provider }: GameApi) => {
	const { dropBomb, triggerMove } = provider;
	const { gameMap, is3D, players } = state;

	const timeOutRef = useRef<{ [key in PlayerId]?: number }>({
		P1: new Date().getTime(),
		P2: new Date().getTime(),
		P3: new Date().getTime(),
		P4: new Date().getTime(),
	});
	const keyMap = useRef<KeyMap>({});

	const npcMovementSpeed = useMemo(() => {
		const npcState = players.P4?.state;
		// if there is no NPC, lets not call this often
		if (!npcState) return Number.MAX_SAFE_INTEGER;
		return getPoweredUpValue(npcState, PowerUp.MovementSpeed);
	}, [players.P4]);

	useInterval(() => {
		// TODO: Make this dynamic as well
		if (!players.P4) return;
		npcAction({ players, gameMap, triggerMove, dropBomb });
	}, npcMovementSpeed);

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
				const playerState = players[id]!.state;
				const movementSpeed = getPoweredUpValue(
					playerState,
					PowerUp.MovementSpeed
				);

				if (keys) {
					const ref = document.getElementById(id);

					if (ref) {
						const newTime = new Date().getTime();
						if (newTime - timeOutRef.current[id]! > movementSpeed) {
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
