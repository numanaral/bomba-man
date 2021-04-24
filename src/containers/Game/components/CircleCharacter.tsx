import config from 'config';
import { forwardRef } from 'react';
import styled from 'styled-components';
import theme from 'theme';
import { CharacterProps, PlayerRef } from '../types';

const StyledTempCharacterName = styled.span`
	color: ${theme.palette.color.warning};
`;

const StyledTempCharacterFace = styled.div`
	color: #000;
`;
const StyledTempCharacterEyes = styled.span``;
const StyledTempCharacterMouth = styled.span``;

const StyledTempCharacter = styled.div<{ $name: string }>`
	width: ${theme.game.character.size};
	height: ${theme.game.character.size};
	background-color: ${theme.palette.color.success};
	position: absolute;
	/* top: 0;
	left: 0; */
	border-radius: 50%;
	display: flex;
	justify-content: center;

	/* TODO: This character type won't be used but update this if it changes */
	transition: top ${config.duration.movement}ms,
		left ${config.duration.movement}ms;

	& > ${StyledTempCharacterName} {
		z-index: 9999;
		position: absolute;
		top: calc((${theme.game.character.size} + 2px) * -1);
		font-size: calc(${theme.game.character.size} / 3);
	}

	& > ${StyledTempCharacterFace} {
		position: absolute;
		top: calc(${theme.game.character.size} / 8);
		font-size: calc(${theme.game.character.size} / 4);

		/* & > ${StyledTempCharacterEyes} {
		}
		& > ${StyledTempCharacterMouth} {
		} */
	}
`;

const CircleCharacter = forwardRef<PlayerRef, CharacterProps>(
	(
		{ id, name, coordinates: { top, left }, keyboardConfig: _, ...rest },
		ref
	) => {
		return (
			<StyledTempCharacter
				$name={`${name} ${id}`}
				style={{
					top,
					left,
				}}
				ref={ref}
				{...rest}
			>
				<StyledTempCharacterName>{name}</StyledTempCharacterName>
				<StyledTempCharacterFace>
					<StyledTempCharacterEyes>o-o</StyledTempCharacterEyes>
					<br />
					<StyledTempCharacterMouth>===</StyledTempCharacterMouth>
				</StyledTempCharacterFace>
			</StyledTempCharacter>
		);
	}
);

export default CircleCharacter;
