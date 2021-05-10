import styled from 'styled-components';
import theme from 'theme';
import { MarginDirection } from './types';

interface Props {
	direction?: MarginDirection;
	spacing?: NumberOrString;
}

const Wrapper = styled.span<StyledProps<Props, 'direction' | 'spacing'>>`
	display: block;
	width: 100%;
	${({ $direction, $spacing }) => `
		margin-${$direction}: ${theme.spacing($spacing as number)}px;
	`}
`;

/**
 * Element that adds margin to the given direction based on the
 * spacing amount. The amount is passed in to the spacing method
 * of Mui. By default 1-unit-spacing = 8px
 *
 * @example
 * ```js
 * <Spacer direction="right" spacing="5" />
 * ```
 *
 * @component
 */
const Spacer = ({ direction = 'bottom', spacing = 1 }: Props) => (
	<Wrapper
		$direction={direction}
		$spacing={
			(typeof spacing === 'string' && parseInt(spacing, 10)) || spacing
		}
	/>
);

export default Spacer;
