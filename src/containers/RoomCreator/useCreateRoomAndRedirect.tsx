import { GameType } from 'enums';
import { generateDefaultGameState } from 'utils/game';
import { useHistory } from 'react-router-dom';
import { BASE_PATH } from 'routes/constants';
import { ReactRouterState } from 'routes/types';
import useOnlineGameActions from 'store/firebase/hooks/useOnlineGameActions';
import { Config } from './types';

const useCreateRoomAndRedirect = (type: GameType) => {
	const { push } = useHistory<ReactRouterState>();
	const { createOnlineGame } = useOnlineGameActions();

	const onCreate = async (gameConfig?: Config) => {
		if (!gameConfig) return;
		if (type === GameType.Local) {
			push(`${BASE_PATH}/${type}`, { gameConfig });
			return;
		}
		const newGameId = await createOnlineGame(
			generateDefaultGameState(gameConfig)
		);
		if (!newGameId) {
			// eslint-disable-next-line no-alert
			alert('Error creating the game');
			return;
		}
		push(`${BASE_PATH}/waiting-room/${newGameId}`);
	};

	return onCreate;
};

export default useCreateRoomAndRedirect;
