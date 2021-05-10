/**
 * Creates and extends default styled-component theme types
 * with Mui Theme so that we can have types access to Mui
 * theme props
 */
import 'styled-components';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

declare module 'styled-components' {
	export interface DefaultTheme extends Theme {}
}
