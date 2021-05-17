import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookDead } from '@fortawesome/free-solid-svg-icons';
import {
	FontAwesomeIconProps,
	PlayerId,
	TopLeftCoordinates,
} from 'containers/Game/types';
import theme from 'theme';
import { GameConfigRanges } from 'store/redux/reducers/game/types';
import { useEffect } from 'react';
import TileIcon from './TileIcon';
import { SpriteCharacterProps } from './SpriteCharacter';

const DeadIcon = (props: FontAwesomeIconProps) => (
	<FontAwesomeIcon icon={faBookDead} {...props} />
);

interface Props extends Omit<SpriteCharacterProps, 'onPlayerIsWalking'> {
	explodingDuration: GameConfigRanges.ExplodingDuration;
	coordinates: TopLeftCoordinates;
	onDeathAnimationComplete?: (playerId: PlayerId) => void;
}

const DeadCharacter = ({
	id,
	// name,
	size,
	explodingDuration,
	coordinates: { top, left },
	onDeathAnimationComplete,
}: Props) => {
	useEffect(() => {
		setTimeout(() => {
			onDeathAnimationComplete?.(id);
		}, explodingDuration * 1000 + 1000);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<TileIcon
			$top={top}
			$left={left}
			$size={size}
			$animationDelay={`${explodingDuration}s`}
		>
			<DeadIcon color={theme.palette.color.default} />
			{/* <div className="name">{name}</div> */}
		</TileIcon>
	);
};

export default DeadCharacter;
