import { useForm } from 'components/Form';
import { GameType } from 'enums';
import {
	generateDefaultGameConfig,
	generateDefaultGameState,
} from 'utils/game';
import { useHistory } from 'react-router-dom';
import { BASE_PATH } from 'routes/constants';
import { ReactRouterState } from 'routes/types';
import { GameConfig } from 'store/redux/reducers/game/types';
import useOnlineGameActions from 'store/firebase/hooks/useOnlineGameActions';
import { configSchema } from './schemas';
import { configSections } from './sections';
import { SectionProps } from './types';

const defaultValues = generateDefaultGameConfig();

const useOnSubmit = (type: GameType) => {
	const { push } = useHistory<ReactRouterState>();
	const { createOnlineGame } = useOnlineGameActions();
	const onSubmit = async (gameConfig: GameConfig) => {
		if (type === GameType.Local) {
			push(`${BASE_PATH}/${type}`, { gameConfig });
			return;
		}

		const newGameId = await createOnlineGame(
			generateDefaultGameState(gameConfig)
		);
		push(`${BASE_PATH}/waiting-room/${newGameId}`);
	};

	return onSubmit;
};

const useRoomCreator = (type: GameType) => {
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
