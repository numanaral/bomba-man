import { useFirebaseConnect } from 'react-redux-firebase';
import { GameState } from 'store/redux/reducers/game/types';
import { OnlineGame, OnlineGameId } from 'containers/Game/types';
import getRandomName from 'utils/random-name-generator';
import { DataSnapshot } from 'store/firebase/types';
import useFirebaseUtils from './useFirebaseUtils';

const useOnlineGameActions = () => {
	const refKey = `online`;
	useFirebaseConnect(refKey);
	const { create, update, remove } = useFirebaseUtils<OnlineGame>(refKey);

	const createOnlineGame = async (gameState: GameState) => {
		const randomName = getRandomName();
		// create the game
		const snapshotOrError = await create(
			{
				gameState,
				started: false,
			},
			undefined,
			undefined,
			randomName
		);

		if ((snapshotOrError as DataSnapshot).key) {
			// TODO: error checking..
			// set its id
			await update(
				{
					gameId: randomName as OnlineGameId,
				},
				`/${randomName}`
			);
			return randomName;
		}
		return null;
	};

	const restartOnlineGame = async (
		gameId: OnlineGameId,
		gameState: GameState
	) => {
		await update(
			{
				gameState,
				gamePlayers: {},
				started: false,
			},
			`/${gameId}`
		);
	};

	const removeOnlineGame = async (gameId: OnlineGameId) => {
		remove(`/${gameId}`);
	};

	return {
		createOnlineGame,
		removeOnlineGame,
		restartOnlineGame,
	};
};

export default useOnlineGameActions;
