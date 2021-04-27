import config from 'config';
import Cube from 'containers/Game/components/Cube';
import { Player } from 'enums';
import { forwardRef } from 'react';
import theme from 'theme';
import { CUBE_BASE_TRANSFORM } from 'utils/game';
import {
	CharacterProps,
	PlayerId,
	PlayerKeyboardConfig,
	PlayerRef,
	TopLeftCoordinates,
} from '../types';
// import CircleCharacter from './CircleCharacter';
import SpriteCharacter from './SpriteCharacter';

interface Props {
	id: PlayerId;
	name: string;
	// skin: Skin;
	coordinates: TopLeftCoordinates;
	keyboardConfig: PlayerKeyboardConfig;
	is3D: boolean;
	highlight?: boolean;
}

const Character = forwardRef<PlayerRef, Props>(
	(
		{
			/* skin */
			id,
			name,
			coordinates: { top, left },
			keyboardConfig,
			is3D,
			highlight = false,
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
			keyboardConfig,
			ref,
			highlight,
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
			)) || <SpriteCharacter {...props} />
		);
	}
);

export type { Props };
export default Character;
