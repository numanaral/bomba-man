import { useFirebaseConnect } from 'react-redux-firebase';
import { GameState } from 'store/redux/reducers/game/types';
import { OnlineGame, OnlineGameId } from 'containers/Game/types';
import { DataSnapshot } from 'store/firebase/types';
import useFirebaseUtils from './useFirebaseUtils';

const useOnlineGameActions = () => {
	const refKey = `online`;
	useFirebaseConnect(refKey);
	const { create, update, remove } = useFirebaseUtils<OnlineGame>(refKey);

	const createOnlineGame = async (gameState: GameState) => {
		debugger;
		// create the game
		const { key: newGameId } = (await create({
			gameState,
			started: false,
		})) as DataSnapshot;
		// set its id
		await update(
			{
				gameId: newGameId as OnlineGameId,
			},
			`/${newGameId}`
		);
		return newGameId;
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
