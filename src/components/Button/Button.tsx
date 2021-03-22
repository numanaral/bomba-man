import { memo } from 'react';
import styled from 'styled-components';
import theme from 'theme';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant: BaseColorVariant;
	size: BaseSize;
}

const Container = styled.button<StyledProps<Props, 'variant' | 'size'>>`
	background-color: ${({ $variant }) => theme.palette.color[$variant]};
	/* IGNORE SIZE FOR NOW */
	border-radius: ${theme.shape.borderRadius};
	padding: ${theme.shape.padding};
`;

const Button = ({ variant, size, children, ...rest }: Props) => {
	return (
		<Container $variant={variant} $size={size} {...rest}>
			{children}
		</Container>
	);
};

export default memo(Button);
