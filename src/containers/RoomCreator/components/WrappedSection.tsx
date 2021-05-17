import Spacer from 'components/Spacer';
import { Fragment } from 'react';
import Section from './Section';
import WrappedSectionItem from './WrappedSectionItem';

const WrappedSection = ({
	name,
	description,
	items,
	utils,
	isMain = false,
	...rest
}: any) => {
	return (
		<>
			<Section
				title={name}
				description={description}
				isMain={isMain}
				{...rest}
			>
				{items.map((props: any, ind: any) => {
					const {
						name: sectionName,
						title: subTitle,
						description: subDescription,
						items: subItems,
					} = props;
					return subItems ? (
						<Fragment key={subTitle + ind}>
							<WrappedSection
								name={subTitle}
								description={subDescription}
								items={subItems}
								utils={utils}
								style={{ maxWidth: '100%', width: '100%' }}
							/>
							<Spacer spacing="3" />
						</Fragment>
					) : (
						<WrappedSectionItem
							key={sectionName + ind}
							utils={utils}
							{...props}
						/>
					);
				})}
			</Section>
			<Spacer spacing="3" />
		</>
	);
};

export default WrappedSection;
