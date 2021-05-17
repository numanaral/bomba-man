import React from 'react';
import styled from 'styled-components';
import { GridProps, Grid } from '@material-ui/core';

const Wrapper = styled(Grid)<{ $horizontal: boolean; $vertical: boolean }>`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	${({ $horizontal, $vertical }) => `
		${$horizontal && 'justify-content: center;'}
		${$vertical && 'height: 100%; align-items: center;'}
	`}
`;

interface Props extends GridProps {
	horizontal?: boolean;
	vertical?: boolean;
}

/**
 * Centered Grid
 *
 * @component
 */
const ContainerWithCenteredItems: React.FC<Props> = ({
	children,
	horizontal = true,
	vertical = false,
	...rest
}) => (
	<Wrapper $horizontal={horizontal} $vertical={vertical} {...rest}>
		{children}
	</Wrapper>
);

export default ContainerWithCenteredItems;
