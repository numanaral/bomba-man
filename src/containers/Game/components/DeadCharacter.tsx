import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookDead } from '@fortawesome/free-solid-svg-icons';
import {
	FontAwesomeIconProps,
	TopLeftCoordinates,
} from 'containers/Game/types';
import theme from 'theme';
import config from 'config';
import TileIcon from './TileIcon';

const DeadIcon = (props: FontAwesomeIconProps) => (
	<FontAwesomeIcon icon={faBookDead} {...props} />
);

interface Props {
	coordinates: TopLeftCoordinates;
}

const DeadCharacter = ({ coordinates: { top, left } }: Props) => {
	return (
		<TileIcon
			$top={top}
			$left={left}
			$size={config.size.character}
			$animationDelay={`${config.duration.bomb.exploding}s`}
		>
			<DeadIcon color={theme.palette.color.default} />
		</TileIcon>
	);
};

export default DeadCharacter;
