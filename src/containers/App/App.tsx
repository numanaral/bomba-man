import Container from 'components/Container';
import Game from 'containers/Game';
import { GlobalStyles } from 'theme';

const App = () => {
	return (
		<>
			<Container>
				<Game />
			</Container>
			<GlobalStyles />
		</>
	);
};

export default App;
