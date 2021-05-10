import styled from 'styled-components';
import LoadingIndicator from 'components/LoadingIndicator';
import { SvgIconProps } from '@material-ui/core';

type SizeMap = Omit<
	Record<NonNullable<SvgIconProps['fontSize']>, number>,
	'inherit'
>;

const sizeMap: SizeMap = {
	default: 24,
	small: 20,
	large: 35,
};

const multiplierMap: SizeMap = {
	default: 2,
	small: 2.1,
	large: 1.7,
};

const StyledLoadingIconButton = styled(LoadingIndicator)<{
	$iconSize: SvgIconProps['fontSize'];
}>`
	position: absolute;
	left: 0;
	right: 0;
	${({ theme, $iconSize }) => {
		if (!$iconSize || $iconSize === 'inherit') return '';

		const iconSize = theme.typography.pxToRem(
			(sizeMap[$iconSize] || sizeMap.default) *
				(multiplierMap[$iconSize] || multiplierMap.default)
		);

		return `
			width: ${iconSize} !important;
			height: ${iconSize} !important;
		`;
	}}
`;

export default StyledLoadingIconButton;
