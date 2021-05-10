import { useSelector } from 'react-redux';
import { makeSelectGameConfig } from 'store/redux/reducers/game/selectors';
import { getMuiTheme, GlobalStyles } from 'theme';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';
import { ThemeProvider as ScThemeProvider } from 'styled-components';

const ThemeProvider: React.FC = ({ children }) => {
	const themeConfig = getMuiTheme();
	const gameConfig = useSelector(makeSelectGameConfig());

	return (
		<StylesProvider injectFirst>
			<MuiThemeProvider theme={themeConfig}>
				<ScThemeProvider theme={themeConfig}>
					{children}
				</ScThemeProvider>
			</MuiThemeProvider>
			<CssBaseline />
			<GlobalStyles $gameConfig={gameConfig} />
		</StylesProvider>
	);
};

export default ThemeProvider;
