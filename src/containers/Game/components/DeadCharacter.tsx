import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookDead } from '@fortawesome/free-solid-svg-icons';
import {
	FontAwesomeIconProps,
	TopLeftCoordinates,
} from 'containers/Game/types';
import theme from 'theme';
import { GameConfigRanges } from 'store/redux/reducers/game/types';
import TileIcon from './TileIcon';

const DeadIcon = (props: FontAwesomeIconProps) => (
	<FontAwesomeIcon icon={faBookDead} {...props} />
);

interface Props {
	size: GameConfigRanges.SquareSize;
	explodingDuration: GameConfigRanges.ExplodingDuration;
	coordinates: TopLeftCoordinates;
}

const DeadCharacter = ({
	size,
	explodingDuration,
	coordinates: { top, left },
}: Props) => {
	return (
		<TileIcon
			$top={top}
			$left={left}
			$size={size}
			$animationDelay={`${explodingDuration}s`}
		>
			<DeadIcon color={theme.palette.color.default} />
		</TileIcon>
	);
};

export default DeadCharacter;
