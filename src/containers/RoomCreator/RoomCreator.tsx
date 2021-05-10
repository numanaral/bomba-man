import { RoomType } from 'enums';
import { FormContainer } from 'components/Form';
import { Grid, GridSize } from '@material-ui/core';
import { SectionProps } from './types';
import { WrappedSection } from './components';
import { ConfigDisclaimer } from './disclaimers';
import useRoomCreator from './useRoomCreator';

const RoomCreator = ({ type }: { type: RoomType }) => {
	const { handleSubmit, columns, utils } = useRoomCreator(type);

	const columnKeys = Object.keys(columns);
	// TODO: error out for non-numbers
	const columnWidthFromSmall = Number(12 / columnKeys.length) as GridSize;

	return (
		<>
			<ConfigDisclaimer />
			<FormContainer
				onSubmit={handleSubmit}
				submitText="Start"
				doubleSubmit
			>
				{/* TODO: Convert this to a reusable component as well */}
				<Grid container spacing={2}>
					{columnKeys.map(key => {
						return (
							<Grid
								key={key}
								item
								xs={12}
								md={columnWidthFromSmall}
							>
								{(Object.values(
									columns[key]
								) as Array<SectionProps>).map(props => {
									return (
										<WrappedSection
											key={props.title}
											isMain
											{...props}
											utils={utils}
										/>
									);
								})}
							</Grid>
						);
					})}
				</Grid>
			</FormContainer>
		</>
	);
};

export default RoomCreator;
