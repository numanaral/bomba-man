import {
	faFistRaised,
	faCube,
	faTh,
	faSquare,
	faFire,
	faUser,
	faRobot,
	faGhost,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DeadCharacter from 'containers/Game/components/DeadCharacter';
import SpriteCharacter, {
	SpriteCharacterProps,
} from 'containers/Game/components/SpriteCharacter';
import { FontAwesomeIconProps } from 'containers/Game/types';

import styled from 'styled-components';
import { generateIconPackFromPowerUps } from './utils';

const PowerUpIcon = (props: FontAwesomeIconProps) => (
	<FontAwesomeIcon icon={faFistRaised} {...props} />
);

const CubeIcon = (props: FontAwesomeIconProps) => (
	<FontAwesomeIcon icon={faCube} {...props} />
);

const MapIcon = (props: FontAwesomeIconProps) => (
	<FontAwesomeIcon icon={faTh} {...props} />
);

const FireIcon = (props: FontAwesomeIconProps) => (
	<FontAwesomeIcon icon={faFire} {...props} />
);

const SquareIcon = (props: FontAwesomeIconProps) => (
	<FontAwesomeIcon icon={faSquare} {...props} />
);

const UserIcon = (props: FontAwesomeIconProps) => (
	<FontAwesomeIcon icon={faUser} {...props} />
);

const RobotIcon = (props: FontAwesomeIconProps) => (
	<FontAwesomeIcon icon={faRobot} {...props} />
);

const GhostIcon = (props: FontAwesomeIconProps) => (
	<FontAwesomeIcon icon={faGhost} {...props} />
);

const CharacterWrapper = styled.div<
	StyledProps<CharacterIconProps, 'size' | 'showId'>
>`
	position: relative;
	pointer-events: none;
	min-width: 50px;

	${({ $showId }) => {
		if ($showId) return '';

		return `
			.name {
				display: none;
			}
		`;
	}}

	${({ $size }) => {
		return `
			width: ${$size}px;
			height: ${$size}px;

			> div {
				/* Gotta override as char is taking coordinates by default */
				top: ${$size / 2}px !important;
				left: calc(50% - ${$size}px / 2) !important;
			}
		`;
	}}
`;

interface CharacterIconProps extends Partial<SpriteCharacterProps> {
	size: SpriteCharacterProps['size'];
	showId?: boolean;
}

const CharacterIcon = ({
	size,
	showId = false,
	...rest
}: CharacterIconProps) => {
	return (
		<CharacterWrapper $size={size} $showId={showId}>
			<SpriteCharacter
				coordinates={{ top: 0, left: 0 }}
				id="P1"
				name="Bomba-man"
				size={size}
				{...rest}
			/>
		</CharacterWrapper>
	);
};

const DeadCharacterIcon = ({
	size,
	showId = false,
	...rest
}: CharacterIconProps) => {
	return (
		<CharacterWrapper $size={size} $showId={showId}>
			<DeadCharacter
				coordinates={{ top: 0, left: 0 }}
				id="P1"
				name="Bomba-man"
				explodingDuration={0 as any}
				size={size}
				{...rest}
			/>
		</CharacterWrapper>
	);
};

const ICON_STYLE = { fontSize: 40, width: 50 };
const powerUpIconPack = generateIconPackFromPowerUps(ICON_STYLE);

export type { CharacterIconProps };
export {
	PowerUpIcon,
	CubeIcon,
	MapIcon,
	FireIcon,
	SquareIcon,
	UserIcon,
	RobotIcon,
	GhostIcon,
	CharacterIcon,
	DeadCharacterIcon,
	powerUpIconPack,
	ICON_STYLE,
};
