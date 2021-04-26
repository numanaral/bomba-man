import { forwardRef, memo } from 'react';
import styled from 'styled-components';
import theme from 'theme';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ColorVariants;
	size?: BaseSize;
}

const Container = styled.button<StyledProps<Props, 'variant' | 'size'>>`
	background-color: ${({ $variant }) =>
		theme.palette.color[$variant as ColorVariants]};
	/* IGNORE SIZE FOR NOW */
	border-radius: ${theme.shape.borderRadius};
	padding: ${theme.shape.padding};
	cursor: pointer;
	transition: background-color ${theme.transition.hover};

	&:hover {
		background-color: ${({ $variant }) =>
			theme.palette.color[`${$variant}-lighter` as ColorVariants]};
	}
`;

const Button = forwardRef<HTMLButtonElement, Props>(
	({ variant = 'default', size = 'medium', children, ...rest }, ref) => {
		return (
			<Container $variant={variant} $size={size} ref={ref} {...rest}>
				{children}
			</Container>
		);
	}
);

export type { Props as ButtonProps };
export default memo(Button);
