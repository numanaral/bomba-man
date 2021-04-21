import { Direction } from 'enums';
import { forwardRef, useEffect, useState } from 'react';
import { getMoveDirectionFromKeyboardCode } from 'utils/game';
import { PlayerRef, CharacterProps } from '../types';
import './SpriteCharacter.scss';

const SpriteCharacter = forwardRef<PlayerRef, CharacterProps>(
	(
		{
			id,
			name,
			coordinates: { top, left },
			style,
			keyboardConfig,
			...rest
		},
		ref
	) => {
		/** Direction being faced */
		const [direction, setDirection] = useState<Direction>(Direction.DOWN);
		/** Direction key being held */
		const [currentKeyDirection, setCurrentKeyDirection] = useState('');

		const isWalking = !!currentKeyDirection;

		useEffect(() => {
			const getDirection = (e: KeyboardEvent) => {
				return getMoveDirectionFromKeyboardCode(e.code, keyboardConfig);
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
				updateDirection(newDirection);
				setCurrentKeyDirection(newDirection);
			};

			const handleKeyUp = () => {
				clearCurrentKey();
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
				className="character"
				data-facing={direction}
				data-walking={isWalking.toString()}
				ref={ref}
				style={{ ...style, top, left }}
				{...rest}
			>
				{/* <div className="name">{name}</div> */}
				<div className="shadow pixel-art" />
				<div className="spritesheet-wrapper">
					<div className="spritesheet pixel-art" />
				</div>
			</div>
		);
	}
);

export default SpriteCharacter;
