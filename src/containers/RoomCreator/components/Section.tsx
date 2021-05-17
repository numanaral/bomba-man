import { GridProps } from '@material-ui/core';
import ContainerWithCenteredItems from 'components/ContainerWithCenteredItems';
import { H1, H4 } from 'components/typography';
import PaperWrapper from './PaperWrapper';

const Section: React.FC<
	GridProps & { title: string; description?: string; isMain?: boolean }
> = ({ title, description, isMain = false, children, ...rest }) => {
	return (
		<ContainerWithCenteredItems
			item
			xs={12}
			container
			wrap="wrap"
			direction="column"
			{...rest}
		>
			<PaperWrapper isMain={isMain}>
				<H1>{title}</H1>
				{description && <H4>{description}</H4>}
				{children}
			</PaperWrapper>
		</ContainerWithCenteredItems>
	);
};

export default Section;
