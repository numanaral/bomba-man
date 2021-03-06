import Cube from 'containers/Game/components/Cube';
import { Direction, Player } from 'enums';
import { GameProvider } from 'store/redux/hooks/useGameProvider';
import { GameConfigRanges } from 'store/redux/reducers/game/types';
import theme from 'theme';
import { getCubeBaseTransform } from 'utils/game';
import { KeyboardConfig, PlayerId, TopLeftCoordinates } from '../types';
// import CircleCharacter from './CircleCharacter';
import SpriteCharacter from './SpriteCharacter';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
	id: PlayerId;
	currentOnlinePlayerId?: PlayerId;
	name: string;
	size: GameConfigRanges.SquareSize;
	tileSize: GameConfigRanges.SquareSize;
	coordinates: TopLeftCoordinates;
	keyboardConfig?: KeyboardConfig;
	is3D: boolean;
	highlight?: boolean;
	// mainly for sprite
	// skin: Skin;
	onPlayerIsWalking?: GameProvider['updatePlayerIsWalking'];
	isWalking?: boolean;
	direction?: Direction;
	isNPC?: boolean;
}

const Character = ({
	/* skin */
	id,
	currentOnlinePlayerId,
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
					transform: getCubeBaseTransform(tileSize),
					// top,
					// left,
				}}
				variant={Player[id]}
				{...rest}
			/>
		)) || (
			<SpriteCharacter
				id={id}
				currentOnlinePlayerId={currentOnlinePlayerId}
				// name={`${name}${id}`}
				name={id}
				coordinates={{
					top: _top,
					left: _left,
				}}
				keyboardConfig={keyboardConfig}
				highlight={highlight}
				size={size}
				{...rest}
			/>
		)
	);
};

export type { Props as CharacterProps };
export default Character;
