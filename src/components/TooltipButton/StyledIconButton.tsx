import { IconButton } from '@material-ui/core';
import { Palette, PaletteColor } from '@material-ui/core/styles/createPalette';
import styled from 'styled-components';

const StyledIconButton = styled(IconButton)<{
	$bg?: KeysOf<Palette>;
}>`
	${({ theme, $bg }) => {
		if (!$bg) return '';

		const paletteColors = theme.palette[$bg] as PaletteColor;

		return `
			&.MuiIconButton-root {
					background-color: ${paletteColors.main};
					color: ${theme.palette.getContrastText(paletteColors.main)};
					&:hover {
						background-color: ${paletteColors.dark};
					}
				}
			}
		`;
	}}
`;

export default StyledIconButton;
