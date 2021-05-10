import { useForm } from 'components/Form';
import { RoomType } from 'enums';
import { generateDefaultGameConfig } from 'utils/game';
import { useHistory } from 'react-router-dom';
import { BASE_PATH } from 'routes/constants';
import { ReactRouterState } from 'routes/types';
import { GameConfig } from 'store/redux/reducers/game/types';
import { configSchema } from './schemas';
import { configSections } from './sections';
import { SectionProps } from './types';

const defaultValues = generateDefaultGameConfig();

const useOnSubmit = (type: RoomType) => {
	const { push } = useHistory<ReactRouterState>();
	const onSubmit = (gameConfig: GameConfig) => {
		console.log(`${BASE_PATH}/room-creator/${type}`);
		// push(`${BASE_PATH}/${type}`);
		push(`${BASE_PATH}/${type}`, { gameConfig });
	};

	return onSubmit;
};

const useRoomCreator = (type: RoomType) => {
	const onSubmit = useOnSubmit(type);

	const { handleSubmit, utils } = useForm({
		defaultValues,
		onSubmit,
		schema: configSchema,
	});

	const columns = configSections.reduce<Record<string, Array<SectionProps>>>(
		(acc, { side, ...props }) => {
			if (!acc[side]) acc[side] = [];
			acc[side].push(props as SectionProps);
			return acc;
		},
		{}
	);

	return {
		handleSubmit,
		utils,
		columns,
	};
};

export default useRoomCreator;
