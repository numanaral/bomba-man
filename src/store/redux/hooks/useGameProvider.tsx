import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setGameState } from 'store/redux/reducers/game/actions';
import { GameActionFn } from 'store/redux/reducers/game/types';

const useGameProvider = () => {
	const dispatch = useDispatch();

	const updateGameSettings = useCallback<GameActionFn>(
		payload => dispatch(setGameState(payload)),
		[dispatch]
	);

	return {
		updateGameSettings,
	};
};

export default useGameProvider;
