import { Direction } from 'enums';
import { useEffect, useRef, useState } from 'react';
import { getMoveDirectionFromKeyboardCode } from 'utils/game';
import { CharacterProps } from '../types';
import './SpriteCharacter.scss';

const ANIMATION_STOP_THROTTLE_DURATION = 200;
const SpriteCharacter = ({
	id,
	name,
	coordinates: { top, left },
	style,
	keyboardConfig,
	highlight,
	isWalking = false,
	...rest
}: CharacterProps) => {
	/** Direction being faced */
	const [direction, setDirection] = useState<Direction>(Direction.DOWN);
	/** Direction key being held */
	const [currentKeyDirection, setCurrentKeyDirection] = useState('');
	const lastMovementTime = useRef(new Date().getTime());

	const _isWalking = isWalking || !!currentKeyDirection;

	useEffect(() => {
		// ignore the npc action
		const getDirection = (e: KeyboardEvent) => {
			return keyboardConfig
				? getMoveDirectionFromKeyboardCode(e.code, keyboardConfig)
				: null;
		};

		const updateDirection = (newDirection: Direction) => {
			setDirection(newDirection);
		};

		const clearCurrentKey = () => {
			if (currentKeyDirection) setCurrentKeyDirection('');
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			const newDirection = getDirection(e);
			if (!newDirection) {
				clearCurrentKey();
				return;
			}
			lastMovementTime.current = new Date().getTime();
			setCurrentKeyDirection(newDirection);
			updateDirection(newDirection);
		};

		const handleKeyUp = () => {
			// keypress-move: keydown + keyup, i.e. D, D, D (not hold D)
			// Only stop the moving animation after the player goes idle
			// for some duration. This allows us to use keypress to move
			// and still have a move animation (instead of keydown).
			// This is needed because otherwise keypress-move wont trigger
			// animations.
			setTimeout(() => {
				const delayedCurrentTime =
					new Date().getTime() - ANIMATION_STOP_THROTTLE_DURATION;
				if (lastMovementTime.current >= delayedCurrentTime) return;
				clearCurrentKey();
			}, ANIMATION_STOP_THROTTLE_DURATION);
		};

		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, [currentKeyDirection, keyboardConfig]);

	return (
		<div
			id={id}
			className="character"
			data-facing={direction}
			data-walking={_isWalking.toString()}
			data-highlight={highlight}
			style={{ ...style, top, left, position: 'absolute', zIndex: 9999 }}
			{...rest}
		>
			{/* <div className="name">{name}</div> */}
			<div className="shadow pixel-art" />
			<div className="spritesheet-wrapper">
				<div className="spritesheet pixel-art" />
			</div>
		</div>
	);
};

export default SpriteCharacter;
