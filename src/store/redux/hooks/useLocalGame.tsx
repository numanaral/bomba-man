import { GameApiHook } from 'containers/Game/types';
import { useSelector } from 'react-redux';
import makeSelectGameState from '../reducers/game/selectors';
import useGameProvider from './useGameProvider';

const useLocalGame: GameApiHook = () => {
	const provider = useGameProvider();
	const state = useSelector(makeSelectGameState());

	return {
		provider,
		state,
	};
};

export default useLocalGame;
