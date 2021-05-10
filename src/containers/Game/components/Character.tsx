import Cube from 'containers/Game/components/Cube';
import { Player } from 'enums';
import { GameConfigRanges } from 'store/redux/reducers/game/types';
import theme from 'theme';
import { CUBE_BASE_TRANSFORM } from 'utils/game';
import {
	CharacterProps,
	PlayerId,
	PlayerKeyboardConfig,
	TopLeftCoordinates,
} from '../types';
// import CircleCharacter from './CircleCharacter';
import SpriteCharacter from './SpriteCharacter';

interface Props {
	id: PlayerId;
	name: string;
	// skin: Skin;
	size: GameConfigRanges.SquareSize;
	tileSize: GameConfigRanges.SquareSize;
	coordinates: TopLeftCoordinates;
	keyboardConfig?: PlayerKeyboardConfig;
	is3D: boolean;
	highlight?: boolean;
}

const Character = ({
	/* skin */
	id,
	name,
	size,
	tileSize,
	coordinates: { top, left },
	keyboardConfig,
	is3D,
	highlight = false,
	...rest
}: Props) => {
	const padding = (tileSize - size) / 2;

	const _top = padding + top;
	const _left = padding + left;

	const props: CharacterProps = {
		id,
		// name: `${name}${id}`,
		name: id,
		coordinates: {
			top: _top,
			left: _left,
		},
		keyboardConfig,
		highlight,
		size,
		...rest,
	};

	return (
		(is3D && (
			<Cube
				id={id}
				size={size}
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
				{...rest}
			/>
		)) || <SpriteCharacter {...props} />
	);
};

export type { Props };
export default Character;
