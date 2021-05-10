import { cloneElement, useState } from 'react';
import {
	Button as MuiButton,
	IconButtonProps,
	PropTypes,
	SvgIconProps,
	Theme,
	Tooltip,
	useMediaQuery,
} from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import { getElementFromElementOrType } from 'utils/react';
import LoadingIndicator from 'components/LoadingIndicator';
import { Palette } from '@material-ui/core/styles/createPalette';
import StyledIconButton from './StyledIconButton';
import StyledLoadingIconButton from './StyledLoadingIconButton';

type Btn = ButtonProps | IconButtonProps;

interface Props {
	// ========== Tooltip props ==========
	/**
	 * - Tooltip to display
	 */
	tooltip?: string;
	interactive?: boolean;
	// ========== Button props ==========
	onClick?: ReactOnButtonClick;
	/**
	 * - Background color variant
	 */
	bg?: PropTypes.Color & KeysOf<Palette>;
	icon?: ReactElementOrElementType;
	disabled?: boolean;
	type?: React.ComponentProps<'button'>['type'];
	preventDefaultEvent?: boolean;
	displayTooltipOnClickForMobile?: boolean;
	loading?: boolean;
	// ========== TextButton props ==========
	/**
	 * - Text to display in a text button
	 * - If filled, generates a TextTooltipButton
	 */
	text?: string;
	variant?: ButtonProps['variant'];
	// ========== IconButton props ==========
	/**
	 * - Icon size
	 * - 'inherit' loading size is same as default
	 */
	iconSize?: SvgIconProps['fontSize'];
}

/**
 * Text/Icon Button with Tooltip. If the text prop has value then
 * it's a TextTooltipButton, else it's IconTooltipButton
 *
 * @example
 * ```js
 * // IconTooltipButton
 * <TooltipButton tooltip="Details" onClick={onClick} icon={DetailsIcon} />
 *
 * // TextTooltipButton
 * <TooltipButton tooltip="Details" text="Details" onClick={onClick} icon={DetailsIcon} />
 * ```
 *
 * @component
 */
const TooltipButton = ({
	// Tooltip defaultProps
	tooltip,
	interactive = false,
	// Button defaultProps
	onClick,
	bg,
	icon,
	disabled = false,
	type = 'button',
	preventDefaultEvent = false,
	displayTooltipOnClickForMobile = true,
	loading = false,
	// TextButton defaultProps
	text,
	variant = 'contained',
	// IconButton defaultProps
	iconSize = 'default',
	// IconButton props
	// MuiButtonProps|MuiIconButtonProps
	...rest
}: Props & Btn) => {
	if (type !== 'submit' && !onClick) {
		throw new Error(
			'Either provide an onClick handler or set the type="submit"'
		);
	}

	if (!text && !tooltip) {
		throw new Error('Icon buttons require a tooltip text!');
	}

	// Manual triggering of tooltip on mobile
	const [isTooltipOpen, setIsTooltipOpen] = useState(false);
	const smAndDown = useMediaQuery<Theme>(theme =>
		theme.breakpoints.down('sm')
	);

	// Prevents default event
	// eslint-disable-next-line max-len
	const wrappedOnClick: ReactOnButtonClick = async e => {
		if (preventDefaultEvent) {
			e.preventDefault();
			e.stopPropagation();
		}

		// Manual triggering of tooltip on mobile
		if (displayTooltipOnClickForMobile && smAndDown) {
			setIsTooltipOpen(true);
			setTimeout(() => {
				setIsTooltipOpen(false);
			}, 1000);
		}

		onClick?.(e);
	};

	let button = text ? (
		<MuiButton
			variant={variant}
			color={bg}
			{...(icon && { startIcon: getElementFromElementOrType(icon) })}
			onClick={wrappedOnClick}
			disabled={disabled || loading}
			// endIcon={(loading && <LoadingIndicator size="small" />) || null}
			endIcon={(loading && <LoadingIndicator />) || null}
			type={type}
			{...(rest as ButtonProps)}
		>
			{text}
		</MuiButton>
	) : (
		<StyledIconButton
			onClick={wrappedOnClick}
			disabled={disabled || loading}
			type={type}
			$bg={bg}
			{...(rest as IconButtonProps)}
		>
			{loading && <StyledLoadingIconButton $iconSize={iconSize} />}
			{icon &&
				cloneElement(getElementFromElementOrType(icon), {
					fontSize: iconSize,
				})}
		</StyledIconButton>
	);

	let tooltipText = tooltip || text || '';

	// To show tooltip on disabled items
	if (disabled) {
		button = <span className="tooltip-wrapper">{button}</span>;
		tooltipText += ' (DISABLED)';
	}

	return (
		<Tooltip
			title={tooltipText}
			interactive={interactive}
			enterTouchDelay={0}
			disableFocusListener
			open={isTooltipOpen}
			onOpen={() => setIsTooltipOpen(true)}
			onClose={() => setIsTooltipOpen(false)}
		>
			{button}
		</Tooltip>
	);
};

export default TooltipButton;
