import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookDead } from '@fortawesome/free-solid-svg-icons';
import {
	FontAwesomeIconProps,
	TopLeftCoordinates,
} from 'containers/Game/types';

import styled, { css, keyframes } from 'styled-components';
import config from 'config';
import theme from 'theme';

const DeadIcon = (props: FontAwesomeIconProps) => (
	<FontAwesomeIcon icon={faBookDead} {...props} />
);

/** @see https://codepen.io/nelledejones/pen/gOOPWrK#L68 */
const bounceAnimation = keyframes`
	0% { transform: scale(0, 0);  }
	25% { transform: scale(0.9, 1.1);  }
	50% { transform: scale(1.1, 0.9);  }
	75% { transform: scale(0.95, 1.05); }
	100% { transform: scale(1, 1); opacity: 1; }
`;

const Wrapper = styled.div`
	position: absolute;
	width: ${config.size.tile}px;
	height: ${config.size.tile}px;
	display: flex;
	justify-content: center;
	align-items: center;
	opacity: 0;
	${css`
		animation: ${bounceAnimation} var(--block-animation-duration) ease 1.3s
			forwards;
	`}
`;

interface Props {
	coordinates: TopLeftCoordinates;
}

const DeadCharacter = ({ coordinates: { top, left } }: Props) => {
	return (
		<Wrapper style={{ top, left }}>
			<DeadIcon color={theme.palette.color.default} />
		</Wrapper>
	);
};

export default DeadCharacter;
