import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faShoePrints,
	faHeart,
	faBomb,
	faPrescriptionBottleAlt,
} from '@fortawesome/free-solid-svg-icons';
import { PowerUp } from 'enums';
import theme from 'theme';
import { FontAwesomeIconProps } from 'containers/Game/types';

const ShoePrintsIcon = (props: FontAwesomeIconProps) => (
	<FontAwesomeIcon icon={faShoePrints} {...props} />
);
const HeartIcon = (props: FontAwesomeIconProps) => (
	<FontAwesomeIcon icon={faHeart} {...props} />
);
const BombIcon = (props: FontAwesomeIconProps) => (
	<FontAwesomeIcon icon={faBomb} {...props} />
);
const PrescriptionBottleAltIcon = (props: FontAwesomeIconProps) => (
	<FontAwesomeIcon icon={faPrescriptionBottleAlt} {...props} />
);

const icons: Record<
	PowerUp,
	{ icon: (props: FontAwesomeIconProps) => JSX.Element; color: string }
> = {
	[PowerUp.Life]: {
		color: theme.palette.color.success,
		icon: HeartIcon,
	},
	[PowerUp.BombCount]: {
		color: theme.palette.color.error,
		icon: BombIcon,
	},
	[PowerUp.BombSize]: {
		color: theme.palette.color.warning,
		icon: PrescriptionBottleAltIcon,
	},
	[PowerUp.MovementSpeed]: {
		color: theme.palette.color.info,
		icon: ShoePrintsIcon,
	},
};

export default icons;
