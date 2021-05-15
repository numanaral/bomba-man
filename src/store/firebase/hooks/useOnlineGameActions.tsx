import { useFirebaseConnect } from 'react-redux-firebase';
import { GameState } from 'store/redux/reducers/game/types';
import { OnlineGame, OnlineGameId } from 'containers/Game/types';
import getRandomName from 'utils/random-name-generator';
import useFirebaseUtils from './useFirebaseUtils';

const useOnlineGameActions = () => {
	const refKey = `online`;
	useFirebaseConnect(refKey);
	const { create, update, remove } = useFirebaseUtils<OnlineGame>(refKey);

	const createOnlineGame = async (gameState: GameState) => {
		const randomName = getRandomName();
		// create the game
		await create(
			{
				gameState,
				started: false,
			},
			undefined,
			undefined,
			randomName
		);

		// TODO: error checking..
		// set its id
		await update(
			{
				gameId: randomName as OnlineGameId,
			},
			`/${randomName}`
		);
		return randomName;
	};

	const removeOnlineGame = async (gameId: OnlineGameId) => {
		remove(`/${gameId}`);
	};

	return {
		createOnlineGame,
		removeOnlineGame,
	};
};

export default useOnlineGameActions;
