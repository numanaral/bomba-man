import ContainerWithCenteredItems from 'components/ContainerWithCenteredItems';
import { PaperWrapper } from 'containers/RoomCreator/components';
import styled from 'styled-components';
import theme from 'theme';

const Wrapper = styled.div<StyledProps<Props, 'fullHeight'>>`
	/* padding: 20px; */
	background: ${theme.palette.background.secondary};
	${({ $fullHeight }) => {
		if (!$fullHeight) return '';

		const navbarHeight =
			document.getElementById('site-navbar')?.clientHeight || 60;

		/** add 3 full heights for each div in the PageContainer */
		const fullHeight = `${Array(3)
			.fill(0)
			.reduce(acc => {
				return `${acc} > div { height: 100%; `;
			}, '')}}}}`;

		return `
			height: calc(100% - ${navbarHeight}px);
			${fullHeight}
		`;
	}}
`;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
	fullHeight?: boolean;
}

const PageContainer: React.FC<Props> = ({
	children,
	fullHeight = false,
	...rest
}) => {
	return (
		<Wrapper $fullHeight={fullHeight} {...rest}>
			<ContainerWithCenteredItems container item xs={12}>
				<PaperWrapper
					style={{
						backgroundColor:
							theme.palette.background['primary-lighter'],
					}}
				>
					{children}
				</PaperWrapper>
			</ContainerWithCenteredItems>
		</Wrapper>
	);
};

export default PageContainer;
