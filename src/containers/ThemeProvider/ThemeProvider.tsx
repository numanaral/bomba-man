import { useSelector } from 'react-redux';
import { makeSelectGameConfig } from 'store/redux/reducers/game/selectors';
import { GlobalStyles } from 'theme';

const ThemeProvider: React.FC = ({ children }) => {
	const gameConfig = useSelector(makeSelectGameConfig());

	return (
		<>
			{children}
			<GlobalStyles $gameConfig={gameConfig} />
		</>
	);
};

export default ThemeProvider;
