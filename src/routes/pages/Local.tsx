import Game from 'containers/Game';
import useLocalGame from 'store/redux/hooks/useLocalGame';

const Local = () => {
	const gameProps = useLocalGame();
	return <Game {...gameProps} />;
};

export default Local;
