import { Fragment, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { BASE_PATH } from 'routes/constants';
import PageContainer from 'components/PageContainer';
import Form from 'components/Form';
import * as yup from 'yup';
import { FormComponent } from 'components/Form/types';
import { H1 } from 'components/typography';
import { Grid } from '@material-ui/core';
import ContainerWithCenteredItems from 'components/ContainerWithCenteredItems';

const onlineRoomSchema = yup.object().shape({
	roomId: yup.string().required(),
});

type OnlineRoomSchema = {
	roomId: string;
};

interface Props {
	noWrapper?: boolean;
}

const Join = ({ noWrapper = false }: Props) => {
	const { push } = useHistory();

	const onSubmit = useCallback(
		(data: OnlineRoomSchema) => {
			push(`${BASE_PATH}/online/${data.roomId}`);
		},
		[push]
	);

	const Wrapper = noWrapper ? Fragment : PageContainer;

	return (
		<Wrapper>
			<H1> Join a room</H1>
			<ContainerWithCenteredItems container>
				<Grid container justify="center" item xs={12} sm={8}>
					<Form<OnlineRoomSchema>
						fullWidth
						onSubmit={onSubmit}
						submitText="Join"
						focusOnFirstElement
						schema={onlineRoomSchema}
						items={[
							{
								type: FormComponent.Text,
								name: 'roomId',
								label: 'RoomId',
							},
						]}
					/>
				</Grid>
			</ContainerWithCenteredItems>
		</Wrapper>
	);
};

export default Join;
