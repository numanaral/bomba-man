import config from 'config';
import Cube from 'containers/Game/components/Cube';
import { Player } from 'enums';
import { forwardRef } from 'react';
import theme from 'theme';
import { CUBE_BASE_TRANSFORM } from 'utils/game';
import {
	CharacterProps,
	PlayerId,
	PlayerRef,
	TopLeftCoordinates,
} from '../types';
import CircleCharacter from './CircleCharacter';

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

		const props: CharacterProps & { ref: React.ForwardedRef<PlayerRef> } = {
			id,
			name: `${name} ${id}`,
			coordinates: {
				top: _top,
				left: _left,
			},
			ref,
			...rest,
		};

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
			)) || <CircleCharacter {...props} />
		);
	}
);

export type { Props };
export default Character;
