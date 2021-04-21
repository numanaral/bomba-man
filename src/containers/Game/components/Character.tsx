import config from 'config';
import Cube from 'containers/Game/components/Cube';
import { Player } from 'enums';
import { forwardRef } from 'react';
import styled from 'styled-components';
import theme from 'theme';
import { CUBE_BASE_TRANSFORM } from 'utils/game';
import { PlayerId, PlayerRef, TopLeftCoordinates } from '../types';

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

interface Props {
	id: PlayerId;
	name: string;
	// skin: Skin;
	coordinates: TopLeftCoordinates;
	is3D: boolean;
}

const Character = forwardRef<PlayerRef, Props>(
	(
		{
			/* skin */
			id,
			name,
			coordinates: { top, left },
			is3D,
			...rest
		},
		ref
	) => {
		const { tile, character } = config.size;
		const padding = (tile - character) / 2;

		const _top = padding + top;
		const _left = padding + left;

		return (
			(is3D && (
				<Cube
					size={config.size.character}
					top={_top}
					left={_left}
					animate
					color={theme.palette.color.success}
					style={{
						transform: CUBE_BASE_TRANSFORM,
						// top,
						// left,
					}}
					variant={Player[id]}
					ref={ref}
					{...rest}
				/>
			)) || (
				<StyledTempCharacter
					$name={`${name} ${id}`}
					style={{
						top: _top,
						left: _left,
					}}
					ref={ref}
					{...rest}
				>
					<StyledTempCharacterName>{`${name} ${id}`}</StyledTempCharacterName>
					<StyledTempCharacterFace>
						<StyledTempCharacterEyes>o-o</StyledTempCharacterEyes>
						<br />
						<StyledTempCharacterMouth>===</StyledTempCharacterMouth>
					</StyledTempCharacterFace>
				</StyledTempCharacter>
			)
		);
	}
);

export type { Props };
export default Character;
