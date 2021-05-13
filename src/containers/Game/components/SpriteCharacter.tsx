import { Direction } from 'enums';
import { useEffect, useRef, useState } from 'react';
import { getMoveDirectionFromKeyboardCode } from 'utils/game';
import styled, { css } from 'styled-components';
import theme from 'theme';
import { CharacterProps } from './Character';
import './SpriteCharacter.scss';
import spriteShadow from './character-shadow.png';
import spriteImage from './character-skin-default.png';

const SPRITE_SQUARE_SIZE = 32;
const Wrapper = styled.div<{ $size: number }>`
	${({ $size }) => {
		// CALCULATED
		const pixelMultiplier = $size / SPRITE_SQUARE_SIZE;
		const spriteSize = pixelMultiplier * SPRITE_SQUARE_SIZE;
		const spriteSheetSize = spriteSize * 4;
		const spriteSheetSquareSize = pixelMultiplier * -1 * SPRITE_SQUARE_SIZE;
		const translateDiff = ($size / 4) * -1;
		const topDiff = Math.min(-15, translateDiff * 2.5);
		const labelFontSize = Math.ceil(spriteSize / 6);
		const labelMaxWidth = Math.ceil(spriteSize * 0.8);

		const spriteSizing = `
			width: ${spriteSize}px;
			height: ${spriteSize}px;
		`;
		const spriteSheetSizing = `
			width: ${spriteSheetSize}px;
			height: ${spriteSheetSize}px;
		`;

		return css`
			position: absolute;
			z-index: 9999;
			${spriteSizing};
			transition-duration: 450ms;

			&#P1 .name {
				background-color: ${theme.palette.color.warning};
			}
			&#P2 .name {
				background-color: ${theme.palette.color.info};
			}
			&#P3 .name {
				background-color: ${theme.palette.color.success};
			}
			&#P4 .name {
				background-color: ${theme.palette.color.error};
			}

			.character {
				top: ${topDiff}px;
				transform: translate(${translateDiff}px);

				${spriteSizing};
				overflow: hidden;
				position: relative;
				/* MOVEMENT TRANSITION */
				transition-duration: 400ms;

				& .name {
					position: absolute;
					left: 15px;
					right: 15px;
					font-size: ${labelFontSize}px;
					font-weight: bold;
					border: 1px dashed white;
					border-radius: 9999px;
					opacity: 1;
					max-width: ${labelMaxWidth}px;
					margin: auto;
					text-align: center;
				}

				& .shadow {
					${spriteSizing};
					opacity: 0.75;
				}

				& .spritesheet {
					${spriteSheetSizing};
					position: absolute;
					top: 0;
					left: 0;
				}

				/* DIRECTION */
				&[data-facing='Right'] .spritesheet {
					top: ${spriteSheetSquareSize * 1}px;
				}
				&[data-facing='Up'] .spritesheet {
					top: ${spriteSheetSquareSize * 2}px;
				}
				&[data-facing='Left'] .spritesheet {
					top: ${spriteSheetSquareSize * 3}px;
				}

				&[data-walking='true'] {
					/* MOVEMENT ANIMATION */
					.spritesheet {
						animation: walkAnimation 0.6s steps(4) infinite;
					}

					/* SHADOW ANIMATION */
					.shadow {
						animation: shadowAnimation 0.3s infinite;
					}
				}

				/* HIGHLIGHT/DAMAGE ANIMATION */
				&[data-highlight='true'] .spritesheet {
					animation: opacityAnimation 0.6s steps(4) infinite;
				}
			}
		`;
	}}
`;

const ANIMATION_STOP_THROTTLE_DURATION = 200;

interface Props extends Omit<CharacterProps, 'tileSize' | 'is3D' | 'size'> {
	// size can be any number by default, unless it's a game character
	size: number;
}

type UseSpriteCharacterAction = Omit<Props, 'coordinates' | 'name' | 'size'> & {
	shouldBindEvent: boolean;
	// setters
	setDirection: React.Dispatch<React.SetStateAction<Direction>>;
	setIsWalking: React.Dispatch<React.SetStateAction<boolean>>;
};

const useSpriteCharacterAction = ({
	id,
	shouldBindEvent,
	keyboardConfig,
	// state setter
	onPlayerIsWalking,
	// setters
	setDirection,
	setIsWalking,
}: UseSpriteCharacterAction) => {
	const lastMovementTime = useRef(new Date().getTime());

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

		const handleKeyDown = (e: KeyboardEvent) => {
			if (!shouldBindEvent) return;

			const newDirection = getDirection(e);
			if (!newDirection) {
				onPlayerIsWalking?.(false, id);
				setIsWalking(false);
				return;
			}
			lastMovementTime.current = new Date().getTime();
			setIsWalking(true);
			updateDirection(newDirection);
		};

		const handleKeyUp = () => {
			if (!shouldBindEvent) return;
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
				setIsWalking(false);
				onPlayerIsWalking?.(false, id);
			}, ANIMATION_STOP_THROTTLE_DURATION);
		};

		//
		if (shouldBindEvent) {
			document.addEventListener('keydown', handleKeyDown);
			document.addEventListener('keyup', handleKeyUp);
		}
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, [
		id,
		keyboardConfig,
		onPlayerIsWalking,
		setDirection,
		setIsWalking,
		shouldBindEvent,
	]);
};

const SpriteCharacter = ({
	id,
	currentOnlinePlayerId,
	name,
	coordinates: { top, left },
	style,
	keyboardConfig,
	highlight,
	size,
	onPlayerIsWalking,
	isWalking: defaultIsWalking = false,
	direction: defaultDirection = Direction.DOWN,
	isNPC = false,
	...rest
}: Props) => {
	/** Direction being faced */
	const [eventDirection, setEventDirection] = useState<Direction>(
		defaultDirection
	);
	const [eventIsWalking, setEventIsWalking] = useState<boolean>(
		defaultIsWalking
	);

	// We only want to bind the event if it's:
	// - not online game
	// - online game and it's the current player
	const shouldBindEvent =
		!isNPC && (!currentOnlinePlayerId || id === currentOnlinePlayerId);

	useSpriteCharacterAction({
		id,
		currentOnlinePlayerId,
		keyboardConfig,
		shouldBindEvent,
		// state setter
		onPlayerIsWalking,
		// setters
		setDirection: setEventDirection,
		setIsWalking: setEventIsWalking,
	});

	console.log({
		id,
		direction: eventDirection,
		isWalking: eventIsWalking,
		defaultDirection,
		defaultIsWalking,
	});

	let isWalking = defaultIsWalking;
	let direction = defaultDirection;

	if (shouldBindEvent) {
		isWalking = eventIsWalking;
		direction = eventDirection;
	}

	return (
		<Wrapper
			id={id}
			style={{
				...style,
				top,
				left,
			}}
			className="character-wrapper"
			{...rest}
			$size={size * 2}
		>
			<div
				className="character"
				data-facing={direction}
				data-walking={isWalking.toString()}
				data-highlight={highlight}
			>
				<div className="name">{name}</div>
				<img
					className="shadow pixel-art"
					src={spriteShadow}
					alt="sprite skin"
				/>
				<img
					className="spritesheet pixel-art"
					src={spriteImage}
					alt="sprite skin"
				/>
			</div>
		</Wrapper>
	);
};

export type { Props as SpriteCharacterProps };
export default SpriteCharacter;
